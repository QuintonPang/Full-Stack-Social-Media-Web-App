import React, {useEffect,useContext} from 'react'
import { Formik, Form, Field, ErrorMessage} from 'formik'
import * as Yup from 'yup'
import axios from 'axios'
import { useNavigate } from 'react-router-dom'
import { AuthContext } from '../helpers/AuthContext'

const CreatePost = () => {

    const { authState } = useContext(AuthContext)

    useEffect(()=>{
        if(localStorage.getItem('accessToken')) {
            axios.get(process.env.REACT_APP_DOMAIN+'/users/auth',{headers:{accessToken:localStorage.getItem('accessToken')}})
            .then((res)=>{!res.data.id&&navigate('/login')})
        }else{
            navigate('/login')
        }
    })

    const navigate = useNavigate()

    const initialValues={
        title:"",
        postText:"",
        // username:"",
    }

    const onSubmit = (data) =>{
        // console.log(data)
        axios.post(process.env.REACT_APP_DOMAIN+"/posts",{...data,username:authState.username,UserId:authState.id})
        .then((res)=>{console.log("STATUS: " + res.status); navigate(`/`)})
    }

    const validationSchema = Yup.object().shape({
        title:Yup.string().required("You must input a title"), // self-created error message
        postText:Yup.string().required(),
        // username:Yup.string().min(3).max(15).required(),
    })

  return (
    <div>
        <Formik initialValues={initialValues} onSubmit={onSubmit} validationSchema={validationSchema}>
            <Form>
                <label htmlFor="title">Title:</label>
                <ErrorMessage name="title" component="span"/>
                <Field id="title" name="title" placeholder="Title"/>
                <label htmlFor="postText">Post:</label>
                <ErrorMessage name="postText" component="span"/>
                <Field id="postText" name="postText" placeholder="Post"/>
                {/* <label htmlFor="username">Username:</label>
                <ErrorMessage name="username" component="span"/>
                <Field id="username" name="username" placeholder="Username"/> */}
                <button type="submit">Create Post</button>
            </Form>
        </Formik>
    </div>
  )
}

export default CreatePost