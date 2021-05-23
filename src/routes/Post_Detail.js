import { CKEditor } from "@ckeditor/ckeditor5-react";
import ClassicEditor from "@ckeditor/ckeditor5-build-classic";
import React, { useEffect, useState } from "react";
import { dbService } from "../fbase";
import ReactHtmlParser from "react-html-parser";
import { Button } from "react-bootstrap";
import { Link } from "react-router-dom";

const Post_Detail = (props) => {
  console.log(props);

  const [post, set_post] = useState({});

  let temp = props.match.url.split("/");

  console.log(temp);

  const get_url = temp[2];
  console.log(get_url);

  console.log(temp[1]);
  const link_back = temp[1];

  temp = temp[1].split("&");

  const found_board_name = temp[0];

  const get_post_detail = async () => {
    const get_post = await dbService
      .collection(`${found_board_name}`)
      .where("post_url", "==", get_url)
      .get();

    get_post.forEach((doc) => {
      console.log(doc.data());

      const { content, created_at, creator_nickname, title } = doc.data();

      set_post({
        content,
        created_at,
        creator_nickname,
        title,
      });
    });
  };

  useEffect(() => {
    get_post_detail();
  }, []);

  return (
    <div>
      <br></br>
      <div>
        <h3>{post.title}</h3>
        <hr></hr>
        <p>
          {post.creator_nickname} | {post.created_at}{" "}
        </p>
        <hr></hr>
        <div>{ReactHtmlParser(post.content)}</div>
      </div>

      <Button as={Link} to={`/${link_back}`}>
        Back
      </Button>
    </div>
  );
};

export default Post_Detail;
