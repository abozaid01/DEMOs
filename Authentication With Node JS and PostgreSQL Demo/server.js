const express = require('express');
const app = express();

const path = require('path')

app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));

const PORT = process.env.PORT || 3000;

app.get('/', (req, res)=>{
    res.render('index')
})

app.get('/user/register', (req, res)=>{
    res.render('register')
})

app.get('/user/dashboard', (req, res)=>{
    res.render('dashboard', {user: "user"})
})

app.get('/user/login', (req, res)=>{
    res.render('login')
})



app.listen(PORT, ()=>{
    console.log(`Server is running on Port: ${PORT}`);
})