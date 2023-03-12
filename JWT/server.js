const express = require("express");
const app = express();

const auth = require("./routes/auth");
const post = require("./routes/post");

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use("/auth", auth);
app.use("/posts", post);

app.get("/", (req, res) => {
    res.send("hi");
});

app.listen(3000, () => {
    console.log("Listening on port 3000");
});
