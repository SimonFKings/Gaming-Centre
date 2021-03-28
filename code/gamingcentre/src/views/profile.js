import React, { useEffect, useState }  from "react";

import { useAuth0, withAuthenticationRequired } from "@auth0/auth0-react";
import { Loading } from "../components";
import { Link } from 'react-router-dom';
import Game from '../components/Game'






const Profile = () => {
  const { user } = useAuth0();
  const { name, picture, email, sub } = user;

  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [gamesID, setGamesID] = useState([]);


  const { getAccessTokenSilently } = useAuth0();

  useEffect(() => {
    const getUserMetadata = async () => {

      try {
        const token = await getAccessTokenSilently();

        const response = await fetch(
           `https://dev-22x3u4l0.us.auth0.com/api/v2/users/` + sub,
          {    
            headers: {
              Authorization: `Bearer ${token}`,          
            },
          }
          );

          const responseData = await response.json();
          setFirstName(responseData.user_metadata.firstName)
          setLastName(responseData.user_metadata.lastName)
          setGamesID(responseData.user_metadata.games)
         
          
      } catch (e) {
        console.log(e.message);
      }
    };
    getUserMetadata();
  }, []);

  return (
    <div>
      <div className="row align-items-center profile-header">
        <div className="col-md-2 mb-3">
          <img
            src={picture}
            alt="Profile"
            className="rounded-circle img-fluid profile-picture mb-3 mb-md-0"
          />
        </div>
        <div className="col-md text-center text-md-left">
        <h2>{firstName} {lastName}</h2>
          <p className="lead text-muted">{email}</p>
        </div>

    
        <Link to ="/edit-profile">Edit Profile</Link>

      </div>
      <div className="row">
        <pre className="col-12 text-light bg-dark p-4">
          {JSON.stringify(user, null, 2)}
        </pre>

        <div className="game-cotainer">
 
      {gamesID.length > 0 && gamesID.map((game) => (
          <Game key ={game.id} {...game}/>
        ))}
    </div>
      </div>
    </div>
  );
};

export default withAuthenticationRequired(Profile, {
  onRedirecting: () => <Loading />,
});