const express=require('express')
const router=express.Router();

router.get("/", (req,res)=>
{
    const urls=[
        {origin: "www.google.com/Maynor",shorturl:"hdhdhdh"},
        {origin: "www.google.com/Maynor1",shorturl:"hdhdhdh"},
        {origin: "www.google.com/Maynor2",shorturl:"hdhdhdh"}
      ]
      res.render("home", {urls:urls})
})

module.exports=router;