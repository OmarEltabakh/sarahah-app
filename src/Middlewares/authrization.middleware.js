
export const authorizationMiddleware = (allowedRoles) => {

    return (req, res, next) => {

        const { user: { role } } = req.logedInUser;
    

        if (allowedRoles.includes(role)) return next();
        return res.status(401).json({ message: "unauthrized" })

    }

}