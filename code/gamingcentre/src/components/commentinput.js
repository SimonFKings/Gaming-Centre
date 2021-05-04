import { PostAddSharp } from "@material-ui/icons";
import React, { useContext, useEffect, useState } from "react";
import Post from "../components/post";
import { db } from "../firebase";
import { useAuth0, withAuthenticationRequired } from "@auth0/auth0-react";

const CommentInput = ({ comments, id }) => {
  const [comment, setComment] = useState("");
  const [commentArray, setCommentArray] = useState(comments ? comments : []);

  const { user } = useAuth0();
  const { nickname, picture } = user;

  const addComment = () => {
    if (comment != "") {
      //Add a new comment to the post
      commentArray.push({
        comment: comment,
        username: nickname,
      });

      //Add new post comments to database
      db.collection("posts")
        .doc(id)
        .update({
          comments: commentArray,
        })
        .then(function () {
          setComment("");
        });
    }
  };
  return (
    <div className="commentInput">
      <textarea
        className="commentInputTextArea"
        rows="1"
        placeholder="Add a comment"
        onChange={(e) => setComment(e.target.value)}
        value={comment}
      ></textarea>

      <button className="commentInputButton" onClick={addComment}>
        Post
      </button>
    </div>
  );
};
export default CommentInput;
