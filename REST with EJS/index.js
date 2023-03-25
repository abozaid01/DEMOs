const express = require("express");
const path = require("path");
const methodOverride = require("method-override");
const { v4: uuid } = require("uuid");
uuid();

const app = express();

app.use(express.json()); //for the body of postman
app.use(express.urlencoded({ extended: true })); //console.log(req.body) in post request
app.use(methodOverride("_method"));
app.set("views", path.join(__dirname, "views"));
app.set("view engine", "ejs");

let comments = [
    { id: uuid(), username: "john", comment: "hahaha" },
    { id: uuid(), username: "sara", comment: "lol!" },
    { id: uuid(), username: "mark", comment: "funny" },
    { id: uuid(), username: "andrew", comment: "naaaaah" },
];

app.get("/comments", (req, res) => {
    res.render("comments/index", { comments });
});

app.get("/comments/new", (req, res) => {
    res.render("comments/new", {});
});

app.post("/comments", (req, res) => {
    console.log(req.body);
    const { username, comment } = req.body;
    comments.push({ username, comment, id: uuid() });
    res.redirect("/comments");
});

app.get("/comments/:id", (req, res) => {
    const { id } = req.params;
    console.log(id);
    const comment = comments.find((c) => c.id === id);
    console.log(comment);
    res.render("comments/show", { comment });
});

app.patch("/comments/:id", (req, res) => {
    const { id } = req.params;
    const newComment = req.body.comment;
    console.log(newComment);
    const foundComment = comments.find((c) => c.id === id);
    foundComment.comment = newComment;
    res.redirect("/comments");
});

app.get("/comments/:id/edit", (req, res) => {
    const { id } = req.params;
    const comment = comments.find((c) => c.id === id);
    res.render("comments/edit", { comment });
});

app.delete("/comments/:id", (req, res) => {
    const { id } = req.params;
    comments = comments.filter((c) => c.id !== id);
    res.redirect("/comments");
});
// app.get("/tacos", (req, res) => {
//     res.send("<h1 style='color:red'>tacos</h1>");
// });

// app.post("/tacos", (req, res) => {
//     console.log(req.body);
//     const { meat, qty } = req.body;
//     res.send(
//         `<h1 style='color:green'>Post tacos request<br>meat:${meat},qty:${qty}</h1>`
//     );
// });

app.listen(3000, () => {
    console.log("Listening on port 3000");
});
