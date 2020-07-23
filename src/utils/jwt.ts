const jwt = require('jsonwebtoken');

exports.signUser = (username: string) => {
    const jwtKey = "my_secret_key_aatozz";
    const jwtExpirySeconds = 300;
    const token = jwt.sign({ username }, jwtKey, {
        algorithm: "HS256",
        expiresIn: jwtExpirySeconds,
    })
    console.log("token:", token)
    return {
        token,
        jwtExpirySeconds
    }
}