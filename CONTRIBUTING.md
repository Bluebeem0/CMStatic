# Contributing to CMStatic

Thank you for your interest! CMStatic is at an early stage, so the best contributions right now are bug reports, feedback on the design documents, and small focused pull requests.

By participating, you agree to follow the [Code of Conduct](CODE_OF_CONDUCT.md). Security problems must be reported privately, see [SECURITY.md](SECURITY.md).

## Before you start

The design is written down in `docs/` (in French):

| Document | What it covers |
| --- | --- |
| [`docs/01-vision.md`](docs/01-vision.md) | Why the project exists, for whom, guiding principles |
| [`docs/02-architecture.md`](docs/02-architecture.md) | Packages, data model, security rules, tech stack |
| [`docs/03-roadmap.md`](docs/03-roadmap.md) | Phases and tasks: what is being worked on |
| [`docs/05-conventions.md`](docs/05-conventions.md) | Code, Git and testing conventions |
| [`docs/adr/`](docs/adr/) | Architecture decisions already taken |

Work follows the roadmap one phase at a time. For anything bigger than a bug fix, please open an issue first so we can agree on the approach. Ideas outside the current phase are welcome and go to [`docs/ideas.md`](docs/ideas.md).

## Development setup

Requirements: Node.js 22.22 or later (Node 24 recommended, see `.nvmrc`) and Corepack, which ships with Node.

```bash
git clone https://github.com/Bluebeem0/CMStatic.git
cd CMStatic
corepack enable      # installs the pnpm version pinned in package.json
pnpm install
```

## Checks

Run these before every commit; the CI runs them too:

```bash
pnpm typecheck   # TypeScript, all packages
pnpm lint        # Biome lint + format check
pnpm test        # Vitest, all packages
pnpm build       # build all packages
```

`pnpm format` fixes formatting and import order automatically.

## Code rules (short version)

- TypeScript `strict`, ESM only, no `any`.
- Everything coming from outside (files, HTTP, config, CLI) is validated with Zod.
- Named exports, `kebab-case.ts` files, tests next to the code as `*.test.ts`.
- Every bug fix comes with a test that reproduces the bug.

## Branches, commits and pull requests

- One task = one branch: `feat/…`, `fix/…`, `docs/…`, `chore/…`.
- Commits follow [Conventional Commits](https://www.conventionalcommits.org/): `feat(core): add fields.reference helper`. Scopes are package names (`core`, `builder`, `cli`…) or `repo`.
- A commit that adds a dependency explains in its body why this one, whether it is maintained, and which alternatives were considered.
- If you change a publishable package, add a changeset: `pnpm changeset`.
- Code, identifiers, commits and code comments are in English; design documents in `docs/` are in French.

Pull requests are merged into `main` once the CI is green and the review is done.
