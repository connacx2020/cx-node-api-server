exports.getUsers = function (req: any, res: any) {
    res.json({
        status: "success",
        message: "Sample user",
        data: {
            name: "Sample"
        }
    });
}
