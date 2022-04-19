import React from 'react'
import { Formik, Form, Field, ErrorMessage} from 'formik'
import axios from 'axios'
import { useNavigate } from 'react-router-dom'
import * as Yup from 'yup'

const Registration = () => {

    const navigate = useNavigate()
    
    const initialValues={
        username:"",
        password:"",
    }

    const onSubmit = (data) =>{
        // console.log(data)
        axios.post(process.env.REACT_APP_DOMAIN+"/users/registration",data)
        .then((res)=>{console.log("STATUS: " + res.status); navigate(`/login`)})
    }

    const validationSchema = Yup.object().shape({
        username:Yup.string().min(8).max(15).required(),
        password:Yup.string().min(8).max(15).required(),
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
                <button type="submit">Register</button>
            </Form>
        </Formik>
    </div>
  )
}

export default Registration