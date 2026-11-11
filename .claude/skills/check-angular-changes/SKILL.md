---
name: check-angular-changes
description: After an Angular dependency bump, read old/new versions from package.json, fetch the GitHub release notes for every Angular dependency in that range, triage each entry against the codebase and apply the needed changes/fixes/improvements. Use when the user says "check angular changes", "controlla changes angular", or just updated Angular.
---

# Check Angular changes

## 1. Versions old → new

- List the Angular deps: `jq -r '(.dependencies + .devDependencies) | to_entries[] | select(.key | test("^@angular|^@angular-devkit|^@schematics/angular|^angular-eslint")) | "\(.key) \(.value)"' package.json`
- Old versions: `git diff HEAD -- package.json`. If the working tree is clean, use `git diff HEAD~1 -- package.json`. If that also has no Angular diff, use `git log -p -n 5 -- package.json` and find the last bump.
- Installed versions: `jq -r .version node_modules/<pkg>/package.json`. A `^` range can resolve to a higher version than the one written. The upper bound of the range is the installed version.

## 2. Package → repo

| Packages                                                                                                                        | Repo                            |
| ------------------------------------------------------------------------------------------------------------------------------- | ------------------------------- |
| `@angular/core`, `common`, `compiler`, `compiler-cli`, `forms`, `router`, `platform-browser`, `service-worker`, `animations`, … | `angular/angular`               |
| `@angular/cli`, `@angular/build`, `@angular/ssr`, `@angular-devkit/*`, `@schematics/angular`                                    | `angular/angular-cli`           |
| `@angular/material`, `@angular/cdk` (only if present)                                                                           | `angular/components`            |
| `angular-eslint`                                                                                                                | `angular-eslint/angular-eslint` |

## 3. Fetch every release in the range (old, new]

Fetch every release in the range, not only the latest one. A bump can skip versions.

- `gh` is not installed. Use WebFetch:
  - angular/angular: `https://github.com/angular/angular/releases#release-v<version>` (e.g. `#release-v22.2.3`). `releases/tag/<version>` returns 404.
  - Other repos: check the anchor/tag format on `https://github.com/<repo>/releases` first.
  - Fallback: `https://raw.githubusercontent.com/<repo>/main/CHANGELOG.md`. Read only the sections in the range.
- Extract from each release: features, fixes, deprecations, breaking changes, with the package they refer to.

## 4. Check with the `angular-cli` MCP

The project has the `angular-cli` MCP configured. Load its tools with ToolSearch (`+angular-cli`) before the first call.

1. `list_projects`: get the workspace `path` and the project name. Confirm the reported Angular version matches the new version from step 1.
2. `get_best_practices` with the workspace `path`: load the version-specific best practices for the new version. Compare them with the codebase and AGENTS.md. Each new or changed recommendation that the codebase does not follow becomes a triage entry in step 5.
3. `search_documentation` (with the version from `list_projects`) for each release entry that touches an API the codebase uses: confirm the new behavior, the replacement for a deprecated API, and the correct usage.
4. `onpush_zoneless_migration`: run it only when a release changes change detection or zoneless behavior. Use its output as triage entries.

## 5. Triage against the codebase

For each entry, search the real usage with tokensave (`tokensave_search` with `literal: true`, `tokensave_context`). Do not rely on memory. Classify the entry:

- **Action**: a deprecated API in use, a breaking change, or a new API that replaces a workaround or custom code in the codebase. Examples: a fix that makes a `ponytail:` or workaround comment obsolete, or a new signal-forms API that replaces hand-written logic.
- **Check**: a fix in an area the codebase uses (signal forms, zoneless, `rxResource`, `linkedSignal`, router, service worker, Vitest unit-test builder, dev server/HMR). Verify if a local workaround can now be removed.
- **N/A**: an area the codebase does not use.

Also do these checks:

- For a new or changed API, use the `search_documentation` result from step 4, as AGENTS.md requires.
- Read the memory notes that describe Angular workarounds (zoneless form reactivity, no `vi.mock` for local modules, stale HMR dev server, and similar). Flag each note that a release resolves, and propose to update or delete it.

## 6. Report before you edit

Show a table in chat: `release | package | entry | impact (Action/Check/N/A) | file:line | proposed action`. Show only Action and Check rows. Give the N/A count in one line.

If there are no Action or Check items, say "Nothing to change" in one line and stop.

## 7. Apply

- Apply the Action items. If an item is ambiguous (a behavior change, or a refactor with more than one option), ask the user first.
- Follow AGENTS.md:
  - Run `npx prettier --write` on the touched files.
  - Run `npx eslint` / `npx stylelint` on the touched files.
  - Update or add Vitest tests.
  - Run `npx ng test --watch=false`.
  - Run `npx ng build` to catch compiler or template-checker changes.
- Never run `git commit` or `git push`.
- End with a short summary: what changed, what was skipped and why.
