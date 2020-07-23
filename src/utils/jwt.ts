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

exports.validateToken = async (token: string) => {
    var payload;
    try {
        payload = jwt.verify(token, jwtKey);
    } catch (e) {
        if (e instanceof jwt.JsonWebTokenError) {
            // if the error thrown is because the JWT is unauthorized
            console.log('Error:', e);
            throw e;
        }
    }
    const currentTime = new Date();
    const tokenExpiryTime = payload.jwtExpiryTime;
    if (tokenExpiryTime - currentTime.getTime() > 0) {
        return payload;
    }
    return null;
}
