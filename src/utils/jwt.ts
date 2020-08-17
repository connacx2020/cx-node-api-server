const jwt = require('jsonwebtoken');
const jwtKey = "my_secret_key_aatozz";

exports.signUser = (userID: string) => {
    const jwtExpirySeconds = 3600;
    const jwtExpiryTime = new Date(new Date().getTime() + jwtExpirySeconds * 1000).getTime();
    const token = jwt.sign({ userID, jwtExpiryTime }, jwtKey, {
        algorithm: "HS256",
        expiresIn: jwtExpirySeconds,
    });
    return {
        token,
        jwtExpirySeconds
    };
};

export const validateToken = (token: string) => {
    var payload;
    try {
        payload = jwt.verify(token, jwtKey);
    } catch (e) {
        if (e instanceof jwt.JsonWebTokenError) {
            // if the error thrown is because the JWT is unauthorized
            console.log('Error:', e);
            return null;
        }
    }
    const currentTime = new Date();
    const tokenExpiryTime = payload.jwtExpiryTime;
    if (tokenExpiryTime - currentTime.getTime() > 0) {
        return payload;
    }
    return null;
}

export const authenticateJWT = (req:any, res: any, next:any) => {
    const { authorization } = req.headers;
    const validate = validateToken(authorization);
    if(validate != null) {
        next();
    } else {
        res.status(400).json({
            status: 400,
            message: 'token expired!'
        }).end();
    }
}
