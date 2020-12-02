exports.hello = async (req: any, res: any) => {
    res.status(200).json({
        status: 200,
        message: 'Hello'
    }).end();
}