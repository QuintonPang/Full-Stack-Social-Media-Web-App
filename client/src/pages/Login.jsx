import React, { useContext } from 'react'
import { AuthContext } from '../helpers/AuthContext'
import { Formik, Form, Field, ErrorMessage} from 'formik'
import axios from 'axios'
import { useNavigate } from 'react-router-dom'
import * as Yup from 'yup'

const Login = () => {

    const { setAuthState } = useContext(AuthContext)

    const navigate = useNavigate()
    
    const initialValues={
        username:"",
        password:"",
    }

    const onSubmit = (data) =>{
        // console.log(data)
        axios.post(process.env.REACT_APP_BACKEND_DOMAIN+"/users/login",data)
        .then((res)=>{
            if(res.data.error) alert(res.data.error)
            else {
                // sessionStorage is clearedx when the tab is closed, but not for localStorage 
                // sessionStorage.setItem("accessToken",res.data.token)
                localStorage.setItem("accessToken",res.data.token)
                setAuthState({...res.data,status:true})
                navigate(`/`)
            }
        })
    }

    const validationSchema = Yup.object().shape({
        username:Yup.string().required(),
        password:Yup.string().required(),
    })
  return (
    <div>
           <Formik initialValues={initialValues} onSubmit={onSubmit} validationSchema={validationSchema}>
            <Form>
                <label htmlFor="username">Username:</label>
                <ErrorMessage name="username" component="span"/>
                <Field id="username" name="username" placeholder="Username"/>
                <label htmlFor="password">Password:</label>
                <ErrorMessage name="password" component="span"/>
                <Field id="password" type="password" name="password" placeholder="Password"/>
                <button type="submit">Login</button>
            </Form>
        </Formik>
    </div>
  )
}

export default Login