import React from "react";
import routes from "routes.js";
import { Route, Switch, useLocation } from "react-router-dom";
import PerfectScrollbar from "perfect-scrollbar";

const Auth = () => {
  return (
    <div className="wrapper">
      <div className="">
        <Switch>
          {routes.map((prop, key) => {
            return (
              <Route
                path={prop.layout + prop.path}
                component={prop.component}
                key={key}
              />
            );
          })}
        </Switch>
      </div>
    </div>
  );
};

export default Auth;
