const express = require('express')
const mongoose = require('mongoose')
const app  = express()
var methodOverride = require('method-override')
const Articles = require('./models/articles')
const articleRouter = require('./routes/article');
const { urlencoded } = require('express');
var url = "mongodb://localhost:27017/blog";

mongoose.connect(url, { useNewUrlParser: true, useUnifiedTopology: true, useCreateIndex :true },function(err, db) {
  if (err) throw err;
  console.log("Database created!");
});
app. set('view engine', 'ejs') 
//app.use(express.static('views'))

app.use(express.urlencoded({extended : true}))
app.use(methodOverride('_method'))   //use to support the dlete method at the client

app.get('/',async (req,res)=>{
    //res.end('from be')
        const article =await Articles.find().sort({createdAt : "desc"})
        res.render('article/index',{article:article})

    })

app.use('/article',articleRouter)
app.listen(3000,()=>{
console.log('server running')
})