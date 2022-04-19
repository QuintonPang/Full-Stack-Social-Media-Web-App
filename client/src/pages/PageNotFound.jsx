import React from 'react'
import { Link } from 'react-router-dom'
const PageNotFound = () => {
  return (
    <div style={{display:"flex",flexDirection:"column",alignItems:"center",justifyContent:"center"}}>
        <h1>PageNotFound</h1>
        <h3>Click <Link to="/">here</Link> to return to the home page</h3>
    </div>
  )
}

export default PageNotFound