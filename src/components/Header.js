import React, { useEffect, useState } from "react";
import { Button, Col, Form, FormControl, m, Nav, Row } from "react-bootstrap";
import { Link } from "react-router-dom";
import { authService } from "../fbase";

const Header = () => {
  const [check_log_in, set_check_log_in] = useState(false);

  const [signInForm, setSignInForm] = useState({
    email: null,
    passwrod: null,
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

  const onSubmit = (e) => {
    e.preventDefault();

    const { email, password } = signInForm;

    authService.signInWithEmailAndPassword(email, password);
  };

  const onSignOut = () => {
    authService.signOut();

    console.log(authService.currentUser);

    set_check_log_in(false);
  };

  useEffect(() => {
    authService.onAuthStateChanged((user) => {
      if (user) {
        set_check_log_in(true);
      }
    });
  }, []);

  return (
    <div>
      <div>
        <Nav>
          {check_log_in ? (
            <>
              <span>{authService.currentUser.email}</span>
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
                      type="email"
                      name="email"
                      placeholder="input email"
                      minLength="6"
                      required
                    />
                  </Col>
                  <Col>
                    <FormControl
                      onChange={onChange}
                      type="password"
                      name="password"
                      placeholder="input password"
                      minLength="6"
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
    </div>
  );
};

export default Header;
