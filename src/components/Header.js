import React, { useEffect, useState } from "react";
import { Button, Col, Form, FormControl, Nav, Row } from "react-bootstrap";
import { connect } from "react-redux";
import { Link } from "react-router-dom";
import { authService, dbService } from "../fbase";

const Header = (props) => {
  console.log("Header props", props);
  const { dispatch } = props;

  const [check_log_in, set_check_log_in] = useState(false);
  const [get_nickname, set_get_nickname] = useState("");

  const [signInForm, setSignInForm] = useState({
    email: null,
    password: null,
  });

  const onChange = (e) => {
    const {
      target: { name, value },
    } = e;

    setSignInForm({
      ...signInForm,
      [name]: value,
    });
  };

  const onSubmit = async (e) => {
    e.preventDefault();

    const { email, password } = signInForm;

    try {
      authService.signInWithEmailAndPassword(email, password);
    } catch (error) {
      alert(error);
      console.log(error);
    }
  };

  const onSignOut = () => {
    authService.signOut();

    console.log(authService.currentUser);

    set_check_log_in(false);
  };

  useEffect(() => {
    authService.onAuthStateChanged(async (user) => {
      if (user) {
        set_check_log_in(true);

        const user_email = user.email;

        console.log(user_email);

        await dbService
          .collection("user_DB")
          .where("email", "==", user_email)
          .get()
          .then((data) => {
            data.forEach((doc) => {
              set_get_nickname(doc.data().nickname);
              dispatch({ type: "user_nickname", payload: doc.data().nickname });
            });
          });
      }
    });
  }, []);

  return (
    <div>
      <div>
        <Nav>
          {check_log_in ? (
            <>
              <span>{get_nickname}</span>
              <Button onClick={onSignOut} variant="outline-info">
                Sign Out
              </Button>
            </>
          ) : (
            <>
              <Form onSubmit={onSubmit}>
                <Row>
                  <Col>
                    <FormControl
                      onChange={onChange}
                      type="text"
                      name="email"
                      placeholder="input email"
                      required
                    />
                  </Col>
                  <Col>
                    <FormControl
                      onChange={onChange}
                      type="password"
                      name="password"
                      placeholder="input password"
                      required
                    />
                  </Col>
                  <Col>
                    <Button type="submmit" variant="outline-info">
                      Log In
                    </Button>
                  </Col>
                </Row>
              </Form>
              <Button as={Link} to="/signup" variant="outline-info">
                Sign up
              </Button>
            </>
          )}
        </Nav>
      </div>
      <br></br>
    </div>
  );
};

const getStore = (state) => {
  console.log("Header.js/getStore state", state);
};

export default connect(getStore)(Header);
