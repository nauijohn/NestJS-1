import {
  MystiflyRevalidationExtraServices,
  MystiflyRevalidationPricedItineraries,
} from '../../../../../providers/mystifly/flight-utils/dtos/response/mystifly-revalidation-response.dto';

export class UpdateMystiflyFlightRevalidationResponseRequestDto {
  id: number;
  PricedItineraries: MystiflyRevalidationPricedItineraries[];
  ConversationId: string;
  Errors: any[];
  ExtraServices: MystiflyRevalidationExtraServices[];
  TraceId: string;
  IsValidReason: string;
  providerReference: string;
  transactionId: string;
  sequence: number;
}
