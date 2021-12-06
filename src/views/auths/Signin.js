import React, { useState, useEffect } from "react";
import {
  Button,
  CardBody,
  FormGroup,
  Form,
  Input,
  Row,
  Col,
} from "reactstrap";
import "./../../assets/css/Login.css"; // login
import logo from "./../../assets/img/logo.png"; //logo
import axios from "axios"; // http
import NotificationAlert from "react-notification-alert";
import "react-loader-spinner/dist/loader/css/react-spinner-loader.css";
import Loader from "react-loader-spinner";
import { Redirect, useHistory } from "react-router-dom";
import { enviroment } from "variables/enviroment";
import { useSelector } from "react-redux";
import { useDispatch } from "react-redux";
import { login } from "redux/userSlice";

const Signin = () => {
  const user = useSelector(state => state.user)
  const dispatch = useDispatch();
  console.log(user)


  const notificationAlert = React.useRef();
  const [email, setEmail] = useState("francis@nucleus.com.ng");
  const [password, setPassword] = useState("080665");
  const [isLoading, setIsLoading] = useState(false);

  const history = useHistory(); // redirect 

  function validateForm() {
    return email.length > 0 && password.length > 0;
  }

  function handleSubmit(event) {
    event.preventDefault(); // preventDefault

    // loading
    setIsLoading(true);

    axios
      .post(enviroment.BASE_URL + "backend/auth/signin", {
        email: email,
        password: password,
      })
      .then((response) => {
        // console.log(response.data);

        // we got something back...
        if (response.status === 200) {
          if (response.data.status === true) {
            // save token and info to local storage
            const now = new Date();
            const user = {
              ...response.data.user,
              token: response.data.token.original.access_token,
              expiry: now.getTime() + 3600000,
            }
            localStorage.setItem("user", JSON.stringify(user)); //stringify object and store
           

            // dispatch(
            //   login(response.data.token.original.access_token)
            // )

            // redirect user to homepage
            history.push('/admin/dashboard');

            // console.log('here!');
          } else if (response.data.status === false) {
            notificationAlert.current.notificationAlert({
              place: "tr",
              message: (
                <div>
                  <div>Login failed. email or password incorrect!</div>
                </div>
              ),
              type: "danger",
              icon: "nc-icon nc-bell-55",
            });
          }
        }

        // failed login
        if (response.status !== 200) {
          notificationAlert.current.notificationAlert({
            place: "tr",
            message: (
              <div>
                <div>Login failed. email or password incorrect!</div>
              </div>
            ),
            type: "danger",
            icon: "nc-icon nc-bell-55",
          });
        }
      })
      .catch((error) => {
        // console.log(error);
        notificationAlert.current.notificationAlert({
          place: "tr",
          message: (
            <div>
              Login failed.
              <p>If failure continues, please contact support!</p>
            </div>
          ),
          type: "danger",
          icon: "nc-icon nc-bell-55",
        });
      })
      .finally(() => {
        // console.log(e);
        setIsLoading(false);
      });
  }

  useEffect(() => {
    // console.log(process.env.);
  }, []);

  return (
    <>
      <div className="content Login">
        <NotificationAlert ref={notificationAlert} />
        <Row>
          <Col md="4"></Col>
          <Col md="4" className="col-md-4 col-md-offset-4">
            <CardBody>
              <Form
                className="form-horizontal login-page-form"
                onSubmit={handleSubmit}
              >
                <Col md="12" className="mb-4 mx-auto d-block">
                  <img
                    src={logo}
                    className="img-responsive center-block mx-auto d-block logo"
                    alt="Logo"
                  />
                </Col>
                <Col md="12">
                  <FormGroup>
                    {/* <label>Email address</label> */}
                    <Input
                      placeholder="Enter email address"
                      type="text"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                    />
                  </FormGroup>
                </Col>
                <Col md="12" className="mb-3">
                  <FormGroup>
                    {/* <label>Password</label> */}
                    <Input
                      placeholder="Enter Password"
                      type="password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                    />
                  </FormGroup>
                </Col>
                <Col>
                  <div className="update ml-auto mr-auto">
                    <Button
                      className="btn-block"
                      // color=""
                      type="submit"
                      disabled={!validateForm() || isLoading}
                      style={{ backgroundColor: "#663391" }}
                    >
                      {isLoading ? (
                        <Loader
                          type="Bars"
                          color="#fff"
                          height={22}
                          width={22}
                        />
                      ) : (
                        "Sign In"
                      )}
                    </Button>
                  </div>
                </Col>
              </Form>
            </CardBody>
          </Col>
          <Col md="4"></Col>
        </Row>
      </div>
    </>
  );
};

export default Signin;
