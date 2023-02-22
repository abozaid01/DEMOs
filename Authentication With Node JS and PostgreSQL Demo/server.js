const express = require('express');
const app = express();
const {pool} = require('./dbConfig')
const bcrypt = require('bcrypt')
const session = require('express-session')
const flash = require('express-flash')

const path = require('path')

app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));
app.use(express.urlencoded({extended: true}))
app.use(session({
    secret: 'secret',
    resave: false, //save session variables if nothing change
    saveUninitialized: false //save session details if there has been no value placed in the session
}));
app.use(flash());

const PORT = process.env.PORT || 3000;

app.get('/', (req, res)=>{
    res.render('index')
})

//=============== register ========================
app.get('/user/register', (req, res)=>{
    res.render('register')
})

app.post('/user/register', async (req, res)=>{
    const {name, email, password, password2} = req.body;
    //console.log({name, email, password, password2});

    let errors = [];
    if(!name || !email || !password || !password2)
        errors.push({message: "Please ENTER all fields"})

    if(password.length < 6)
        errors.push({message: "Password should be at least 6 characters"})

    if(password !== password2)
    errors.push({message: "Passwords do not match"})

    if(errors.length > 0)
        res.render('register', {errors})
    //form validation pass
    else{
        const hashedPassword = await bcrypt.hash(password, 10);
        
        pool
            .query(`SELECT * FROM USERS WHERE email = $1`, [email])
            .then((result) => {
                if(result.rows.length > 0){
                    errors.push({message: "Email already exists"})
                    res.render('register', {errors})
                }
                else{
                    pool.query(`INSERT INTO users (name, email, password) VALUES ($1, $2, $3) RETURNING id, password`, [name, email, hashedPassword], (err, result)=>{
                        if(err)
                            throw err
                        console.log(result.rows);
                        req.flash('success_msg', "you are now registered, please login")
                        res.redirect('/user/login')
                    })
                }
            })
            .catch((err) => console.error('Error executing query', err.stack))
    }

})

//=============== login ========================
app.get('/user/login', (req, res)=>{
    res.render('login')
})

app.get('/user/dashboard', (req, res)=>{
    res.render('dashboard', {user: "user"})
})





app.listen(PORT, ()=>{
    console.log(`Server is running on Port: ${PORT}`);
})