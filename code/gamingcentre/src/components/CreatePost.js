import React, { useState } from "react";
import AttachmentIcon from '@material-ui/icons/Attachment';
import {storage, db} from '../firebase'
import firebase from "firebase";
import { useAuth0, withAuthenticationRequired } from "@auth0/auth0-react";

const CreatePost = () => {

const [postText, setPostText] = useState("")
const [file, setFile] = useState(null)
const [progress, setProgress] = useState(0)
const { user } = useAuth0();
const { nickname, picture} = user;


const handleChange = (e) => {
    if(e.target.files[0]){
        setFile(e.target.files[0])

        var selectedSrc = URL.createObjectURL(e.target.files[0]);
        var filePreview = document.getElementById("file-preview");


        filePreview.src = selectedSrc;
        filePreview.style.display = "block"
    }

}

const handleUpload = () => {
    console.log("test")
    if(file){
        const uploadTask = storage.ref(`files/${file.name}.jpg`)
        .put(file)

        uploadTask.on( "state_changed",
        (snapshot) => {
          // progress function 
          const progress = Math.round(
            (snapshot.bytesTransferred / snapshot.totalBytes) * 100
          );
          setProgress(progress);
        },
        (error) => {
          // Error function...
          console.log(error);
          alert(error.message);
        },
        () => {
          // upload complete function
          storage
          .ref("files")
          .child(`${file.name}.jpg`)
          .getDownloadURL()
          .then((url) => {
            db.collection("posts").add({
                timestamp: firebase.firestore.FieldValue.serverTimestamp(),
                text: postText,
                postImageUrl: url,
                userName: nickname,
                profileUrl :picture,
              });
            });

        setPostText("");
        setProgress(0);
        setFile(null);

        var preview = document.getElementById("file-preview");
        preview.style.display = "none";
          
        }
        
        );
    }
        
};


    return(

        <div className = "createPost">
            <div >
                <p>Create Post  </p>

                <div className = "createPostArea">
                    <textarea className = "createPostTextArea" rows = "3" 
                    value = {postText} onChange = {(e) => setPostText(e.target.value)}
                    placeholder = "What's going one?"
                    >

                    </textarea>
                    <div className="filePreview">
                        <img id = "file-preview" alt=""/>
                    </div>
                </div>
                <div className="createPostBottom">
                <div className="createPostUpload">
                <label htmlFor= "fileInput">  
                 <AttachmentIcon style = {{cursor:"pointer", fontSize: "20px"}}/>
                </label> 
                    <input id="fileInput" type="file" onChange={handleChange} />
                </div>
                
                <button className="uploadButton" onClick={handleUpload}
                style = {{color: postText ? "#000" : "grey"}}>{`Upload ${progress != 0 ? progress: "" }`}</button>
            </div>
            </div>
        </div>
    )

};
//Show upload button if a file has been uploaded
//Maybe a problem if users upload same name for images
//File names say jpg
//Replace the examples delete button with a timestamp

export default CreatePost;
