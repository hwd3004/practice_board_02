import React from "react";
import ReactDOM from "react-dom";
import App from "./components/App";
import { BrowserRouter } from "react-router-dom";
import { Provider } from "react-redux";
import { combineReducers, createStore } from "redux";

const user_nickname_reducer = (state = null, action) => {
  const { type, payload } = action;

  if (type === "user_nickname") {
    return payload;
  } else {
    return state;
  }
};

const store = createStore(combineReducers({ user_nickname_reducer }));

ReactDOM.render(
  <BrowserRouter>
    <Provider store={store}>
      <App />
    </Provider>
  </BrowserRouter>,
  document.getElementById("root")
);
