const router = require("express").Router();
const { check, validationResult } = require("express-validator");
const { users } = require("../db");
const bcrypt = require("bcrypt");

router.post(
    "/signup",
    [
        check("email", "Please provide a valid email").isEmail(),
        check("password", "Please provide a password length>=6").isLength({
            min: 6,
        }),
    ],
    async (req, res) => {
        const { email, password } = req.body;

        //Validate the input
        const errors = validationResult(req);

        if (!errors.isEmpty())
            return res.status(400).json({
                errors: errors.array(),
            });

        //validate if the user Dosen't already exist
        let user = users.find((user) => {
            return user.email === email;
        });

        if (user) {
            res.status(400).json({
                errors: [
                    {
                        msg: "this user already exists",
                    },
                ],
            });
        }

        const hashedPassword = await bcrypt.hash(password, 10);
        users.push({ email: email, password: hashedPassword }); //temp

        if (!user) res.send("user registerd successfully");
    }
);

module.exports = router;
