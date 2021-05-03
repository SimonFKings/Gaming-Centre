import React, { useEffect, useState } from "react";

import { useAuth0, withAuthenticationRequired } from "@auth0/auth0-react";
import { Loading } from "../components";

const EditProfile = () => {
  const { user } = useAuth0();
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [username, setUsername] = useState("");
  const [emailAddress, setEmail] = useState("");

  const { sub, given_name, family_name, nickname, email, picture } = user;

  useEffect(() => {
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
        setFirstName(
          responseData.user_metadata && responseData.user_metadata.firstName
            ? responseData.user_metadata.firstName
            : given_name
        );
        setLastName(
          responseData.user_metadata && responseData.user_metadata.lastName
            ? responseData.user_metadata.lastName
            : family_name
        );
        setUsername(
          responseData.user_metadata && responseData.user_metadata.username
            ? responseData.user_metadata.username
            : nickname
        );
        setEmail(
          responseData.user_metadata && responseData.user_metadata.emailAddress
            ? responseData.user_metadata.emailAddress
            : email
        );
      } catch (e) {
        console.log(e.message);
      }
    };
    getUserMetadata();
  }, []);

  const { getAccessTokenSilently } = useAuth0();

  const updateUser = async () => {
    let emailRegex = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;

    if (!emailAddress) {
      alert("Please enter an email");
    } else if (!username) {
      alert("Please enter an username");
    } else if (!emailRegex.test(emailAddress)) {
      alert("Please enter a valid email");
    } else {
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
                firstName: firstName,
                lastName: lastName,
                username: username,
                emailAddress: emailAddress,
              },
            }),
          }
        );

        const responseData = await response.json();
        console.log(responseData);
      } catch (error) {}
    }
  };

  return (
    <div className="row">
      <div class="col-md-4 border-right">
        <div class="d-flex flex-column align-items-center text-center p-3 py-5">
          <img
            src={picture}
            alt="Profile"
            className="rounded-circle img-fluid profile-picture mb-3 mb-md-0"
          />
        </div>
      </div>

      <div class="col-md-8">
        <div class="p-3 py-5">
          <div class="row mt-2">
            <div class="col-md-6">
              <label>
                <p>First Name</p>
                <input
                  name="name"
                  value={firstName}
                  onChange={(e) => setFirstName(e.target.value)}
                />
              </label>
            </div>
            <div class="col-md-6">
              <label>
                <p>Last Name</p>
                <input
                  name="name"
                  defaultValue={lastName}
                  onChange={(e) => setLastName(e.target.value)}
                />
              </label>
            </div>
          </div>
          <div class="row mt-3">
            <div class="col-md-6">
              <label>
                <p>Username</p>
                <input
                  name="name"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                />
              </label>
            </div>
            <div class="col-md-6">
              <label>
                <p>Email Address</p>
                <input
                  name="name"
                  value={emailAddress}
                  onChange={(e) => setEmail(e.target.value)}
                />
              </label>
            </div>
          </div>
          <div class="mt-5 text-right">
            <button
              className="btn btn-primary profile-button"
              type="button"
              onClick={updateUser}
            >
              Submit
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default withAuthenticationRequired(EditProfile, {
  onRedirecting: () => <Loading />,
});
