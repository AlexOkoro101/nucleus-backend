import React, { useState, useEffect } from "react";
// reactstrap components
import {
  Card,
  CardHeader,
  CardBody,
  CardTitle,
  FormGroup,
  Row,
  Input,
  Col,
  Button,
  Badge,
} from "reactstrap";
import axios from "axios"; // http
import NotificationAlert from "react-notification-alert";
import "react-loader-spinner/dist/loader/css/react-spinner-loader.css";
import Loader from "react-loader-spinner";
import { Formik, Form, Field } from "formik";
import * as Yup from "yup";
import { useHistory } from "react-router-dom";

const schema = Yup.object().shape({
  firstName: Yup.string()
    .min(3, "First name Too Short!")
    .max(50, "Too Long!")
    .required("Required"),
  lastName: Yup.string()
    .min(2, "Last name Too Short!")
    .max(50, "Too Long!")
    .required("Required"),
  email: Yup.string().email("Invalid email").required("Required"),
  gender: Yup.string().required("Required"),
  phoneNumber: Yup.string().required("Required"),
});

const CreateAdmin = () => {
  const notificationAlert = React.useRef();
  const [isLoading, setIsLoading] = useState(false);
  const [token] = useState(localStorage.getItem("token"));
  const history = useHistory();

  // create admin
  const createAdmin = (data) => {
    setIsLoading(true); // loading

    axios
      .post(
        `${process.env.REACT_APP_API_BASE_URL}backend/admin`,
        {
          email: data.email,
          firstname: data.firstName,
          lastname: data.lastName,
          phoneNumber: data.phoneNumber,
          gender: data.gender,
          accessLevel: data.accessLevel,
          password: "nucluesAdmin",
        },
        {
          timeout: 1000,
          headers: {
            Accept: "application/json",
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      )
      .then((response) => {
        if (response.status === 200) {
          if (response.data.status === true) {
            notificationAlert.current.notificationAlert({
              place: "tr",
              message: <div>{response.data.msg}</div>,
              type: "success",
              icon: "nc-icon nc-bell-55",
            });

            setTimeout(() => {
                history.push("/admin");
            }, 2000);
          }
        }
      })
      .catch((error) => {
        if (error.response.status === 401) {
          notificationAlert.current.notificationAlert({
            place: "tr",
            message: <div>User is not authenticated</div>,
            type: "danger",
            icon: "nc-icon nc-bell-55",
          });

          // do redirect to login page...
          setTimeout(() => {
            window.location = "/auth/signin";
          }, 2000);
          return;
        }

        notificationAlert.current.notificationAlert({
          place: "tr",
          message: <div>An error occurred, could not create admin!</div>,
          type: "danger",
          icon: "nc-icon nc-bell-55",
        });
      })
      .finally(() => {
        setIsLoading(true);
      });
  };

  return (
    <>
      <div className="content">
        <NotificationAlert ref={notificationAlert} />
        <Col md="8">
          <Card className="card-user">
            <CardHeader>
              <CardTitle tag="h5">Create Admin</CardTitle>
            </CardHeader>
            <CardBody>
              <Formik
                initialValues={{
                  firstName: "James",
                  lastName: "Doe",
                  email: "james@exmaple.com",
                  phoneNumber: "080665183288",
                  gender: "MALE",
                  accessLevel: "1",
                  password: "nucluesis",
                }}
                validationSchema={schema}
                onSubmit={(values) => {
                  createAdmin(values);
                }}
              >
                {({
                  errors,
                  touched,
                  handleChange,
                  handleBlur,
                  handleSubmit,
                  isSubmitting,
                  values,
                }) => (
                  <Form>
                    <Row>
                      <Col md="6">
                        <FormGroup>
                          <label>First Name</label>
                          <Input
                            placeholder="Enter Admin firstname"
                            type="text"
                            onChange={handleChange("firstName")}
                            onBlur={handleBlur("firstName")}
                            value={values.firstName}
                          />
                          {errors.firstName && touched.firstName && (
                            <span className="text-danger">
                              {errors.firstName}
                            </span>
                          )}
                        </FormGroup>
                      </Col>
                      <Col md="6">
                        <FormGroup>
                          <label>Last Name</label>
                          <Input
                            placeholder="Enter Admin lastname"
                            type="text"
                            onChange={handleChange("lastName")}
                            onBlur={handleBlur("lastName")}
                            value={values.lastName}
                          />
                          {errors.lastName && touched.lastName && (
                            <span className="text-danger">
                              {errors.lastName}
                            </span>
                          )}
                        </FormGroup>
                      </Col>
                      <Col md="6">
                        <FormGroup>
                          <label>Email Address</label>
                          <Input
                            placeholder="Enter email address"
                            type="email"
                            onChange={handleChange("email")}
                            onBlur={handleBlur("email")}
                            value={values.email}
                          />
                          {errors.email && touched.email && (
                            <span className="text-danger">{errors.email}</span>
                          )}
                        </FormGroup>
                      </Col>
                      <Col md="6">
                        <FormGroup>
                          <label>Phone Number</label>
                          <Input
                            placeholder="Enter phone number"
                            type="text"
                            onChange={handleChange("phoneNumber")}
                            onBlur={handleBlur("phoneNumber")}
                            value={values.phoneNumber}
                          />
                          {errors.phoneNumber && touched.phoneNumber && (
                            <span className="text-danger">
                              {errors.phoneNumber}
                            </span>
                          )}
                        </FormGroup>
                      </Col>
                      <Col md="6">
                        <FormGroup>
                          <label>Gender</label>
                          <Input
                            type="select"
                            name="gender"
                            placeholder="Select gender"
                            onChange={handleChange("gender")}
                            onBlur={handleBlur("gender")}
                            value={values.gender}
                          >
                            <option value="">Select Gender</option>
                            <option value="FEMALE">Female</option>
                            <option value="MALE">Male</option>
                          </Input>
                          {errors.gender && touched.gender && (
                            <span className="text-danger">{errors.gender}</span>
                          )}
                        </FormGroup>
                      </Col>
                      <Col md="6">
                        <FormGroup>
                          <label>Access Level</label>
                          <Input
                            type="select"
                            name="accessLevel"
                            placeholder="Select access level"
                            onChange={handleChange("accessLevel")}
                            onBlur={handleBlur("accessLevel")}
                            value={values.accessLevel}
                          >
                            <option value="1">Level </option>
                          </Input>
                          {errors.accessLevel && touched.accessLevel && (
                            <span className="text-danger">
                              {errors.accessLevel}
                            </span>
                          )}
                        </FormGroup>
                      </Col>
                      <Col md="6">
                        <Button className="btn-block" color="primary">
                          {isLoading ? (
                            <Loader
                              type="Bars"
                              color="#fff"
                              height={22}
                              width={22}
                            />
                          ) : (
                            "Create Admin"
                          )}
                        </Button>
                      </Col>
                    </Row>
                  </Form>
                )}
              </Formik>
            </CardBody>
          </Card>
        </Col>
      </div>
    </>
  );
};

export default CreateAdmin;
