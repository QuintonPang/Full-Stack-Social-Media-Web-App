import React,{useContext, useState, useEffect} from 'react'
import Button from '@mui/material/Button'
import { styled } from '@mui/material/styles';
import Card from '@mui/material/Card';
import CardHeader from '@mui/material/CardHeader';
// import CardMedia from '@mui/material/CardMedia';
import CardContent from '@mui/material/CardContent';
import CardActions from '@mui/material/CardActions';
import Collapse from '@mui/material/Collapse';
import Avatar from '@mui/material/Avatar';
import IconButton from '@mui/material/IconButton';
import Typography from '@mui/material/Typography';
import { red } from '@mui/material/colors';
import FavoriteIcon from '@mui/icons-material/Favorite';
import ShareIcon from '@mui/icons-material/Share';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import { useNavigate } from 'react-router-dom'
import axios from 'axios'
import { AuthContext } from '../helpers/AuthContext'
import DeleteIcon from '@mui/icons-material/Delete'
import {Link} from 'react-router-dom'

const PostCard = ({post,fetchPosts}) => {

  const navigate = useNavigate()
  const { authState } = useContext(AuthContext)

  const [liked, setLiked] = useState(false)

  useEffect(()=>{
    axios.get(`${process.env.REACT_APP_BACKEND_DOMAIN}/likes/${post?.id}`,
    {
      headers:{
        "accessToken":localStorage.getItem("accessToken"),
      }
    })
    .then(res=>res.data?.id?setLiked(true):setLiked(false))
  },[post?.id])
  

  const handleLike=(postId)=>{
    axios.post(`${process.env.REACT_APP_BACKEND_DOMAIN}/likes/`,
    {
      PostId:postId,
      UserId: authState.id,
    },{
      headers:{
        'Content-Type': 'application/json',
        accessToken: localStorage.getItem('accessToken'),
      },
    })
    .then(res=>{
      console.log(res.status)
      fetchPosts()
    })

    setLiked(!liked)
  }

  const handleDelete = (id) =>{
    axios.delete(`${process.env.REACT_APP_BACKEND_DOMAIN}/posts/${post.id}`,
    {
      headers:{
        accessToken: localStorage.getItem('accessToken')
      }
    })
    .then(res=>{
      console.log(res.status)
      fetchPosts()
      navigate('/')
    })
  }

  const editPost = (option) =>{
    switch(option){
      case "title":
        const newTitle = prompt("Enter new title:")
        axios.put(`${process.env.REACT_APP_BACKEND_DOMAIN}/posts/updateTitle/${post.id}`,
        {
          newTitle,
        },
        {
          headers:{
            accessToken:localStorage.getItem('accessToken'),
          }
        }).then(res=>{console.log(res.status); fetchPosts()})
        break;
      case "postText":
        const newPostText = prompt("Enter new post text:")
        axios.put(`${process.env.REACT_APP_BACKEND_DOMAIN}/posts/updatePostText/${post.id}`,
        {
          newPostText,
        },
        {
          headers:{
            accessToken:localStorage.getItem('accessToken'),
          }
        }).then(res=>{console.log(res.status); fetchPosts()})
        break;
      default:
        break;
    }
  }

    const ExpandMore = styled((props) => {
      const { expand, ...other } = props;
      return <IconButton {...other} />;
    })(({ theme, expand }) => ({
      transform: !expand ? 'rotate(0deg)' : 'rotate(180deg)',
      marginLeft: 'auto',
      transition: theme.transitions.create('transform', {
        duration: theme.transitions.duration.shortest,
      }),
    }));
    const [expanded, setExpanded] = useState(false);

    const handleExpandClick = () => {
      setExpanded(!expanded);
    };
 

  return (
    <Card onClick={()=>navigate(`/post/${post?.id}`)} sx={{ maxWidth: 345 }}>
      <CardHeader
        avatar={
          <Avatar sx={{ bgcolor: red[500] }} aria-label="recipe">
            {post?.username?.charAt(0)}
          </Avatar>
        }
        action={
          <IconButton aria-label="settings">
            <MoreVertIcon />
          </IconButton>
        }
        title={post?.title}
        subheader={post?.createdAt}
      />
      <CardContent>
        <Typography variant="body2" color="text.secondary">
          {post?.postText}
        </Typography>
        <Typography variant="body2" color="text.secondary">
          by <Link onClick={(e)=>e.stopPropagation()} to={`/profilePage/${post?.UserId}`}>{post?.username}</Link>
        </Typography>
      </CardContent>
      <CardActions disableSpacing>
        <IconButton onClick={(e)=>{handleLike(post?.id);e.stopPropagation()}} aria-label="add to favorites">
          <FavoriteIcon sx={{color:liked?red[900]:null}}/>
          {post?.Likes?.length}
        </IconButton>
        {/* <IconButton aria-label="share">
          <ShareIcon />
        </IconButton> */}
        {authState?.username===post?.username&&(
          <IconButton onClick={(e)=>{handleDelete(post.id);e.stopPropagation()}} aria-label="delete">
            <DeleteIcon />
          </IconButton>
        )}
        <ExpandMore
          expand={expanded}
          onClick={(e)=>{handleExpandClick();e.stopPropagation()}}
          aria-expanded={expanded}
          aria-label="show more"
        >
          <ExpandMoreIcon/>
        </ExpandMore>
      </CardActions>
      <Collapse in={expanded} timeout="auto" unmountOnExit>
        <CardContent>
      {authState?.id===post?.UserId&&
      <div>
          <Button onClick={(e)=>{e.stopPropagation();editPost("title")}}>
            Edit title
          </Button>
          <Button onClick={(e)=>{e.stopPropagation();editPost("postText")}}>
            Edit text
          </Button>
      </div>}
        </CardContent>
      </Collapse>
         
    </Card>
  );
}

  
export default PostCard