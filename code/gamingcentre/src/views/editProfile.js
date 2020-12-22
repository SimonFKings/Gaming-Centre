import React from "react";

import { useAuth0, withAuthenticationRequired } from "@auth0/auth0-react";
import { Loading } from "../components";
// import { Button } from 'react-native';


const EditProfile = () => {
  const { user } = useAuth0();
  const { name, picture, email, given_name } = user;

  return (

    <div>
                <h2>{name}</h2>
<label>
           <p>First Name</p>
           <input name="name" value={given_name}/>
         </label>

         <label>
           <p>Email Address</p>
           <input name="name" value={email}/>
         </label>
         
      <form>




      </form>

</div>


)
};

export default withAuthenticationRequired(EditProfile, {
    onRedirecting: () => <Loading />,
  });