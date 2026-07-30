# ALTARYS SaaS Architecture Blueprint v2

## Reusing the AWS SaaS Reference Architecture — Cloud-Agnostic, Zero-Budget, Cross-Referenced with Your Specs

---

## 1. What You're Borrowing from AWS SaaS Factory (and What Changes)

The AWS SaaS Factory's **Control Plane / Application Plane** decomposition remains the right model for ALTARYS. But the implementation strategy changes significantly given your specs.

### What stays the same (architectural patterns):
- Two-plane model: Control Plane (platform ops) + Application Plane (tenant HR/Finance)
- Event-driven tenant onboarding pipeline
- Tiered isolation (pooled for SME, siloed for enterprise)
- Tenant context propagation from edge to data store
- Tenant-aware logging and metrics

### What changes (implementation):

| AWS Pattern | AWS Implementation | ALTARYS Implementation |
|---|---|---|
| Control Plane services communicate with Application Plane | EventBridge (cross-service) | **Spring Application Events** (in-process, same JVM) for module-to-module. RabbitMQ only at the *deployment boundary* (e.g., async provisioning jobs, notification dispatch). |
| Microservices per concern | Lambda / ECS per service | **Spring Modulith modules** in a single deployable. Module boundaries enforced via package structure, not network. |
| Tenant resolver | Cognito + API Gateway header | **Keycloak JWT → Spring Security filter → TenantContext ThreadLocal → Spring Data JDBC query parameter**. No Hibernate `CurrentTenantIdentifierResolver` — you're using JDBC. |
| Schema provisioning | CDK/CloudFormation per tenant | **Flyway + custom provisioner** triggered by Application Events |
| Cost per tenant metering | CloudWatch + custom metrics | **Micrometer → Prometheus** with tenant_id tag on every metric |

---

## 2. Architecture Overview — Aligned with Your Stack

```
┌──────────────────────────────────────────────────────────────────────────┐
│                         ALTARYS PLATFORM                                 │
│                     (Single Spring Boot 4 Application)                   │
│                     (Spring Modulith — Modular Monolith)                 │
│                                                                          │
│  ┌────────────────────────────────┐  ┌─────────────────────────────────┐ │
│  │     CONTROL PLANE MODULES      │  │     APPLICATION PLANE MODULES   │ │
│  │     (com.altarys.papillon.platform.*)    │  │     (com.altarys.papillon.modules.*)     │ │
│  │                                │  │                                 │ │
│  │  ┌──────────────────────────┐  │  │  ┌───────────────────────────┐ │ │
│  │  │ tenant/                  │  │  │  │ absence/                  │ │ │
│  │  │  Tenant CRUD, lifecycle  │  │  │  │  Leave requests, accruals │ │ │
│  │  │  Onboarding orchestrator │  │  │  │  OHADA leave types        │ │ │
│  │  ├──────────────────────────┤  │  │  ├───────────────────────────┤ │ │
│  │  │ identity/                │  │  │  │ attendance/               │ │ │
│  │  │  Keycloak integration    │  │  │  │  QR code clock-in/out    │ │ │
│  │  │  User, Role, Permission  │  │  │  │  Offline-first scanning  │ │ │
│  │  ├──────────────────────────┤  │  │  ├───────────────────────────┤ │ │
│  │  │ billing/                 │  │  │  │ budget/                   │ │ │
│  │  │  CinetPay / Stripe       │  │  │  │  Budget lines, tracking  │ │ │
│  │  │  Plan tiers, metering    │  │  │  │  SYSCOHADA alignment     │ │ │
│  │  ├──────────────────────────┤  │  │  ├───────────────────────────┤ │ │
│  │  │ config/                  │  │  │  │ commitment/              │ │ │
│  │  │  Country config engine   │  │  │  │  Purchase commitments    │ │ │
│  │  │  Tax tables, CNPS rates  │  │  │  │  Approval workflows     │ │ │
│  │  │  Fiscal year settings    │  │  │  ├───────────────────────────┤ │ │
│  │  ├──────────────────────────┤  │  │  │ crm/                     │ │ │
│  │  │ audit/                   │  │  │  │  Freelance salespeople   │ │ │
│  │  │  Immutable audit trail   │  │  │  │  Commission tracking     │ │ │
│  │  │  Who/when/what/before/   │  │  │  ├───────────────────────────┤ │ │
│  │  │  after                   │  │  │  │ payroll/                  │ │ │
│  │  ├──────────────────────────┤  │  │  │  Salary computation      │ │ │
│  │  │ notification/            │  │  │  │  CNPS, ITS, payslips    │ │ │
│  │  │  In-app + email + (SMS)  │  │  │  │  CIV-first, then expand │ │ │
│  │  └──────────────────────────┘  │  │  └───────────────────────────┘ │ │
│  └────────────────────────────────┘  └─────────────────────────────────┘ │
│                                                                          │
│  ┌──────────────────────────────────────────────────────────────────────┐│
│  │  SHARED INFRASTRUCTURE LAYER  (com.altarys.papillon.platform.infrastructure)  ││
│  │                                                                      ││
│  │  TenantContext │ MultiTenantDataSource │ AuditService │ i18n         ││
│  │  OfflineSync   │ EventBus (App Events) │ SecurityConfig              ││
│  └──────────────────────────────────────────────────────────────────────┘│
│                                                                          │
│  ════════════════════════════════════════════════════════════════════════ │
│                                                                          │
│  ┌────────────────────────┐  ┌────────────────────────────────────────┐ │
│  │  frontend/              │  │  frontend-enterprise/                  │ │
│  │  Papillon HR Suite      │  │  ALTARYS Enterprise HR Suite           │ │
│  │  (React 19.2 + TS)      │  │  (PLACEHOLDER until Month 12-13)      │ │
│  │  Mobile-first, offline  │  │  Desktop-first, dense                 │ │
│  │  Warm amber/gold        │  │  Navy corporate                       │ │
│  └────────────────────────┘  └────────────────────────────────────────┘ │
│              │                              │                            │
│              └──────────┬───────────────────┘                            │
│                         │                                                │
│              ┌──────────▼──────────┐                                     │
│              │  packages/           │                                     │
│              │  shared-components/  │                                     │
│              │  (theme injection)   │                                     │
│              └─────────────────────┘                                     │
└──────────────────────────────────────────────────────────────────────────┘

External Services:
┌────────────┐ ┌──────────┐ ┌──────────┐ ┌────────┐ ┌────────────────┐
│  Keycloak  │ │  Postgres │ │  Redis   │ │ MinIO  │ │ RabbitMQ       │
│  (IAM)     │ │  (Data)   │ │ (Cache)  │ │(Files) │ │(Async jobs     │
│            │ │           │ │          │ │        │ │ only)           │
└────────────┘ └──────────┘ └──────────┘ └────────┘ └────────────────┘
```

### Why a Single Deployable (Not Microservices)

Your workflow document explicitly specifies **Spring Modulith**. This is the right call because:

1. **Team size**: 4 volunteer devs + Claude Code. Operating 8 microservices is infrastructure tax you can't afford.
2. **Spring Modulith gives you module boundaries** without network overhead. Each module is isolated by package structure, communicates via Application Events, and can be extracted to a separate service later if needed.
3. **Single Coolify deployment**: One Docker image, one PostgreSQL, one Keycloak. Operational simplicity.
4. **The AWS SaaS Boost itself** runs its control plane as a single deployable with internal routing — you're following the same pragmatic pattern.

---

## 3. AWS-to-Cloud-Agnostic Service Mapping (Revised)

### 3.1 Identity & Access

| AWS Service | ALTARYS Replacement | Notes |
|---|---|---|
| Amazon Cognito | **Keycloak 26+** | OIDC/OAuth2. French locale. JWT with `tenant_id` and `country_code` claims. |
| Cognito User Pool per tier | Keycloak Realm strategy | MVP: single realm, tenant as JWT claim. V2+: realm-per-enterprise for silo tier. |

**OHADA-specific**: Custom Keycloak user attributes for `country_code` (CIV, BEN, CMR, COD, SEN) and `preferred_currency` (XOF, XAF).

### 3.2 API Gateway & Routing

| AWS Service | ALTARYS Replacement | Notes |
|---|---|---|
| Amazon API Gateway | **Spring Boot embedded** (no separate gateway needed for modular monolith) | Single app — use Spring Security filters for tenant extraction and auth. Add Spring Cloud Gateway only when you need it (multiple deployables). |
| CloudFront | **Nginx reverse proxy** + **Cloudflare free CDN** | Serves React SPA, handles TLS. Coolify may handle this automatically. |

**Tenant resolution** (adapted for Spring Data JDBC — no Hibernate):

```java
// 1. Spring Security Filter extracts tenant from JWT
@Component
public class TenantResolutionFilter extends OncePerRequestFilter {
    @Override
    protected void doFilterInternal(HttpServletRequest request, ...) {
        String tenantId = jwtDecoder.extractClaim(request, "tenant_id");
        String countryCode = jwtDecoder.extractClaim(request, "country_code");
        TenantContext.set(tenantId, countryCode);
        try { filterChain.doFilter(request, response); }
        finally { TenantContext.clear(); }
    }
}

// 2. TenantContext (ThreadLocal — works with virtual threads via ScopedValue in Java 25)
public final class TenantContext {
    // Java 25: prefer ScopedValue when stable
    private static final ThreadLocal<TenantInfo> CONTEXT = new ThreadLocal<>();
    
    public record TenantInfo(String tenantId, String countryCode) {}
    
    public static void set(String tenantId, String countryCode) {
        CONTEXT.set(new TenantInfo(tenantId, countryCode));
    }
    public static TenantInfo current() {
        return Objects.requireNonNull(CONTEXT.get(), "TenantContext not set");
    }
    public static void clear() { CONTEXT.remove(); }
}

// 3. Spring Data JDBC — NO Hibernate resolver! Manual tenant in every query.
public interface LeaveRequestRepository extends CrudRepository<LeaveRequest, Long> {
    
    @Query("SELECT * FROM leave_request WHERE tenant_id = :tenantId AND id = :id")
    Optional<LeaveRequest> findByIdAndTenant(@Param("id") Long id, 
                                              @Param("tenantId") String tenantId);
    
    @Query("SELECT * FROM leave_request WHERE tenant_id = :tenantId AND employee_id = :employeeId")
    List<LeaveRequest> findByEmployee(@Param("tenantId") String tenantId,
                                      @Param("employeeId") Long employeeId);
}

// 4. Service layer always passes tenant context
@Service
public class LeaveRequestService {
    public List<LeaveRequest> getForCurrentEmployee(Long employeeId) {
        String tenantId = TenantContext.current().tenantId();
        return repository.findByEmployee(tenantId, employeeId);
    }
}
```

**Critical difference from v1**: Since you use Spring Data JDBC (not Hibernate), there is no automatic `CurrentTenantIdentifierResolver`. Every repository method MUST explicitly include `tenant_id` as a parameter. This is actually **better for security** — no magic, no risk of forgetting the filter.

### 3.3 Compute & Containers

| AWS Service | ALTARYS Replacement | Notes |
|---|---|---|
| ECS / Fargate | **Docker + Coolify** | Coolify is a self-hosted Vercel/Heroku alternative. Handles deployment, TLS, reverse proxy. |
| Lambda | Not needed | Spring Modulith modules run in-process. No separate Lambda-like services. |
| CodePipeline | **GitHub Actions** (free tier) | CI/CD: build → test → Docker image → deploy via Coolify webhook. |

### 3.4 Data & Multi-Tenant Strategy (4 Profiles)

This is the most significant adaptation. Your platform-vision.md defines 4 DB profiles — this goes beyond the standard AWS Silo/Pool/Bridge model.

| Profile | AWS Equivalent | When Used | MVP? | Implementation |
|---|---|---|---|---|
| **Profile A: Shared DB** | Pool Model | Small businesses, cost-effective | ✅ MVP ships this only | `tenant_id` column on every table. WHERE clause in every query. |
| **Profile B: Schema-per-tenant** | Bridge Model | Medium businesses needing isolation | V2 | Dynamic `SET search_path` on connection. Flyway migrations per schema. |
| **Profile C: DB-per-tenant** | Silo Model | Large enterprises, full isolation | V2+ (Month 18) | Dynamic DataSource routing per request. Separate connection pool per tenant. |
| **Profile D: BYO-DB** | (Not in AWS reference) | Enterprises with existing infrastructure | V2+ | Tenant-provided connection string, validated and pooled. **Design for this first.** |

**Your ARCHITECT personality spec says: "Design for BYO-DB first (hardest), simplify for others."** This is excellent architectural discipline. Here's how it affects the data access layer:

```java
// Abstract tenant-aware data access — works for all 4 profiles
public interface TenantAwareDataSource {
    Connection getConnection(String tenantId);
}

// Profile A: Shared DB (MVP)
public class SharedDbDataSource implements TenantAwareDataSource {
    private final DataSource pooledDs;
    public Connection getConnection(String tenantId) {
        return pooledDs.getConnection(); // tenant_id in WHERE clauses
    }
}

// Profile B: Schema-per-tenant (V2)
public class SchemaPerTenantDataSource implements TenantAwareDataSource {
    private final DataSource pooledDs;
    public Connection getConnection(String tenantId) {
        Connection conn = pooledDs.getConnection();
        conn.createStatement().execute("SET search_path TO tenant_" + tenantId);
        return conn;
    }
}

// Profile C: DB-per-tenant (V2+)
public class DbPerTenantDataSource implements TenantAwareDataSource {
    private final Map<String, DataSource> tenantPools;
    public Connection getConnection(String tenantId) {
        return tenantPools.get(tenantId).getConnection();
    }
}

// Profile D: BYO-DB (V2+ — the hardest case)
public class ByoDbDataSource implements TenantAwareDataSource {
    private final TenantConfigRepository configRepo;
    private final Map<String, DataSource> cachedPools = new ConcurrentHashMap<>();
    
    public Connection getConnection(String tenantId) {
        return cachedPools.computeIfAbsent(tenantId, this::createPool).getConnection();
    }
    
    private DataSource createPool(String tenantId) {
        TenantDbConfig config = configRepo.getDbConfig(tenantId);
        // Validate connection string, create HikariCP pool
        return HikariDataSourceBuilder.create()
            .jdbcUrl(config.jdbcUrl())
            .username(config.username())
            .password(config.password()) // encrypted at rest
            .maximumPoolSize(config.poolSize())
            .build();
    }
}
```

### 3.5 Messaging & Events (Two Levels)

Your architecture has **two event systems**, not one:

| Level | Mechanism | Scope | Use Cases |
|---|---|---|---|
| **Intra-app events** | Spring Application Events (`ApplicationEventPublisher`) | Between Modulith modules within the same JVM | `EmployeeCreated`, `LeaveApproved`, `CommitmentApproved`, `PayrollComputed` — all the events in your platform-vision.md §5 |
| **Infrastructure events** | RabbitMQ (or Redis Streams) | Async jobs, external notifications, provisioning tasks that may take time or fail | Tenant onboarding provisioning, email dispatch, PDF generation queue, SMS notifications (V2) |

This maps to the AWS pattern where **EventBridge handles cross-service events** and **SQS handles async processing**. But since you're a monolith, most "EventBridge" events become in-process Application Events.

```java
// Platform-vision.md §5 events → Spring Application Events
// Published by Absence Management module
public record LeaveApprovedEvent(
    String tenantId,
    Long employeeId, 
    String leaveType,
    LocalDate startDate, 
    LocalDate endDate, 
    boolean isPaid
) {}

// Consumed by Payroll module (same JVM, different Modulith module)
@Component
public class PayrollLeaveListener {
    @EventListener
    public void onLeaveApproved(LeaveApprovedEvent event) {
        // Calculate unpaid leave deduction for next payroll run
        payrollService.recordLeaveDeduction(event);
    }
}
```

### 3.6 Other Infrastructure Mapping

| AWS Service | ALTARYS Replacement | Notes |
|---|---|---|
| S3 | **MinIO** (Docker) | Payslips, DGI declarations, employee docs, receipt photos |
| ElastiCache | **Redis** (Docker) | Tenant config cache, session management |
| CloudWatch | **Prometheus + Grafana** via Micrometer | Spring Boot Actuator → Micrometer with `tenant_id` tag |
| X-Ray | **Micrometer Tracing** (built into Spring Boot 4) | Add Zipkin later if needed |
| Cognito | **Keycloak** (Docker) | French locale, custom themes for Papillon branding |

---

## 4. Tenant Onboarding — The AWS SBT Pattern Adapted

The AWS SaaS Builder Toolkit uses a single admin-driven onboarding flow.
ALTARYS extends this with **3 onboarding channels** that all converge into the same provisioning pipeline.

### 4.1 Three Entry Points, One Pipeline

```
┌─────────────────────────────────────────────────────────────────────────┐
│                      ONBOARDING ENTRY POINTS                            │
│                                                                         │
│  ┌─────────────────────┐  ┌───────────────────────┐  ┌──────────────┐ │
│  │  CHANNEL A           │  │  CHANNEL B             │  │  CHANNEL C   │ │
│  │  Self-Onboarding     │  │  Freelance Salesperson  │  │  ALTARYS     │ │
│  │                      │  │  (Internal CRM)         │  │  Admin       │ │
│  │  Public registration │  │                         │  │              │ │
│  │  form on papillon.ci │  │  Salesperson creates    │  │  Back-office │ │
│  │                      │  │  prospect in CRM →      │  │  manual      │ │
│  │  Tenant fills:       │  │  converts to tenant     │  │  creation    │ │
│  │  • Company name      │  │                         │  │              │ │
│  │  • Country           │  │  Salesperson fills:     │  │  Admin fills │ │
│  │  • Employee count    │  │  • All company info     │  │  any/all     │ │
│  │  • Contact info      │  │  • Employee count       │  │  fields      │ │
│  │  • Admin email       │  │  • Plan preference      │  │              │ │
│  │                      │  │  • Contact person       │  │              │ │
│  │  NO AUTH REQUIRED    │  │                         │  │              │ │
│  │  (public endpoint)   │  │  REQUIRES: CRM auth     │  │  REQUIRES:   │ │
│  │                      │  │  (salesperson JWT)      │  │  Admin JWT   │ │
│  └──────────┬───────────┘  └───────────┬─────────────┘  └──────┬───────┘ │
│             │                          │                       │         │
│             │   ┌──────────────────────┘                       │         │
│             │   │   ┌─────────────────────────────────────────┘         │
│             ▼   ▼   ▼                                                   │
│  ┌──────────────────────────────────────────────────────────────────┐   │
│  │              UNIFIED ONBOARDING PIPELINE                         │   │
│  │              TenantOnboardingService.onboard(request)            │   │
│  └──────────────────────────────────────────────────────────────────┘   │
└─────────────────────────────────────────────────────────────────────────┘
```

**Architectural principle**: All three channels produce the same `TenantOnboardingRequest` record. The pipeline doesn't know or care which channel originated the request. This is the AWS SBT pattern — the *provisioning pipeline is decoupled from the intake mechanism*.

### 4.2 Channel-Specific Architectural Concerns

| Concern | Channel A: Self-Onboarding | Channel B: Freelance CRM | Channel C: Admin |
|---|---|---|---|
| **Authentication** | None (public endpoint) | Salesperson JWT (CRM module auth) | ALTARYS admin JWT (Control Plane auth) |
| **Security surface** | **HIGH** — exposed to internet. Needs: rate limiting, CAPTCHA, email verification, input sanitization, abuse prevention | Medium — internal users only | Low — trusted operators |
| **Email verification** | **MANDATORY** before provisioning starts. Tenant admin receives verification link → clicks → pipeline begins | Not needed (salesperson verified the contact) — but tenant admin receives **activation email** with password setup link | Optional (admin may create on behalf) |
| **DB profile selection** | **Auto-selected** based on declared employee count (see §4.3) | Salesperson can suggest, but system applies same rules | Admin can **override** auto-selection (only channel with override capability) |
| **Tenant status at creation** | `PENDING_VERIFICATION` → (email verified) → `PENDING` → (provisioned) → `ACTIVE` | `PENDING_VALIDATION` → (CRM manager validates) → `PENDING` → (provisioned) → `ACTIVE` | `PENDING` → (provisioned) → `ACTIVE` |
| **Cross-module dependency** | Control Plane only | **CRM module → Control Plane** (new dependency — not in original platform-vision.md) | Control Plane only |
| **API endpoint** | `POST /api/v1/public/onboarding` (no auth) | `POST /api/v1/crm/prospects/{id}/convert-to-tenant` (CRM auth) | `POST /api/v1/admin/tenants` (admin auth) |

### 4.3 DB Profile Auto-Selection

The system selects the database isolation profile based on declared employee count. This is an architecture-level decision because it determines infrastructure provisioning.

```
Declared employee count → DB Profile selection
    │
    ├── MVP (all tenants): Profile A (Shared DB)
    │   Regardless of employee count — MVP ships one profile only.
    │   The selection logic EXISTS but always returns Profile A.
    │
    └── V2+ (when profiles B/C/D are implemented):
        ├── ≤ threshold_1 employees  →  Profile A (Shared DB)
        ├── ≤ threshold_2 employees  →  Profile B (Schema-per-tenant)
        ├── > threshold_2 employees  →  Profile C (DB-per-tenant)
        └── Explicit request (admin override only) → Profile D (BYO-DB)
```

> **Note for PRD**: The exact thresholds (threshold_1, threshold_2) are **business decisions**, not architecture decisions. They belong in the Control Plane PRD where the ANALYST will interview you about them. The architecture only needs to know that a `ProfileSelector` component exists and returns one of four values.

```java
// Architecture-level: the interface and routing
public interface TenantProfileSelector {
    DatabaseProfile selectProfile(TenantOnboardingRequest request);
}

// MVP implementation: always returns SHARED
public class MvpProfileSelector implements TenantProfileSelector {
    @Override
    public DatabaseProfile selectProfile(TenantOnboardingRequest request) {
        return DatabaseProfile.SHARED; // V2: apply threshold logic
    }
}

public enum DatabaseProfile { SHARED, SCHEMA_PER_TENANT, DB_PER_TENANT, BYO_DB }
```

### 4.4 Unified Provisioning Pipeline

All three channels converge here. This is the AWS SBT onboarding pattern adapted for Spring Modulith:

```
TenantOnboardingService.onboard(request)
    │
    ├── Source: request.channel() = SELF | CRM | ADMIN
    │
    ├── 1. Validate input (company name, country, email uniqueness)
    ├── 2. Select DB profile: profileSelector.selectProfile(request)
    ├── 3. Save Tenant entity (status = PENDING)
    ├── 4. Publish TenantOnboardingRequestedEvent(tenantId, profile, country, channel)
    │
    ▼
TenantProvisioningListener (Spring Application Event)
    │
    ├── Provision database (profile-dependent):
    │     ├── Profile A (Shared DB, MVP): No DB action — tenant_id column handles it
    │     ├── Profile B (V2): CREATE SCHEMA tenant_{id} + Flyway migrations
    │     ├── Profile C (V2+): Create new database + Flyway migrations
    │     └── Profile D (V2+): Validate BYO connection + Flyway migrations
    │
    ├── Seed country-specific reference data:
    │     ├── SYSCOHADA chart of accounts
    │     ├── Tax tables (ITS, IS, IGR per country)
    │     ├── Social contribution rates (CNPS/CNSS per country)
    │     ├── Default leave types (per country labor code)
    │     ├── Public holidays (per country)
    │     └── Default fiscal year config
    │
    ├── Configure Keycloak:
    │     ├── Create tenant client in Keycloak realm
    │     ├── Create admin user for tenant
    │     └── Set default roles (DG, RH Manager, Comptable, Employé)
    │
    ├── Send activation email to tenant admin:
    │     ├── Channel A (self): "Email vérifié — votre compte Papillon est prêt"
    │     ├── Channel B (CRM): "Votre compte Papillon a été créé par [salesperson name]"
    │     └── Channel C (admin): "Votre compte Papillon a été créé par l'équipe ALTARYS"
    │
    └── Publish TenantOnboardedEvent → TenantService updates status to ACTIVE
```

### 4.5 Tenant Lifecycle State Machine (Updated for 3 Channels)

```
Channel A (Self):
  Register → PENDING_VERIFICATION → (email click) → PENDING → (provisioned) → ACTIVE

Channel B (CRM):
  Prospect converted → PENDING_VALIDATION → (CRM manager approves) → PENDING → (provisioned) → ACTIVE

Channel C (Admin):
  Admin creates → PENDING → (provisioned) → ACTIVE

All channels share these post-activation states:
  ACTIVE → (non-payment / admin action) → SUSPENDED → (grace period) → DELETED (soft)

Full state machine:
┌─────────────────────┐
│ PENDING_VERIFICATION │──── (email verified) ────┐
└─────────────────────┘                           │
┌─────────────────────┐                           ▼
│ PENDING_VALIDATION   │──── (CRM approved) ──► PENDING
└─────────────────────┘                           │
                                                  │ Provisioning complete
                                              ┌───▼───┐
                                 Reactivate ──► ACTIVE │
                                              └───┬───┘
                                                  │ Non-payment / Admin action
                                            ┌─────▼──────┐
                                            │ SUSPENDED   │
                                            └─────┬──────┘
                                                  │ Grace period expired
                                            ┌─────▼────┐
                                            │ DELETED   │ (soft-delete, data retained
                                            └──────────┘  per OHADA 10-year rule)
```

### 4.6 Security: Self-Onboarding Public Endpoint

Channel A introduces a **public-facing, unauthenticated endpoint** — this doesn't exist in the standard AWS SaaS Boost pattern (which assumes admin-driven onboarding). It requires specific security measures:

| Threat | Mitigation | Implementation |
|---|---|---|
| Spam / bot registrations | CAPTCHA on registration form | hCaptcha (free, GDPR-compliant, works in Africa) |
| Email abuse | Email verification required before provisioning | Verification token with 24h expiry |
| Rate limiting | Throttle registrations per IP | Spring Boot rate limiter: max 5 registrations/IP/hour |
| Input abuse | Strict validation | Jakarta Bean Validation on all fields. Company name regex, country enum, email format. |
| Fake employee counts | Audit after onboarding | Flag for review if declared count vs. actual employee creation diverges significantly (V2) |
| Enumeration attacks | Don't reveal if email exists | Generic response: "Si cette adresse existe, un email de vérification a été envoyé" |

```java
// Public endpoint — no JWT required
@RestController
@RequestMapping("/api/v1/public/onboarding")
public class SelfOnboardingController {

    @PostMapping
    @RateLimited(maxRequests = 5, perHours = 1, keyExtractor = "ip")
    public ResponseEntity<OnboardingResponse> selfOnboard(
            @Valid @RequestBody SelfOnboardingRequest request,
            @RequestParam("captchaToken") String captchaToken) {
        
        captchaService.verify(captchaToken); // throws if invalid
        
        TenantOnboardingRequest onboardingRequest = TenantOnboardingRequest.builder()
            .companyName(request.companyName())
            .countryCode(request.countryCode())    // CIV for MVP
            .declaredEmployeeCount(request.employeeCount())
            .adminEmail(request.adminEmail())
            .adminName(request.adminName())
            .channel(OnboardingChannel.SELF)
            .build();
        
        tenantOnboardingService.initiateSelfOnboarding(onboardingRequest);
        // Does NOT provision yet — sends verification email first
        
        return ResponseEntity.accepted().body(
            new OnboardingResponse("verification_email_sent"));
    }
}
```

### 4.7 CRM-to-Tenant Conversion (Cross-Module Dependency)

Channel B creates a **new architectural dependency** not in your original platform-vision.md dependency graph:

```
Original (platform-vision.md §3):
  Internal CRM (independent, uses Control Plane auth only)

Updated:
  Internal CRM ──── publishes TenantConversionRequestedEvent ───► Control Plane (Tenant module)
```

This means the CRM module must be able to trigger tenant creation. The cleanest pattern in Spring Modulith:

```java
// CRM module publishes an event (respects module boundaries)
// com.altarys.papillon.modules.crm.event
public record ProspectConvertedToTenantEvent(
    Long prospectId,
    String companyName,
    String countryCode,
    int declaredEmployeeCount,
    String contactEmail,
    String contactName,
    Long salesPersonId        // for commission tracking
) {}

// Control Plane tenant module listens
// com.altarys.papillon.platform.tenant.listener
@Component
public class CrmConversionListener {
    
    @EventListener
    public void onProspectConverted(ProspectConvertedToTenantEvent event) {
        TenantOnboardingRequest request = TenantOnboardingRequest.builder()
            .companyName(event.companyName())
            .countryCode(event.countryCode())
            .declaredEmployeeCount(event.declaredEmployeeCount())
            .adminEmail(event.contactEmail())
            .adminName(event.contactName())
            .channel(OnboardingChannel.CRM)
            .originatingCrmProspectId(event.prospectId())
            .originatingSalesPersonId(event.salesPersonId())
            .build();
        
        // CRM channel: requires CRM manager validation before provisioning
        tenantOnboardingService.initiateValidatedOnboarding(request);
    }
}
```

> **Impact on sprint timeline**: Internal CRM is scheduled for Sprint 3 (Weeks 3-6). The CRM → tenant conversion feature requires that the onboarding pipeline (Sprint 1) supports the `CRM` channel. However, the pipeline can be built with all 3 channel interfaces in Sprint 1, even though the CRM module that *calls* Channel B won't exist until Sprint 3. Design the interface now, wire the CRM later.

### 4.8 OHADA-Specific Seeding (Unchanged — Still Not in AWS Reference)

All three channels trigger the same country-specific seeding:

```java
@Component
public class CountryConfigSeeder {
    
    public void seedForCountry(String tenantId, String countryCode) {
        switch (countryCode) {
            case "CIV" -> {
                seedSyscohada(tenantId);           // Standard for all OHADA
                seedCivTaxTables(tenantId);         // ITS brackets specific to CIV
                seedCnpsCivRates(tenantId);         // CNPS rates for CIV
                seedCivLeaveTypes(tenantId);        // Labor code leave entitlements
                seedCivPublicHolidays(tenantId);    // CIV-specific holidays
            }
            case "BEN" -> {                         // Month 9 expansion
                seedSyscohada(tenantId);
                seedBenTaxTables(tenantId);
                seedCnssBenRates(tenantId);         // CNSS (not CNPS) for Benin
                seedBenLeaveTypes(tenantId);
                seedBenPublicHolidays(tenantId);
            }
            // CMR, COD, SEN follow same pattern
        }
    }
}
```

### 4.9 Items for the ANALYST to Interview About (PRD Scope, Not Architecture)

The following questions are **business decisions** that belong in the Control Plane PRD, not this architecture document. Flag them for your ANALYST personality session:

1. **Profile thresholds**: At what employee counts do tenants move from Profile A → B → C? Is this purely employee count, or also influenced by revenue/plan tier?
2. **Self-onboarding form fields**: What minimum information is required? Is RCCM (Registre du Commerce) number mandatory at onboarding or collected later?
3. **CRM validation workflow**: Who in ALTARYS validates a CRM-originated tenant? The salesperson's manager? A central operations team?
4. **Tenant profile override**: The system auto-selects a DB profile based on employee count, but tenants can override this choice during onboarding. What constraints apply? Can any tenant choose any profile (including paying more for higher isolation)? Are some profiles restricted by plan tier? What UI flow allows the tenant to understand the trade-offs?
5. **Profile upgrade path**: What happens when a tenant onboarded at 20 employees grows to 400? Is migration from Profile A to B automatic, manual, or triggered by a request?
5. **Trial period**: Is there a free trial period for self-onboarded tenants? How long? What happens at expiry?
6. **Salesperson commission**: When a CRM-originated tenant activates and pays, how is the salesperson's commission tracked? (CRM module PRD scope)
7. **Duplicate detection**: How do we detect if a company is already onboarded (especially across channels — e.g., company self-onboards while a salesperson is also registering them)?
8. **Onboarding email content**: What language, branding, and information does each channel's activation email contain? (Design scope)

---

## 5. Control Plane Services — Mapped to Your Module List

Your platform-vision.md §2.1 defines the Control Plane. Here's how each AWS SBT service maps:

| AWS SBT Service | ALTARYS Module | Spring Modulith Package | Priority |
|---|---|---|---|
| Tenant Service | **Tenant Management** | `com.altarys.papillon.platform.tenant` | Sprint 1, Week 1-2 |
| User Service | **User & Identity** | `com.altarys.papillon.platform.identity` | Sprint 1, Week 1-2 |
| (Cognito integration) | **Keycloak integration** | `com.altarys.papillon.platform.identity.keycloak` | Sprint 1, Week 1-2 |
| Tier Service | **Plan & Tiering** | `com.altarys.papillon.platform.billing` | Sprint 1, Week 2-3 |
| Billing + Stripe | **Billing (CinetPay/Stripe)** | `com.altarys.papillon.platform.billing` | Sprint 1, Week 3 |
| Onboarding workflow | **Onboarding Orchestrator** | `com.altarys.papillon.platform.tenant.provisioning` | Sprint 1, Week 2 |
| Metrics | **Metrics & Analytics** | `com.altarys.papillon.platform.metrics` | Post-MVP |
| *(Not in AWS)* | **Country Config Engine** | `com.altarys.papillon.platform.config` | Sprint 1, Week 2 |
| *(Not in AWS)* | **Audit Trail** | `com.altarys.papillon.platform.audit` | Sprint 1, Week 1 |
| *(Not in AWS)* | **Notification Service** | `com.altarys.papillon.platform.notification` | Sprint 1, Week 3 |

### Plus your 12 Application Plane modules:

| # | Module | Sprint | Package |
|---|---|---|---|
| 1 | **Core HR (COHRPA)** — Employee entity lives here | Sprint 1 (basic), Sprint 7+ (full) | `com.altarys.papillon.modules.corehr` |
| 2 | **Leave & Absence** | Sprint 1 (Track B) | `com.altarys.papillon.modules.absence` |
| 3 | **QR Attendance** | Sprint 1 (Track B) | `com.altarys.papillon.modules.attendance` |
| 4 | **Time & Activities** | Post-MVP | `com.altarys.papillon.modules.timeactivities` |
| 5 | **Expense Management** | Post-MVP (Sprint 6) | `com.altarys.papillon.modules.expense` |
| 6 | **Commitment Management** | Sprint 2 | `com.altarys.papillon.modules.commitment` |
| 7 | **Payroll** | Sprint 4 (Weeks 4-10) | `com.altarys.papillon.modules.payroll` |
| 8 | **HSE** | Post-MVP | `com.altarys.papillon.modules.hse` |
| 9 | **Performance & Objectives** | Post-MVP | `com.altarys.papillon.modules.performance` |
| 10 | **Skills & GPEC** | Post-MVP | `com.altarys.papillon.modules.skills` |
| 11 | **Learning & Training** | Post-MVP | `com.altarys.papillon.modules.learning` |
| 12 | **Recruitment (ATS)** | Post-MVP | `com.altarys.papillon.modules.recruitment` |
| *Special* | **Budget Lines** (dependency for Commitment + Expense) | Sprint 2 | `com.altarys.papillon.modules.budget` |
| *Special* | **Internal CRM** (ALTARYS sales network) | Sprint 3 | `com.altarys.papillon.modules.crm` |

---

## 6. Hosting Strategy — Aligned with Coolify

Your AI workflow document specifies **Docker + Coolify**. This simplifies hosting significantly compared to raw Docker Compose or K3s.

| Phase | Infrastructure | Estimated Cost | Coolify Setup |
|---|---|---|---|
| **Dev/MVP** (Now → Month 6) | Single Hetzner CX42 (8 vCPU, 16GB) + Coolify | ~€25-35/month | Coolify self-hosted on same box. Manages: Spring Boot app, PostgreSQL, Keycloak, Redis, MinIO as Docker services. Auto-TLS via Let's Encrypt. |
| **Pilot** (Month 6-9, CIV only) | 2× Hetzner servers (app + DB) | ~€50-80/month | Coolify on app server, PostgreSQL on dedicated server. Daily backups to Hetzner Storage Box. |
| **Expansion** (Month 9-15, +BEN +CMR) | 3 servers | ~€100-200/month | Consider: separate PostgreSQL for CEMAC countries (CMR) if data residency requires it. |
| **Enterprise** (Month 18+) | Managed K8s or multi-server Coolify | Budget from enterprise contracts | Silo tenants get dedicated DB instances via Profile C/D. |

**Why Coolify works for you:**
- Self-hosted PaaS — deploy via `git push` or Docker image
- Built-in reverse proxy (Traefik/Nginx), auto-TLS, environment variables
- Supports Docker Compose projects natively
- Zero vendor lock-in
- Free (open-source)
- UI for managing deployments — your volunteer devs won't need to learn K8s

---

## 7. What to Build First — Cross-Referenced with Your Sprint Timeline

Your AI workflow document (Part 7-8) defines a clear sprint sequence. Here's how it maps to the AWS SaaS control plane pattern:

### Sprint 0: Host Shell (Days 1-5)

**Not part of AWS SaaS pattern** — this is your team morale booster. Ship a beautiful, empty shell.

What it proves architecturally:
- React 19.2 + TypeScript setup works
- PWA manifest + Service Worker caching works
- Offline detection works
- Responsive layout works (360px → 1024px)
- i18n with French works
- Dark mode toggle works
- The `frontend/` → `packages/shared-components/` structure is in place

### Sprint 1 (Weeks 1-3): Control Plane + First Business Modules

This is where the AWS SaaS pattern kicks in hard.

**Track A — Control Plane (Weeks 1-3):**

| Week | Deliverable | AWS SBT Equivalent |
|---|---|---|
| Week 1 | Platform Vision PRD + Control Plane PRD (via ANALYST personality) | Architecture design |
| Week 1-2 | Architecture + Design docs (via ARCHITECT + DESIGNER) | Technical specification |
| Week 2 | Tenant CRUD API + Tenant status lifecycle (PENDING → ACTIVE → SUSPENDED → DELETED) | Tenant Service |
| Week 2 | Keycloak integration: login, JWT issuance, tenant_id claim | Identity Service |
| Week 2 | User + Role + Permission management | User Service |
| Week 2 | TenantContext filter + tenant-aware Spring Data JDBC base | Tenant resolution |
| Week 2-3 | Onboarding orchestrator: create tenant → seed CIV config → activate | Provisioning |
| Week 3 | Audit trail service (immutable log of all mutations) | *(ALTARYS-specific)* |
| Week 3 | Basic employee entity (minimal — full COHRPA is post-MVP) | Shared entity |

**Track B — Absence + Attendance (starts Week 2):**

| Week | Deliverable |
|---|---|
| Week 1 | PRD + Legal Research via Perplexity (OHADA labor code, CIV leave rules) |
| Week 2 | Architecture + Design (parallel with Control Plane implementation) |
| Week 2-3 | Implementation — first real validation of the full tenant isolation chain |

**This is the critical test**: If an Absence leave request correctly resolves to the right tenant, with proper Keycloak auth, audit trail, and offline queueing — your entire platform foundation works.

### Sprint 2-4: Follow Your Defined Build Order

The remaining sprints follow your platform-vision.md §7 build order exactly:

| Sprint | Modules | AWS SaaS Pattern Being Exercised |
|---|---|---|
| Sprint 2 | Budget Lines + Commitment Management | Cross-module events (`CommitmentApproved` → `budget/` module) |
| Sprint 3 | Internal CRM | Independent module, proves module isolation |
| Sprint 4 | Payroll | Most complex — exercises country config engine, tax calculation, payslip generation |

---

## 8. Key Patterns to Implement (Revised for Spring Data JDBC)

### 8.1 Tenant-Aware Repository Base (The Most Important Pattern)

Since you're NOT using Hibernate, every query must manually include tenant context. Create a base pattern:

```java
// Base interface for all tenant-aware queries
public interface TenantAware {
    default String currentTenantId() {
        return TenantContext.current().tenantId();
    }
}

// Example: Absence module repository
public interface LeaveRequestRepository extends CrudRepository<LeaveRequest, Long>, TenantAware {
    
    @Query("""
        SELECT lr.* FROM leave_request lr
        WHERE lr.tenant_id = :tenantId
          AND lr.employee_id = :employeeId
          AND lr.status IN (:statuses)
        ORDER BY lr.start_date DESC
        """)
    List<LeaveRequest> findByEmployeeAndStatuses(
        @Param("tenantId") String tenantId,
        @Param("employeeId") Long employeeId,
        @Param("statuses") List<String> statuses
    );
}

// Service always passes tenant
@Service
public class LeaveRequestService {
    private final LeaveRequestRepository repo;
    private final ApplicationEventPublisher events;
    
    public LeaveRequest approve(Long requestId) {
        String tenantId = TenantContext.current().tenantId();
        LeaveRequest request = repo.findByIdAndTenant(requestId, tenantId)
            .orElseThrow(() -> new ResourceNotFoundException("leave_request", requestId));
        
        request.approve();
        repo.save(request);
        
        // Cross-module event (consumed by Payroll module)
        events.publishEvent(new LeaveApprovedEvent(
            tenantId, request.employeeId(), request.leaveType(),
            request.startDate(), request.endDate(), request.isPaid()
        ));
        
        // Audit
        auditService.log("APPROVE", "LeaveRequest", requestId, null, request);
        
        return request;
    }
}
```

### 8.2 Modulith Module Boundaries (Replaces Microservice Communication)

```java
// Module structure enforced by Spring Modulith
// com.altarys.papillon.modules.absence/ ← public module API
//   ├── api/                    ← REST controllers
//   ├── domain/                 ← Entities, events
//   ├── service/                ← Business logic (this IS the module API)
//   ├── repository/             ← Spring Data JDBC
//   └── event/                  ← Published/consumed events

// Test that module boundaries are respected
@ApplicationModuleTest
class AbsenceModuleTest {
    @Test
    void verifyModuleBoundaries() {
        ApplicationModules.of(AltarysApplication.class).verify();
    }
}
```

### 8.3 Country Configuration Engine (ALTARYS Differentiator)

```java
// This doesn't exist in any AWS blueprint — it's your competitive moat

@Service
public class CountryConfigService {
    private final CountryConfigRepository repo;
    
    // Tax tables versioned per fiscal year per country
    public TaxTable getTaxTable(String tenantId, String countryCode, int fiscalYear) {
        return repo.findTaxTable(countryCode, fiscalYear)
            .orElseThrow(() -> new ConfigNotFoundException(
                "Tax table not found for " + countryCode + " / " + fiscalYear));
    }
    
    // Social contribution rates (CNPS for CIV, CNSS for BEN, etc.)
    public SocialContributionRates getSocialRates(String countryCode, int fiscalYear) {
        return repo.findSocialRates(countryCode, fiscalYear)
            .orElseThrow();
    }
    
    // Leave entitlements per country's labor code
    public List<LeaveTypeConfig> getLeaveTypes(String countryCode) {
        return repo.findLeaveTypes(countryCode);
    }
}

// Versioned — admin can update rates without redeployment
// Critical for: "CIV government changes tax rates mid-year"
```

### 8.4 Tenant-Aware Logging with MDC

```java
// MDC filter — matches your REVIEWER checklist requirement
@Component
public class TenantMdcFilter extends OncePerRequestFilter {
    @Override
    protected void doFilterInternal(HttpServletRequest request, ...) {
        TenantContext.TenantInfo tenant = TenantContext.current();
        MDC.put("tenant_id", tenant.tenantId());
        MDC.put("country_code", tenant.countryCode());
        try { filterChain.doFilter(request, response); }
        finally { MDC.clear(); }
    }
}
// Logback pattern: %d{ISO8601} [%X{tenant_id}] [%X{country_code}] %level %msg%n
```

---

## 9. What's ALTARYS-Specific (Not in AWS Blueprint) — Revised

| Capability | Source (your docs) | Implementation |
|---|---|---|
| **OHADA Country Config Engine** | platform-vision.md §2.1 + AI-workflow ARCHITECT.md | Dedicated control plane module. JSON/DB-driven. Versioned per fiscal year. |
| **SYSCOHADA Chart of Accounts** | platform-vision.md §2.9 | Seeded during tenant onboarding. Reference data in control plane. |
| **4 DB Profiles** | AI-workflow §5.1 CLAUDE.md | `TenantAwareDataSource` abstraction. MVP = Profile A only. |
| **Dual-Frontend** | AI-workflow Part 0 + ARCHITECT.md | One backend API, two React apps. `packages/shared-components/` with theme injection. |
| **Offline-First** | platform-vision.md §6, §9 | PWA + Service Worker + IndexedDB queue. Every write works offline. |
| **8-Personality Claude Workflow** | AI-workflow Parts 2-9 | LEGAL AUDITOR → ANALYST → ARCHITECT → DESIGNER → PO → DEVELOPER → REVIEWER → QA VALIDATOR |
| **Legal Research Pipeline** | AI-workflow Part 3, Step 0 | Perplexity → Legal Auditor → Human validation → ANALYST reads only validated version |
| **French-first UX** | platform-vision.md §4, §9 | react-i18next, `fr` default, DD/MM/YYYY, space-as-thousands-separator, XOF/XAF 0 decimals |
| **10-year Data Retention** | platform-vision.md §9 | Tenant offboarding archives to MinIO cold storage. Never hard-delete payroll/accounting data. |
| **Mobile-first for low-end Android** | platform-vision.md §9, §10 (P4 persona) | 360px first, 48px touch targets, 3G performance (<2s page load), offline-first |
| **Internal CRM** (not typical HR SaaS) | platform-vision.md §2.6 | Manages ALTARYS's own freelance salesforce. Separate from tenant HR modules. |

---

## 10. Risks & Assumptions (Revised)

| # | Assumption | Risk if Wrong | Mitigation |
|---|---|---|---|
| 1 | Spring Data JDBC + manual tenant_id in every query is sustainable at 12+ modules | Developer fatigue, risk of forgetting WHERE clause | **Create a custom `@TenantQuery` annotation or AOP interceptor** that validates tenant_id is present. The REVIEWER personality checklist already covers this. |
| 2 | Single Spring Boot app handles 500 concurrent users per tenant (your NFR) | Performance bottleneck at scale | Spring Boot 4 + virtual threads (Java 25) handle I/O-bound concurrency well. Monitor early with Prometheus. Extract hot modules to separate services if needed. |
| 3 | Coolify handles production deployment adequately | Operational gaps (monitoring, auto-scaling, rollbacks) | Coolify supports health checks, auto-restart, and rollback. Add Prometheus/Grafana for monitoring. Plan K8s migration at ~Month 15 if needed. |
| 4 | Profile A (Shared DB) scales to Month 9 multi-country | Table sizes grow, queries slow down | Partial indexes on `(tenant_id, ...)`. PgBouncer for connection pooling. Plan Profile B migration by Month 12. |
| 5 | 4 volunteer devs + Claude Code can deliver Sprint 0-2 | Velocity risk — volunteers may not be consistent | Your AI workflow is designed for this: spec-based development, story files limit scope per session, Claude Code does heavy lifting. **Keep Sprint 0 razor-sharp: Host Shell in 5 days, nothing more.** |
| 6 | Keycloak on same server as app is fine for MVP | Resource contention | Keycloak is surprisingly lightweight (<512MB). Monitor. Move to dedicated container if needed. |
| 7 | BYO-DB can be deferred to V2+ | An early enterprise client demands it | The `TenantAwareDataSource` abstraction exists from day one. Only the implementation is deferred. |

---

## 11. How This Blueprint Fits Your AI Workflow

Your 8-personality workflow processes this architecture blueprint as follows:

| Personality | How They Use This Document |
|---|---|
| **ANALYST** | References §5 (module list) and §4 (tenant onboarding) when writing module PRDs. Uses the AWS control plane/application plane vocabulary. |
| **ARCHITECT** | This document IS the pre-input for the ARCHITECT personality. The ARCHITECT refines per-module architecture following these patterns. |
| **DESIGNER** | References §2 (dual-frontend) for brand context. Knows that `packages/shared-components/` exists. |
| **PRODUCT OWNER** | Uses §7 sprint timeline when sequencing story files. Knows module dependencies. |
| **DEVELOPER** | References §8 (key patterns) for tenant-aware repository pattern, event publishing, and MDC logging. |
| **REVIEWER** | Uses §3 (tenant resolution) and §8 (patterns) as the source of truth for the multi-tenant correctness checklist. |
| **QA VALIDATOR** | Tests that tenant isolation works per §3.4 (4 profiles — but only Profile A for MVP). |

### Recommended: Add This to Your `docs/architecture/` Directory

```
docs/architecture/
├── platform-saas-blueprint.md    ← THIS DOCUMENT
├── platform-vision-prd.md        ← ANALYST output (Tier 1)
├── control-plane-arch.md         ← ARCHITECT output for Control Plane
├── absence-arch.md               ← ARCHITECT output per module
└── ...
```

The ARCHITECT personality should read this blueprint as context when designing each module's architecture.

---

## 12. Summary

> **ALTARYS is a Spring Modulith modular monolith with two planes — a Control Plane (tenant management, identity via Keycloak, billing, OHADA country configuration) and an Application Plane (12 HR & Finance modules) — using Spring Data JDBC with explicit tenant_id in every query, supporting 4 database isolation profiles (Shared DB for MVP), event-driven onboarding, dual React frontends (Papillon SME + Enterprise at Month 18), offline-first PWA, all containerized with Docker and deployed via Coolify on a €30/month Hetzner VPS.**

The AWS SaaS Factory gave you the *thinking*. Your stack gives you the *doing*.

---

*Document version: 2.0 — February 2026*  
*Cross-referenced with: `docs/specs/platform-vision.md` (v1) and `ALTARYS_AI_Development_Workflow.md` (v7.0)*  
*Recommended location: `docs/architecture/platform-saas-blueprint.md`*  
*Next step: Run ANALYST personality against this + platform-vision.md to produce the Platform Vision PRD.*
