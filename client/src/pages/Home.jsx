import React, {useState, useEffect} from 'react'
import axios from 'axios'
import PostCard from '../components/PostCard'
import { Box } from '@mui/material'
import { useNavigate } from 'react-router-dom'

const Home = () => {

    const navigate = useNavigate()
    const [posts, setPosts] = useState([])

    const fetchPosts = () =>{
        axios.get(process.env.REACT_APP_BACKEND_DOMAIN+'/posts')
        .then((res)=>{
            setPosts(res.data)
        })
    }
    useEffect(()=>{
        if(localStorage.getItem('accessToken')) {
            axios.get(process.env.REACT_APP_BACKEND_DOMAIN+'/users/auth',{headers:{accessToken:localStorage.getItem('accessToken')}})
            .then((res)=>{!res.data.id&&navigate('/login')})
        }else{
            navigate('/login')
        }
        fetchPosts()
    },[])

    return (
        <Box container spacing={2}>
             {
            posts.map((post)=>
                <PostCard item key={post.id} post={post} fetchPosts={fetchPosts} xs={4}/>
            )
        }
        </Box>   
    )
}

export default Home