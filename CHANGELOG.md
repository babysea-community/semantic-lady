# Changelog

All notable changes will be documented here. The format follows [Keep a Changelog](https://keepachangelog.com/en/1.1.0), and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [Unreleased]

## [0.6.1] - 2026-06-24

### Changed

- Black Forest Labs FLUX 1.1 [pro] ultra `generation_aspect_ratio` is now an enum of common presets (`21:9`, `16:9`, `3:2`, `4:3`, `1:1`, `3:4`, `2:3`, `9:16`, `9:21`; default `16:9`) instead of a free-form string. BFL accepts any ratio between 21:9 and 9:21, but surfacing the common presets lets consumers render it as a dropdown that matches every other model's aspect ratio field while keeping BYOK validation aligned.

## [0.6.0] - 2026-06-23

### Changed

- Recategorized video model workflows to reflect true capabilities. Workflow inference now derives `video-to-video` only for models that edit a **required primary** video input, and adds two dedicated workflows for specialized models:
  - `video-to-video` is now limited to the four genuine video editors: Runway Aleph 2, Runway Gen-4 Aleph, HappyHorse 1.0 Video Edit, and Wan 2.7 VideoEdit.
  - Reference (`reference_video`) and continuation (`first_clip`) inputs no longer imply `video-to-video`. HappyHorse 1.0 R2V, Wan 2.7 R2V, Wan 2.7 I2V, ByteDance Seedance 2.0, and Seedance 2.0 Fast are now image/reference-to-video only.
  - Added `character` workflow for performance transfer driven by a reference (Runway Act Two).
  - Added `animation` workflow for a still image animated by a required driving video (Wan 2.2 Animate Mix and Move).

### Removed

- Removed the `character-performance` workflow, superseded by the more precise `character` workflow.

## [0.5.1] - 2026-06-22

### Fixed

- Added safe square defaults to dimensional fields that previously synthesized an out-of-range value when a client (or a downstream agent that auto-fills omitted fields) left them blank:
  - Black Forest Labs: Flux 2 Flex, Klein 4B, Klein 9B, Max, and Pro `generation_width`/`generation_height` now default to `1024`. They previously defaulted to `0`, which is below the documented `64` minimum and was rejected with `generation_width must be >= 64`.
  - Alibaba Cloud: Qwen Image 2.0, Qwen Image 2.0 Pro, Qwen Image Edit Max, and Qwen Image Edit Plus `generation_size` now default to `1024*1024` instead of an empty string.

### Notes

- These dimensional defaults are BabySea schema-completion conveniences, not provider-documented defaults (the providers treat the dimensions as optional/auto-sized); they are marked `// custom` in the raw schema source.

## [0.5.0] - 2026-06-21

### Changed

- Restructured the Runway Aleph 2 schema to provider-native keyframe references and a `targetAspectRatio` control with standard aspect-ratio values (such as `16:9`), replacing the previous typed reference list.

### Fixed

- Validated every model schema against the inference provider documentation as the single source of truth and corrected provider-native values across all 57 models:
  - Black Forest Labs: dropped the synthesized Flux `seed` default, minimum, and maximum (the docs document only an example value, not a default) and published the Flux Pro 1.1 Ultra aspect ratio as a free-form provider value.
  - BytePlus: removed the undocumented `off` prompt-enhancement mode from the Seedream models.
  - Google: corrected resolution tokens (`0.5K` to `512`, `4K` to `4k`) and added the missing `4k` option for Veo 3.1 Fast.
  - Runway: made `promptText` and `duration` optional on Gen-4 Turbo to match the API.
  - Alibaba Cloud: marked the Wan 2.2 Animate `mode` control as required with no default, matching the provider's required field.

## [0.4.5] - 2026-06-20

### Fixed

- Removed unsupported Google Veo 3.1 `negativePrompt` request fields from every Veo 3.1 variant schema so clients no longer emit invalid Gemini API parameters.

## [0.4.4] - 2026-06-18

### Fixed

- Corrected video workflow inference so optional reference-image fields no longer make video-to-video models appear as primary image-to-video models; Runway Aleph, Wan 2.7 Video Edit, and HappyHorse Video Edit now publish only `video-to-video`, while Wan and HappyHorse reference-to-video models keep both image/video workflows.

## [0.4.3] - 2026-06-17

### Fixed

- Removed the unsupported Google Veo 3.1 `generateAudio` request control from the generated schema so BYOK clients no longer send an invalid Gemini API parameter.

## [0.4.2] - 2026-06-16

### Fixed

- Corrected provider defaults in the generated schema catalog, including BFL Flux seed defaults, and locked raw-to-refined default preservation across all 57 models.
- Removed non-file example metadata from raw and public schemas so generated schemas only expose documented defaults and constraints.

## [0.4.1] - 2026-06-16

### Changed

- Updated the pnpm and node version.

## [0.4.0] - 2026-06-16

### Added

- Published canonical provider model identifiers as `providerModel` on model records, model summaries, and schema model metadata, so BYOK applications can route provider calls without maintaining their own model-id catalog.
- Added package lifecycle guards so `npm pack` builds `dist` and `npm publish` runs the public package check before publishing.

## [0.3.2] - 2026-06-15

### Changed

- Consolidated provider output-count controls, including Alibaba `max_images` and BytePlus `sequential_image_generation_options.max_images`, under `generation_output_number` while keeping provider modes such as sequential generation, partial images, return-last-frame, and masks as separate fields.

## [0.3.1] - 2026-06-15

### Changed

- Refactored the private schema source so provider-native raw schemas are tracked separately from BabySea standard model names and refined `generation_*` schemas.
- Promoted `generation_moderation` into the core schema tier so moderation controls appear alongside primary generation inputs.
- Normalized diverse image, video, and audio input-file terms through dedicated converter maps, including polymorphic media roles such as first frame, last frame, reference image, reference video, and reference audio.

### Fixed

- Removed semantic workflow defaults from raw provider schemas so raw model definitions remain aligned with provider documentation.
- Added `requiredAnyOf` metadata for polymorphic required media inputs so models can express “one of these input files is required” without incorrectly requiring every possible media type.

## [0.3.0] - 2026-06-15

### Changed

- Aligned image sizing schemas with provider-native request fields across all 57 models: models that accept raw `size` expose `generation_size`, models that accept raw `width`/`height` expose `generation_width` and `generation_height`, and models that accept raw `ratio`/`resolution` keep `generation_ratio`/`generation_resolution` without synthesized replacement fields.
- Removed ratio/resolution-to-size and size-to-width/height provider payload synthesis; Semantic Lady now passes provider-native sizing values through under their `generation_*` names instead of converting between sizing dialects.
- Updated Runway schemas to use provider-native pixel-ratio values (for example `1280:720`) where Runway expects those values directly.
- Promoted `generation_size`, `generation_width`, and `generation_height` into the core schema tier so native size controls appear in the primary field set for models that support them.

### Fixed

- Preserved the existing moderation normalization boundary while removing unrelated sizing value normalization, so moderation remains the only cross-provider value abstraction handled by Semantic Lady.

## [0.2.3] - 2026-06-14

### Fixed

- Re-audited all 57 model request schemas against the raw provider docs under `source-of-truth-docs-raw-schema` and added a locked field-matrix regression test for every model.
- Removed response-only or unsupported request fields from provider schemas, including generated output format/count fields on Alibaba Cloud video, BytePlus video, Google Veo video, and fixed-format image models where the raw docs do not accept those inputs.
- Corrected model-specific media and parameter support for HappyHorse, BytePlus Seedance, Google Veo 3.1 variants, BFL raw width/height controls, and Qwen public-to-provider model mapping.

## [0.2.2] - 2026-06-13

### Fixed

- Added documented `7:9` and `9:7` aspect ratios for `z/image-turbo`.
- Aligned BytePlus video provider payloads with multimodal reference role requirements by emitting `reference_image`, `reference_video`, and `reference_audio` roles where required.

## [0.2.1] - 2026-06-12

### Fixed

- Corrected Google Veo 3.1 schemas: durations are constrained to numeric `4`, `6`, or `8`, `generation_seed` is non-negative, `4K` casing is preserved, and provider input no longer emits image-count fields for Veo video requests.
- Added numeric enum support for integer/number fields in the public schema metadata.

## [0.2.0] - 2026-06-10

### Changed

- Revalidated all 57 model schemas against current inference provider documentation.
- Restricted aspect-ratio enums to provider-accepted values where ratios are passed verbatim (Alibaba Cloud Wan/HappyHorse video, BytePlus Seedance, Google Gemini/Imagen/Veo).
- Corrected Alibaba Cloud schemas: fixed-size Qwen Image/Max tiers, Qwen Image Edit no longer exposes size or prompt enhancement, Z-Image prompt enhancement defaults off, Wan 2.7 video resolutions are `720P`/`1080P` (default `1080P`), Wan 2.2 Animate `generation_check_image` defaults to `true`, and prompts are optional for image-to-video and video-edit workflows.
- Corrected Black Forest Labs schemas: guidance, steps, and prompt upsampling are FLUX.2 Flex only; FLUX 1.1 Pro Ultra is aspect-ratio driven with raw mode and image prompt strength; FLUX 1.1 Pro no longer exposes raw mode.
- Removed unsupported `generation_seed` from BytePlus Seedream image models and OpenAI GPT Image 2.
- Seedream 4.0 prompt enhancement now defaults to `standard` with a `fast` option.
- Nano Banana Pro output resolutions are `1K`/`2K`/`4K`; Imagen 4 Fast is `1K` only.
- Veo 3.1 family now supports `16:9`/`9:16`, 4-8 second durations, negative prompts, audio on by default, and last-frame input (non-Lite).
- GPT Image 2 output number raised to 10 and resolutions extended to `4K`.
- Runway seeds are non-negative, video-to-video models no longer expose the deprecated ratio, and Gen-4 Image Turbo requires reference images.

### Added

- Added the public Semantic Lady SDK package with a generated local model schema catalog.
- Added resolver helpers for model lookup, model summaries, and `core`, `advanced`, and `full` schema views.
- Added OSS utility files, GitHub issue templates, pull request template, Dependabot config, and package/security workflows.

### Security

- Documented the BYOK boundary: Semantic Lady contains no backend client, provider credentials, hosted API calls, telemetry, or provider execution path.

## [0.1.0] - 2026-06-09

### Added

- Initial public SDK release candidate for normalized `generation_*` image and video model schemas.
