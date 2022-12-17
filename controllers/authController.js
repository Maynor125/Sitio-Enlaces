const User = require("../models/User")
const { nanoid }=require('nanoid')
const {validationResult}=require('express-validator')
const flash=require('connect-flash')
const nodemailer = require("nodemailer");
require('dotenv').config


const loginForm=(req,res)=>
{
    res.render('login')
}

const loginUser= async(req,res)=>
{
   const errors=validationResult(req)
   if(!errors.isEmpty())
   {
      req.flash("mensajes",errors.array())
      return res.redirect("/auth/login")
   }


   const {email,password}=req.body;
  try {
   
    const user=await User.findOne({email})
    if(!user) throw new Error('no existe este correo')
    
    if(!user.cuentaConfirmada) throw new Error('aun falta confirmar cuenta')

    if(!await user.comparePassword(password)) throw new Error('contraseña erronea')

    req.login(user,function(error)
    {
      if(error) throw new Error('Error al iniciar la sesion')
      return res.redirect('/');
    })
   

   } 
  catch (error) {
   req.flash("mensajes",[{msg: error.message}])
   return res.redirect("/auth/login")
  }
}

const registerForm=(req,res)=>
{
   res.render('register')
}
const registerUser= async(req,res)=>
{
   const errors=validationResult(req)
   if(!errors.isEmpty())
   {   
      req.flash("mensajes",errors.array())
      return res.redirect("/auth/register")
   }

   const{userName,email,password}=req.body
   try {
    let userv = await User.findOne({email:email})
    if(userv) throw new Error("ya existe usuario");
     
    userv=new User({userName,email,password,tokenConfirm:nanoid()})
    await userv.save()

    //Enviar correo electronico con la confirmacion de la cuenta.
    var transport = nodemailer.createTransport({
      host: "smtp.mailtrap.io",
      port: 2525,
      auth: {
        user: process.env.userEmail,
        pass: process.env.passEmail
      }
    });
    
      await transport.sendMail({
      from: '"Fred Foo 👻" <foo@example.com>', // sender address
      to: userv.email, // list of receivers
      subject: "Verifica tu cuenta de correo warro ✔", // Subject line
       // plain text body
      html: `<a class="btn btn-dark" href="http://localhost:5000/auth/confirmar/${userv.tokenConfirm}">Verifica tu cuenta aqui</a>`, // html body
    });

    req.flash("mensajes",[{msg: "Revisa el correo electronico y valida cuenta"}])
    return res.redirect('/auth/login')
    
   
   } catch (error) {
      req.flash("mensajes",[{msg: error.message}])
      return res.redirect("/auth/register")
   }
  // res.json(req.body)
}

const confirmarCuenta = async(req,res)=>
{
   const{token}=req.params;

   try {
    
    const user = await User.findOne({tokenConfirm:token})

    if(!user) throw new Error('No existe este usuario')

    user.cuentaConfirmada=true;
    user.tokenConfirm=null;
    
    await user.save()

    res.redirect("/auth/login")
    req.flash("mensajes",[{msg: "Cuenta verificada ya puedes iniciar sesion"}])
   } 
   catch (error) {
   
    req.flash("mensajes",[{msg: error.message}])
    return res.redirect("/auth/login")
   }

}
const cerrarSesion = (req,res) =>
{
   req.logout()
   return res.redirect("/auth/login")
}

module.exports={
    loginForm,
    registerForm,
    registerUser,
    confirmarCuenta,
    loginUser,
    cerrarSesion,
}