const router = require("express").Router();
const { check, validationResult } = require("express-validator");

router.post(
    "/signup",
    [
        check("email", "Please provide a valid email").isEmail(),
        check("password").isLength({ min: 6 }),
    ],
    (req, res) => {
        const { email, password } = req.body;
        const errors = validationResult(req);

        if (!errors.isEmpty())
            return res.status(400).json({
                errors: errors.array(),
            });

        console.log(email, password);

        res.send("validation passed");
    }
);

module.exports = router;
