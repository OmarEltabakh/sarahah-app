import { Router } from "express";
import * as authService from '../Services/auth.service.js';
import { signUpSchema } from "../../../Validators/Schemas/user.schema.js";
import { validateMiddleware  , authenticationMiddleware , refreshTokenVerify } from "../../../Middlewares/index.js";

export const authController = Router();

authController.post('/signUp', validateMiddleware(signUpSchema), authService.signUpService);
authController.post('/signIn', authService.signInService);
authController.put('/confrim', authService.confirmEmailService);
authController.post('/logOut', authenticationMiddleware,refreshTokenVerify, authService.logOutServices);
authController.post('/refreshToken', authService.refreshTokenService);
authController.post('/auth-with-google', authService.authWithGoogleService);


