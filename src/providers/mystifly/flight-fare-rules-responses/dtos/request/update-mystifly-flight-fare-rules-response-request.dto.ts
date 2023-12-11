import {
  MystiflyFareRulesBaggageInfos,
  MystiflyFareRulesFareRules,
} from '../../../flight-utils/dtos/response/mystifly-fare-rules-response.dto';

export class UpdateMystiflyFlightFareRulesResponseRequestDto {
  id: number;
  BaggageInfos: MystiflyFareRulesBaggageInfos;
  ConversationId: string;
  Errors: any[];
  FareRules: MystiflyFareRulesFareRules;
  TraceId: string;
}
