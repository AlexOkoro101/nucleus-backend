import React, { useState, useEffect } from "react";
// reactstrap components
import {
  Card,
  CardHeader,
  CardBody,
  CardTitle,
  Table,
  Row,
  Col,
  Button,
  Badge,
} from "reactstrap";
import axios from "axios"; // http
import NotificationAlert from "react-notification-alert";
import "react-loader-spinner/dist/loader/css/react-spinner-loader.css";
import Loader from "react-loader-spinner";
import { useHistory } from "react-router-dom";

const Admins = () => {
  const notificationAlert = React.useRef();
  const [data, setData] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [token] = useState(localStorage.getItem("token"));
  const history = useHistory(); // redirect

  // filters
  const [email, setEmail] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");

  useEffect(() => {
    getAdmins();
  }, []);

  // get all admins
  const getAdmins = () => {
    setIsLoading(true); // loading...

    // fetch admins
    axios
      .get(
        `${process.env.REACT_APP_API_BASE_URL}backend/admin?email&phoneNumber`,
        {
          headers: {
            Accept: "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      )
      .then((response) => {
        console.log(response);
        if (response.status === 200) {
          if (response.data.status === true) {
            setData(response.data.data);
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
        } else {
          return Promise.reject(error);
        }
      })
      .finally(() => {
        setIsLoading(false);
      });
  };

  const goToCreateAdmin = () => {
    history.push("/admin/admins-create");
  };

  return (
    <>
      <div className="content">
        <NotificationAlert ref={notificationAlert} />
        <Row>
          <Col md="12">
            <Card>
              <CardHeader>
                <CardTitle tag="h6">
                  <Button
                    className="btn btn-primary"
                    onClick={() => goToCreateAdmin()}
                  >
                    Create Admin
                  </Button>
                </CardTitle>
              </CardHeader>
              <CardBody>
                <Table responsive>
                  <thead className="text-primary">
                    <tr>
                      <th>Full Name</th>
                      <th>Gender</th>
                      <th>Phone Number</th>
                      <th>Email</th>
                      <th>Account Type</th>
                      <th className="text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {data.map((item, index) => (
                      <tr key={index}>
                        <td>
                          {item.firstname} {item.lastname} {item.othernames}
                        </td>
                        <td>
                          {item.gender === "MALE" ? (
                            <Badge color="info" pill>
                              MALE
                            </Badge>
                          ) : (
                            <Badge color="danger" pill>
                              FEMALE
                            </Badge>
                          )}
                        </td>
                        <td>{item.phone_number}</td>
                        <td>{item.email}</td>
                        <td className="">
                          <Badge color="primary" pill>
                            {item.account_type}
                          </Badge>
                        </td>
                        <td className="text-right">
                          <Button className="btn btn-default" size="sm">
                            UPDATE
                          </Button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </Table>
                {isLoading ? (
                  <div className="text-center">
                    <Loader
                      type="ThreeDots"
                      color="grey"
                      height={100}
                      width={100}
                    />
                  </div>
                ) : null}
              </CardBody>
            </Card>
          </Col>
        </Row>
      </div>
    </>
  );
};

export default Admins;
