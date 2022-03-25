import React, { useEffect, useState, useRef } from "react";
import { useHistory } from "react-router";
// reactstrap components
import { Card, CardHeader, CardBody, Row, Col, Table, Button, Modal, ModalHeader, ModalBody, ModalFooter, Input, Badge, Pagination, PaginationItem, PaginationLink } from "reactstrap";
import { enviroment } from "variables/enviroment";
import NotificationAlert from "react-notification-alert";
import ReactPaginate from 'react-paginate'

function Loans() {
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

  const [pageCount, setpageCount] = useState(0)
  const [totalPage, settotalPage] = useState(0)



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

    fetch(enviroment.BASE_URL + `backend/loans`, requestOptions)
      .then(response => {
        setisLoading(false)
        return response.text()
      })
      .then(result => {
        const item = JSON.parse(result)
        console.log(item)
        setorders(item.data.data)
        setpageCount(item.data.current_page)
        settotalPage(item.data.last_page)
      })
      .catch(error => {
        seterror(error)
        console.log('error', error)
      });
  }

  const fetchOrders = (currentPage) => {
    setisLoading(true)
    seterror(null)

    var myHeaders = new Headers();
    myHeaders.append("Authorization", `Bearer ${token}`);

    var requestOptions = {
      method: 'GET',
      headers: myHeaders,
      redirect: 'follow'
    };

    fetch(enviroment.BASE_URL + `backend/loans?page=${currentPage}`, requestOptions)
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


  const handlePageChange = (data) => {
    console.log(data.selected)

    let currentPage = data.selected + 1

    fetchOrders(currentPage)
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
                  
                  <CardHeader>All Loans</CardHeader>
                  <CardBody>
                  <Table responsive>
                      <thead className="text-primary">
                        <tr>
                          <th>Ref</th>
                          <th>Amount</th>
                          <th>Channel</th>
                          <th>Type</th>
                          <th>Status</th>
                          <th>Loan Status</th>
                          <th>Created At</th>
                          {/* <th>Action</th> */}
                        </tr>
                      </thead>
                      <tbody>
                        {orders?.map((order) => (
                          <tr key={order.order_id} className="plans-row">
                            <td onClick={() => {history.push('/admin/orders/' + order.order_id)}}>{order.order_ref}</td>
                            <td onClick={() => {history.push('/admin/orders/' + order.order_id)}}>N{order.order_amount}</td>
                            <td onClick={() => {history.push('/admin/orders/' + order.order_id)}}>{order.channel.channel_name}</td>
                            <td onClick={() => {history.push('/admin/orders/' + order.order_id)}}>{order.order_type}</td>
                            <td onClick={() => {history.push('/admin/orders/' + order.order_id)}}>
                            {order.order_status === "paid" ? (
                              <Badge color="success">{order.order_status}</Badge>
                            ) : (
                              <Badge>{order.order_status}</Badge>
                            )}
                            </td>
                            <td onClick={() => {history.push('/admin/orders/' + order.order_id)}}>
                            {order.order_loan_status == "APPROVE" && (
                              <Badge color="success">{order.order_loan_status}</Badge>
                            )}
                            {order.order_loan_status == "DECLINE" && (
                              <Badge color="danger">{order.order_loan_status}</Badge>
                            )}
                            {order.order_loan_status == "AWAITING" && (
                              <Badge color="warning">{order.order_loan_status}</Badge>
                            )}
                            {order.order_loan_status == "CLOSED" && (
                              <Badge color="info">{order.order_loan_status}</Badge>
                            )}
                            {order.order_loan_status == null && (
                              <Badge>{"Not Active"}</Badge>
                            )}
                            </td>
                            <td> 
                              {new Date(order.create_time).toLocaleDateString("en-NG",
                                  {
                                      year: "numeric",
                                      day: "numeric",
                                      month: "long",
                                  }
                              )}
                            </td>
                            {/* <td onClick={() => {history.push('/admin/orders/' + order.order_id)}}>
                              <Button color="success" className="loan-button">Approve</Button>
                              <Button color="danger" className="loan-button">Decline</Button>
                              </td> */}
                          </tr>

                        ))}
                        
                      </tbody>
                    </Table>
                  </CardBody>
                </Card>
                <ReactPaginate
                  previousLabel={'previous'}
                  nextLabel={'next'}
                  pageCount={totalPage}
                  onPageChange={handlePageChange}
                  containerClassName={'pagination justify-content-center'}
                  pageClassName={'page-item'}
                  pageLinkClassName={'page-link'}
                  previousClassName={'page-item'}
                  nextClassName={'page-item'}
                  nextLinkClassName={'page-link'}
                  previousLinkClassName={'page-link'}
                  activeClassName={'active'}
                ></ReactPaginate>
              </>

            )}
            
            
          </Col>
        </Row>
      </div>
    </>
  );
}

export default Loans;
