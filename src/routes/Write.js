import React, { useState } from "react";
import { CKEditor } from "@ckeditor/ckeditor5-react";
import ClassicEditor from "@ckeditor/ckeditor5-build-classic";
import { Button, Form, FormControl } from "react-bootstrap";
import { authService, dbService } from "../fbase";
import shortid from "shortid";
import moment from "moment";

const Write = (arg) => {
  const [post, set_post] = useState({
    title: "",
    content: "",
  });

  console.log("arg", arg);
  console.log(arg.match.url);

  let temp = arg.match.url.split("/");
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

    const url = shortid.generate();

    const { title, content } = post;

    const new_post = {
      url,
      title,
      content,
      createdAt: moment().format("YYYY-MM-DD HH:mm:ss"),
      creatorUid: authService.currentUser.uid,
      creatorEmail: authService.currentUser.email,
    };

    dbService.collection(`${found_board_name}`).doc(url).set(new_post);
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

export default Write;
