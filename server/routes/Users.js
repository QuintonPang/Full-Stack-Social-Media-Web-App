const express = require('express')
const router = express.Router()
const { Users } = require('../models')
const bcrypt = require('bcryptjs')
const { validateToken } = require('../middlewares/AuthMiddleware')
 
const { sign } = require('jsonwebtoken')

router.post('/registration', async(req,res)=>{
    const { username, password } = req.body
    bcrypt.hash(password, 10)      // second parameter is salt round, the higher it is the more scrambled the password is
    .then(async (hash)=>{
        await Users.create({
            username,
            password: hash
        })
    })
    res.json("Created user successfully!")
})

router.post('/login',async (req,res)=>{
    const { username, password } = req.body
    const user = await Users.findOne({where:{username:username}})
    if(!user) res.json({error:"User not found"})
    bcrypt.compare(password,user.password)   // hash the password inputed to compare it with the password in database
    .then(async (match)=>{
        if(!match) res.json({error:"Wrong password"})
        const accessToken = sign({username:user.username, id:user.id},"importantSecret")
        res.json({token:accessToken, username,id:user.id})
    })
})

router.get('/auth',validateToken,(req,res)=>{
    res.json(req.user)
})

router.get('/:id', async (req,res)=>{
    const user = await Users.findByPk(req.params.id,{
        attributes:{
            exclude:['password']
        }
    })
    res.json(user)
})

router.put("/changePassword/:userId",validateToken,async(req,res)=>{
    const user = await Users.findByPk(req.params.userId)
    if(req.user.id===parseInt(req.params.userId)){
        bcrypt.compare(req.body.oldPassword,user.password)
        .then(async(match)=>{
            if (!match) {
                return res.json({error:"Old password is incorrect."})
            }else{
                bcrypt.hash(req.body.newPassword,10)
                .then(async(hash)=>{
                    await Users.update({password:hash},{where:{id:req.params.userId}})
                    return res.json(`Password of user with id ${req.params.userId} has been changed`);
                })
            }
        })
    }else{
        return res.json({error:"You are not allowed to change the password."})
    }
})

module.exports = router