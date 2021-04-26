import React, { useEffect, useState } from "react";

import { useAuth0, withAuthenticationRequired } from "@auth0/auth0-react";
import { Loading } from "../components";
import { useParams } from "react-router";
import { Container, Row, Col } from "reactstrap";
import { Modal } from "react-bootstrap";
import ReactPlayer from "react-player";
import ReactStars from "react-rating-stars-component";
import StarRatings from "react-star-ratings";

import Switch from "react-switch";
import { db } from "../firebase";
// import Carousel from 'react-elastic-carousel';
import Game from "../components/Game";
import "pure-react-carousel/dist/react-carousel.es.css";
import "react-responsive-carousel/lib/styles/carousel.min.css"; // requires a loader
import { Carousel } from "react-responsive-carousel";

const GameDetails = (props) => {
  const [gameName, setGameName] = useState([]);
  const [summary, setSummary] = useState([]);
  const [criticRatings, setCriticRating] = useState([]);
  const [criticCount, setCriticCount] = useState([]);
  const [image, setImage] = useState([]);
  const [genres, setGenres] = useState([]);
  const [platforms, setPlatforms] = useState([]);
  const [video, setVideo] = useState([]);
  const [isOpen, setIsOpen] = useState(false);
  const [artwork, setArtwork] = useState([]);
  const [checked, setChecked] = useState(false);
  const [myGames, setMyGames] = useState([]);
  const [rating, setRating] = useState(0);
  const [ratingHide, setRatingHide] = useState(true);
  const [predictHid, setPredictHide] = useState(true);
  const [similarGames, setSimilarGames] = useState([]);
  const [prediction, setPrediction] = useState(0);
  const [storyline, setStoryline] = useState(0);

  const { user } = useAuth0();
  const { name, picture, email, sub } = user;

  const { getAccessTokenSilently } = useAuth0();

  //When a user adds or removes a game from their list
  const handleChange = () => {
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
        if (responseData.user_metadata && responseData.user_metadata.games) {
          setMyGames(responseData.user_metadata.games);
        }
      } catch (e) {
        console.log(e.message);
      }

      //Remove the game from their list
      if (checked) {
        const index = myGames.indexOf(id);

        if (index !== -1) {
          myGames.splice(index, 1);
          setChecked(false);
        }
      } else {
        //Add the games to their list
        if (myGames) {
          if (!myGames.includes(id)) {
            myGames.push(id);
            setChecked(true);
          } else {
            myGames.push(id);
            setChecked(true);
          }
          //Send the list back to the server
          try {
            const token = await getAccessTokenSilently();

            const response = await fetch(
              `https://dev-22x3u4l0.us.auth0.com/api/v2/users/` + sub,
              {
                method: "PATCH",
                headers: {
                  Authorization: `Bearer ${token}`,
                  "Content-Type": "application/json",
                },
                body: JSON.stringify({
                  user_metadata: {
                    games: myGames,
                  },
                }),
              }
            );

            const responseData = await response.json();
          } catch (error) {}
        }
      }
    };
    updateGames();
  };

  //When a user sets a rating for the game
  const changeRating = (newRating) => {
    let docs = db
      .collection("reviews")
      .where(`gameID`, `==`, id)
      .where(`user`, `==`, sub);

    docs.get().then((querySnapshot) => {
      //if they have not rated the game before, set the rating
      if (querySnapshot.size === 0) {
        db.collection("reviews").add({
          gameID: id,
          rating: newRating,
          user: sub,
        });
      } else {
        //If game already rated, update rating
        querySnapshot.forEach((doc) => {
          doc.ref.update({
            rating: newRating,
          });
        });
      }
    });

    setRating(newRating);
  };

  const findNearestNeighbors = (user, users, games) => {
    var similarityScores = {};

    for (let i = 0; i < users.length; i++) {
      let other = users[i];
      if (other != user) {
        const similarity = euclideanDistance(user, other, games);

        similarityScores[other] = similarity;
      }
    }

    users.sort(compareSimilarity);

    function compareSimilarity(a, b) {
      var score1 = similarityScores[a];
      var score2 = similarityScores[b];
      return score2 - score1;
    }

    var k = 5;
    let weightedSum = 0;
    let similaritySum = 0;

    for (let i = 0; i < k; i++) {
      const user = users[i];
      var sim = similarityScores[user];

      if (user != null) {
        let docs = db
          .collection("reviews")
          .where(`gameID`, `==`, id)
          .where(`user`, `==`, user);

        docs.get().then((querySnapshot) => {
          if (querySnapshot.size > 0) {
            querySnapshot.forEach((doc) => {
              let rating = doc.data().rating;
              if (rating != null) {
                weightedSum += rating * sim;
                similaritySum += sim;
              }
            });
          }

          if (weightedSum / similaritySum) {
            setPrediction(weightedSum / similaritySum);
            return true;
          } else {
            return false;
          }
        });
      }
    }
  };

  const euclideanDistance = (user, user2, games) => {
    var sumSquares = 0;

    for (let i = 0; i < games.length; i++) {
      let game = games[i];

      let docs = db
        .collection("reviews")
        .where(`gameID`, `==`, game)
        .where(`user`, `==`, user);

      let docs2 = db
        .collection("reviews")
        .where(`gameID`, `==`, game)
        .where(`user`, `==`, user2);

      let rating1 = null;
      let rating2 = null;
      docs.get().then((querySnapshot) => {
        if (querySnapshot.size > 0) {
          querySnapshot.forEach((doc) => {
            rating1 = doc.data().rating;
          });
        }
      });

      docs2.get().then((querySnapshot) => {
        if (querySnapshot.size > 0) {
          querySnapshot.forEach((doc) => {
            rating2 = doc.data().rating;
          });
        }
      });

      if (rating1 != null && rating2 != null) {
        var diff = rating1 - rating2;
        sumSquares += diff * diff;
      }
    }

    var d = Math.sqrt(sumSquares);

    var similarity = 1 / (1 + d);
    return similarity;
  };

  let { id } = useParams();
  useEffect(() => {
    //Get the review for this game by the user
    db.collection("reviews")
      .where(`gameID`, `==`, id)
      .where(`user`, `==`, sub)
      .onSnapshot((snapshot) => {
        //If the review exist show it
        if (snapshot.docs.length > 0) {
          setRating(snapshot.docs[0].data().rating);
          setRatingHide(false);
          setPredictHide(true);
        } else {
          //If rating does not exist
          let users = [];
          let games = [];
          db.collection("reviews").onSnapshot((snapshot) => {
            users = snapshot.docs
              .map((doc) => doc.data().user)
              .filter((value, index, self) => self.indexOf(value) === index);

            games = snapshot.docs
              .map((doc) => doc.data().gameID)
              .filter((value, index, self) => self.indexOf(value) === index);

            //Check if the game has been rated by other users
            if (games.includes(id)) {
              //If fnn is calcualted show the predicted rating
              if (findNearestNeighbors(sub, users, games)) {
                setRating(0);
                setRatingHide(true);
                setPredictHide(false);

                //If not show a blank rating
              } else {
                setRating(0);
                setRatingHide(false);
                setPredictHide(true);
              }
            } else {
              setRating(0);
              setRatingHide(false);
              setPredictHide(true);
            }
          });
        }
      });

    fetch(
      `https://id.twitch.tv/oauth2/token?client_id=ozi5hp5ssdlwirs85n2deu5f4rtnm0&client_secret=4fg8qly9eqv7kwu9pib34ydk31zxf0&grant_type=client_credentials`,
      {
        method: "POST",
      }
    )
      .then((response) => response.json())
      .then((data) => {
        const token = data.access_token;
        const proxyurl = "https://cors-anywhere.herokuapp.com/";

        fetch(proxyurl + `https://api.igdb.com/v4/games`, {
          method: "POST",
          headers: {
            "Client-ID": `ozi5hp5ssdlwirs85n2deu5f4rtnm0`,
            Authorization: `Bearer ${token}`,
            "Access-Control-Allow-Origin": "*",
          },
          body: "fields *; where id =" + id + " ;",
        })
          .then((response) => response.json())
          .then((data) => {
            const game = data[0];

            const genres = data[0].genres.toString();
            const platforms = data[0].platforms.toString();

            const videoId = data[0].videos[0];

            const similarGames = JSON.stringify(game.similar_games)
              .replace("[", "(")
              .replace("]", ")")
              .replace(/['"]+/g, "");

            let artwork = null;
            if (data[0].artworks) {
              artwork = data[0].artworks[0];
            }

            setGameName(game.name);
            setSummary(game.summary);
            setCriticRating(game.aggregated_rating);
            setCriticCount(game.aggregated_rating_count);
            setStoryline(game.storyline);

            fetch(
              proxyurl + `https://api.igdb.com/v4/covers`,

              {
                method: "POST",

                headers: {
                  "Client-ID": `ozi5hp5ssdlwirs85n2deu5f4rtnm0`,
                  Authorization: `Bearer ${token}`,

                  "Access-Control-Allow-Origin": "*",
                },
                body: `fields url; where id = ${game.cover};`,
              }
            )
              .then((response) => response.json())
              .then((data) => {
                const url = data[0].url.replace("thumb", "1080p");

                setImage(url);
              });
            fetch(proxyurl + `https://api.igdb.com/v4/games`, {
              method: "POST",
              headers: {
                "Client-ID": `ozi5hp5ssdlwirs85n2deu5f4rtnm0`,
                Authorization: `Bearer ${token}`,
                "Access-Control-Allow-Origin": "*",
              },
              body: `fields *; where id = ${similarGames} ;`,
            })
              .then((response) => response.json())
              .then((data) => {
                setSimilarGames(data);
              });

            fetch(
              proxyurl + `https://api.igdb.com/v4/genres`,

              {
                method: "POST",

                headers: {
                  "Client-ID": `ozi5hp5ssdlwirs85n2deu5f4rtnm0`,
                  Authorization: `Bearer ${token}`,

                  "Access-Control-Allow-Origin": "*",
                },
                body: `fields name; where id = (${genres});`,
              }
            )
              .then((response) => response.json())
              .then((data) => {
                setGenres(data);
              });

            fetch(
              proxyurl + `https://api.igdb.com/v4/platforms`,

              {
                method: "POST",

                headers: {
                  "Client-ID": `ozi5hp5ssdlwirs85n2deu5f4rtnm0`,
                  Authorization: `Bearer ${token}`,

                  "Access-Control-Allow-Origin": "*",
                },
                body: `fields name; where id = (${platforms});`,
              }
            )
              .then((response) => response.json())
              .then((data) => {
                setPlatforms(data);
              });

            fetch(
              proxyurl + `https://api.igdb.com/v4/game_videos`,

              {
                method: "POST",

                headers: {
                  "Client-ID": `ozi5hp5ssdlwirs85n2deu5f4rtnm0`,
                  Authorization: `Bearer ${token}`,

                  "Access-Control-Allow-Origin": "*",
                },
                body: `fields video_id; where id = (${videoId});`,
              }
            )
              .then((response) => response.json())
              .then((data) => {
                setVideo(data[0].video_id);
              });
            if (artwork) {
              fetch(
                proxyurl + `https://api.igdb.com/v4/artworks`,

                {
                  method: "POST",

                  headers: {
                    "Client-ID": `ozi5hp5ssdlwirs85n2deu5f4rtnm0`,
                    Authorization: `Bearer ${token}`,

                    "Access-Control-Allow-Origin": "*",
                  },
                  body: `fields url; where id = (${artwork});`,
                }
              )
                .then((response) => response.json())
                .then((data) => {
                  setArtwork(data[0].url.replace("thumb", "1080p"));
                });
            } else {
              setArtwork(
                `https://media-assets-02.thedrum.com/cache/images/thedrum-prod/s3-news-tmp-145688-anzu--default--1080.png`
              );
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

                if (metadata) {
                  const gamesArray = metadata.games;

                  if (gamesArray) {
                    setMyGames(gamesArray);

                    if (gamesArray.includes(id)) {
                      setChecked(true);
                    } else {
                      setChecked(false);
                    }
                  }
                }
              } catch (e) {
                console.log(e.message);
              }
            };

            getUserMetadata();
          });
      });
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
        ></MoviePalyerModal>

        <div className="col text-center" style={{ width: "100%" }}>
          <div className="A" style={{ zIndex: "-10", position: "relative" }}>
            <img className="img-fluid" src={artwork} alt={gameName}></img>
          </div>
          <div className="carousel-center">
            <i
              onClick={() => setIsOpen(true)}
              className="far fa-play-circle"
              style={{
                fontSize: 95,
                color: "#f4c10f",
                cursor: "pointer",
                position: "absolute",
                marginTop: -400,
              }}
            ></i>
          </div>
          <div
            className="carousel-caption"
            style={{ textAlign: "center", fontSize: 35 }}
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
              rating={rating}
              changeRating={changeRating}
              starRatedColor={"purple"}
            />
          </div>
        </div>
        <div className="col">
          <div className="row mt-3" hidden={predictHid}>
            <p style={{ color: "#5a606b", fontWeight: "bolder" }}>
              PREDICTED RATING
            </p>

            <StarRatings
              rating={prediction}
              starRatedColor={"grey"}
              isSelectable={false}
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
        <div className="col">
          <p style={{ color: "#5a606b", fontWeight: "bolder" }}>
            SIMILAR GAMES
          </p>
        </div>
      </div>
      <Carousel
        centerMode={true}
        centerSlidePercentage="40"
        showThumbs={false}
        useKeyboardArrows={true}
      >
        {similarGames.length > 0 &&
          similarGames.map((game) => <Game key={game.id} {...game} />)}
      </Carousel>

      <div className="row mt-3">
        <div className="col">
          <div className="mt-3">
            <p style={{ color: "#5a606b", fontWeight: "bolder" }}>STORYLINE</p>
            {storyline}
          </div>
        </div>
      </div>
    </div>
  );
};

export default withAuthenticationRequired(GameDetails, {
  onRedirecting: () => <Loading />,
});
