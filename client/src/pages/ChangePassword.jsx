import React, { useContext } from 'react'
import { Formik, Form, ErrorMessage, Field } from 'formik'
import { AuthContext } from '../helpers/AuthContext'
import * as Yup from 'yup'
import axios from 'axios'
import { useNavigate } from 'react-router-dom'

const ChangePassword = () => {

    const navigate = useNavigate()

    const {authState} = useContext(AuthContext)
    
    const initialValues={
        oldPassword:"",
        newPassword1:"",
        newPassword2:"",
    }

    const onSubmit = (data) =>{
        axios.put(`${process.env.REACT_APP_DOMAIN}/users/changePassword/${authState.id}`,
        {
            oldPassword:data.oldPassword,
            newPassword: data.newPassword1 || data.newPassword2,
        },
        {
            headers:{
                'Content-Type': 'application/json',
                'accessToken':localStorage.getItem('accessToken'),
            }
        })
        .then(res=>{
            if(res.data.error) alert(res.data.error)
            else{
                alert(res.data)
                navigate('/profilePage/'+authState?.id)
            }
        })
    }

    const validationSchema = Yup.object().shape({
        oldPassword:Yup.string().min(8).max(15).required(),
        newPassword1:Yup.string().min(8).max(15).required(),
        newPassword2: Yup.string().oneOf([Yup.ref('newPassword1'),null],"New passwords must be same").required(),
    })
  return (
    <div>
        <Formik initialValues={initialValues} onSubmit={onSubmit} validationSchema={validationSchema}>
            <Form>
                <label htmlFor="oldPassword">Old password:</label>
                <ErrorMessage name="oldPassword" component="span"/>
                <Field type="password" id="oldPassword" name="oldPassword" placeholder="Enter old password"/>
                <label htmlFor="newPassword1">New password:</label>
                <ErrorMessage name="newPassword1" component="span"/>
                <Field type="password" id="newPassword1" name="newPassword1" placeholder="Enter new password"/>
                <label htmlFor="newPassword2">Retype password:</label>
                <ErrorMessage name="newPassword2" component="span"/>
                <Field type="password" id="newPassword2" name="newPassword2" placeholder="Enter new password again"/>
                <button type="submit">CHANGE PASSWORD</button>   
            </Form>
        </Formik>
    </div>
  )
}

export default ChangePassword