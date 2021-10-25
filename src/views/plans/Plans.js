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
import Moment from "react-moment";
import Pagination from "react-js-pagination";
import "./../../assets/css/Login.css"; // login

const Plans = () => {
  const notificationAlert = React.useRef();
  const [data, setData] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [token] = useState(localStorage.getItem("token"));
  const [activePage, setActivePage] = useState(1);
  const [itemsCountPerPage, setItemsCountPerPage] = useState(2);
  const [totalItemsCount, setTotalItemsCount] = useState(0);

  const history = useHistory(); // redirect

  //   filter plans
  const [name, setName] = useState("");
  const [status, setStatus] = useState("");
  const [insurer, setInsurer] = useState("");

  const goToCreateAdmin = () => {
    // history.push("/admin/admins-create");
  };

  const getPlans = () => {
    setIsLoading(true); // loading...
    setData([]); // set to null

    // fetch plans
    axios
      .get(
        `${process.env.REACT_APP_API_BASE_URL}backend/plans?name=${
          name || ""
        }&status=${status || ""}&insurer=${insurer || ""}&page=${
          activePage || ""
        }`,
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
            setData(response.data.data.data); // data received
            setItemsCountPerPage(response.data.data.per_page);
            setTotalItemsCount(response.data.data.total);
            setActivePage(response.data.data.current_page);
          }
        }
      })
      .catch((error) => {
        console.error(error);
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

  const goToCreateplans = () => {
    //   history.push("/admin")
  };

  function currencyFormat(num) {
    return "₦" + num.toFixed(2).replace(/(\d)(?=(\d{3})+(?!\d))/g, "$1,");
  }

  const handlePageClick = (pageNumber) => {
    // console.log("handlePageClick", { pageNumber });
    setActivePage(pageNumber);
    console.log(pageNumber);
    // getPlans();
  };

  useEffect(() => {
    getPlans();
  }, [activePage]);

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
                    onClick={() => goToCreateplans()}
                  >
                    Create Plans
                  </Button>
                </CardTitle>
              </CardHeader>
              <CardBody>
                <Table responsive>
                  <thead className="text-primary">
                    <tr>
                      <th>Plan</th>
                      <th>Amount</th>
                      <th>Tenor </th>
                      <th>category</th>
                      <th>Status</th>
                      <th>Created</th>
                      <th className="text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {data.map((item, index) => (
                      <tr key={index}>
                        <td>{item.name}</td>
                        <td>{currencyFormat(item.amount)}</td>
                        <td>{item.tenure}</td>
                        <td>{item.category}</td>
                        <td>
                          {item.status === 1 ? (
                            <Badge color="success" pill>
                              ACTIVE
                            </Badge>
                          ) : (
                            <Badge color="danger" pill>
                              IN-ACTIVE
                            </Badge>
                          )}
                        </td>
                        <td>
                          <Moment format="YYYY/MM/DD">{item.created_at}</Moment>
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
                ) : (
                  <div className="text-right">
                    <Pagination
                      activePage={activePage}
                      itemsCountPerPage={itemsCountPerPage}
                      totalItemsCount={totalItemsCount}
                      pageRangeDisplayed={5}
                      onChange={(e) => handlePageClick(e)}
                      itemClass="page-item"
                      linkClass="page-link"
                      firstPageText="First Page"
                      lastPageText="Last Lage"
                      activeLinkClass={"pagination-link"}
                    />
                  </div>
                )}
              </CardBody>
            </Card>
          </Col>
        </Row>
      </div>
    </>
  );
};

export default Plans;
