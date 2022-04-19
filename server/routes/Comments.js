const express = require('express')
const router = express.Router()
const { Comments } = require('../models')
const { validateToken } = require('../middlewares/AuthMiddleware')

router.get('/:postId',async (req,res)=>{
    const comment = await Comments.findAll({where:{PostId:req.params.postId}})
    res.json(comment)
})

router.post('/', validateToken, async(req,res)=>{ // second parameter is a middleware
    const comment = req.body
    const username = req.user.username
    comment.username = username
    await Comments.create(comment)
    res.json(comment)
})

router.delete('/:commentId', validateToken, async(req,res)=>{ // second parameter is a middleware
    const commentId = req.params.commentId
    const username = req.user.username
    const comment = await Comments.findOne({where:{id:commentId}})
    if(username===comment.username){
        await Comments.destroy({where:{id:commentId}})
        res.json({message:`Comment with id ${commentId} has been deleted`})
    }else{
        res.json({error:"You cannot delete the comment"})
    }
})

module.exports = router