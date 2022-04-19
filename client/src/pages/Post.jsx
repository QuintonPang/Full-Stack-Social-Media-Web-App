import React, { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import axios from 'axios'
import PostCard from '../components/PostCard'
import CommentSection from '../components/CommentSection'
import { Box } from '@mui/material'

const Post = () => {
    const { id } = useParams()
    const [post, setPost] = useState(null)
    const [comments, setComments] = useState([])

    useEffect(()=>{
        fetchPosts()
        fetchComments()
    },[id])

    const fetchPosts = () =>{
      axios.get(`${process.env.REACT_APP_DOMAIN}/posts/byPost/${id}`)
        .then(res=>setPost(res.data))
    }

    const fetchComments =  () =>{   
      axios.get(`${process.env.REACT_APP_DOMAIN}/comments/${id}`)
      .then(res=>setComments(res.data))
      // alert('done')
    }

  return (
    <Box style={{display:"flex",flexDirection:"row", alignItems:"start"}}>
      <PostCard post={post} fetchPosts={fetchPosts}/> 
      <CommentSection comments={comments} postId={post?.id} fetchComments={fetchComments}/>
    </Box>
  )
}

export default Post