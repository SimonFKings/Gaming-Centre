import { PostAddSharp } from "@material-ui/icons";
import React, { useContext, useEffect, useState } from "react";
import Post from "../components/post";
import { db } from "../firebase";

const Feed = () => {
  const [post, setPosts] = useState([]);

  useEffect(() => {
    db.collection("posts").onSnapshot((snapshot) => {
      setPosts(snapshot.docs.map((doc) => ({ id: doc.id, post: doc.data() })));
    });
  }, []);

  return (
    <div className="feed">
      {post.map(({ id, post }) => {
        return (
          <Post
            key={id}
            id={id}
            profileURL={post.profileUrl}
            username={post.userName}
            file={post.postImageUrl}
            text={post.text}
            comments={post.comments}
          />
        );
      })}
    </div>
  );
};
export default Feed;
