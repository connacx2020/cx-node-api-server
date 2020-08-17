const { decrypt } = require('../utils/crypto');
const { signUser, validateToken } = require('../utils/jwt');
const auth = require('../utils/auth.json');

exports.login = async (req: any, res: any) => {
    const { username, password, client } = req.body;

    if (!username || !password || !client) {
        res.status(400).json({
            status: 400,
            message: 'Invalid inputs!'
        }).end();
    }

    var authData: any = '';
    auth.map((res: any) => {
        if (res.client === client) {
            authData = res;
        }
    });
    if(!authData && authData.client !== client) {
        res.status(400).json({
            status: 400,
            message: 'Invalid client!'
        }).end();
    } else if (username !== authData.username) {
        res.status(400).json({
            status: 400,
            message: 'User not found!'
        }).end();
    } else {
        const decrypted = await decrypt(authData.password);
        if (password === decrypted) {
            const jwtToken = signUser(authData.id);
            res.status(200).json({
                status: 200,
                message: "Login Successful!",
                token: jwtToken.token
            }).end();
        } else {
            res.status(400).json({
                status: 400,
                message: "Password mismatch!"
            }).end();
        }
    }
}