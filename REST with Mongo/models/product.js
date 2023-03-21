const mongoose = require("mongoose");

// I donn't need to connect the DB here
//because I'm going to be requiring this model product
//in the index file (where I'm doing the connecting)

const productSchema = mongoose.Schema({
    name: {
        type: "string",
        required: true,
    },
    price: {
        type: Number,
        required: true,
        min: 0,
    },
    category: {
        type: String,
        lowercase: true,
        enum: ["fruit", "vegteable", "dairy"],
    },
});

const Product = mongoose.model("Product", productSchema);

module.exports = Product;
