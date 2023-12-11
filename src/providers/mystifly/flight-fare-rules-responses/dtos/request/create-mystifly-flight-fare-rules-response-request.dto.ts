import {
  MystiflyFareRulesBaggageInfos,
  MystiflyFareRulesFareRules,
} from '../../../flight-utils/dtos/response/mystifly-fare-rules-response.dto';

export class CreateMystiflyFlightFareRulesResponseRequestDto {
  BaggageInfos: MystiflyFareRulesBaggageInfos;
  ConversationId: string;
  Errors: any[];
  FareRules: MystiflyFareRulesFareRules;
  TraceId: string;
  sequence: number;
  providerReference: string;
  transactionId: string;
}
