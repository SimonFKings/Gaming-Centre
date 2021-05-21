import React from "react";
import { shallow, mount } from "enzyme";
import App from "./App";
import Adapter from "enzyme-adapter-react-16";
import "../src/setupTest";
import "./firebase";
import { GameDetails, Games, Home, Profile } from "./views";
import Game from "./components/Game";
import CreatePost from "./components/createPost";
import games from "./views/games";
import { unmountComponentAtNode } from "react-dom";
import CommentInput from "./components/commentinput";

it("renders Home without crashing", () => {
  shallow(<Home />);
});
it("renders Profile without crashing", () => {
  shallow(<Profile />);
});
it("renders Game without crashing", () => {
  shallow(<Game />);
});
it("renders Games without crashing", () => {
  shallow(<Games />);
});
it("renders Game Details without crashing", () => {
  shallow(<GameDetails />);
});

it("renders Game component summary", () => {
  const wrapper = shallow(<Game />);
  const welcome = <h3> Summary:</h3>;

  expect(wrapper.contains(welcome)).toEqual(true);
});
