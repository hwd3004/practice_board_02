import React, { useState, useEffect } from "react";
import { authService } from "../fbase";
import AppRouter from "./AppRouter";
import "../css/reset.css";
import "bootstrap/dist/css/bootstrap.min.css"

const App = () => {
  const [init, setInit] = useState(false);

  // console.log(authService)

  useEffect(() => {
    authService.onAuthStateChanged((user) => {
      console.log(user);
    });

    setInit(true);
  }, []);

  return (
    <div>
      {init ? (
        <div>
          <AppRouter />
        </div>
      ) : (
        <div>Initializing...</div>
      )}
    </div>
  );
};

export default App;
