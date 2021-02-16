import React, {useEffect, useState} from "react";

import { useAuth0, withAuthenticationRequired } from "@auth0/auth0-react";
import { Loading } from "../components";
import Game from '../components/Game'



const Games = () => {
const [ games , setGames] = useState([]);
const [ searchTerm , setSearchTerm] = useState('');



useEffect(()  => {
  const getGames = async () => {

    try {

      const response = await fetch(
         `https://id.twitch.tv/oauth2/token?client_id=ozi5hp5ssdlwirs85n2deu5f4rtnm0&client_secret=4fg8qly9eqv7kwu9pib34ydk31zxf0&grant_type=client_credentials`,
        
        {    
          method: 'POST',

        }
        );

        const responseData = await response.json();
      
        const token = responseData.access_token;
        const proxyurl = "https://cors-anywhere.herokuapp.com/";

        const response2 = await fetch(
         proxyurl+
          `https://api.igdb.com/v4/games`,
         
         {    
           method: 'POST',

           headers: {
             'Client-ID': `ozi5hp5ssdlwirs85n2deu5f4rtnm0`,
             Authorization: `Bearer ${token}`,
             'Access-Control-Allow-Origin' : '*',
 
             
           },
           body:
           'fields name, cover, summary, total_rating, follows; where follows > 1 & total_rating > 0.0 ;limit 9;sort follows desc;'

         }
         );
         const responseData2 = await response2.json();
       console.log(responseData2)
         setGames(responseData2)

    } catch (e) {
      console.log(e.message);
    }
   
  };
  getGames();
}, []);

const handleOnSubmit = (e)=>{
  e.preventDefault();
if(searchTerm){
fetch(`https://id.twitch.tv/oauth2/token?client_id=ozi5hp5ssdlwirs85n2deu5f4rtnm0&client_secret=4fg8qly9eqv7kwu9pib34ydk31zxf0&grant_type=client_credentials`,      
{    
  method: 'POST',

}
).then((response) => response.json())
.then((data) => {
  
  const token = data.access_token
  const proxyurl = "https://cors-anywhere.herokuapp.com/";

  console.log(token)
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
   'fields name, cover, summary, total_rating, follows; where follows > 1 & total_rating > 0.1 ;search "' + searchTerm + '";'

 }


  
).then((response) => response.json())
.then((data) => {
  setGames(data)
})

})
}
setSearchTerm('')


};


const handleOnChange = (e)=>{
  setSearchTerm(e.target.value);
}


  return (<>
    <header>
      <form onSubmit={handleOnSubmit}>
        
      <input className="search"
       type = "search" 
       placeholder="Search..." 
       value={searchTerm} 
       onChange={handleOnChange}/>


      </form>

  </header>

<div className="game-cotainer">
 
      {games.length > 0 && games.map((game) => (
          <Game key ={game.id} {...game}/>
        ))}
    </div>
    </>

  );
};

export default withAuthenticationRequired(Games, {
  onRedirecting: () => <Loading />,
});