const express = require("express");
const app = express();

const auth = require("./routes/auth");

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use("/auth", auth);

app.get("/", (req, res) => {
    res.send("hi");
});

app.listen(3000, () => {
    console.log("Listening on port 3000");
});
