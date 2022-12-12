const User = require("../models/User")
const { nanoid }=require('nanoid')
const bcrypt=require('bcryptjs')

const registerForm=(req,res)=>
{
   res.render('register')
}

const loginForm=(req,res)=>
{
    res.render('login')
}

const registerUser= async(req,res)=>
{
   console.log(req.body)
   const{userName,email,password}=req.body
   try {
    let userv=await User.findOne({email:email})
    if(userv) throw new Error('Ya existe el usuario')
    res.json(userv)

    userv=new User({userName,email,password,tokenConfirm:nanoid()})
    await userv.save()

    //Enviar correo electronico con la confirmacion de la cuenta.
    

    res.redirect('/auth/login')
   
   } catch (error) {
    res.json({error:error.message})
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

   } catch (error) {
    res.json({error:error.message})
   }

}
const loginUser= async(req,res)=>
{
   const {email,password}=req.body;
  try {
   
    const user=await User.findOne({email})
    if(!user) throw new Error('no existe este correo')
    
    if(!user.cuentaConfirmada) throw new Error('aun falta confirmar cuenta')

    if(!await user.comparePassword(password)) throw new Error('contraseña erronea')

    res.redirect('/');

   } 
  catch (error) {
    console.log(error)
    res.send(error.message)
  }
}
module.exports={
    loginForm,
    registerForm,
    registerUser,
    confirmarCuenta,
    loginUser,
}