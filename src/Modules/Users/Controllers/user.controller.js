import { Router } from "express";
import * as userServices from '../Services/user.service.js';
import { authenticationMiddleware } from "../../../Middlewares/authentication.middleware.js";
import { authorizationMiddleware } from "../../../Middlewares/authrization.middleware.js";
import { privilegeEnum } from "../../../Common/Enums/user.enum.js";
import { CloudinaryUpload, LocalUpload } from "../../../Middlewares/Multer.middleware.js";
export const userController = Router();

userController.put('/update', authenticationMiddleware, userServices.UpdateService);
userController.delete('/delete', authenticationMiddleware, userServices.DeleteUserService);
userController.get('/getUserById/:id', userServices.getUserByIdService);
userController.post('/updatePassword', authenticationMiddleware, userServices.updatePasswordService);
userController.get('/listAllUsers', authenticationMiddleware, authorizationMiddleware(privilegeEnum.user_admin), userServices.listAllUsers);
userController.post('/uploadProfilePictureService', authenticationMiddleware, CloudinaryUpload({ limits: { files: 2, fields: 2 } }).single('profilePicture'), userServices.uploadProfilePictureService);// write the diffrent between array , filed , single and one
userController.delete('/deleteProfilePictureService', authenticationMiddleware, userServices.deleteProfilePictureService);
