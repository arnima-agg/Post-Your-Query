const express = require('express')
const router= express.Router()
const Articles = require('./../models/articles')
var Comments = require('./../models/comment');
var http = require("http").Server(app);
var io = require("socket.io")(http);

router.get('/new',(req,res)=>
{
    res.render('article/new',{article: new Articles() })
})

router.get('/edit/:id', async (req,res)=>
{
    const article = await Articles.findById(req.params.id)
     res.render('article/edit',{article: article })
})

router.get('/:slug',async (req,res)=>
{
    const article = await Articles.findOne({slug :req.params.slug})
    //console.log(article)
    if(article == null)
    res.redirect('/')
    res.render('article/show',{article :article})
})

router.post('/',async (req,res,next)=>{
    req.article = new Articles()
    next()
},saveArticleAndRedirect('new'))

router.put('/:id',async (req,res,next)=>{
    req.article = await Articles.findById(req.params.id)
    next()
},saveArticleAndRedirect('edit'))



router.delete('/:id', async (req, res)=> {
    const k=await Articles.findByIdAndDelete(req.params.id)
    console.log(k)
    res.redirect('/article/new')
})

function saveArticleAndRedirect(path)
{
     return async (req,res)=>{
        let article = req.article
            article.title =  req.body.title
            article.description = req.body.description
        try{
        article = await article.save()
            res.redirect(`/article/${article.slug}`)
        }
        catch(err)
        {
            //console.log(err)
            res.render(`article/${path}`,{article : article})
        }
    }
}

io.on('connection',function(socket){
    socket.on('comment',function(data){
        var commentData = new Comments(data);
        commentData.save();
        socket.broadcast.emit('comment',data);  
    });
 
});

module.exports= router