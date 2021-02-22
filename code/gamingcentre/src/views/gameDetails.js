import React, { useEffect, useState } from "react";

import { useAuth0, withAuthenticationRequired } from "@auth0/auth0-react";
import { Loading } from "../components";
import { useParams } from "react-router";
import { Container, Row, Col } from 'reactstrap';


const GameDetails = () => {

    
    
    const [ name , setName] = useState([]);
    const [ summary , setSummary] = useState([]);
    const [ rating , setRating] = useState([]);
    const [ image , setImage] = useState([]);
    const [ cover , setCover] = useState([]);







    let { id } = useParams();

    useEffect(() => {

    fetch(`https://id.twitch.tv/oauth2/token?client_id=ozi5hp5ssdlwirs85n2deu5f4rtnm0&client_secret=4fg8qly9eqv7kwu9pib34ydk31zxf0&grant_type=client_credentials`,      
{    
  method: 'POST',

}
).then((response) => response.json())
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
   'fields *; where id =' + id +' ;'

 }


  
).then((response) => response.json())
.then((data) => {

    const game =  data[0]

setName(game.name)
setSummary(game.summary)



fetch(
    proxyurl+
    `https://api.igdb.com/v4/covers`,
   
   {    
     method: 'POST',

     headers: {
       'Client-ID': `ozi5hp5ssdlwirs85n2deu5f4rtnm0`,
       Authorization: `Bearer ${token}`,

        //  'Content-Type': 'application/json',
        //  'Accept': 'application/json',
       'Access-Control-Allow-Origin' : '*',

       
     },
     body:
     `fields url; where id = ${game.cover};`
  //  'fields url;'

   }
   ).then((response) => response.json())
   .then((data) => {
    const url =  data[0].url.replace("thumb", "1080p")

    setImage(url)
   })


})

})
}, []);

return (
    
        


      <div>
       
<Container>
<Row>
        <Col xs="6"> 
        <div className='game'> 
        
        <img src={image ? image: 'https://images.unsplash.com/photo-1573053986275-840ffc7cc685?ixid=MXwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHw%3D&ixlib=rb-1.2.1&auto=format&fit=crop&w=934&q=80'} alt={name} />

      </div>
      </Col>
        <Col xs="6"> 
        <h1>
            {name}
        </h1>
        <span>
            {summary}
        </span>
        </Col>
      </Row>
</Container>
       
      </div>
  );






};

export default withAuthenticationRequired(GameDetails, {
    onRedirecting: () => <Loading />,
  });
