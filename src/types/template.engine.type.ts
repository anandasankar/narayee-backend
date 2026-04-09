export interface TemplateRenderResult {
  subject?: string;
  messageText?: string;
  messageHTML?: string;
}

export interface TemplateInput {
  subject?: string | null;
  messageText?: string | null;
  messageHTML?: string | null;
}
