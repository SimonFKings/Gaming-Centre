import React, { Fragment, useEffect } from "react";

import { Hero, HomeContent } from "../components";

const Home = () => {


  useEffect(() => {
    const getToken = async () => {

      try {

        const response = await fetch(
           `https://id.twitch.tv/oauth2/token?client_id=ozi5hp5ssdlwirs85n2deu5f4rtnm0&client_secret=4fg8qly9eqv7kwu9pib34ydk31zxf0&grant_type=client_credentials`,
          
          {    
            method: 'POST',

          }
          );

          const responseData = await response.json();
        
          console.log(responseData)
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
 
              //  'Content-Type': 'application/json',
              //  'Accept': 'application/json',
               'Access-Control-Allow-Origin' : '*',
   
               
             },
             body:
             'fields name, cover; limit 10;'
          //  'fields url;'

           }
           );
           const responseData2 = await response2.json();
         
           console.log(responseData2)
 
      } catch (e) {
        console.log(e.message);
      }
     
    };
    getToken();
  }, []);

  

  return (


  <Fragment>
    <Hero />
    <hr />
  <div>
  </div>
    <HomeContent />
  </Fragment>

  )
};

export default Home;
