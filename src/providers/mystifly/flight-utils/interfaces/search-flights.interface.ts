export interface SearchFlights {
  Data: {
    ConversationId: string;
    FlightSegmentList: Array<{
      DepartureAirportLocationCode: string;
      ArrivalAirportLocationCode: string;
      DepartureDateTime: string;
      ArrivalDateTime: string;
      stops: number;
      JourneyDuration: number;
      Equipment: string;
      OperatingCarrierCode: string;
      OperatingFlightNumber: string;
      MarketingCarriercode: string;
      MarketingFlightNumber: string;
      StopQuantityInfos: Array<unknown>;
      SegmentRef: number;
    }>;
    ItineraryReferenceList: Array<{
      CabinClassCode: string;
      CabinClassType: string;
      RBD: string;
      FareFamily: string;
      SeatsRemaining: number;
      CheckinBaggage: Array<{
        Type: string;
        Value: string;
      }>;
      CabinBaggage: Array<{
        Type: string;
        Value: string;
      }>;
      FareBasisCodes: string;
      ItineraryRef: number;
    }>;
    FulfillmentDetailsList: Array<unknown>;
    PenaltiesInfoList: Array<{
      Penaltydetails: Array<{
        PaxType: string;
        RefundPenaltyAmount: string;
        RefundAllowed: boolean;
        Currency: string;
        ChangePenaltyAmount: string;
        ChangeAllowed: boolean;
      }>;
      PenaltiesInfoRef: number;
    }>;
    FlightFaresList: Array<{
      FareType: string;
      Currency: string;
      PassengerFare: Array<{
        PaxType: string;
        Quantity: 1;
        BaseFare: string;
        TaxBreakUp: Array<{
          Amount: string;
          TaxCode: string;
        }>;
        TotalFare: string;
      }>;
      FareRef: number;
    }>;
    PricedItineraries: Array<{
      FareSourceCode: string;
      ValidatingCarrier: string;
      OriginDestinations: Array<{
        SegmentRef: number;
        ItineraryRef: number;
        LegIndicator: string;
      }>;
      FareRef: number;
      PenaltiesInfoRef: number;
      FulfillmentDetailsRef: number;
      Provider: string;
    }>;
    GroupedItems: Array<{ Itins: Array<string>; Segments: Array<string> }>;
  };
  Success: boolean;
  Message: string;
}
