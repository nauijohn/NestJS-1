import {
  FlightFares,
  OriginDestinations,
  PenaltiesInfo,
} from '../../../flight-utils/dtos/response/mystifly-search-response.dto';

export class CreateMystiflyFlightDetailRequestDto {
  FareSourceCode: string;
  ValidatingCarrier: string;
  OriginDestinations: OriginDestinations[];
  FlightFares: FlightFares;
  PenaltiesInfo: PenaltiesInfo;
  providerReference: string;
  paymentReferenceNumber: string;
  sequence: number;
}
