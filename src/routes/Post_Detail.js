import { CKEditor } from "@ckeditor/ckeditor5-react";
import ClassicEditor from "@ckeditor/ckeditor5-build-classic";
import React, { useEffect, useState } from "react";
import { dbService } from "../fbase";
import ReactHtmlParser from "react-html-parser";

const Post_Detail = (props) => {
  console.log(props);

  const [post, set_post] = useState({});

  const temp = props.match.url.split("/");

  console.log(temp);

  const found_board_name = temp[1];
  const get_url = temp[2];
  console.log(found_board_name);
  console.log(get_url);

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
      <h3>{post.title}</h3>
      <p>{post.creator_nickname}</p>
      <div>{ReactHtmlParser(post.content)}</div>
    </div>
  );
};

export default Post_Detail;
