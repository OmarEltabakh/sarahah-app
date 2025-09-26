import Joi from "joi";
import { isValidObjectId } from "mongoose";

export function objectIdValidation(value, helpers) { // first parameter must be value, second parameter must be helpers , helpers means you can use it to return custom error messages
    return isValidObjectId(value) ? value : helpers.message(`${value} is not a valid ObjectId`);
}



export const generalRules = {
    _id: Joi.string().custom(objectIdValidation).required(), // custom validation function,
    email: Joi.string().email().lowercase().required(),
    password: Joi.string().min(8).max(30).required(),
}