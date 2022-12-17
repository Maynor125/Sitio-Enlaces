const express=require('express')
const router=express.Router();
const {leerUrls,agregarUrl,eliminarUrl,editarUrlForm,editarUrl,redireccionamiento} = require("../controllers/homeController");
const urlValidar = require('../middlewares/urlValida');
const verificarUser = require('../middlewares/verificarUser');

router.get("/",verificarUser,leerUrls)
router.post("/",verificarUser,urlValidar,agregarUrl)
router.get("/eliminar/:id",verificarUser,eliminarUrl)
router.get("/editar/:id",verificarUser,editarUrlForm)
router.post("/editar/:id",verificarUser, urlValidar,editarUrl)
router.get("/:shortUrl",redireccionamiento)

module.exports=router;