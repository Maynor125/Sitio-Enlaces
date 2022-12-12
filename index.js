
const express = require("express")
const { create } = require("express-handlebars");
const session=require('express-session')
require('dotenv').config()
require('./data/db')

const app=express();
const port=5000;

app.use(session({
    secret:'keyboard cat',
    resave: false,
    saveUninitialized: false,
    name:"Uso-de-sesiones-perro",
}))


const hbs = create({
    extname: ".hbs",
    partialsDir: ["views/components"],
});

app.engine(".hbs", hbs.engine);
app.set("view engine", ".hbs");
app.set("views", "./views");

app.use(express.urlencoded({ extended:true }))
app.use("/", require('./routes/home'))
app.use("/auth", require('./routes/auth'))
app.use(express.static(__dirname+"/public"))


const PORT = process.env.PORT || 5000
app.listen(PORT , () => console.log("Servidor andado "+ PORT));
