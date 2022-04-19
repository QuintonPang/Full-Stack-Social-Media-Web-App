const express = require('express')
const router = express.Router()
const { Likes } = require('../models')
const { validateToken } = require('../middlewares/AuthMiddleware')

router.post('/', validateToken, async(req,res)=>{ // second parameter is a middleware
    const like = req.body
    const userId = req.user.id
    like.UserId = userId
    const found = await Likes.findOne({where:like})
    if(!found){
        await Likes.create(like)
        res.json({like:true})       
    } else {
        // res.json({error:"You have already liked it before."})
        await Likes.destroy({where:like})
        res.json({like:false,message:`Like with id ${found.id} has been removed`})
    }
})

router.get('/:id', validateToken, async(req,res)=>{ // second parameter is a middleware
    const postId = req.params.id
    const userId = req.user.id
    const like = {postId,userId}
    const found = await Likes.findOne({where:like})
    if(!found){
        res.json({error:'Like not found!'})       
    } else {
        res.json(found)
    }
})

// router.delete('/:likeId', validateToken, async(req,res)=>{ // second parameter is a middleware
//     const likeId = req.params.likeId
//     const userId = req.user.id
//     const like = await Likes.findOne({where:{id:likeId}})
//     if(userId===like.UserId){
//         await Likes.destroy({where:{id:userId}})
//         res.json({message:`Like with id ${likeId} has been removed`})
//     }else{
//         res.json({error:"You cannot remove the like"})
//     }
// })

module.exports = router