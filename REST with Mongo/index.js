const express = require("express");
const path = require("path");
const mongoose = require("mongoose");
const Product = require("./models/product");
const methodOverride = require("method-override");

mongoose
    .connect("mongodb://localhost:27017/shopApp")
    .then(() => {
        console.log("connection open");
    })
    .catch((err) => {
        console.log("ERROR!");
        console.log(err);
    });

const app = express();

app.use(express.json()); //for the body of postman
app.use(express.urlencoded({ extended: true })); //console.log(req.body) in post request
app.use(methodOverride("_method"));
app.set("views", path.join(__dirname, "views"));
app.set("view engine", "ejs");

const categories = ["fruit", "vegteable", "dairy"];

//---------------- get All Products -----------------------
app.get("/products", async (req, res) => {
    const { category } = req.query;
    if (!category) {
        const allProducts = await Product.find({});
        res.render("products/index", {
            products: allProducts,
            category: "All",
        });
    } else {
        const allProducts = await Product.find({ category: category });
        res.render("products/index", {
            products: allProducts,
            category: category,
        });
    }
});

//---------------- create new product ----------------
//form to submit new product
app.get("/products/new", (req, res) => {
    res.render("products/new", { categories });
});

//creation of the new product and redirection
app.post("/products", async (req, res) => {
    const newProduct = new Product(req.body);
    await newProduct.save();
    res.redirect(`/products/${newProduct.id}`);
});

//---------------- get detailed product -----------------------
app.get("/products/:id", async (req, res) => {
    const foundProduct = await Product.findById(req.params.id);
    res.render("products/show", { foundProduct });
});

//---------------- update product -----------------------
//form to submit new product
app.get("/products/:id/edit", async (req, res) => {
    const foundProduct = await Product.findById(req.params.id);
    res.render("products/edit", { foundProduct, categories });
});

app.put("/products/:id", async (req, res) => {
    const { id } = req.params;
    await Product.findByIdAndUpdate(id, req.body, {
        runValidators: true,
        new: true,
    });
    res.redirect(`/products/${id}`);
});

//---------------- delete product ----------------
app.delete("/products/:id", async (req, res) => {
    const id = req.params.id;
    await Product.findByIdAndDelete(id);
    res.redirect("/products");
});

app.listen(3000, () => {
    console.log("Listening on port 3000");
});
