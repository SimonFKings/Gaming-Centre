import React, { useContext, useState }  from "react";
import Post from "../components/post" 

const Comment = ({id , username, text}) => {

return(
    <div className="comment">

<span style= {{fontWeight: "600", marginRight: "8px"}}>{username}</span>


         
         {text}


    </div>
)

}


export default Comment;
