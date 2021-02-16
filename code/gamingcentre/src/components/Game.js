import React, {useEffect, useState} from "react";



const Game = ({name, cover, summary, total_rating ,follows}) => {

    if(total_rating== null){
        total_rating = 0;
    }
    const setRatingClass = (rating) => {

        if(rating> 69.99){
            return 'green'
        }else if(rating >= 40){
            return 'orange'
        }else if(rating == 0){
            return 'black'
        } else{
        return 'red';
    
    }
}
// if(summary.length > 400 ){
//     summary = summary.substring(0,350) + " ..."
// }

const [ image , setImage] = useState("");

    useEffect(()  => {

  const getImages = async () => {

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
             `fields url; where id = ${cover};`
          //  'fields url;'

           }
           );
           const responseData2 = await response2.json();



       const url =  responseData2[0].url.replace("thumb", "1080p")

           setImage(url)
 
      } catch (e) {
        console.log(e.message);
      }
     
    };
    if(cover != null ){

    getImages();
    }
}, []);

  return  <div className='game'> 
    <img src={image ? image: 'https://images.unsplash.com/photo-1573053986275-840ffc7cc685?ixid=MXwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHw%3D&ixlib=rb-1.2.1&auto=format&fit=crop&w=934&q=80'} alt={name} />

<div className="game-info">
<h3> {name} </h3>
<span 
className={`tag ${setRatingClass(total_rating)}`}
>
    {total_rating.toFixed(2)}</span>

</div>
<div className="game-sum">
    <h3> Summary:</h3>
    <p>{summary}</p>
    
</div>
    </div>;

}
export default Game