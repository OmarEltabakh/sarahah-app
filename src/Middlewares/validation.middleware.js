


const reqKey = ['body', 'headers', 'params', 'query'];
export const validateMiddleware = (schema) => {

    return (req, res, next) => {

        const validationErrors = []

        for (const key of reqKey) {
            if(schema[key]){
                const {error} = schema[key].validate(req[key], { abortEarly: false }); // this step return one key in success case =>value , and 2 key in faild case => key and error
                if(error) validationErrors.push(...error.details)
            }
        }

        if(validationErrors.length) return res.status(400).json({message:"validation faild" , validationErrors})
        next();
 
    }
}