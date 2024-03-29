const express=require('express');
const {body}=require('express-validator')

const { loginForm, registerForm,registerUser, confirmarCuenta, loginUser, cerrarSesion} = require('../controllers/authController');
const router=express.Router();

router.get("/login",loginForm)
  
router.get("/register",registerForm)

router.post("/register",[
    body("userName","Ingrese un nombre valido perro").trim().notEmpty().escape(),
    body("email","Ingrese un email valido").trim().isEmail().normalizeEmail(),
    body("password","Contraseña de 3 caracteres minimo warro").trim().isLength({min:3}).escape()
    .custom((value,{req})=>{
       if(value !== req.body.repassword)
       {
        throw new Error("Las contraseñas no coinciden warro")
       }
       else
       {
        return value;
       }
    })
],registerUser)
router.get("/confirmar/:token",confirmarCuenta)
  

router.post("/login",[
    body("email","Ingrese un email valido").trim().isEmail().normalizeEmail(),
    body("password","Contraseña de minimo 6 caracteres").trim().isLength({min:3}).escape()
],loginUser)

router.get('/logout',cerrarSesion)
module.exports=router;