// import { Request, Response, NextFunction } from 'express';
// import { validateUsername } from './user.validator';
// import { UserApiResponse, UserResponse } from './user.types';


// export function validateUsernameMiddleware(req: Request, res: Response<UserApiResponse<UserResponse>>, next: NextFunction) {
//   const { username } = req.params;
//   const error = validateUsername(username);
//   if (error) {
//     return res.status(400).json({ success: false, message: error });
//   }
//   next();
// }
