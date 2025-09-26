import {Router} from 'express';
import * as messageServices from '../Messages/Services/message.service.js';

export const messageController = Router();

messageController.post('/sendMessage/:receiverId', messageServices.sendMessageService);
messageController.get('/', messageServices.getMessagesService);
