

import React, { useEffect, useRef, useState } from "react";
// react plugin used to create charts
import { Line, Pie } from "react-chartjs-2";
import { useHistory } from "react-router-dom";
// reactstrap components
import {
  Card,
  CardHeader,
  CardBody,
  CardFooter,
  CardTitle,
  Row,
  Col,
  Table,
  Button,
  Badge,
} from "reactstrap";
// core components
import {
  dashboard24HoursPerformanceChart,
  dashboardEmailStatisticsChart,
  dashboardNASDAQChart,
} from "variables/charts.js";
import { enviroment } from "variables/enviroment";

function Dashboard() {
  const notificationAlert = useRef();
  var Spinner = require('react-spinkit');
  const [token, settoken] = useState(null)
  const [dashboard, setdashboard] = useState(null)
  const [isLoading, setisLoading] = useState(false)
  const [error, seterror] = useState(null)

   //Route hook
   const history = useHistory()

   useEffect(() => {
     const item = document.getElementsByClassName('table-responsive')
     item[0]?.classList.add('provider-table')
   }, [dashboard])
 
 
   useEffect(() => {
     getToken()
     return () => {
       getToken()
     }
   }, [])
 
   const getToken = () => {
     const user = localStorage.getItem("user");
 
     if(!user) return;
 
     const formatItem = JSON.parse(user);
 
     if(formatItem?.token) {
       settoken(formatItem?.token)
       getDashboard(formatItem?.token)
     }
   }

   const getDashboard = (token) => {
    setisLoading(true)
    seterror(null)

    var myHeaders = new Headers();
    myHeaders.append("Authorization", `Bearer ${token}`);

    var requestOptions = {
      method: 'GET',
      headers: myHeaders,
      redirect: 'follow'
    };

    fetch(enviroment.BASE_URL + "backend/dashboard", requestOptions)
      .then(response => {
        
        return response.text()
      })
      .then(result => {
        setisLoading(false)
        const item = JSON.parse(result)
        console.log(item)
        setdashboard(item.data)
      })
      .catch(error => {
        seterror(error)
        console.log('error', error)
      });
  }




  return (
    <>
      <div className="content">
        {isLoading && (
          <Spinner name='circle' color="#663391" fadeIn="none" />
        )}

        {dashboard && (
          <>
            <Row>
              <Col lg="3" md="6" sm="6">
                <Card className="card-stats">
                  <CardBody>
                    <Row>
                      <Col md="4" xs="5">
                        <div className="icon-big text-center icon-warning">
                          <i className="nc-icon nc-globe text-warning" />
                        </div>
                      </Col>
                      <Col md="8" xs="7">
                        <div className="numbers">
                          <p className="card-category">Plans</p>
                          <CardTitle tag="p">{dashboard.plans.length}</CardTitle>
                          <p />
                        </div>
                      </Col>
                    </Row>
                  </CardBody>
                  <CardFooter>
                    <hr />
                    <div style={{cursor: "pointer"}} onClick={() => history.push('/admin/plans')} className="stats">
                      <i  className="fas fa-sync-alt" /> View Plans
                    </div>
                  </CardFooter>
                </Card>
              </Col>
              <Col lg="3" md="6" sm="6">
                <Card className="card-stats">
                  <CardBody>
                    <Row>
                      <Col md="4" xs="5">
                        <div className="icon-big text-center icon-warning">
                          <i className="nc-icon nc-money-coins text-success" />
                        </div>
                      </Col>
                      <Col md="8" xs="7">
                        <div className="numbers">
                          <p className="card-category">Orders</p>
                          <CardTitle tag="p">{dashboard.orders.length}</CardTitle>
                          <p />
                        </div>
                      </Col>
                    </Row>
                  </CardBody>
                  <CardFooter>
                    <hr />
                    <div style={{cursor: "pointer"}} onClick={() => history.push('/admin/orders')} className="stats">
                      <i className="fas fa-sync-alt" /> View Orders
                    </div>
                  </CardFooter>
                </Card>
              </Col>
              <Col lg="3" md="6" sm="6">
                <Card className="card-stats">
                  <CardBody>
                    <Row>
                      <Col md="4" xs="5">
                        <div className="icon-big text-center icon-warning">
                          <i className="nc-icon nc-vector text-danger" />
                        </div>
                      </Col>
                      <Col md="8" xs="7">
                        <div className="numbers">
                          <p className="card-category">Entities</p>
                          <CardTitle tag="p">{dashboard.entities.length}</CardTitle>
                          <p />
                        </div>
                      </Col>
                    </Row>
                  </CardBody>
                  <CardFooter>
                    <hr />
                    <div style={{cursor: "pointer"}} onClick={() => history.push('/admin/entities')} className="stats">
                      <i  className="fas fa-sync-alt" /> View Entities
                    </div>
                  </CardFooter>
                </Card>
              </Col>
              <Col lg="3" md="6" sm="6">
                <Card className="card-stats">
                  <CardBody>
                    <Row>
                      <Col md="4" xs="5">
                        <div className="icon-big text-center icon-warning">
                          <i className="nc-icon nc-favourite-28 text-primary" />
                        </div>
                      </Col>
                      <Col md="8" xs="7">
                        <div className="numbers">
                          <p className="card-category">USSD Logs</p>
                          <CardTitle tag="p">{dashboard.ussdLogs.length}</CardTitle>
                          <p />
                        </div>
                      </Col>
                    </Row>
                  </CardBody>
                  <CardFooter>
                    <hr />
                    <div style={{cursor: "pointer"}} onClick={() => history.push('/admin/ussd-logs')} className="stats">
                      <i  className="fas fa-sync-alt" /> View USSD Logs
                    </div>
                  </CardFooter>
                </Card>
              </Col>
            </Row>
            <Row>
              <Col md="12">
                <Card>
                  
                  <CardHeader className="d-flex justify-content-between">
                  <p className="">Plans</p>
                  <p style={{cursor: "pointer"}} onClick={() => history.push('/admin/plans')} className="">View Plans</p>
                   
                  </CardHeader>
                  <CardBody>
                  <Table responsive>
                      <thead className="text-primary">
                        <tr>
                          <th>Name</th>
                          <th>Tenure</th>
                          <th>Amount</th>
                          <th>Category</th>
                          <th>Status</th>
                        </tr>
                      </thead>
                      <tbody>
                        {dashboard.plans?.slice(0, 10).map((plan) => (
                          <tr key={plan.id} className="plans-row">
                            <td onClick={() => {history.push('/admin/plans/' + plan.id)}}>{plan.planName}</td>
                            <td onClick={() => {history.push('/admin/plans/' + plan.plan_id)}}>{plan.planTenure}</td>
                            <td onClick={() => {history.push('/admin/plans/' + plan.plan_id)}}>N{plan.planAmount.amount}</td>
                            <td onClick={() => {history.push('/admin/plans/' + plan.plan_id)}}>{plan.planCategory || "N/A"}</td>
                            <td onClick={() => {history.push('/admin/plans/' + plan.plan_id)}}>{plan.status === 1 ? 'Active' : "Inactive"}</td>
                          </tr>

                        ))}
                        
                      </tbody>
                    </Table>
                  </CardBody>
                </Card>
              </Col>
            </Row>
            <Row>
              <Col md="12">
                <Card>
                  
                  <CardHeader className="d-flex justify-content-between">
                  <p className="">Orders</p>
                  <p style={{cursor: "pointer"}} onClick={() => history.push('/admin/orders')} className="">View Orders</p>
                   
                  </CardHeader>
                  <CardBody>
                  <Table responsive>
                      <thead className="text-primary">
                        <tr>
                          <th>Ref</th>
                          <th>Amount</th>
                          <th>Channel</th>
                          <th>Type</th>
                          <th>Status</th>
                          <th className="text-right">Created At</th>
                        </tr>
                      </thead>
                      <tbody>
                        {dashboard.orders?.slice(0, 10).map((order) => (
                          <tr key={order.order_id} className="plans-row">
                            <td onClick={() => {history.push('/admin/orders/' + order.order_id)}}>{order.order_ref}</td>
                            <td onClick={() => {history.push('/admin/orders/' + order.order_id)}}>N{order.order_amount}</td>
                            <td onClick={() => {history.push('/admin/orders/' + order.order_id)}}>{order.order_channel}</td>
                            <td onClick={() => {history.push('/admin/orders/' + order.order_id)}}>{order.order_type}</td>
                            <td onClick={() => {history.push('/admin/orders/' + order.order_id)}}>
                            {order.order_status === "paid" ? (
                              <Badge color="success">{order.order_status}</Badge>
                            ) : (
                              <Badge>{order.order_status}</Badge>
                            )}
                            </td>
                            <td className="text-right"> 
                              {new Date(order.create_time).toLocaleDateString("en-NG",
                                  {
                                      year: "numeric",
                                      day: "numeric",
                                      month: "long",
                                  }
                              )}
                            </td>
                          </tr>

                        ))}
                        
                      </tbody>
                    </Table>
                  </CardBody>
                </Card>
              </Col>
            </Row>

          </>
        )}
      </div>
    </>
  );
}

export default Dashboard;
