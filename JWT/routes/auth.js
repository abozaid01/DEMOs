const router = require("express").Router();
const { check, validationResult } = require("express-validator");
const { users } = require("../db");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

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
            return res.status(400).json({
                errors: [
                    {
                        msg: "this user already exists",
                    },
                ],
            });
        }

        const hashedPassword = await bcrypt.hash(password, 10);
        users.push({ email: email, password: hashedPassword }); //temp

        const token = await jwt.sign(
            //create token
            {
                email, //not good idea to send the email to user
            },
            "ahdlkjhadfhalkfhalkfha", //secret  //.env
            {
                expiresIn: 360000,
            }
        );

        res.json(token);

        //res.send("user registerd successfully");
    }
);

router.post("/login", async (req, res) => {
    const { email, password } = req.body;

    let user = users.find((user) => {
        return user.email === email;
    });

    if (!user) {
        return res.status(400).json({
            errors: [
                {
                    msg: "username OR password not correct",
                },
            ],
        });
    }

    let isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch) {
        return res.status(400).json({
            errors: [
                {
                    msg: "username OR password not correct",
                },
            ],
        });
    }

    const token = await jwt.sign(
        //create token
        {
            email, //not good idea to send the email to user
        },
        "ahdlkjhadfhalkfhalkfha", //secret  //.env
        {
            expiresIn: 360000,
        }
    );
    res.json(token);
});

module.exports = router;
console.log(users[0].password);
