import React from "react";
import { Link, Route, Switch } from "react-router-dom";
import { Button } from "react-bootstrap";
import Header from "./Header";
import SignUp from "../routes/SignUp";
import Board from "../routes/Board";
import Write from "../routes/Write";
import "../css/AppRouter.css";

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

          <Button variant="primary" as={Link} to="/board1">
            Board1
          </Button>

          <Button variant="primary" as={Link} to="/board2">
            Board2
          </Button>
        </div>

        <div>
          <Switch>
            <Route exact path="/"></Route>
            <Route path="/board1" component={Board}></Route>
            <Route path="/board2" component={Board}></Route>
            <Route path="/signup" component={SignUp}></Route>
            <Route path="/:id&write" component={Write}></Route>
          </Switch>
        </div>
      </div>
    </div>
  );
};

export default AppRouter;
