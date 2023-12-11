class TboStatus {
  Code: number;
  Description: string;
}

export class TboHotelBookResponseDto {
  Status: TboStatus;
  ClientReferenceId: string;
  ConfirmationNumber: string;
}
