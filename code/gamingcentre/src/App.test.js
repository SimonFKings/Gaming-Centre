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

//App Compne
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
it("renders Game Details without crashing", () => {
  shallow(<GameDetails />);
});

it("renders 2 header", () => {
  const wrapper = shallow(<Home />);
  const welcome = <h1>Welcome to Game Centre</h1>;

  expect(wrapper.contains(welcome)).toEqual(true);
});

let container = null;
beforeEach(() => {
  // setup a DOM element as a render target
  container = document.createElement("div");
  document.body.appendChild(container);
});

afterEach(() => {
  // cleanup on exiting
  unmountComponentAtNode(container);
  container.remove();
  container = null;
});
