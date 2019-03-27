const path=require('path');
const publicpath=path.join(__dirname,'../public');
const express=require('express');
const port=process.env.PORT || 3000;
var app=express();
app.use(express.static(publicpath));
app.get('/index',(req,res)=>{
    res.render('/index');
});
app.listen(port,()=>{
    console.log("app started at port 3000");
});