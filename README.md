<div align="center">

<img src="public/icon.png" width="100" alt="Semantic Lady icon" />

# Semantic Lady

Schema unification SDK for generative media model APIs.

### One generation schema across image and video models.

<br />

<strong>Project details</strong>

[![BabySea OSS SDK](https://custom-icon-badges.demolab.com/badge/oss-sdk-7C3AED?style=for-the-badge&logo=babysea&logoColor=white)](#babysea-oss-taxonomy)
[![BabySea OSS Status Production](https://custom-icon-badges.demolab.com/badge/status-production-C026D3?style=for-the-badge&logo=babysea&logoColor=white)](#status)
[![License](https://custom-icon-badges.demolab.com/badge/license-apache_2.0-059669?style=for-the-badge&logo=apache&logoColor=white)](LICENSE)

<br/>

<strong>Checks</strong>

[![GitLabCI](https://img.shields.io/gitlab/pipeline-status/babysea/semantic-lady?branch=main&style=for-the-badge&label=gitlabci&logo=gitlab&logoColor=white&color=FC6D26)](https://gitlab.com/babysea/semantic-lady/-/commits/main)
[![CodeQL](https://img.shields.io/github/actions/workflow/status/babysea-community/semantic-lady/codeql.yml?style=for-the-badge&label=codeql&logo=github&logoColor=white)](https://github.com/babysea-community/semantic-lady/actions/workflows/codeql.yml)
[![Package](https://img.shields.io/github/actions/workflow/status/babysea-community/semantic-lady/package-check.yml?style=for-the-badge&label=package&logo=npm&logoColor=white)](https://github.com/babysea-community/semantic-lady/actions/workflows/package-check.yml)

<br/>

<strong>Built with</strong>

[![npm](https://img.shields.io/npm/v/semantic-lady?style=for-the-badge&color=CB3837&logo=npm&logoColor=white)](https://www.npmjs.com/package/semantic-lady)
[![Node.js](https://img.shields.io/badge/Node.js-24%2B-5FA04E?style=for-the-badge&logo=nodedotjs&logoColor=white)](https://nodejs.org)
[![TypeScript](https://img.shields.io/badge/typescript-3178C6?style=for-the-badge&logo=typescript&logoColor=white)](https://www.typescriptlang.org)

<br/>

<img src="public/card.png" alt="Semantic Lady card" />

</div>

<br/>

## BabySea OSS taxonomy

BabySea open source projects are organized into three categories:

[![BabySea OSS SDK](https://custom-icon-badges.demolab.com/badge/oss-sdk-7C3AED?style=for-the-badge&logo=babysea&logoColor=white)](#babysea-oss-taxonomy)
[![BabySea OSS Primitive](https://custom-icon-badges.demolab.com/badge/oss-primitive-EA580c?style=for-the-badge&logo=babysea&logoColor=white)](#babysea-oss-taxonomy)
[![BabySea OSS Starter](https://custom-icon-badges.demolab.com/badge/oss-starter-2563EB?style=for-the-badge&logo=babysea&logoColor=white)](#babysea-oss-taxonomy)

| Category      | Description                                                                                                                                        |
| :------------ | :------------------------------------------------------------------------------------------------------------------------------------------------- |
| **SDK**       | Typed developer entry points that applications import directly. Semantic Lady is an SDK because it ships local model/schema resolver APIs.         |
| **Primitive** | Reusable infrastructure boundaries extracted from BabySea's execution control plane. Each primitive focuses on one system concern.                 |
| **Starter**   | Deployable reference applications that combine product UI, auth, storage, and generative media execution patterns. Some starters may include billing. |

## Status

BabySea OSS projects are published into three status levels:

[![BabySea OSS Status Working](https://custom-icon-badges.demolab.com/badge/status-working-DB2777?style=for-the-badge&logo=babysea&logoColor=white)](#status)
[![BabySea OSS Status Production](https://custom-icon-badges.demolab.com/badge/status-production-C026D3?style=for-the-badge&logo=babysea&logoColor=white)](#status)
[![BabySea OSS Status Alpha](https://custom-icon-badges.demolab.com/badge/status-alpha-D97706?style=for-the-badge&logo=babysea&logoColor=white)](#status)

| Status         | Description                                                                                                                                                                          |
| :------------- | :----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| **Working**    | Fully implemented and usable. All documented capabilities function as described. Suitable for personal and small-team use. No breaking-change guarantees between versions.          |
| **Production** | Working plus a hardened public runtime contract. Validated against a stated infrastructure stack with deterministic behavior, explicit failure modes, and a documented upgrade path. |
| **Alpha**      | Early-stage implementation. Core structure exists but some capabilities may be incomplete, undocumented, or subject to breaking changes. Not recommended for production deployments. |

---

## Contents

- [1. Overview](#1-overview)
- [2. Architecture](#2-architecture)
- [3. Quickstart](#3-quickstart)
- [4. Security and Compliance](#4-security-and-compliance)
- [5. Community](#5-community)
- [6. License](#6-license)

---

## 1. Overview

### What this is

`semantic-lady` is a local TypeScript SDK for resolving generative media model schemas into one normalized `generation_*` field contract.

It helps BYOK products, workflow builders, and community tools present many provider models through one consistent schema vocabulary without calling BabySea, running a backend, or wrapping provider SDKs.

Different inference providers name the same ideas differently. Semantic Lady exposes a resolved catalog where public API model IDs, provider model IDs, UI names, field names, field types, defaults, enum values, placeholders, and schema tiers are normalized for application code.

Semantic Lady is extracted from the schema work used to make BabySea and BabyChain handle provider growth without hard-coding every UI and request shape by hand. The public SDK exposes the normalized contract and canonical provider model identifiers, not BabySea's private schema compiler or provider payload mapper.

Public OSS behavior is limited to local schema discovery and schema resolution. The package ships model metadata and normalized `generation_*` fields. It does not submit generations, store credentials, call provider APIs, call BabySea APIs, choose providers, price workloads, or manage execution.

Install the SDK, list available image/video models, resolve the schema for the selected model, render fields in your UI, collect user input, then pass that input to your own BYOK provider integration.

### Schema contract

| Surface       | Contract                                                                                           |
| :------------ | :------------------------------------------------------------------------------------------------- |
| Model names   | Stable API names such as `bfl/flux-2-pro`, provider model IDs such as `flux-2-pro`, and user-facing UI names for pickers and labels. |
| Model groups  | Separate image and video model arrays, plus one combined array ordered by provider and API name.    |
| Fields        | Normalized `generation_*` names such as `generation_prompt`, `generation_aspect_ratio`, and media inputs. |
| Field shape   | Type, required flag, default, enum values, min/max, placeholder, description, and schema tier.      |
| Schema views  | `core`, `advanced`, and `full` views for compact UI controls or complete model forms.              |

The public package is data plus local resolver helpers. It is safe to use in server-side code, build tools, CLIs, and browser bundles where the generated catalog size is acceptable.

### Terminology

| Term                  | Meaning in this package                                                                                 |
| :-------------------- | :------------------------------------------------------------------------------------------------------- |
| Semantic model        | One supported image or video model with an API name, UI name, provider, workflows, and resolved schema. |
| API name              | Stable model identifier used by application code, for example `google/veo-3.1-fast`.                    |
| Provider model        | Canonical provider-side model identifier used by BYOK adapters, for example `veo-3.1-fast-generate-preview`. |
| UI name               | Human-readable model label for menus and forms.                                                         |
| Normalized field      | A provider-neutral field named with the `generation_*` prefix.                                           |
| Core schema           | The fields most users need first, ordered for predictable UI rendering.                                  |
| Advanced schema       | Less common controls, ordered alphabetically after core fields.                                          |
| BYOK                  | Bring your own key: your application owns provider credentials and provider execution.                   |

### Boundaries

- Not a hosted API, backend client, or network SDK.
- Not a provider SDK wrapper and not a generation submission tool.
- Not a credential store, proxy, queue, pricing engine, or provider router.
- Not BabySea's private schema compiler, raw provider-doc parser, private alias map, or provider payload mapper.
- Not a replacement for your BYOK integration. It gives your app the normalized schema contract your BYOK integration can consume.

### Core capabilities

**What it normalizes.** Semantic Lady normalizes model names for APIs, model names for UIs, and provider field shapes into one `generation_*` schema vocabulary. Normalized field names follow the `generation_` prefix convention, for example `generation_prompt`, `generation_aspect_ratio`, `generation_image_url`, `generation_duration`, and `generation_seed`.

**Model ordering.** The exported model catalog is ordered by inference provider first, then model API name alphabetically. Image and video models are also exported separately for products that need media-type tabs or filters.

**Schema tiers.** `core` fields are designed for the first screen of a model form. `advanced` fields are available for complete model control. `full` returns both tiers in deterministic order.

**BYOK usage.** Semantic Lady is meant for BYOK applications. It never asks for provider keys and never sends requests. Use it to decide which fields your app should collect, then map the normalized input inside your own provider adapter.

## 2. Architecture

```text
Private schema source
        |
        v
Resolved public catalog
        |
        v
semantic-lady local SDK
        |
        v
Your BYOK app UI / workflow builder / provider adapter
```

The public SDK exports generated, normalized catalog data and small resolver helpers. Your application remains responsible for provider credentials, provider calls, retries, storage, billing, and moderation policy.

## 3. Quickstart

### Install

```bash
pnpm add semantic-lady
```

```bash
npm install semantic-lady
```

### List models

```typescript
import {
  SEMANTIC_LADY_IMAGE_MODELS,
  SEMANTIC_LADY_VIDEO_MODELS,
  listModelSummaries,
} from 'semantic-lady';

const models = listModelSummaries();
const imageModelCount = SEMANTIC_LADY_IMAGE_MODELS.length;
const videoModelCount = SEMANTIC_LADY_VIDEO_MODELS.length;

console.log(
  models[0]?.apiName,
  models[0]?.providerModel,
  imageModelCount,
  videoModelCount,
);
```

### Resolve a model schema

```typescript
import { getModelSchema } from 'semantic-lady';

const schema = getModelSchema('bfl/flux-2-pro', 'full');

for (const field of schema.fields) {
  console.log(field.name, field.type, field.required ?? false);
}
```

### Build UI controls

```typescript
import { getModelCoreSchema } from 'semantic-lady';

const core = getModelCoreSchema('google/veo-3.1-fast');

const controls = core.fields.map((field) => ({
  key: field.name,
  label: field.description,
  options: field.enum,
  placeholder: field.placeholder,
  required: field.required ?? false,
  type: field.type,
}));
```

## 4. Security and Compliance

The project publishes its trust signals through public GitHub, GitLab, or other CI provider checks so contributors can inspect the actual CI configuration, jobs, and reports.

## 5. Community

Issues, pull requests, design discussion, and security reports should follow [`CONTRIBUTING.md`](CONTRIBUTING.md), [`CODE_OF_CONDUCT.md`](CODE_OF_CONDUCT.md), and [`SECURITY.md`](SECURITY.md).

## 6. License

[Apache License 2.0](LICENSE).
