# semantic-lady

`@babysea/semantic-lady` is a public TypeScript SDK for local schema unification across generative media models. See [README.md](README.md) for the full contract.

This file mirrors the README so deploys, IDEs, and tooling that read `AGENTS.md` see the same context.

## Scope

- **Supported OSS surface:** local TypeScript SDK, generated model catalog, and resolver helpers only.
- **Purpose:** normalize model API names, UI names, and `generation_*` schema fields for BYOK image/video applications.
- **Not included:** hosted APIs, provider SDK calls, provider credentials, auth, persistence, billing, queues, webhooks, telemetry, network clients, retries, or BabySea account dependencies.
- **Public data boundary:** resolved schema metadata is public; private schema compiler details, provider aliases, raw provider payloads, and BabySea-only internals are not public.

## Layout

| Path | Purpose |
| --- | --- |
| `src/catalog.generated.ts` | Generated public model/schema catalog |
| `src/index.ts` | Public resolver helpers and exports |
| `src/types.ts` | Public SDK types |
| `test/` | Node test runner checks for catalog count, ordering, schema views, and public-boundary sanitization |
| `.github/` | Issue templates and package/security workflows for the standalone repo |

## Conventions

- Apache 2.0 license.
- TypeScript strict mode.
- No runtime network calls.
- No provider credentials, raw prompts, signed URLs, generated media, private aliases, or provider-native payloads in examples or tests.
- Models are ordered by inference provider, then API name alphabetically.
- Keep core fields first and advanced fields deterministic.
- Update `CHANGELOG.md` for user-visible schema, docs, package, workflow, or export changes.
