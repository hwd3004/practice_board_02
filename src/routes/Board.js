import React, { useEffect, useState } from "react";
import { Button, Table } from "react-bootstrap";
import { Link, useHistory } from "react-router-dom";
import { authService, dbService } from "../fbase";

const Board = (arg) => {
  const {
    match: { url },
  } = arg;

  const history = useHistory();

  let temp = url.split("/");
  const found_board_name = temp[1];
  console.log(found_board_name);

  const [post_list, set_post_list] = useState([]);

  const get_post = async () => {
    const board_DB = await dbService
      .collection(`${found_board_name}`)
      .orderBy("createdAt", "desc")
      .get();

    set_post_list([]);

    await board_DB.forEach((doc) => {
      const post_obj = {
        ...doc.data(),
      };

      console.log(post_obj);

      set_post_list((prev) => [...prev, post_obj]);
    });
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

  useEffect(() => {
    get_post();
  }, [url]);

  return (
    <div>
      <div>
        <Table>
          <tbody>
            {post_list.map((item, index) => {
              const { title, url, createdAt } = item;

              return (
                <>
                  <tr key={index}>
                    <td>
                      <Link>{title}</Link>
                    </td>
                    <td></td>
                  </tr>
                </>
              );
            })}
          </tbody>
        </Table>
      </div>
      <Button as={Link} onClick={click_write_btn} variant="secondary">
        Write
      </Button>
    </div>
  );
};

export default Board;
