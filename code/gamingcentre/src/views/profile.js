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
  const [ games , setGames] = useState([]);


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

          const games = JSON.stringify(responseData.user_metadata.games).replace("[","(" ).replace("]",")").replace(/['"]+/g, '') ;


          fetch(`https://id.twitch.tv/oauth2/token?client_id=ozi5hp5ssdlwirs85n2deu5f4rtnm0&client_secret=4fg8qly9eqv7kwu9pib34ydk31zxf0&grant_type=client_credentials`,      

          {    
            method: 'POST',
          
          }).then((response) => response.json())
          .then((data) => {
            const token = data.access_token
            const proxyurl = "https://cors-anywhere.herokuapp.com/";

            fetch(
              proxyurl + `https://api.igdb.com/v4/games`,
              {
                method: 'POST',
                headers: {
                       'Client-ID': `ozi5hp5ssdlwirs85n2deu5f4rtnm0`,
                       Authorization: `Bearer ${token}`,
                       'Access-Control-Allow-Origin' : '*',
                  
                       
                     },
                     body:
               `fields *; where id = ${games} ;`
            
             }
            
            
              
            ).then((response) => response.json())
            .then((data) =>{
              setGames(data)

            })
            

          })
          
      } catch (e) {
        console.log(e.message);
      }
    };
    getUserMetadata();

    let isMounted = true; // note this flag denote mount status

    // const getGames = async () => {
  
    //   try {
  
    //     const response = await fetch(
    //        `https://id.twitch.tv/oauth2/token?client_id=ozi5hp5ssdlwirs85n2deu5f4rtnm0&client_secret=4fg8qly9eqv7kwu9pib34ydk31zxf0&grant_type=client_credentials`,
          
    //       {    
    //         method: 'POST',
  
    //       }
    //       );
  
    //       if(isMounted){
    //       const responseData = await response.json();
        
    //       const token = responseData.access_token;
    //       const proxyurl = "https://cors-anywhere.herokuapp.com/";
    //       const response2 = await fetch(
  
    //        proxyurl+
    //         `https://api.igdb.com/v4/games`,
           
    //        {    
    //          method: 'POST',
  
    //          headers: {
    //            'Client-ID': `ozi5hp5ssdlwirs85n2deu5f4rtnm0`,
    //            Authorization: `Bearer ${token}`,
    //            'Access-Control-Allow-Origin' : '*',
   
               
    //          },
    //          body:
    //          'fields name, cover, summary, total_rating, follows; where follows > 1 ;limit 9;sort follows desc;'
  
    //        }
    //        );
  
    //        const responseData2 = await response2.json();
  
    //        }
  
    //   } catch (e) {
    //     console.log(e.message);
    //   }
     
    // };
    
    // getGames();
    // return () => { isMounted = false };
  
  
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
 
      {games.length > 0 && games.map((game) => (
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