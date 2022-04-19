const { verify } = require('jsonwebtoken')

const validateToken = (req,res,next)=>{ // next is a function called when you want the request to move forward without being stopped
    const accessToken = req.header("accessToken")
    if (!accessToken) return res.json({error:"User is not logged in"}) // not logged in 
    try{
        const validToken = verify(accessToken,"importantSecret") // check if the accessToken is correct
        req.user = validToken // passing the username and user id into req.user to be accessed at endpoints
        if(validToken){
            return next() // continue the request
        }
    }catch(err){
        return res.json({error:err})
    }
} 

module.exports = { validateToken }