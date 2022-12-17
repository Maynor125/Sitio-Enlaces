const Url=require("../models/Url")
const { nanoid }=require('nanoid')
const leerUrls= async(req,res)=>
{
  try {
    
    const urls= await Url.find({user:req.user.id}).lean()
    res.render("home", {urls:urls})

  } catch (error) {
    //console.log(error)
    //res.send('algo fallo warro...')
    req.flash("mensajes",[{msg: error.message}])
    return res.redirect("/")
  }
    
}

const agregarUrl = async(req,res) => {
  const {origin} = (req.body);
  try {
       const url1=new Url({origin: origin,shortURL:nanoid(8),user:req.user.id})
       await url1.save()
       req.flash("mensajes",[{msg: "Su url se agrego de foma exitosa"}])
       res.redirect('/')
  } catch (error) {
    req.flash("mensajes",[{msg: error.message}])
    return res.redirect("/")
  }
};
const editarUrlForm = async(req,res)=>
{
  const {id}=req.params;
  try {
    
      const urlBD= await Url.findById(id).lean()
      
      if(!urlBD.user.equals(req.user.id))
      {
         throw new Error("No es tu url warro")
      }
      return res.render("home",{urlBD})

  } catch (error) {
    req.flash("mensajes",[{msg: error.message}])
    return res.redirect("/")
  }
}

const editarUrl = async(req,res)=>
{
  const {id}=req.params;
  const {origin}=req.body;
  try {
    
    const url =await Url.findById(id)
    if(!url.user.equals(req.user.id))
    {
       throw new Error("No es tu url warro")
    }
      await url.updateOne({origin})
      req.flash("mensajes",[{msg: "La url se edito de forma exitosa"}])
      //await Url.findByIdAndUpdate(id,{origin:origin})
      res.redirect('/')
  } catch (error) {
    req.flash("mensajes",[{msg: error.message}])
    return res.redirect("/")
  }
}
const eliminarUrl = async(req,res)=>
{
  const {id}=req.params;
  try {
    //await Url.findByIdAndDelete(id)
    const url =await Url.findById(id)
    if(!url.user.equals(req.user.id))
    {
       throw new Error("No es tu url warro")
    }
    await url.remove()
    req.flash("mensajes",[{msg: "La url se elimino de forma exitosa"}])
    res.redirect('/')
  } catch (error) {
    req.flash("mensajes",[{msg: error.message}])
    return res.redirect("/")
  }
}

const redireccionamiento=async(req,res)=>
{
    const {shortUrl}=req.params
    try {
      const url= await Url.findOne({shortURL:shortUrl})
      res.redirect(url.origin)
    } catch (error) {
      req.flash("mensajes",[{msg: "No existe esta url configurada"}])
      return res.redirect("/auth/login")
    }
}

module.exports={
    leerUrls,
    agregarUrl, 
    eliminarUrl,
    editarUrlForm,
    editarUrl,
    redireccionamiento,
}