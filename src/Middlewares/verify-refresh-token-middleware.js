export const refreshTokenVerify = async (req, res, next) => {
    const { refreshtoken } = req.headers;
  
    const data = verifyToken(refreshtoken, process.env.JWT_REFRESH_SECRET);
    if (!data._id) return res.status(400).json({ message: "Invalid token payload" });
  
    // check if token is revoked
    const isTokenRevoked = await BlacklistedTokens.findOne({ tokenId: data.jti });
    if (isTokenRevoked) return res.status(400).json({ message: "Token is revoked" });
  
    req.refreshToken = data;
    next();
  };
  