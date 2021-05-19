import moment from "moment";
import React, { useState } from "react";
import { Form, FormControl, Button } from "react-bootstrap";
import { useHistory } from "react-router";
import { authService, dbService } from "../fbase";

const SignUp = () => {
  const history = useHistory();

  const [signUpForm, setSignUpForm] = useState({
    email: null,
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

    const { email, password } = signUpForm;

    const check_exist_email = await dbService
      .collection("user_DB")
      .where("email", "==", email)
      .get();

    let get_already_use_email;

    await check_exist_email.forEach((doc) => {
      get_already_use_email = doc.data().email;
    });

    console.log(`get_already_use_id - ${get_already_use_email}`);

    if (get_already_use_email) {
      alert("already use email");
      return false;
    } else {
      await authService.createUserWithEmailAndPassword(email, password);

      const uid = authService.currentUser.uid;

      const signUpDate = moment().format("YYYY-MM-DD HH:mm:ss");

      await dbService.collection("user_DB").doc(uid).set({
        uid,
        email,
        password,
        signUpDate,
      });
    }

    history.push("/");
  };

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
