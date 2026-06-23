export type SemanticLadyProvider =
  | 'alibaba-cloud'
  | 'black-forest-labs'
  | 'byteplus'
  | 'google'
  | 'openai'
  | 'runway';

export type SemanticLadyModelKind = 'image' | 'video';

export type SemanticLadyWorkflow =
  | 'text-to-image' // image
  | 'image-to-image' // image
  | 'text-to-video' // video
  | 'image-to-video' // video
  | 'video-to-video' // video
  | 'character' // video: performance transfer driven by a reference (e.g. Act Two)
  | 'animation'; // video: a still image animated by a required driving video (e.g. Wan Animate)

export type SemanticLadyFieldType =
  | 'boolean'
  | 'enum'
  | 'integer'
  | 'number'
  | 'object'
  | 'string'
  | 'string-array'
  | 'url'
  | 'url-array';

export type SemanticLadyFieldName = `generation_${string}`;

export type SemanticLadySchemaTier = 'core' | 'advanced';

export type SemanticLadySchemaView = SemanticLadySchemaTier | 'full';

export type SemanticLadyField = {
  default?: unknown;
  description: string;
  enum?: readonly (number | string)[];
  max?: number;
  min?: number;
  name: SemanticLadyFieldName;
  placeholder?: string;
  required?: boolean;
  tier: SemanticLadySchemaTier;
  type: SemanticLadyFieldType;
};

export type SemanticLadyModel = {
  apiName: string;
  kind: SemanticLadyModelKind;
  provider: SemanticLadyProvider;
  providerModel: string;
  schema: readonly SemanticLadyField[];
  uiName: string;
  workflows: readonly SemanticLadyWorkflow[];
};

export type SemanticLadyModelSummary = Omit<SemanticLadyModel, 'schema'>;

export type SemanticLadyModelSchema = {
  fields: readonly SemanticLadyField[];
  model: SemanticLadyModelSummary;
  view: SemanticLadySchemaView;
};
