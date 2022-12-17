const passport=require('passport')
const express = require("express")
const { create } = require("express-handlebars");
const session=require('express-session')
const flash=require('connect-flash');
const User = require('./models/User');
const csrf=require('csurf')

require('dotenv').config()
require('./data/db')

const app=express();


app.use(session({
    secret:'keyboard cat',
    resave: false,
    saveUninitialized: false,
    name:"Uso-de-sesiones-perro",
}))

app.use(flash())
app.use(passport.initialize())
app.use(passport.session())
//Preguntas no se para que warro.
passport.serializeUser((user, done)=> done(null,{id: user._id,userName: user.userName})) //req.user
passport.deserializeUser(async(user,done)=>
{
    const userdb= await User.findById(user.id)
    return done(null,{id: userdb._id,userName: userdb.userName})
})

/*
app.get('/mensaje-flash',(req,res)=>
{
    res.json(req.flash('Mensaje'))
})
app.get('/crear-mensaje',(req,res)=>
{
    req.flash("mensaje","Este es un mensaje de error")
    res.redirect('/mensaje-flash')
})
*/
/*
app.get('/ruta-protegida',(req,res)=>
{
    res.json(req.session.usuario || "Sin sesion de usuario")
}) 

app.get('/crear-session',(req,res)=>
{
    req.session.usuario="Maynor125"
    res.redirect('/ruta-protegida')
})
app.get('/destruir-session',(req,res)=>
{
    req.session.destroy()
    res.redirect('/ruta-protegida')
})*/

const hbs = create({
    extname: ".hbs",
    partialsDir: ["views/components"],
});

app.engine(".hbs", hbs.engine);
app.set("view engine", ".hbs");
app.set("views", "./views");



app.use(express.urlencoded({ extended:true }))

app.use(csrf())
app.use((req,res,next)=>
{
  res.locals.csrfToken=req.csrfToken()
  res.locals.mensajes=req.flash("mensajes")
  next()
})

app.use("/", require('./routes/home'))
app.use("/auth", require('./routes/auth'))
app.use(express.static(__dirname+"/public"))


const PORT = process.env.PORT || 5000
app.listen(PORT , () => console.log("Servidor andado "+ PORT));
