import React, { useState } from "react";
import { useAuth0 } from "@auth0/auth0-react";

const ExternalApi = () => {
  const [message, setMessage] = useState("");

  const { getAccessTokenSilently } = useAuth0();

  const callApi = async () => {
    try {
      const response = await fetch(`https://dev-22x3u4l0.us.auth0.com/api/v2/users/google-oauth2%7C107476463422329654527`);

      const responseData = await response.json();

      setMessage(responseData.message);
    } catch (error) {
      setMessage(error.message);
    }
  };

  const callSecureApi = async () => {
    try {
      const token = await getAccessTokenSilently();

      const response = await fetch(
        // proxyurl+
         `https://dev-22x3u4l0.us.auth0.com/api/v2/users/google-oauth2|107476463422329654527`,
        
        {    
          // mode: "no-cors",

          headers: {
            Authorization: `Bearer ${token}`,
            // 'Access-Control-Allow-Origin' : '*',

            
          },
        }
      );
        console.log(response)
        console.log('responseData');

      const responseData = await response.json();

      console.log(responseData)

      setMessage(responseData.message);
    } catch (error) {
      setMessage(error.message);
    }
  };

  return (
    <div className="container">
      <h1>External API</h1>
      <p>
        Use these buttons to call an external API. The protected API call has an
        access token in its authorization header. The API server will validate
        the access token using the Auth0 Audience value.
      </p>
      <div
        className="btn-group mt-5"
        role="group"
        aria-label="External API Requests Examples"
      >
        <button type="button" className="btn btn-primary" onClick={callApi}>
          Get Public Message
        </button>
        <button
          type="button"
          className="btn btn-primary"
          onClick={callSecureApi}
        >
          Get Protected Message
        </button>
      </div>
      {message && (
        <div className="mt-5">
          <h6 className="muted">Result</h6>
          <div className="container-fluid">
            <div className="row">
              <code className="col-12 text-light bg-dark p-4">{message}</code>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ExternalApi;