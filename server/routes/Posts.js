const express = require('express')
const router = express.Router()
const { Posts, Likes } = require('../models')
const { validateToken } = require('../middlewares/AuthMiddleware')

router.get('/',async (req,res)=>{
    const posts = await Posts.findAll({include:[Likes]})
    res.json(posts)
})

router.post("/",async (req,res)=>{
    const post = req.body
    await Posts.create(post)
    res.json(post)
})

// by post id
router.get("/byPost/:postId",async (req,res)=>{
    const post = await Posts.findByPk(req.params.postId,{include:[Likes]}) // find by primary key(id)
    res.json(post)
})

// by user id
router.get("/byUser/:userId",async (req,res)=>{
    const post = await Posts.findAll({where:{UserId:req.params.userId},include:[Likes]}) // find by primary key(id)
    res.json(post)
})

router.delete("/:postId",validateToken,async (req,res)=>{
    const post = await Posts.findByPk(req.params.postId)
    if(req.user.username===post.username){
        await Posts.destroy({where:{id:req.params.postId}})
        res.json(`Post with id ${req.params.postId} has been deleted.`)
    }else{
        res.json('You are not allowed to delete this post.')
    }
})

// edit post
router.put("/updateTitle/:postId",validateToken,async(req,res)=>{
    const { newTitle } = req.body
    await Posts.update({title:newTitle},{where:{id:req.params.postId}}) 
    res.json("Title for post with id " + req.params.postId +" has been updated") 
})

router.put("/updatePostText/:postId",validateToken,async(req,res)=>{
    const { newPostText } = req.body  
    await Posts.update({postText:newPostText},{where:{id:req.params.postId}})
    res.json("Post text for post with id " + req.params.postId +" has been updated") 
})

module.exports = router