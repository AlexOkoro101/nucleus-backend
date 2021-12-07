import React, { useEffect, useState, useRef } from "react";
import { useHistory } from "react-router";
// reactstrap components
import { Card, CardHeader, CardBody, Row, Col, Table, Button, Modal, ModalHeader, ModalBody, ModalFooter, Input, Badge } from "reactstrap";
import { enviroment } from "variables/enviroment";
import NotificationAlert from "react-notification-alert";

function Orders() {
  const notificationAlert = useRef();
  var Spinner = require('react-spinkit');
  const [token, settoken] = useState(null)
  const [orders, setorders] = useState(null)
  const [isLoading, setisLoading] = useState(false)
  const [modalIsLoading, setmodalIsLoading] = useState(false)
  const [error, seterror] = useState(null)
  const [modal, setmodal] = useState(false)
  const [orderId, setorderId] = useState(null)

  //Route hook
  const history = useHistory()



  useEffect(() => {
    getToken()
    return () => {
      getToken()
    }
  }, [])

  useEffect(() => {
    const item = document.getElementsByClassName('table-responsive')
    item[0]?.classList.add('provider-table')
  }, [orders])


  const getToken = () => {
    const user = localStorage.getItem("user");

    if(!user) return;

    const formatItem = JSON.parse(user);

    if(formatItem?.token) {
      settoken(formatItem?.token)
      getOrders(formatItem?.token)
    }
  }


  const getOrders = (token) => {
    setisLoading(true)
    seterror(null)

    var myHeaders = new Headers();
    myHeaders.append("Authorization", `Bearer ${token}`);

    var requestOptions = {
      method: 'GET',
      headers: myHeaders,
      redirect: 'follow'
    };

    fetch(enviroment.BASE_URL + "backend/orders?ref&channel&processed", requestOptions)
      .then(response => {
        setisLoading(false)
        return response.text()
      })
      .then(result => {
        const item = JSON.parse(result)
        console.log(item)
        setorders(item.data.data)
      })
      .catch(error => {
        seterror(error)
        console.log('error', error)
      });
  }





  return (
    <>
      <div className="content">
        <NotificationAlert ref={notificationAlert} />
        <Row>
          <Col md="12">
            {isLoading && (
              <Spinner name='circle' color="#663391" fadeIn="none" />
            )}

            {orders && (
              <>
                <Card>
                  
                  <CardHeader>All Orders</CardHeader>
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
                        {orders?.slice(0).reverse().map((order) => (
                          <tr key={order.order_id} className="plans-row">
                            <td onClick={() => {history.push('/admin/orders/' + order.order_id)}}>{order.order_ref}</td>
                            <td onClick={() => {history.push('/admin/orders/' + order.order_id)}}>N{order.order_amount}</td>
                            <td onClick={() => {history.push('/admin/orders/' + order.order_id)}}>{order.order_channel}</td>
                            <td onClick={() => {history.push('/admin/orders/' + order.order_id)}}>{order.order_type}</td>
                            <td onClick={() => {history.push('/admin/orders/' + order.order_id)}}>
                            {order.order_status == "paid" ? (
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
              </>

            )}
            
          </Col>
        </Row>
      </div>
    </>
  );
}

export default Orders;
