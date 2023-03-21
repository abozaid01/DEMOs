const mongoose = require("mongoose");
const Product = require("./models/product");

mongoose
    .connect("mongodb://localhost:27017/shopApp")
    .then(() => {
        console.log("connection oppen");
    })
    .catch((err) => {
        console.log("ERROR!");
        console.log(err);
    });

// I required mongoose
// I required model (Product)
// I connect the database
//no server, express, web app involved

//this file I'll run on its own any time I just want get new data in my DB
//I isolate this file from the index file for devlovpment purpses

// const p = new Product({
//     name: "orange",
//     price: "1.99",
//     category: "fruit",
// });

// p.save()
//     .then((p) => {
//         console.log(p);
//     })
//     .catch((err) => {
//         console.log(err);
//     });

const seedProducts = [
    {
        name: "apple",
        price: 3.5,
        category: "fruit",
    },
    {
        name: "potato",
        price: 8.0,
        category: "vegteable",
    },
    {
        name: "milk",
        price: 5.0,
        category: "dairy",
    },
];

Product.insertMany(seedProducts) //insertMany apply validation before insertion
    .then((result) => console.log(result))
    .catch((err) => console.log(err));
