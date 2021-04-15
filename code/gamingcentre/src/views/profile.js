import React, { useEffect, useState }  from "react";

import { useAuth0, withAuthenticationRequired } from "@auth0/auth0-react";
import { Loading } from "../components";
import { Link } from 'react-router-dom';
import Game from '../components/Game'
import { db } from "../firebase";
import Post from "../components/post" 


import Carousel from 'react-elastic-carousel';





const Profile = () => {
  const { user } = useAuth0();
  const { given_name,family_name, picture, email, sub, nickname } = user;

  const [post, setPosts ] = useState([]);

  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  // const [username, setUsername] = useState("");

  const [ games , setGames] = useState([]);
  const [recommendedGames, setRecommended] = useState([])


  const { getAccessTokenSilently } = useAuth0();

  
let username = "";
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
          const metadata = responseData.user_metadata;
          
          if(metadata && metadata.firstName && metadata.lastName && metadata.usernmae){
          setFirstName(responseData.user_metadata.firstName)
          setLastName(responseData.user_metadata.lastName)
          username = responseData.user_metadata.username

          
          }else{
            username = nickname
            try {
              const token = await getAccessTokenSilently();
        
        
              const response = await fetch(
                `https://dev-22x3u4l0.us.auth0.com/api/v2/users/` + sub ,
                {    
                  // mode: "no-cors",
                  method: 'PATCH',
                  headers: {
                    Authorization: `Bearer ${token}`,
          
                    'Content-Type': 'application/json'      
        
                  },
                  body: JSON.stringify( { "user_metadata": {
                    "firstName" : given_name, 
                    "lastName" : family_name,
                    "username" : nickname,
                    "emailAddress" : email
        
                }})
                  
        
                }
              );
        
        
        
        
              const responseData = await response.json();
        console.log(responseData)
            } catch (error) {
            }
          }
          if(responseData.user_metadata && responseData.user_metadata.games){
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

              const gamesList = data;

              const recommendID = [];
              const recommendList = [];


              gamesList.map((game) => (

                // recommendList.push(game.similar_games)
                game.similar_games.map((recommend) =>(
                  recommendID.push(recommend)
                )
                )


              )
              
              )

              console.log(recommendID)

                //   for (let index = 0; index < recommendID.length; index++) {
                //     fetch(
                //   proxyurl + `https://api.igdb.com/v4/games`,
                //   {
                //     method: 'POST',
                //     headers: {
                //            'Client-ID': `ozi5hp5ssdlwirs85n2deu5f4rtnm0`,
                //            Authorization: `Bearer ${token}`,
                //            'Access-Control-Allow-Origin' : '*',
                      
                           
                //          },
                //          body:
                //    `fields *; where id = ${recommendID[index]} ;`
                
                //  }
                
                
                  
                // )
                // .then((response) => response.json())
                // .then((data) =>{
                //   recommendList.push(data)


                //   }
                // )
                // }
                // console.log(recommendList)
            })
            

          })
        }
          
      } catch (e) {
        console.log(e.message);
      }

      console.log(username)
     db.collection("posts").where(`userName`,`==`, username ).onSnapshot((snapshot) =>
      {
        // const a = snapshot.docs.map((doc) => ({id: doc.id, post:doc.data()}));
        // console.log(username);

        setPosts( snapshot.docs.map((doc) => ({id: doc.id, post:doc.data()})));


      } );   


      
      
      
      // if(doc.data().userName === "simon-fk")


    
   
       
  

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
      <h2>Recommended Games</h2>


      {/* <Carousel>
      {recommendedGames.length > 0 && recommendedGames.map((recommended) => (
          <Game key ={recommended} {...recommended}/>
        ))}
        
</Carousel> */}
</div>

      <div className="row">
      <h2>My Games</h2>

        {/* { <pre className="col-12 text-light bg-dark p-4">
          {JSON.stringify(user, null, 2)}
        </pre> } */}

        <div className="game-cotainer">
 
      {games.length > 0 && games.map((game) => (
          <Game key ={game.id} {...game}/>
        ))}
    </div>
      </div>

      <div className="row">
      <h2>My Post</h2>
      <div className="feed">       
         {post.map(({id, post}) =>{
             return <Post 
             key ={id}
             id = {id}
             profileURL = {post.profileUrl}
             username = {post.userName}
             file = {post.postImageUrl}
             text  = {post.text}
             comments = {post.comments}
             />
         })}
    </div>
        </div>

    </div>
  );
};

export default withAuthenticationRequired(Profile, {
  onRedirecting: () => <Loading />,
});