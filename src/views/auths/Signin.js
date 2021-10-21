import React, { useState } from "react";
import {
  Button,
  Card,
  CardHeader,
  CardBody,
  CardFooter,
  CardTitle,
  FormGroup,
  Form,
  Input,
  Row,
  Col,
} from "reactstrap";

import "./../../assets/css/Login.css"; // login
import logo from "./../../assets/img/logo.png"; //logo

const Signin = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  function validateForm() {
    return email.length > 0 && password.length > 0;
  }

  function handleSubmit(event) {
    event.preventDefault();
  }

  return (
    <>
      <div className="content Login">
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
                    className="img-responsive center-block mx-auto d-block"
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
                      color="primary"
                      type="submit"
                      disabled={!validateForm()}
                      style={{ backgroundColor: "#663391" }}
                    >
                      Sign In
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
