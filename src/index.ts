import {
  SEMANTIC_LADY_IMAGE_MODELS,
  SEMANTIC_LADY_MODELS,
  SEMANTIC_LADY_VIDEO_MODELS,
} from './catalog.generated.js';
import type {
  SemanticLadyField,
  SemanticLadyModel,
  SemanticLadyModelSchema,
  SemanticLadyModelSummary,
  SemanticLadySchemaView,
} from './types.js';

export {
  SEMANTIC_LADY_IMAGE_MODELS,
  SEMANTIC_LADY_MODELS,
  SEMANTIC_LADY_VIDEO_MODELS,
} from './catalog.generated.js';
export type {
  SemanticLadyField,
  SemanticLadyFieldName,
  SemanticLadyFieldType,
  SemanticLadyModel,
  SemanticLadyModelKind,
  SemanticLadyModelSchema,
  SemanticLadyModelSummary,
  SemanticLadyProvider,
  SemanticLadySchemaTier,
  SemanticLadySchemaView,
  SemanticLadyWorkflow,
} from './types.js';

const MODEL_BY_NAME = new Map<string, SemanticLadyModel>(
  SEMANTIC_LADY_MODELS.map((model) => [model.apiName, model]),
);

export function listModels(): SemanticLadyModel[] {
  return SEMANTIC_LADY_MODELS.map(cloneModel);
}

export function listModelSummaries(): SemanticLadyModelSummary[] {
  return SEMANTIC_LADY_MODELS.map(toModelSummary);
}

export function listModelNames(): string[] {
  return SEMANTIC_LADY_MODELS.map((model) => model.apiName);
}

export function getModel(apiName: string): SemanticLadyModel | undefined {
  const model = MODEL_BY_NAME.get(apiName);

  return model ? cloneModel(model) : undefined;
}

export function requireModel(apiName: string): SemanticLadyModel {
  const model = getModel(apiName);

  if (!model) {
    throw new Error(`Unknown Semantic Lady model: ${apiName}`);
  }

  return model;
}

export function getModelSchema(
  apiName: string,
  view: SemanticLadySchemaView = 'full',
): SemanticLadyModelSchema {
  const model = requireModel(apiName);
  const fields = fieldsForView(model.schema, view);

  return {
    fields,
    model: toModelSummary(model),
    view,
  };
}

export function getModelCoreSchema(apiName: string): SemanticLadyModelSchema {
  return getModelSchema(apiName, 'core');
}

export function getModelAdvancedSchema(
  apiName: string,
): SemanticLadyModelSchema {
  return getModelSchema(apiName, 'advanced');
}

export function resolveModelSchema(
  apiName: string,
  view: SemanticLadySchemaView = 'full',
): readonly SemanticLadyField[] {
  return getModelSchema(apiName, view).fields;
}

function fieldsForView(
  fields: readonly SemanticLadyField[],
  view: SemanticLadySchemaView,
): SemanticLadyField[] {
  if (view === 'full') {
    return fields.map(cloneField);
  }

  return fields.filter((field) => field.tier === view).map(cloneField);
}

function cloneModel(model: SemanticLadyModel): SemanticLadyModel {
  return {
    ...model,
    schema: model.schema.map(cloneField),
    workflows: [...model.workflows],
  };
}

function cloneField(field: SemanticLadyField): SemanticLadyField {
  const { enum: enumValues, ...rest } = field;

  return enumValues ? { ...rest, enum: [...enumValues] } : rest;
}

function toModelSummary(model: SemanticLadyModel): SemanticLadyModelSummary {
  return {
    apiName: model.apiName,
    kind: model.kind,
    provider: model.provider,
    uiName: model.uiName,
    workflows: [...model.workflows],
  };
}
