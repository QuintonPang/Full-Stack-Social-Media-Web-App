import React, { useContext } from 'react'
import Card from '@mui/material/Card';
import CardHeader from '@mui/material/CardHeader';
import CardContent from '@mui/material/CardContent';
import Typography from '@mui/material/Typography';
import Avatar from '@mui/material/Avatar'
import { red } from '@mui/material/colors';
import axios from 'axios'
import { Formik, Form, Field, ErrorMessage} from 'formik'
import * as Yup from 'yup'
import DeleteIcon from '@mui/icons-material/Delete'
import { useNavigate } from 'react-router-dom'
import { AuthContext } from '../helpers/AuthContext'

const CommentSection = ({comments,postId, fetchComments}) => {

  const navigate = useNavigate()
  const { authState } = useContext(AuthContext)

    const handleDelete = (id) =>{
      axios.delete(`${process.env.REACT_APP_DOMAIN}/comments/${id}`,{
        headers:{accessToken:localStorage.getItem('accessToken')}
      })
      .then((res)=>{
        console.log(res)
        fetchComments()
      })
    }
    const initialValues = {
        comment:""
    }

    const onSubmit = (data,{resetForm}) =>{

        axios.post(process.env.REACT_APP_DOMAIN+'/comments/',
          {
              commentBody:data.comment,
              PostId: postId,
          },
          {
            headers:{
              // accessToken: sessionStorage.getItem('accessToken'),
              accessToken: localStorage.getItem('accessToken'),
            }
          }
        )
        .then(res=>{
            console.log(`Status: ${res.status}`)
            if(res.data.error?.name==='JsonWebTokenError') alert("Please login first")
            else fetchComments()
        })

        resetForm()
    }

    const validationSchema = Yup.object().shape({
        comment:Yup.string().required()
    })
  return (
    <div style={{margin:"20px"}}>
        <Typography variant="body1" color="text.secondary">
                Comments
        </Typography>
        {comments?.map(comment=>
            <Card key={comment.id} sx={{ maxWidth: 345 }}>
            <CardHeader
            avatar={
              <Avatar sx={{ bgcolor: red[500] }} aria-label="recipe">
                {comment?.username?.charAt(0)}
              </Avatar>
            }
            title={comment?.username}
            subheader={comment?.createdAt}
            />
            <CardContent>
              <Typography variant="body2" color="text.secondary">
                {comment?.commentBody}
              </Typography>
            </CardContent>
            {authState.username===comment.username&&<DeleteIcon onClick={()=>handleDelete(comment?.id)}/>}
          </Card>)}
          <Formik initialValues={initialValues} onSubmit={onSubmit} validationSchema={validationSchema}>
            <Form>
                <label htmlFor="comment">Comment:</label>
                <ErrorMessage name="comment" component="span"/>
                <Field id="comment" name="comment" placeholder="Enter you comment here"/>
                <button type="submit">Submit</button>
            </Form>
        </Formik>
    </div>
  )
}

export default CommentSection