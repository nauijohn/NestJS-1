import {
  FlightFares,
  OriginDestinations,
  PenaltiesInfo,
} from '../../../flight-utils/dtos/response/mystifly-search-response.dto';

export class UpdateMystiflyFlightDetailRequestDto {
  id: number;
  FareSourceCode?: string;
  ValidatingCarrier?: string;
  OriginDestinations?: OriginDestinations[];
  FlightFares?: FlightFares;
  PenaltiesInfo?: PenaltiesInfo;
}
