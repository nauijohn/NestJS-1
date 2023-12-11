import {
  MystiflyFareRulesBaggageInfos,
  MystiflyFareRulesFareRules,
} from '../../../../../providers/mystifly/flight-utils/dtos/response/mystifly-fare-rules-response.dto';

export class CreateMystiflyFlightRoundtripFareRulesResponseRequestDto {
  transactionId: string;
  departureFareRulesResponse: {
    BaggageInfos: MystiflyFareRulesBaggageInfos;
    ConversationId: string;
    Errors: any[];
    FareRules: MystiflyFareRulesFareRules;
    TraceId: string;
  };
  returnFareRulesResponse: {
    BaggageInfos: MystiflyFareRulesBaggageInfos;
    ConversationId: string;
    Errors: any[];
    FareRules: MystiflyFareRulesFareRules;
    TraceId: string;
  };
}
