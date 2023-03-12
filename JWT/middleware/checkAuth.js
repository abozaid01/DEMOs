const jwt = require("jsonwebtoken");

module.exports = async (req, res, next) => {
    const token = req.header("x-auth-token");

    if (!token)
        return res.status(400).json({
            errors: [
                {
                    msg: "no token",
                },
            ],
        });

    try {
        let user = await jwt.verify(token, "ahdlkjhadfhalkfhalkfha"); //secret  //.env
        console.log(user);
        req.user = user.email; //for every single authenicated request you can access to that particular's user email which could be helpful for getting their info
        next();
    } catch (err) {
        //console.log(err);
        return res.status(400).json({
            errors: [
                {
                    msg: "token invalid",
                },
            ],
        });
    }
};
