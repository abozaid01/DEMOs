const express = require("express");
const app = express();

const User = require("./models/user");

const path = require("path");

const mongoose = require("mongoose");
const bcrypt = require("bcrypt");

const session = require("express-session");

mongoose
    .connect("mongodb://localhost:27017/authDemo")
    .then(() => {
        console.log("Monge connection open ...");
    })
    .catch((err) => {
        console.log("mongo connection error!!", err);
    });

app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));

app.use(express.urlencoded({ extended: true }));
app.use(session({ secret: "notagoodsecret" }));

app.get("/", (req, res) => {
    res.send("this is a Home Page!");
});

app.get("/register", (req, res) => {
    res.render("register");
});

app.post("/register", async (req, res) => {
    const { username, password } = req.body;
    const hash = await bcrypt.hash(password, 12);

    const user = new User({
        username,
        password: hash,
    });

    await user.save();
    req.session.user_id = user._id;

    res.redirect("/secret");
});

app.get("/login", (req, res) => {
    res.render("login");
});

app.post("/login", async (req, res) => {
    const { username, password } = req.body;
    const user = await User.findOne({ username });
    const validPassword = await bcrypt.compare(password, user.password);
    if (validPassword) {
        req.session.user_id = user._id;
        res.redirect("/secret");
    } else res.redirect("/login");
});

app.get("/secret", (req, res) => {
    if (!req.session.user_id) res.redirect("/login");
    res.send("this is a secret route, you can't see me HAHAHA");
});

app.listen(3000, () => {
    console.log("Serving your App on port 3000 ...");
});
