import assert from 'node:assert/strict';
import test from 'node:test';
import {
  getModel,
  getModelSchema,
  listModelNames,
  listModels,
  listModelSummaries,
  resolveModelSchema,
  SEMANTIC_LADY_IMAGE_MODELS,
  SEMANTIC_LADY_MODELS,
  SEMANTIC_LADY_VIDEO_MODELS,
} from '../dist/index.js';

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
    assert.equal(model.schema.some((field) => Object.hasOwn(field, 'aliases')), false);
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

  assert.equal(Object.hasOwn(summary, 'schema'), false);
  assert.equal(typeof summary.apiName, 'string');
});
