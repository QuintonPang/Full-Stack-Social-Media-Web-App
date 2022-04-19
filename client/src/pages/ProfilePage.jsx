import React, { useEffect, useState, useContext } from 'react'
import { useParams } from 'react-router-dom'
import axios from 'axios'
import PostCard from '../components/PostCard'
import { AuthContext } from '../helpers/AuthContext'
import Button from '@mui/material/Button'
import { useNavigate } from 'react-router-dom'

const ProfilePage = () => {

    const navigate = useNavigate()

    const handleChangePassword = () =>{
        navigate('/changePassword')
    }
    const [user, setUser] = useState(null)
    const [posts, setPosts] = useState([])

    const { id } = useParams()

    const { authState } = useContext(AuthContext)

    useEffect(()=>{
        axios.get(process.env.REACT_APP_BACKEND_DOMAIN+'/users/'+id)
        .then(res=>setUser(res.data))
    },[id])

    useEffect(()=>{
        fetchPosts()
    },[id])

    useEffect(()=>{
        if(localStorage.getItem('accessToken')) {
            axios.get(process.env.REACT_APP_BACKEND_DOMAIN+'/users/auth',{headers:{accessToken:localStorage.getItem('accessToken')}})
            .then((res)=>{!res.data.id&&navigate('/login')})
        }else{
            navigate('/login')
        }
    },[])


    const fetchPosts= () =>{
        axios.get(process.env.REACT_APP_BACKEND_DOMAIN+'/posts/byUser/'+id)
        .then(res=>setPosts(res?.data))
    }
  return (
    <div>
        <h1>Username: {user?.username}</h1>
        {authState?.id===parseInt(id)&&(
            <Button onClick={handleChangePassword}>
                CHANGE PASSWORD
            </Button>
        )}
        <h2>His/Her posts:</h2>
        {posts&&(
            posts.map(post=>
            <PostCard key={post.id} post={post} fetchPosts={fetchPosts}/>
            )
        )}
    </div>
  )
}

export default ProfilePage