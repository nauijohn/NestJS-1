export interface UserRequest {
  id: string;
  email: string;
  roles: string[];
  signAs: string;
  refreshToken?: string;
}
