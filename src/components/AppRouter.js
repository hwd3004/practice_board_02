import React from "react";
import { Link, Route, Switch } from "react-router-dom";
import { Button } from "react-bootstrap";
import Header from "./Header";
import SignUp from "../routes/SignUp";
import Board from "../routes/Board";
import Write from "../routes/Write";
import "../css/AppRouter.css";
import Post_Detail from "../routes/Post_Detail";

const AppRouter = () => {
  return (
    <div>
      <div id="AppRouter">
        <h1>게시판</h1>

        <Header />

        <div>
          <Button variant="primary" as={Link} to="/">
            Home
          </Button>

          <Button variant="primary" as={Link} to="/board1&page=1">
            Board1
          </Button>

          <Button variant="primary" as={Link} to="/board2&page=1">
            Board2
          </Button>
        </div>

        <div>
          <Switch>
            <Route exact path="/"></Route>
            <Route exact path="/board1&page=:id" component={Board}></Route>
            <Route exact path="/board2&page=:id" component={Board}></Route>
            <Route exact path="/signup" component={SignUp}></Route>
            <Route exact path="/:id&write" component={Write}></Route>
            <Route exact path="/:id/:id" component={Post_Detail}></Route>
          </Switch>
        </div>
      </div>
    </div>
  );
};

export default AppRouter;
