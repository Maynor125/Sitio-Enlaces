const Url=require("../models/Url")
const { nanoid }=require('nanoid')
const leerUrls= async(req,res)=>
{
  try {
    
    const urls= await Url.find().lean()
    res.render("home", {urls:urls})

  } catch (error) {
    console.log(error)
    res.send('algo fallo warro...')
  }
    
}

const agregarUrl = async(req,res) => {
  const {origin} = (req.body);
  try {
       const url1=new Url({origin: origin,shortURL:nanoid(8)})
       await url1.save()
       console.log(url1)
       res.redirect('/')
  } catch (error) {
    console.log(error)
    res.send('error, algo fallo warro')
  }
};
const editarUrlForm = async(req,res)=>
{
  const {id}=req.params;
  try {
    
      const urlBD= await Url.findById(id).lean()
      res.render("home",{urlBD})

  } catch (error) {
    console.log(error)
    res.send('error, algo fallo warro')
  }
}
const editarUrl = async(req,res)=>
{
  const {id}=req.params;
  const {origin}=req.body;
  try {
    
      await Url.findByIdAndUpdate(id,{origin:origin})
      res.redirect('/')
  } catch (error) {
    console.log(error)
    res.send('error, algo fallo warro')
  }
}
const eliminarUrl = async(req,res)=>
{
  const {id}=req.params;
  try {
    await Url.findByIdAndDelete(id)

    res.redirect('/')
  } catch (error) {
    console.log(error)
    res.send('error, algo fallo warro')
  }
}

const redireccionamiento=async(req,res)=>
{
    const {shortUrl}=req.params
    try {
      const url= await Url.findOne({shortURL:shortUrl})
      res.redirect(url.origin)
    } catch (error) {
      
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