# Handoff

The note one session leaves for the next — local or in the cloud. **Rewrite it at the end of every
session** (not append) and commit it with that session's work. `ROADMAP.md` says *what* is done and
next; this file says *how it was left*: state of the working tree, what is half-finished, what to
watch out for. A cloud session cannot see the maintainer's private vault, so nothing here may depend
on it.

Read order for a new session: `ROADMAP.md` → this file → `CLAUDE.md` → the spec and plan named under
"Where to continue".

---

## Session

<!-- Date, local or cloud, and the one-line goal of the session. -->

## Where to continue

<!-- The exact next action: task and step in the plan, with the file paths. One or two lines. -->

## State of the working tree

<!-- Branch, last commit, anything uncommitted or unpushed and why. "Clean" if clean. -->

## Done this session

<!-- Short list; each item names the commit or file. Details belong in commits and CHANGELOG.md. -->

## Half-finished

<!-- What was started and not completed, how far it got, and what the next step on it is. -->

## Decisions taken this session

<!-- Only those not yet in a DECISIONS.md; move them there before ending if possible. -->

## Open questions for the maintainer

<!-- Questions only the maintainer can answer, most important first. -->

## Watch out

<!-- Traps found this session: failing tests, flaky tools, environment quirks, things that look
     wrong but are intentional. -->

## Verification

<!-- The commands run at the end and their results (lint, typecheck, tests, build). -->
