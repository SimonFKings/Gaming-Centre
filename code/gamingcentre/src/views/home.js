import React, { Fragment, useEffect } from "react";
import { Loading } from "../components";
import { Hero, HomeContent } from "../components";
import CreatePost from '../components/createPost'
import Feed from '../components/feed'
import { useAuth0, withAuthenticationRequired } from "@auth0/auth0-react";

const Home = () => {


  

  return (


  <Fragment>
<CreatePost/>
<Feed />
  </Fragment>

  )
};

export default withAuthenticationRequired(Home, {
  onRedirecting: () => <Loading />,
});