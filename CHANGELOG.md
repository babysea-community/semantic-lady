# Changelog

All notable changes will be documented here. The format follows [Keep a Changelog](https://keepachangelog.com/en/1.1.0), and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## Unreleased

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
