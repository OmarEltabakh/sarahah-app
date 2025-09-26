import {BlackListedTokens , User} from "../DB/Models/index.js";
import { verifyToken } from "../Utils/token.util.js";

export const authenticationMiddleware = async (req, res, next) => {
    try {
        // check if token is provided
        const { accesstoken } = req.headers;
        if (!accesstoken) return res.status(401).json({ message: 'Unauthorized' });

        // check if token is valid => revoke the token
        const { id ,exp , jti } = verifyToken(accesstoken, process.env.JWT_ACCESS_SECRET);
        const blackListedToken = await BlackListedTokens.findOne({ tokenId: jti });
        if (blackListedToken) return res.status(409).json({ message: 'Token is Revoked please sign in again' });

        // get user data
        const user = await User.findById(id);
        if (!user) return res.status(409).json({ message: 'User not found' });

        req.logedInUser = {user , token:{ exp , jti}};
        
        next();
    } catch (error) {
        res.status(500).json({ message: error });
    }
}