export class FacebookValidationMobileRequestDto {
  email: string;
  first_name: string;
  id: string;
  last_name: string;
  middle_name?: string;
  picture: {
    data: {
      width: number;
      url: string;
    };
    is_silhouette: boolean;
    height: number;
  };
}
