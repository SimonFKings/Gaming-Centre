import React, { useEffect, useState } from "react";

import { useAuth0, withAuthenticationRequired } from "@auth0/auth0-react";
import { Loading } from "../components";
import { useParams } from "react-router";
import { Container, Row, Col } from 'reactstrap';
import { Modal } from "react-bootstrap";
import ReactPlayer from "react-player";
import ReactStars from "react-rating-stars-component";




const GameDetails = (props) => {

    
    
    const [ name , setName] = useState([]);
    const [ summary , setSummary] = useState([]);
    const [ criticRatings , setCriticRating] = useState([]);
    const [ criticCount , setCriticCount] = useState([]);
    const [ image , setImage] = useState([]);
    const [ genres , setGenres] = useState([]);
    const [ platforms , setPlatforms] = useState([]);
    const [ video , setVideo] = useState([]);
    const [isOpen, setIsOpen] = useState(false);
    const [artwork, setArtwork] = useState([]);













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
    console.log(game)

    const genres =  data[0].genres.toString()
    const platforms = data[0].platforms.toString()

    const videoId = data[0].videos[0];
    const artwork = data[0].artworks[0];



setName(game.name)
setSummary(game.summary)
setCriticRating(game.aggregated_rating);
setCriticCount(game.aggregated_rating_count	)
console.log(game.aggregated_rating)


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

console.log(data[0].video_id)  
setVideo(data[0].video_id)
})

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

console.log(data[0].url)  
setArtwork(data[0].url.replace("thumb", "1080p"))
})

})

})
}, []);
const MoviePalyerModal = (props) => {
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
            {name}
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
            alt={name}
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
            {name}
          </div>
        </div>
      </div>

    <div className="row mt-3">
        <div className="col">
          <p style={{ color: "#5a606b", fontWeight: "bolder" }}>GENRE</p>
        </div>
      </div>

      <div className="row mt-3">
        <div className="col">
          <ul className="list-inline">{genresList}</ul>
        </div>
      </div>

      <div className="row mt-3">
        <div className="col">
          <div className="text-center">
            <ReactStars
              number={criticRatings}
              size={20}
              color1={"#f4c10f"}
            ></ReactStars>
          </div>
          <div className="mt-3">
            <p style={{ color: "#5a606b", fontWeight: "bolder" }}>SUMMARY</p>
            {summary}
          </div>
        </div>
      </div>
          

      <div className="row mt-3">
        <div className="col-md-3">
          <p style={{ color: "#5a606b", fontWeight: "bolder" }}>RELEASE DATE</p>
          <p style={{ color: "#f4c10f" }}>{criticCount}</p>
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
          <p style={{ color: "#5a606b", fontWeight: "bolder" }}>CASTS</p>
        </div>
      </div>
      <div className="row mt-3">{criticCount}</div>

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
       
/* <Container>
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
        <Row>


       <h5>Genres: </h5>{genres.length > 0 && genres.map((genre) => (
            <h6 key = {genre.id}>{genre.name + ", "}</h6>
        ))}
        </Row>
        <Row>


<h5>Platforms: </h5>{platforms.length > 0 && platforms.map((platform) => (
     <h6 key = {platform.id}>{platform.name + ", "}</h6>
 ))}
 </Row>
 <h5>Critics:</h5>
        <span> {criticRatings}  out of {criticCount} ratings</span>
        </Col>
      </Row>
</Container> */





  );






};

export default withAuthenticationRequired(GameDetails, {
    onRedirecting: () => <Loading />,
  });
