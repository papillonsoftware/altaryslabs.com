---
description: Commit changes, push, and create a PR
model: haiku
---
Run the following steps:

**Pre-flight: worktree check**
1. Run `git rev-parse --show-toplevel` and `git branch --show-current`
2. If you are on `main` or on `refonte-multipages`, or in the main checkout rather than inside `.claude/worktrees/`, STOP and warn the user: "This branch receives no direct commits. Create a worktree first: `git worktree add .claude/worktrees/<slug> -b <type>/<slug> origin/refonte-multipages`."
3. Only proceed on a `feat/`, `fix/`, `refactor/`, `chore/` or `docs/` branch inside a worktree.

**Commit flow**
4. Run `git status` and `git diff --stat` to understand the changes
5. Run the build: `npm run build` and `npm run check`. Both must be green.
6. If either fails, STOP and report. Never commit on a red build.
7. Write a conventional commit message **in French**, per the repository language rule: `feat|fix|refactor|docs|chore(scope): description`
8. Push to the branch (`git push -u origin <branch>` on first push)
9. Create a PR **targeting `refonte-multipages`**, never `main`. `main` still serves the legacy site and the rebuild deletes `CNAME`.
10. In the PR description, link to the work item doc under `docs/work-items/` and to the relevant D-rows in `docs/DECISIONS.md`.

Never use the em-dash or the interpunct in the commit message or the PR description.
