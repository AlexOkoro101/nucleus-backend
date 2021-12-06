import React, { useEffect } from "react";
import routes from "routes.js";
import { Route, Switch, useHistory } from "react-router-dom";

const Auth = () => {
  const history = useHistory();

  useEffect(() => {
    getToken()
    return () => {
      getToken()
    }
  }, [])

  const getToken = () => {
    const user = localStorage.getItem('user');
    const item = JSON.parse(user)
    if(item?.token) {
      history.push('/admin/dashboard')
    }
  }

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
