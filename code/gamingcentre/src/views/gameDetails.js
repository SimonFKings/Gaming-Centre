import React, { useEffect, useState } from "react";

import { useAuth0, withAuthenticationRequired } from "@auth0/auth0-react";
import { Loading } from "../components";
import { useParams } from "react-router";
import { Container, Row, Col } from 'reactstrap';
import { Modal } from "react-bootstrap";
import ReactPlayer from "react-player";
import ReactStars from "react-rating-stars-component";
import StarRatings from 'react-star-ratings';

import Switch from "react-switch";
import { db } from "../firebase";
// import Carousel from 'react-elastic-carousel';
import Game from '../components/Game'
import 'pure-react-carousel/dist/react-carousel.es.css';
import "react-responsive-carousel/lib/styles/carousel.min.css"; // requires a loader
import { Carousel } from 'react-responsive-carousel';





const GameDetails = (props) => {

    
    
    const [ gameName , setGameName] = useState([]);
    const [ summary , setSummary] = useState([]);
    const [ criticRatings , setCriticRating] = useState([]);
    const [ criticCount , setCriticCount] = useState([]);
    const [ image , setImage] = useState([]);
    const [ genres , setGenres] = useState([]);
    const [ platforms , setPlatforms] = useState([]);
    const [ video , setVideo] = useState([]);
    const [isOpen, setIsOpen] = useState(false);
    const [artwork, setArtwork] = useState([]);
    const [checked, setChecked] = useState(false);
    const [myGames, setMyGames] = useState([]);
    const [rating, setRating] = useState(0);
    const [ratingHide, setRatingHide] = useState(true)
    const [predictHid, setPredictHide] = useState(true)




    // const [users, setUsers] = useState([])
    // const [games, setGames] = useState([])
    const [similarGames, setSimilarGames] = useState([]);

    const [prediction, setPrediction] = useState(0)



    const { user } = useAuth0();
    const { name, picture, email, sub } = user;
  
    const { getAccessTokenSilently } = useAuth0();

    const handleChange = () =>{
      // console.log(checked)

      const updateGames = async () => {

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
            if(responseData.user_metadata && responseData.user_metadata.games){
              setMyGames(responseData.user_metadata.games)
            }
           
           
            
        } catch (e) {
          console.log(e.message);
  
        }


      if(checked){
        // console.log(myGames);

        const index = myGames.indexOf(id)
        
        if(index !== -1){
          myGames.splice(index, 1);
          setChecked(false);
          

        }

        
      }else{


        if(myGames){
        if(!myGames.includes(id)){
        myGames.push(id);
        setChecked(true)
        }else{
          myGames.push(id);
          setChecked(true)
        }
        try {
          const token = await getAccessTokenSilently();
    
    
          const response = await fetch(
            `https://dev-22x3u4l0.us.auth0.com/api/v2/users/` + sub ,
            {    
              method: 'PATCH',
              headers: {
                Authorization: `Bearer ${token}`,
                'Content-Type': 'application/json'
    
          
    
              },
              body: JSON.stringify( { "user_metadata": {
                "games" : myGames, 
              
    
            }})
              
    
            }
          );
    
    
    
    
          const responseData = await response.json();
        } catch (error) {
        }
      }
      };
        
      }
      updateGames();



    }
  
    const changeRating = (newRating) =>{
 

  let docs =  db.collection("reviews").where(`gameID`,`==`, id).where(`user`, `==`, sub);

      docs.get().then(querySnapshot => {
        if(querySnapshot.size === 0 ){

          db.collection("reviews").add({
            gameID : id,
            rating :  newRating,
            user : sub
          });

          
        }else{
        querySnapshot.forEach(doc => {
          doc.ref.update({
            rating :  newRating,

          })
        });
      }
      });
      
    }
   
 
      
    const findNearestNeighbors = (user, users, games) =>{ 


      var similarityScores = {};

    for (let i = 0; i < users.length; i++) {
      let other = users[i];
      if(other != user){
        const similarity = euclideanDistance(user, other, games)
        // console.log(similarity)

        similarityScores[other] = similarity;
      }
    }
    // console.log(similarityScores)

      users.sort(compareSimilarity);

      function compareSimilarity(a, b) {
        var score1 = similarityScores[a];
        var score2 = similarityScores[b];
        return score2 - score1;
      }

      var k = 5;
        let weightedSum = 0;
        let similaritySum = 0;

        for(let i = 0 ; i < k ; i++){
          const user = users[i];
          var sim = similarityScores[user];

 
          if(user != null){
          let docs =  db.collection("reviews").where(`gameID`,`==`, id).where(`user`, `==`, user);


          
          console.log("inside Fnn5")

          docs.get().then(querySnapshot => {
            if(querySnapshot.size>0){
              querySnapshot.forEach(doc => {
              let rating = doc.data().rating;
                if (rating != null) {
                  weightedSum += rating * sim;
                  similaritySum += sim;

                }
      

              });
            }

            console.log(weightedSum / similaritySum)
            setPrediction(weightedSum / similaritySum);

          })

   

         

          // console.log(stars)



        }


        }
        // let stars = (weightedSum / similaritySum);
        // console.log(stars)
      }

  // for (var i = 0; i < data.titles.length; i++) {
  //   var title = data.titles[i];
  //   if (user[title] == null) {
  //     var k = 5;
  //     var weightedSum = 0;
  //     var similaritySum = 0;
  //     for (var j = 0; j < k; j++) {
  //       var name = data.users[j].name;
  //       var sim = similarityScores[name];
  //       var ratings = data.users[j];
  //       var rating = ratings[title];
  //       if (rating != null) {
  //         weightedSum += rating * sim;
  //         similaritySum += sim;
  //       }
  //     }

    const euclideanDistance = (user, user2, games)=> {
      // console.log(user)
     
      // console.log(user2)

      var sumSquares = 0;

      for (let i = 0; i < games.length; i++) {
        let game = games[i];
        // console.log(game)
        
        let docs =  db.collection("reviews").where(`gameID`,`==`, game).where(`user`, `==`, user);

        let docs2 =  db.collection("reviews").where(`gameID`,`==`, game).where(`user`, `==`, user2);


        let rating1 = null;
        let rating2 = null;
        docs.get().then(querySnapshot => {
          // console.log("rating1 " + querySnapshot.size)
          if(querySnapshot.size>0){

            querySnapshot.forEach(doc => {
              rating1 = doc.data().rating;
              // console.log(doc.data());

            });
          }
        })
        // console.log(rating1)

        docs2.get().then(querySnapshot => {
          // console.log("rating2 " + querySnapshot.size)

          if(querySnapshot.size>0){
            querySnapshot.forEach(doc => {
              rating2 = doc.data().rating;
              // console.log(doc.data().rating)
            });
          }
        })
        // console.log(rating2)

      //  console.log( rating1)
      //  console.log( rating2)

        if (rating1 != null && rating2 != null) {
          // console.log("here")
          var diff = rating1 - rating2;
          sumSquares += diff * diff;
        }


      }

      var d = Math.sqrt(sumSquares);

      var similarity = 1 / (1 + d);
      return similarity;
        
      







    }

    // const euclideanDistance2 = (ratings1, ratings2)=> {
    //   var titles = data.titles;
    
    //   var sumSquares = 0;
    //   for (var i = 0; i < titles.length; i++) {
    //     var title = titles[i];
    //     var rating1 = ratings1[title];
    //     var rating2 = ratings2[title];
    //     if (rating1 != null && rating2 != null) {
    //       var diff = rating1 - rating2;
    //       sumSquares += diff * diff;
    //     }
    //   }
    //   var d = sqrt(sumSquares);
    
    //   var similarity = 1 / (1 + d);
    //   return similarity;
    // }

    





    let { id } = useParams();
    useEffect(() => {
       //This is going to be somewhere else
    
      
      // db.collection("reviews").onSnapshot((snapshot) => {
      //   snapshot.docs.map((doc) =>{

          
      //     if(!users.includes(doc.data().user)){
      //     users.push(doc.data().user);
      //     }

      //     if(!games.includes(doc.data().gameID)){
      //       games.push(doc.data().gameID);
      //     }

          


      //   }
      //   )

    

      // });
      // findNearestNeighbors(sub);
      let users = [];
      let games = [];
      db.collection("reviews").onSnapshot((snapshot) =>
      {
        
           users = snapshot.docs.map((doc) => (doc.data().user)).filter((value, index, self) => self.indexOf(value) === index);
           console.log(users);
  
          games = (snapshot.docs.map((doc) => (doc.data().gameID)).filter((value, index, self) => self.indexOf(value) === index))
          console.log(games)
  
          findNearestNeighbors(sub, users, games);

      })



      db.collection("reviews").where(`gameID`,`==`, id).where(`user`, `==`, sub).onSnapshot((snapshot) =>{

        if(snapshot.docs.length>0){

          setRating(snapshot.docs[0].data().rating);
          setRatingHide(false)
          setPredictHide(true)

        }else{
          setRating(0);
          setRatingHide(true)
          setPredictHide(false)

        }

        // setRating(snapshot.docs.length>0 ? snapshot.docs[0].data().rating : 0);
        
        });
      
      

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
    // console.log(game)

    const genres =  data[0].genres.toString()
    const platforms = data[0].platforms.toString()

    const videoId = data[0].videos[0];
    // const artwork = data[0].artworks[0];

    const similarGames = JSON.stringify(game.similar_games).replace("[","(" ).replace("]",")").replace(/['"]+/g, '') ;
    console.log(similarGames)

    let artwork = null;
    if(data[0].artworks){
     artwork = data[0].artworks[0];

    }

setGameName(game.name)
setSummary(game.summary)
setCriticRating(game.aggregated_rating);
setCriticCount(game.aggregated_rating_count	)
// console.log(game.aggregated_rating)


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
     `fields *; where id = ${similarGames} ;`
  
   }
  
  
    
  ).then((response) => response.json())
  .then((data) =>{
    setSimilarGames(data)

  })

fetch(
    proxyurl+
    `https://api.igdb.com/v4/genres`,
   
   {    
     method: 'POST',

     headers: {
       'Client-ID': `ozi5hp5ssdlwirs85n2deu5f4rtnm0`,
       Authorization: `Bearer ${token}`,

 
       'Access-Control-Allow-Origin' : '*',

       
     },
     body:
     `fields name; where id = (${genres});`

   }
   ).then((response) => response.json())
   .then((data) => {
setGenres(data)
  })


  fetch(
    proxyurl+
    `https://api.igdb.com/v4/platforms`,
   
   {    
     method: 'POST',

     headers: {
       'Client-ID': `ozi5hp5ssdlwirs85n2deu5f4rtnm0`,
       Authorization: `Bearer ${token}`,

 
       'Access-Control-Allow-Origin' : '*',

       
     },
     body:
     `fields name; where id = (${platforms});`

   }
   ).then((response) => response.json())
   .then((data) => {
setPlatforms(data)
  })


    

  fetch(
    proxyurl+
    `https://api.igdb.com/v4/game_videos`,
   
   {    
     method: 'POST',

     headers: {
       'Client-ID': `ozi5hp5ssdlwirs85n2deu5f4rtnm0`,
       Authorization: `Bearer ${token}`,

 
       'Access-Control-Allow-Origin' : '*',

       
     },
     body:
     `fields video_id; where id = (${videoId});`

   }
   ).then((response) => response.json())
   .then((data) => {

setVideo(data[0].video_id)
})
if(artwork){
fetch(
    proxyurl+
    `https://api.igdb.com/v4/artworks`,
   
   {    
     method: 'POST',

     headers: {
       'Client-ID': `ozi5hp5ssdlwirs85n2deu5f4rtnm0`,
       Authorization: `Bearer ${token}`,

 
       'Access-Control-Allow-Origin' : '*',

       
     },
     body:
     `fields url; where id = (${artwork});`

   }
   ).then((response) => response.json())
   .then((data) => {

setArtwork(data[0].url.replace("thumb", "1080p"));
})
}else{
  setArtwork(`https://media-assets-02.thedrum.com/cache/images/thedrum-prod/s3-news-tmp-145688-anzu--default--1080.png`)
}


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

      if(metadata){
      const gamesArray = metadata.games

      if(gamesArray){
      setMyGames(gamesArray);

      if(gamesArray.includes(id)){
        setChecked(true)
        // console.log("Setting to true")
      }else{
        setChecked(false)
        // console.log("Setting to false")

      }
     
    }
  }
      
  } catch (e) {
    console.log(e.message);
  }
};

getUserMetadata();



db.collection("reviews").where(`gameID`,`==`, id).where(`user`, `==`, sub).onSnapshot((snapshot) =>{

  if(snapshot.docs.length>0){

    setRating(snapshot.docs[0].data().rating);
    setRatingHide(false)
    setPredictHide(true)

  }else{
    setRating(0);
    setRatingHide(true)
    setPredictHide(false)

  }

  // setRating(snapshot.docs.length>0 ? snapshot.docs[0].data().rating : 0);
  
  });
})

})






}, []);
const MoviePalyerModal = (props) => {
  // console.log(users)
  // console.log(games)

    const youtubeUrl = "https://www.youtube.com/watch?v=";
    return (
      <Modal
        {...props}
        size="lg"
        aria-labelledby="contained-modal-title-vcenter"
        centered
      >
        <Modal.Header closeButton>
          <Modal.Title
            id="contained-modal-title-vcenter"
            style={{ color: "#000000", fontWeight: "bolder" }}
          >
            {gameName}
          </Modal.Title>
        </Modal.Header>
        <Modal.Body style={{ backgroundColor: "#000000" }}>
          <ReactPlayer
            className="container-fluid"
            url={youtubeUrl + video}
            playing
            width="100%"
          ></ReactPlayer>
        </Modal.Body>
      </Modal>
    );
  };

let genresList;
if (genres) {
  genresList = genres.map((g, i) => {
    return (
      <li className="list-inline-item" key={i}>
        <button type="button" className="btn btn-outline-info">
          {g.name}
        </button>
      </li>
    );
  });
}
return (
    

           <div className="container">
            <div className="row mt-2">
        <MoviePalyerModal
          show={isOpen}
          onHide={() => {
            setIsOpen(false);
          }}
        >

        </MoviePalyerModal>

        <div className="col text-center" style={{ width: "100%" }}>
        <div className="A" style={{ zIndex: "-10", position : "relative" }}> 
          <img
            className="img-fluid"
            src={artwork}
            alt={gameName}
          ></img>
</div>
          <div className="carousel-center">
            <i
              onClick={() => setIsOpen(true)}
              className="far fa-play-circle"
              style={{ fontSize: 95, color: "#f4c10f", cursor: "pointer",  position:'absolute' , marginTop: -400} }
            ></i>
          </div> 
          <div
            className="carousel-caption"
            style={{ textAlign: "center", fontSize: 35}}
          >
            {gameName}
          </div>
        </div>
      </div>


    <div className="row mt-3">
        <div className="col">
          <p style={{ color: "#5a606b", fontWeight: "bolder" }}>GENRE</p>
          <div className="row mt-3">
        <div className="col">
          <ul className="list-inline">{genresList}</ul>
        </div>
      </div>
        </div>

        <div className="col">
        <p style={{ color: "#5a606b", fontWeight: "bolder" }}>MY GAMES</p>
        <Switch onChange={handleChange} checked={checked} />
        </div>
        
        
      </div>

      <div className="col">

      <div className="row mt-3" hidden={ratingHide}>
        
      <p style={{ color: "#5a606b", fontWeight: "bolder" }}>MY RATING</p>
      <div className="row mt-3">
        
            <StarRatings
            rating ={rating}
            changeRating= {changeRating}
            starRatedColor	= {"purple"}
          
            />
          </div>
          </div>
                <div className="col">

          <div className="row mt-3" hidden={predictHid}>

          <p style={{ color: "#5a606b", fontWeight: "bolder" }}>PREDICTED RATING</p>
          
          <StarRatings
            rating ={prediction}
            starRatedColor	= {"grey"}
            isSelectable = {false}
          
            />

          </div>

          </div>

      </div>

      <div className="row mt-3">
        <div className="col">
          <div className="mt-3">
            <p style={{ color: "#5a606b", fontWeight: "bolder" }}>SUMMARY</p>
            {summary}
          </div>
        </div>
      </div>
          

      <div className="row mt-3">
        <div className="col-md-3">
          <p style={{ color: "#5a606b", fontWeight: "bolder" }}>RELEASE DATE</p>
          <p style={{ color: "#f4c10f" }}>{prediction}</p>
        </div>
        <div className="col-md-3">
          <p style={{ color: "#5a606b", fontWeight: "bolder" }}>RUN TIME</p>
          <p style={{ color: "#f4c10f" }}>{criticCount}</p>
        </div>
        <div className="col-md-3">
          <p style={{ color: "#5a606b", fontWeight: "bolder" }}>BUDGET</p>
          <p style={{ color: "#f4c10f" }}>{criticCount}</p>
        </div>
        <div className="col-md-3">
          <p style={{ color: "#5a606b", fontWeight: "bolder" }}>HOMEPAGE</p>
          <p style={{ color: "#f4c10f" }}>{criticCount}</p>
        </div>
      </div>

      <div className="row mt-3">
        <div className="col">
          <p style={{ color: "#5a606b", fontWeight: "bolder" }}>SIMILAR GAMES</p>
        </div>
      </div>
<Carousel centerMode={true} centerSlidePercentage="40" showThumbs={false} useKeyboardArrows = {true}> 
  
      {similarGames.length > 0 && similarGames.map((game) => (
          <Game key ={game.id} {...game}/>
        ))}
        
</Carousel>



      <div className="row mt-3">
        <div className="col">
          <p style={{ color: "#5a606b", fontWeight: "bolder" }}>
            SIMILAR MOVIES
          </p>
        </div>
      </div>

      <div className="row mt-3">{criticCount}</div>

      <hr className="mt-5" style={{ borderTop: "1px solid #5a606b" }}></hr>

      <div className="row mt-3 mb-5">
        <div className="col-md-8 col-sm-6" style={{ color: "#5a606b" }}>
          <h3>ABOUT ME</h3>
          <p>
            Lorem ipsum dolor sit, amet consectetur adipisicing elit. Animi
            error earum perspiciatis praesentium sint ipsum provident blanditiis
            pariatur necessitatibus voluptas, cum, atque iste eligendi autem,
            culpa cupiditate placeat facilis repellat.
          </p>
          <p>
            Lorem ipsum dolor sit amet consectetur adipisicing elit. Minus,
            perspiciatis? Numquam, enim illo voluptatum neque facere aut sed ut
            dolore nihil? Nulla sit, recusandae ea tenetur rerum deserunt sequi
            earum?
          </p>
          <ul className="list-inline">
            <li className="list-inline-item">
              <a href="/" style={{ color: "#f4c10f" }}>
                <i className="fab fa-facebook"></i>
              </a>
            </li>
            <li className="list-inline-item">
              <a href="/" style={{ color: "#f4c10f" }}>
                <i className="fab fa-youtube"></i>
              </a>
            </li>
            <li className="list-inline-item">
              <a href="/" style={{ color: "#f4c10f" }}>
                <i className="fab fa-twitter"></i>
              </a>
            </li>
            <li className="list-inline-item">
              <a href="/" style={{ color: "#f4c10f" }}>
                <i className="fab fa-instagram"></i>
              </a>
            </li>
          </ul>
        </div>
        <div className="col-md-4 col-sm-6" style={{ color: "#5a606b" }}>
          <h3>KEEP IN TOUCH</h3>
          <ul className="list-unstyled">
            <li>
              <p>
                <strong>
                  <i className="fas fa-map-marker-alt"></i> Address:
                </strong>{" "}
                city, state, country
              </p>
            </li>
            <li>
              <p>
                <strong>
                  <i className="fas fa-map-marker-alt"></i> Phone:
                </strong>{" "}
                +01 00 00 00
              </p>
            </li>
            <li>
              <p>
                <strong>
                  <i className="fas fa-envelope"></i> Email:
                </strong>{" "}
                info@infomail.com
              </p>
            </li>
          </ul>
        </div>
      </div> 
    </div>
       


  );






};

export default withAuthenticationRequired(GameDetails, {
    onRedirecting: () => <Loading />,
  });
