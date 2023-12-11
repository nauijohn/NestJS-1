import { Request } from 'express';

import { UserRequest } from '../../auth/interfaces/user-request.interface';

export interface RequestWithUser extends Request {
  user: UserRequest;
}
