import React, { useEffect, useState } from "react";

import { useAuth0, withAuthenticationRequired } from "@auth0/auth0-react";
import { Loading } from "../components";
// import { Button } from 'react-native';

const EditProfile = () => {

  
  const { user } = useAuth0();
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [username, setUsername] = useState("");
  const [emailAddress, setEmail] = useState("");


  const {name, picture, email, given_name, family_name, nickname, sub} = user;


  useEffect(() => {
    const getUserMetadata = async () => {

      try {
        const token = await getAccessTokenSilently();

        const response = await fetch(
          // proxyurl+
           `https://dev-22x3u4l0.us.auth0.com/api/v2/users/google-oauth2|107476463422329654527`,
          
          {    
            // mode: "no-cors",
  
            headers: {
              Authorization: `Bearer ${token}`,
              // 'Access-Control-Allow-Origin' : '*',
  
              
            },
          }
          );

          const responseData = await response.json();
          setFirstName(responseData.user_metadata.firstName)
          setLastName(responseData.user_metadata.lastName)
          setUsername(responseData.user_metadata.username)
          setEmail(responseData.user_metadata.emailAddress)

          
      } catch (e) {
        console.log(e.message);
      }
    };
    getUserMetadata();
  }, []);


  const proxyurl = "https://cors-anywhere.herokuapp.com/";

  const { getAccessTokenSilently } = useAuth0();

  const updateUser = async () => {
    try {
      const token = await getAccessTokenSilently();


      const response = await fetch(
        `https://dev-22x3u4l0.us.auth0.com/api/v2/users/` + sub ,
        {    
          // mode: "no-cors",
          method: 'PATCH',
          headers: {
            Authorization: `Bearer ${token}`,
            // 'Access-Control-Allow-Origin' : '*',
            // 'Content-Type': 'application/json'
            // 'Accept': 'application/json',
            'Content-Type': 'application/json'

            // 'Access-Control-Allow-Methods' : '*',
            // "x-requested-with": 'XMLHttpRequest',
            // "origin" : "http://localhost:4040"

          },
          body: JSON.stringify( { "user_metadata": {
            "firstName" : firstName, 
            "lastName" : lastName,
            "username" : username,
            "emailAddress" : emailAddress

        }})
          

        }
      );




      const responseData = await response.json();
console.log(responseData)
    } catch (error) {
    }
  };

  return (


    <div>

                <h2>{name}</h2>
<label>
           <p>First Name</p>
           <input name="name" value={firstName}
           onChange={e => setFirstName(e.target.value)}
/>
         </label>

         <label>
           <p>Last Name</p>
           <input name="name" defaultValue={lastName}
            onChange={e => setLastName(e.target.value)}
                   />
         </label>

         <label>
           <p>Username</p>
           <input name="name" value={username}
           onChange={e => setUsername(e.target.value)}
/>
         </label>

         <label>
           <p>Email Address</p>
           <input name="name" value={emailAddress}
           onChange={e => setEmail(e.target.value)}
/>
         </label>


         <button type="button" onClick={updateUser}>Submit</button>




</div>


)
};

export default withAuthenticationRequired(EditProfile, {
    onRedirecting: () => <Loading />,
  });