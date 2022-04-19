const express = require('express')
const app = express()
const PORT = process.env.PORT || 3001
const cors = require('cors')

// for nodejs to read .env 
require('dotenv').config()

app.use(express.json())
app.use(cors())

const db = require('./models')

// Routers
const postsRouter = require("./routes/Posts.js")
const commentsRouter = require("./routes/Comments.js")
const usersRouter = require("./routes/Users.js")
const likesRouter = require("./routes/Likes.js")

app.use("/posts",postsRouter)
app.use("/comments",commentsRouter)
app.use("/users",usersRouter)
app.use("/likes",likesRouter)

db.sequelize.sync().then(()=>{
    app.listen(PORT,()=>{
        console.log(`Server running on port ${PORT}`)
    })
})
.catch(err=>console.log(err))
