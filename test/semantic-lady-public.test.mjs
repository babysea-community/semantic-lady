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

test('publishes the resolved local schema catalog', () => {
  assert.equal(listModelNames().length, 57);
  assert.equal(SEMANTIC_LADY_MODELS.length, 57);
  assert.equal(SEMANTIC_LADY_IMAGE_MODELS.length, 34);
  assert.equal(SEMANTIC_LADY_VIDEO_MODELS.length, 23);

  const qwen = getModel('qwen/image');

  assert.equal(qwen.uiName, 'Qwen Image');
  assert.equal(qwen.kind, 'image');
  assert.ok(qwen.schema.every((field) => field.name.startsWith('generation_')));
});

test('publishes doc-backed model-specific schemas', () => {
  /** @param {string} modelName @param {string} fieldName */
  const field = (modelName, fieldName) =>
    getModelSchema(modelName).fields.find((entry) => entry.name === fieldName);
  /** @param {string} modelName */
  const fieldNames = (modelName) =>
    getModelSchema(modelName).fields.map((entry) => entry.name);

  assert.deepEqual(field('wan/2.7-image', 'generation_resolution')?.enum, [
    '1K',
    '2K',
  ]);
  assert.deepEqual(field('wan/2.7-image-pro', 'generation_resolution')?.enum, [
    '1K',
    '2K',
    '4K',
  ]);
  assert.equal(field('wan/2.7-image-pro', 'generation_output_number')?.max, 12);
  assert.ok(!fieldNames('wan/2.7-image-pro').includes('generation_max_images'));
  assert.deepEqual(
    field('bytedance/seedream-4', 'generation_resolution')?.enum,
    ['1K', '2K', '4K'],
  );
  assert.ok(!fieldNames('google/nano-banana').includes('generation_thinking'));
  assert.ok(
    field('google/nano-banana-2', 'generation_ratio')?.enum?.includes('1:8'),
  );
  assert.ok(field('z/image-turbo', 'generation_ratio')?.enum?.includes('7:9'));
  assert.ok(field('z/image-turbo', 'generation_ratio')?.enum?.includes('9:7'));
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

test('keeps public model data free of raw provider internals', () => {
  for (const model of listModels()) {
    assert.equal(Object.hasOwn(model, 'aliases'), false);
    assert.equal(Object.hasOwn(model, 'providerModel'), false);
    assert.equal(
      model.schema.some((field) => Object.hasOwn(field, 'aliases')),
      false,
    );
  }
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
      (field) => field.name === 'generation_reference_motion_file',
    ),
  );
});

test('publishes lightweight summaries without schemas', () => {
  const summary = listModelSummaries()[0];

  assert.ok(summary);

  assert.equal(Object.hasOwn(summary, 'schema'), false);
  assert.equal(typeof summary.apiName, 'string');
});
