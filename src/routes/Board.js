import React from "react";
import { Button } from "react-bootstrap";
import { Link } from "react-router-dom";

const Board = (param) => {
  //   console.log(param);
  //   console.log(param.match.url);

  const {
    match: { url },
  } = param;

  console.log(url);

  return (
    <div>
      <p>{url}</p>
      <Button as={Link} to={`${url}&write`} variant="secondary">
        Write
      </Button>
    </div>
  );
};

export default Board;
