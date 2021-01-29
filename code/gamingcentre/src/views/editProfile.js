import React, { useState } from "react";

import { useAuth0, withAuthenticationRequired } from "@auth0/auth0-react";
import { Loading } from "../components";
// import { Button } from 'react-native';


const EditProfile = () => {
  
  const { user } = useAuth0();
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [username, setUsername] = useState("");
  const [emailAdress, setEmail] = useState("");


  const {name, picture, email, given_name, family_name, nickname, sub} = user;
  const proxyurl = "https://cors-anywhere.herokuapp.com/";

  const { getAccessTokenSilently } = useAuth0();


  const callSecureApi = async () => {
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
          body: JSON.stringify( { "user_metadata": {"family_name" : lastName}})
          


        }
      );

console.log(user)



      const responseData = await response.json();
console.log(responseData)
setLastName(  responseData.user_metadata.family_name)
      setLastName(responseData.message);
    } catch (error) {
      setLastName(error.lastName);
    }
  };

  return (


    <div>

                <h2>{name}</h2>
<label>
           <p>First Name</p>
           <input name="name" value={given_name}
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
           <input name="name" value={nickname}
           onChange={e => setUsername(e.target.value)}
/>
         </label>

         <label>
           <p>Email Address</p>
           <input name="name" value={email}
           onChange={e => setEmail(e.target.value)}
/>
         </label>


         <button type="button" onClick={callSecureApi}>Submit</button>




</div>


)
};

export default withAuthenticationRequired(EditProfile, {
    onRedirecting: () => <Loading />,
  });