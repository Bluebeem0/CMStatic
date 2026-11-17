# Security Policy

## Supported versions

CMStatic has not been released yet. Until version 1.0, only the latest release (or the `main` branch before the first release) receives security fixes.

## Reporting a vulnerability

**Please do not open a public issue for a security problem.**

Report it privately through GitHub: go to the [Security tab](https://github.com/Bluebeem0/CMStatic/security) and click **Report a vulnerability**, or open <https://github.com/Bluebeem0/CMStatic/security/advisories/new> directly. Only the maintainers can read the report.

Please include:

- what an attacker can do, and under which conditions;
- the steps to reproduce, ideally with a minimal example site;
- the CMStatic version or commit, your operating system and Node version.

## What happens next

CMStatic is maintained by one person in their spare time, so these are goals, not guarantees:

- acknowledgement of your report within 7 days;
- a first assessment (accepted or not, severity) within 14 days;
- a fix and a public advisory as soon as possible, crediting you unless you prefer not to be named.

## Scope

Security rules the project commits to are listed in [`docs/02-architecture.md`](docs/02-architecture.md#sécurité). Of particular interest:

- the local admin server (it must only listen on `127.0.0.1` and require its session token);
- path handling (no write outside the site folder);
- secrets (deployment credentials must never end up in the site repository, logs or error messages);
- HTML sanitization of Markdown content.
