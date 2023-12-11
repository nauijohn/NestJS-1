import { SetMetadata } from '@nestjs/common';

export const IS_PUBLIC_FROM_ACCESS_TOKEN_KEY = 'isPublicFromAccessToken';
export const PublicAccessToken = () =>
  SetMetadata(IS_PUBLIC_FROM_ACCESS_TOKEN_KEY, true);

export const IS_PUBLIC_FROM_REFRESH_TOKEN_KEY = 'isPublicFromRefreshToken';
export const PublicRefreshToken = () =>
  SetMetadata(IS_PUBLIC_FROM_REFRESH_TOKEN_KEY, true);

export const IS_PUBLIC_FROM_AUTHENTICATED_KEY = 'isPublicFromAuthenticated';
export const PublicAuthenticated = () =>
  SetMetadata(IS_PUBLIC_FROM_AUTHENTICATED_KEY, true);

export const IS_PUBLIC = 'isPublic';
export const Public = () => SetMetadata(IS_PUBLIC, true);
