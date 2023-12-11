class CreatePaymongoEventAttributes {
  type: string;
  livemode: boolean;
  data: any;
  previous_data: object;
  created_at: number;
  updated_at: number;
}

class CreatePaymongoEventData {
  id: string;
  type: string;
  attributes: CreatePaymongoEventAttributes;
}

export class CreatePaymongoEventRequestDto {
  data: CreatePaymongoEventData;
}
