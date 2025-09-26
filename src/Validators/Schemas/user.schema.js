import Joi from 'joi';
import { genderEnum, skillsLevelEnum } from '../../Common/Enums/user.enum.js';
import { isValidObjectId } from 'mongoose';

const names = ['JavaScript', 'Python', 'Java', 'C#', 'PHP', 'C++', 'TypeScript', 'Ruby', 'Swift', 'Go', 'Kotlin', 'Rust', 'Dart', 'Scala', 'Perl', 'Haskell', 'Lua', 'Elixir', 'Clojure', 'Erlang']



export const signUpSchema = {
    body: Joi.object( // why use Joi.object() ?
        {
            firstName: Joi.string().alphanum().min(3).max(30).required().messages({
                'string.base': 'firstName must be a string', // this mean if the value is not a string, this message will be shown 
                'string.empty': 'firstName cannot be an empty field',
                'string.min': 'firstName should have a minimum length of {#limit}',
                'string.max': 'firstName should have a maximum length of {#limit}',
                'any.required': 'firstName is a required field',
                'string.alphanum': 'firstName must only contain alpha-numeric characters'
            }),
            lastName: Joi.string().min(3).max(30).required(),
            email: Joi.string().email({ // explain this options 
                tlds: {
                    allow: ['com', 'net', 'org'],//allow means only these tlds are allowed
                    deny: ['gov', 'edu'] //deny means these tlds are not allowed
                },
                minDomainSegments: 2, //minDomainSegments means minimum number of segments in the domain name
                multiple: true, //multiple means multiple email addresses are allowed like user@example.com,user2@example.com
                separator: '#' //separator means the character used to separate multiple email addresses
                // all these options is a not vaild , the same message will be shown 
            }).required(),
            password:Joi.string().min(6).max(30).required(),
            gender: Joi.string().valid(...Object.values(genderEnum)),
            phoneNumber: Joi.string().min(10).max(15).required(),
            age:Joi.number().min(18).max(60).required(),
            
        }
    )
}


/*

notes:
    1. Joi defaults is optional, so if you want to make a field mandatory, you need to use .required()
/*
-string type:
    1.alphanum:
        alphanum means only letters and numbers are allowed
    2.min:
        min means minimum length of the string
    3.max:
        max means maximum length of the string
    4.required:
        required means the field is mandatory
    5. length:
        length means exact length of the string
    6. regex:
        regex means the string must match the given regular expression
    7. pattern:
        pattern means the string must match the given regular expression
    8. email:
        email means the string must be a valid email address
    9. hex:
        hex means the string must be a valid hexadecimal number

*/

/*
number type:
    1. integer:
        integer means the number must be an integer
    2. greater: 
        greater means the number must be greater than the given value
    3. less:
        less means the number must be less than the given value
    4. multiple:
        multiple means the number must be a multiple of the given value
    5. positive:
        positive means the number must be positive
    6. negative:
        negative means the number must be negative
    7. port:
        port means the number must be a valid port number


*/

/*
array type:
    1. items:
        items means the array must contain the given type of items
    2. length:
        length means the array must have the exact length
    3. min:
        min means the array must have a minimum length
    4. max:
        max means the array must have a maximum length
    5. sparse:
        sparse means the array can contain empty items
    6. ordered:
        ordered means the array must have the items in the given order

*/

/*
Date type:
    1. greater:
        greater means the date must be greater than the given date
    2. less:
        less means the date must be less than the given date
    3. iso:
        iso means the date must be in ISO 8601 format
    4. timestamp:
        timestamp means the date must be a valid timestamp
    5. format:
        format means the date must be in the given format
    6. min:
        min means the date must be greater than or equal to the given date
    7. max:
        max means the date must be less than or equal to the given date

*/

/*
custom Roules:
    1. custom:
        custom means you can define your own validation function
    2. example:
        const customValidation = (value, helpers) => {
            if (value !== 'expectedValue') {
                return helpers.message('"{{#label}}" must be "expectedValue"');
            }
            return value;
        };

        const schema = Joi.object({
            field: Joi.string().custom(customValidation).required()
        });



*/


/*

peers:
    1. ref:
        ref means the field must be equal to the value of the referenced field
    2. example:
        const schema = Joi.object({
            password: Joi.string().required(),
            confirmPassword: Joi.valid(Joi.ref('password')).required().messages({ 'any.only': 'confirmPassword must match password' })
        });
    3. with:
        with means if the first field is present, the second field must also be present 


*/