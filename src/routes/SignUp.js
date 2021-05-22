import moment from "moment";
import React, { useState } from "react";
import { Form, FormControl, Button } from "react-bootstrap";
import { useHistory } from "react-router";
import { authService, dbService } from "../fbase";

const SignUp = () => {
  const history = useHistory();

  const [signUpForm, setSignUpForm] = useState({
    email: null,
    nickname: null,
    passwrod: null,
  });

  const onChange = (e) => {
    const {
      target: { name, value },
    } = e;
    console.log(`name - ${name}, value - ${value}`);

    setSignUpForm({
      ...signUpForm,
      [name]: value,
    });
  };

  const onSubmit = async (e) => {
    e.preventDefault();

    const { email, nickname, password } = signUpForm;

    const check_exist_email = await dbService
      .collection("user_DB")
      .where("email", "==", email)
      .get();

    const check_exist_nickname = await dbService
      .collection("user_DB")
      .where("nickname", "==", nickname)
      .get();

    let already_use_email;
    let already_use_nickname;

    await check_exist_nickname.forEach((doc) => {
      already_use_nickname = doc.data().nickname;
    });

    await check_exist_email.forEach((doc) => {
      already_use_email = doc.data().email;
    });

    if (already_use_nickname) {
      alert("already use nickname");
      return false;
    } else if (already_use_email) {
      alert("already use email");
      return false;
    } else {
      await authService.createUserWithEmailAndPassword(email, password);

      const uid = authService.currentUser.uid;

      const signUpDate = moment().format("YYYY-MM-DD HH:mm:ss");

      await dbService.collection("user_DB").doc(email).set({
        nickname,
        uid,
        email,
        password,
        signUpDate,
      });
    }

    history.push("/");
  };

  authService.onAuthStateChanged((user) => {
    if (user) {
      history.push("/");
    }
  });

  return (
    <div>
      <br></br>

      <Form onSubmit={onSubmit}>
        <FormControl
          onChange={onChange}
          name="email"
          type="email"
          placeholder="input email"
          required
        ></FormControl>

        <FormControl
          onChange={onChange}
          name="nickname"
          type="text"
          placeholder="input nickname"
          required
        ></FormControl>

        <FormControl
          onChange={onChange}
          name="password"
          type="password"
          placeholder="input password"
          required
        ></FormControl>

        <Button type="submmit" variant="primary">
          Sign Up
        </Button>
      </Form>
    </div>
  );
};

export default SignUp;
