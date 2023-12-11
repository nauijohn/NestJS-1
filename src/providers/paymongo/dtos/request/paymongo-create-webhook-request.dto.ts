class PaymongoCreateWebhookAttributes {
  url: string;
  events: string[];
}

class PaymongoCreateWebhookData {
  attributes: PaymongoCreateWebhookAttributes;
}

export class PaymongoCreateWebhookRequestDto {
  data: PaymongoCreateWebhookData;
}
