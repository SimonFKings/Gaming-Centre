import React, { useContext, useState }  from "react";
import Comment from "./comment";
import CommentInput from "./commentinput";


const Post = ({id,profileURL, username, file, text, comments}) => {


return(
    <div style={{marginTop: "50px   "}} className="post">


        <div className="postHeader">
        <img className="postProfileImage" 
        src={profileURL}>

        </img>
        
        
            <p> <span style= {{fontWeight: "500", marginRight: "8px", marginLeft: "8px"}}>{username}</span> </p>            
        </div>

        <div>
         
       {text}
       </div>
        <div className= "mainPost">

      
            <img className ="fileURL" 
            src = {file} >

            </img>
        </div>

        {comments ? (comments.map((comment) => (
        <Comment username={comment.username} text = {comment.comment}/>
            )) 
            ): (
            <></>
            )}

<CommentInput comments = {comments} id = {id} />

    </div>


)


}
export default Post;
