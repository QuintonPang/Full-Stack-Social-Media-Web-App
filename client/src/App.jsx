import { Routes, Route, Link } from 'react-router-dom'
import CreatePost from './pages/CreatePost'
import Home from './pages/Home'
import Login from './pages/Login'
import Post from './pages/Post'
import Registration from './pages/Registration'
import { AuthContext } from './helpers/AuthContext'
import { useState, useEffect } from 'react'
import axios from 'axios'
import PageNotFound from './pages/PageNotFound'
import ProfilePage from './pages/ProfilePage'
import ChangePassword from './pages/ChangePassword'

const App = () => {
    const [authState, setAuthState] = useState({username:"",id:"",status:false}) // save user that is logged in
    useEffect(()=>{
        if(localStorage.getItem('accessToken')) {
            axios.get(process.env.REACT_APP_DOMAIN+'/users/auth',{headers:{accessToken:localStorage.getItem('accessToken')}})
            .then((res)=>res.data.id?setAuthState({...res.data,status:true}):setAuthState({...authState,status:false})); // prevent fake token
        }
    },[])

    const logout = () =>{
        // alert("Logged out")
        localStorage.removeItem('accessToken')
        setAuthState({username:"",id:"",status:false})
    }
    return(
        <AuthContext.Provider value={{authState,setAuthState}}>
            {!authState.status?
                    <div>
                        <Link to="/registration">Registration</Link>
                        <Link to="/login">Login</Link>
                    </div>
                    :
                    <div>
                        <Link to="/createPost">Create a new post</Link>
                        <Link to="/">Home page</Link>
                        <Link to={`/profilePage/${authState.id}`}>Profile page</Link>
                        <Link onClick={logout} to="/login">Logout</Link>
                    </div>
            }
            <h1>{authState.username}</h1>
            <Routes>
                <Route path="/" element={<Home/>} />
                <Route path="/createPost" element={<CreatePost/>} />
                <Route path="/post/:id" element={<Post/>} />
                <Route path="/registration" element={<Registration/>} />
                <Route path="/login" element={<Login/>} />
                <Route path="/profilePage/:id" element={<ProfilePage/>} />
                <Route path="/*" element={<PageNotFound/>} />
                <Route path="/changePassword" element={<ChangePassword/>} />
            </Routes>
        </AuthContext.Provider>
    )
}

export default App