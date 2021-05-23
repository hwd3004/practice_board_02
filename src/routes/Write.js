import React, { useState } from "react";
import { CKEditor } from "@ckeditor/ckeditor5-react";
import ClassicEditor from "@ckeditor/ckeditor5-build-classic";
import { Button, Form, FormControl } from "react-bootstrap";
import { authService, dbService } from "../fbase";
import shortid from "shortid";
import moment from "moment";
import { useHistory } from "react-router";
import { connect } from "react-redux";

const Write = (props) => {
  console.log("Write.js props", props);
  console.log(props.user_nickname_reducer);

  const { user_nickname_reducer } = props;

  const [post, set_post] = useState({
    title: "",
    content: "",
  });

  const history = useHistory();

  console.log("props", props);
  console.log(props.match.url);

  let temp = props.match.url.split("/");
  console.log(temp);
  temp = temp[1].split("&");
  console.log(temp);

  const found_board_name = temp[0];
  console.log(found_board_name);

  const onChange = (e) => {
    const {
      target: { name, value },
    } = e;

    set_post({
      ...post,
      [name]: value,
    });

    console.log(name, value);
  };

  const onSubmit = (e) => {
    e.preventDefault();

    if (!authService.currentUser) {
      alert("need log in");
      return false;
    } else {
      const post_url = shortid.generate();

      const { title, content } = post;

      const new_post = {
        creator_nickname: user_nickname_reducer,
        post_url,
        title,
        content,
        created_at: moment().format("YYYY-MM-DD HH:mm:ss"),
        creator_uid: authService.currentUser.uid,
        creator_email: authService.currentUser.email,
      };

      dbService.collection(`${found_board_name}`).doc(post_url).set(new_post);

      history.push(`/${found_board_name}&page=1`);
    }
  };

  return (
    <div>
      <Form onSubmit={onSubmit}>
        <FormControl
          type="text"
          name="title"
          placeholder="input title"
          onChange={onChange}
          required
        ></FormControl>
        <CKEditor
          data="input text"
          editor={ClassicEditor}
          onReady={(editor) => {
            console.log("onReady", editor);
          }}
          onBlur={(event, editor) => {
            console.log("onBlur event", event);
            console.log("onBlur editor", editor);
          }}
          onChange={(event, editor) => {
            const data = editor.getData();
            console.log("onChange event", event);
            console.log("onChange editor", editor);
            console.log("onChange data", data);

            set_post({
              ...post,
              content: data,
            });
          }}
          onFocus={(event, editor) => {
            console.log("onFocus event", event);
            console.log("onFocus editor", editor);
          }}
        />
        <Button type="submit" color="success" block>
          Submit
        </Button>
      </Form>
    </div>
  );
};

const getStore = (state) => {
  console.log("Write.js/getStore state", state);

  const { user_nickname_reducer } = state;

  return {
    user_nickname_reducer,
  };
};

export default connect(getStore)(Write);
