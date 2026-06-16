import assert from 'node:assert/strict';
import test from 'node:test';

import {
  SEMANTIC_LADY_IMAGE_MODELS,
  SEMANTIC_LADY_MODELS,
  SEMANTIC_LADY_VIDEO_MODELS,
  getModel as getModelUnsafe,
  getModelSchema,
  listModelNames,
  listModelSummaries,
  listModels,
  resolveModelSchema,
} from '../dist/index.js';

/**
 * @param {string} modelName
 * @returns {import('../dist/index.js').SemanticLadyModel}
 */
function getModel(modelName) {
  const model = getModelUnsafe(modelName);
  assert.ok(model);
  return model;
}

const forbiddenFieldNames = new Set([
  'generation_audio_setting',
  'generation_count',
  'generation_enhance_prompt',
  'generation_generate_audio',
  'generation_guidance_scale',
  'generation_mask_file',
  'generation_max_images',
  'generation_num_inference_steps',
  'generation_prompt_strength',
  'generation_ratio',
  'generation_raw_mode',
  'generation_sequential_max_images',
  'generation_thinking_mode',
]);

test('publishes the resolved local schema catalog', () => {
  assert.equal(listModelNames().length, 57);
  assert.equal(SEMANTIC_LADY_MODELS.length, 57);
  assert.equal(SEMANTIC_LADY_IMAGE_MODELS.length, 34);
  assert.equal(SEMANTIC_LADY_VIDEO_MODELS.length, 23);

  const qwen = getModel('qwen/image');

  assert.equal(qwen.uiName, 'Image');
  assert.equal(qwen.kind, 'image');
  assert.equal(qwen.providerModel, 'qwen-image');
  assert.ok(qwen.schema.every((field) => field.name.startsWith('generation_')));
});

test('publishes doc-backed model-specific schemas', () => {
  /** @param {string} modelName @param {string} fieldName */
  const field = (modelName, fieldName) =>
    getModelSchema(modelName).fields.find((entry) => entry.name === fieldName);
  /** @param {string} modelName */
  const fieldNames = (modelName) =>
    getModelSchema(modelName).fields.map((entry) => entry.name);

  assert.ok(fieldNames('wan/2.7-image').includes('generation_size'));
  assert.ok(fieldNames('wan/2.7-image-pro').includes('generation_size'));
  assert.ok(!fieldNames('wan/2.7-image').includes('generation_resolution'));
  assert.ok(!fieldNames('wan/2.7-image-pro').includes('generation_resolution'));
  assert.equal(field('wan/2.7-image-pro', 'generation_output_number')?.max, 12);
  assert.ok(!fieldNames('wan/2.7-image-pro').includes('generation_max_images'));
  assert.ok(fieldNames('bytedance/seedream-4').includes('generation_size'));
  assert.ok(
    !fieldNames('bytedance/seedream-4').includes('generation_resolution'),
  );
  assert.ok(!fieldNames('google/nano-banana').includes('generation_thinking'));
  assert.ok(
    field('google/nano-banana-2', 'generation_aspect_ratio')?.enum?.includes('1:8'),
  );
  assert.ok(fieldNames('z/image-turbo').includes('generation_size'));
  assert.ok(!fieldNames('z/image-turbo').includes('generation_aspect_ratio'));
  assert.ok(
    !fieldNames('runway/gen-4-turbo').includes('generation_input_video_file'),
  );
  assert.ok(!fieldNames('runway/aleph-2').includes('generation_duration'));
  assert.deepEqual(field('google/veo-3.1-fast', 'generation_duration')?.enum, [
    4,
    6,
    8,
  ]);
  assert.equal(field('google/veo-3.1-fast', 'generation_seed')?.min, 0);
  assert.equal(field('bfl/flux-1.1-pro', 'generation_seed')?.default, 42);
  assert.equal(field('bfl/flux-2-flex', 'generation_seed')?.default, 42);
});

test('does not publish generated example metadata', () => {
  for (const model of listModels()) {
    for (const field of model.schema) {
      assert.equal(Object.hasOwn(field, 'example'), false, `${model.apiName}.${field.name}`);
    }
  }
});

test('does not publish removed semantic field names', () => {
  for (const model of listModels()) {
    for (const field of model.schema) {
      assert.equal(
        forbiddenFieldNames.has(field.name),
        false,
        `${model.apiName} publishes ${field.name}`,
      );
    }
  }
});

test('orders models by inference provider and API name', () => {
  const sorted = listModels()
    .map((model) => `${model.provider}:${model.apiName}`)
    .sort((a, b) => a.localeCompare(b));

  assert.deepEqual(
    listModels().map((model) => `${model.provider}:${model.apiName}`),
    sorted,
  );
});

test('publishes provider model ids without private aliases', () => {
  const providerModelIds = new Set();

  for (const model of listModels()) {
    assert.equal(Object.hasOwn(model, 'aliases'), false);
    assert.equal(typeof model.providerModel, 'string');
    assert.ok(model.providerModel.length > 0);
    assert.equal(providerModelIds.has(model.providerModel), false);
    providerModelIds.add(model.providerModel);
    assert.equal(
      model.schema.some((field) => Object.hasOwn(field, 'aliases')),
      false,
    );
  }

  assert.equal(providerModelIds.size, 57);
  assert.equal(
    getModelSchema('google/veo-3.1-fast').model.providerModel,
    'veo-3.1-fast-generate-preview',
  );
});

test('resolves schema views locally', () => {
  const full = getModelSchema('runway/act-two');
  const core = getModelSchema('runway/act-two', 'core');
  const advanced = resolveModelSchema('runway/act-two', 'advanced');

  assert.equal(full.view, 'full');
  assert.ok(full.fields.length > core.fields.length);
  assert.ok(core.fields.every((field) => field.tier === 'core'));
  assert.ok(advanced.every((field) => field.tier === 'advanced'));
  assert.ok(
    full.fields.some(
      (field) => field.name === 'generation_input_video_file',
    ),
  );
});

test('publishes lightweight summaries without schemas', () => {
  const summary = listModelSummaries()[0];

  assert.ok(summary);

  assert.equal(Object.hasOwn(summary, 'schema'), false);
  assert.equal(typeof summary.apiName, 'string');
  assert.equal(typeof summary.providerModel, 'string');
});
