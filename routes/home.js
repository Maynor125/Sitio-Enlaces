const express=require('express')
const router=express.Router();
const {leerUrls,agregarUrl,eliminarUrl,editarUrlForm,editarUrl,redireccionamiento} = require("../controllers/homeController");
const urlValidar = require('../middlewares/urlValida');

router.get("/",leerUrls)
router.post("/",urlValidar,agregarUrl)
router.get("/eliminar/:id",eliminarUrl)
router.get("/editar/:id",editarUrlForm)
router.post("/editar/:id", urlValidar,editarUrl)
router.get("/:shortUrl",redireccionamiento)

module.exports=router;