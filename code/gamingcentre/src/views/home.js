import React, { Fragment, useEffect } from "react";
import { Loading } from "../components";
import { Hero, HomeContent } from "../components";
import CreatePost from '../components/CreatePost'
import { useAuth0, withAuthenticationRequired } from "@auth0/auth0-react";

const Home = () => {


  

  return (


  <Fragment>
<CreatePost/>
  </Fragment>

  )
};

export default withAuthenticationRequired(Home, {
  onRedirecting: () => <Loading />,
});