import React, { useEffect, useState } from "react";
import { Button, Pagination, Table } from "react-bootstrap";
import { Link, useHistory } from "react-router-dom";
import { authService, dbService } from "../fbase";

const Board = (props) => {
  const {
    match: { url },
  } = props;

  console.log(url);

  const history = useHistory();

  let temp = url.split("/");
  console.log(temp);
  temp = temp[1].split("&");
  console.log(temp[1]);

  const found_board_name = temp[0];

  temp = temp[1].split("=");
  console.log(temp[1]);
  console.log(typeof temp[1]);
  const current_page_num = parseInt(temp[1]);
  console.log("current_page_num", current_page_num);

  const [post_list, set_post_list] = useState([]);

  const get_post = async () => {
    let get_limit = 1;
    const list_num = 4;

    if (current_page_num !== 1) {
      get_limit = (current_page_num - 1) * list_num;
    }

    const board_DB = await dbService
      .collection(`${found_board_name}`)
      .orderBy("created_at", "desc")
      .limit(get_limit)
      .get();

    if (board_DB.docs.length > 0) {
      const last_snapshot = board_DB.docs[board_DB.docs.length - 1];

      const start_at_board_DB = await dbService
        .collection(`${found_board_name}`)
        .orderBy("created_at", "desc")
        .startAt(last_snapshot.data().created_at)
        .limit(list_num - 1)
        .get();

      set_post_list([]);

      await start_at_board_DB.forEach((doc) => {
        const post_obj = {
          ...doc.data(),
        };

        console.log(post_obj);

        set_post_list((prev) => [...prev, post_obj]);
      });
    }
  };

  const click_write_btn = (e) => {
    e.preventDefault();

    if (!authService.currentUser) {
      alert("need log in");
      return false;
    } else {
      history.push(`${url}&write`);
    }
  };

  const page_prev = () => {
    if (current_page_num <= 1) {
      return false;
    } else {
      history.push(`/${found_board_name}&page=${current_page_num - 1}`);
    }
  };

  const page_next = () => {
    history.push(`/${found_board_name}&page=${current_page_num + 1}`);
  };

  const page_first = () => {
    // if (current_page_num <= 10) {
    //   history.push(`/${found_board_name}&page=1`);
    // } else {
    //   history.push(`/${found_board_name}&page=${current_page_num - 10}`);
    // }

    history.push(`/${found_board_name}&page=1`);
  };

  const page_last = () => {
    // history.push(`/${found_board_name}&page=${current_page_num + 10}`);

    const last_page = Math.floor(current_page_num / 10) * 10 + 9;
    console.log(last_page);

    history.push(`/${found_board_name}&page=${last_page}`);
  };

  let page_list = [];

  const get_page_list = () => {
    // console.log("current_page_num / 10 + 1 =", current_page_num / 10 + 1);

    const start_page = Math.floor(current_page_num / 10) * 10;
    console.log(start_page);

    const end_page = Math.floor(current_page_num / 10 + 1) * 10;
    console.log(end_page);

    if (current_page_num < 10) {
      for (let index = 1; index < 10; index++) {
        page_list[index] = index;
      }
    } else {
      let i = 1;
      for (let index = start_page; index < end_page; index++) {
        page_list[i] = index;
        i++;
      }
    }
  };

  const page_select = (e) => {
    console.log(e.target.textContent);

    const {
      target: { textContent },
    } = e;

    history.push(`/${found_board_name}&page=${textContent}`);
  };

  get_page_list();

  useEffect(() => {
    get_post();
  }, [url]);

  return (
    <div>
      <div>
        <Table>
          <tbody>
            {post_list.map((item, index) => {
              const { title, post_url, created_at, creator_nickname } = item;

              return (
                <>
                  <tr key={index}>
                    <td>
                      <Link to={`${url}/${post_url}`}>{title}</Link>
                    </td>
                    <td>{creator_nickname}</td>
                    <td>{created_at}</td>
                  </tr>
                </>
              );
            })}
          </tbody>
        </Table>
      </div>

      <Pagination>
        <Pagination.First onClick={page_first} />
        <Pagination.Prev onClick={page_prev} />
        {page_list.map((item, index) => {
          return (
            <Pagination.Item key={index} onClick={page_select}>
              {item}
            </Pagination.Item>
          );
        })}
        <Pagination.Next onClick={page_next} />
        <Pagination.Last onClick={page_last} />
      </Pagination>

      <Button as={Link} onClick={click_write_btn} variant="secondary">
        Write
      </Button>
    </div>
  );
};

export default Board;
