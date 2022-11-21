import React, { useEffect, useState, useRef } from "react";
import { useHistory } from "react-router";
// reactstrap components
import { Card, CardHeader, CardBody, Row, Col, Table, Button, Modal, ModalHeader, ModalBody, ModalFooter, Input, Badge, Pagination, PaginationItem, PaginationLink } from "reactstrap";
import { enviroment } from "variables/enviroment";
import NotificationAlert from "react-notification-alert";
import ReactPaginate from 'react-paginate'
import DateRangePicker from '@wojtekmaj/react-daterange-picker';

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

  const [pageCount, setpageCount] = useState(0)
  const [totalPage, settotalPage] = useState(0)

  //date filter
  const [date, setdate] = useState([new Date(), new Date()]);
  const [firstdate, setfirstdate] = useState(null)
  const [seconddate, setseconddate] = useState(null)



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

    fetch(enviroment.BASE_URL + `backend/orders`, requestOptions)
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

    fetch(enviroment.BASE_URL + `backend/orders?page=${currentPage}`, requestOptions)
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

  const filterDate = (val) => {
    setdate(val)


    var d = new Date(val[0]),
        month = '' + (d.getMonth() + 1),
        day = '' + d.getDate(),
        year = d.getFullYear();

    if (month.length < 2) 
        month = '0' + month;
    if (day.length < 2) 
        day = '0' + day;

        setfirstdate([year, month, day].join('-'));

    var e = new Date(val[1]),
        smonth = '' + (e.getMonth() + 1),
        sday = '' + e.getDate(),
        syear = e.getFullYear();

    if (smonth.length < 2) 
        smonth = '0' + smonth;
    if (sday.length < 2) 
        sday = '0' + sday;

        setseconddate([syear, smonth, sday].join('-'));
  }

  const filterOrder = () => {
    setisLoading(true)
    seterror(null)

    var myHeaders = new Headers();
    myHeaders.append("Authorization", `Bearer ${token}`);

    var requestOptions = {
      method: 'GET',
      headers: myHeaders,
      redirect: 'follow'
    };

    fetch(enviroment.BASE_URL + `backend/orders?ref&channel&processed&startDate=${firstdate}&endDate=${seconddate}`, requestOptions)
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

  const exportOrders = () => {
    var myHeaders = new Headers();
    myHeaders.append("Authorization", `Bearer ${token}`);


    var requestOptions = {
      method: 'GET',
      headers: myHeaders,
      redirect: 'follow'
    };

    fetch(enviroment.BASE_URL + `backend/orders/export?channel&ref&processed&startDate=${firstdate ? firstdate : ""}&endDate=${seconddate ? seconddate : ""}&type&loanStatus`, requestOptions)
      .then(response => response.blob())
      .then(result => {
        notificationAlert.current.notificationAlert({
          place: "tr",
          message: (
            <div>
              <div>Downloading File</div>
            </div>
          ),
          type: "success",
          icon: "nc-icon nc-bell-55",
        });
        console.log(result)
        const url = window.URL.createObjectURL(new Blob([result]));
        const link = document.createElement('a');
        link.href = url;
        link.setAttribute('download', firstdate ? `Report${firstdate} ${seconddate}.xlsx` : "Report.xlsx");
        // 3. Append to html page
        document.body.appendChild(link);
        // 4. Force download
        link.click();
        // 5. Clean up and remove the link
        link.parentNode.removeChild(link);
      })
      .catch(error => console.log('error', error));
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
                <Row>
                  <Col md="7">
                    <CardHeader>All Orders</CardHeader>

                  </Col>
                  <Col md="5">
                    <DateRangePicker
                     className="filter"
                     onChange={(val) => filterDate(val)} 
                     value={date}
                     clearIcon={null} 
                     
                    />
                    <Button color="info" className="filter-button" onClick={filterOrder}>Filter</Button>
                    <Button color="success" className="filter-button" onClick={exportOrders}>Export</Button>
                  </Col>

                </Row>
                  <CardBody>
                  <Table responsive>
                      <thead className="text-primary">
                        <tr>
                          <th>Ref</th>
                          <th>Amount</th>
                          <th>Channel Name</th>
                          <th>Channel Type</th>
                          <th>Payment Type</th>
                          <th>Type</th>
                          <th>Status</th>
                          <th className="text-right">Created At</th>
                        </tr>
                      </thead>
                      <tbody>
                        {orders?.map((order) => (
                          <tr key={order.order_id} className="plans-row">
                            <td onClick={() => {history.push('/admin/orders/' + order.order_id)}}>{order.order_ref}</td>
                            <td onClick={() => {history.push('/admin/orders/' + order.order_id)}}>N{order.order_amount}</td>
                            <td onClick={() => {history.push('/admin/orders/' + order.order_id)}}>{order.channel?.channel_name ?? 'N/A'}</td>
                            <td onClick={() => {history.push('/admin/orders/' + order.order_id)}}>{order.channel?.channel_type ?? 'N/A'}</td>
                            <td onClick={() => {history.push('/admin/orders/' + order.order_id)}}>{order.order_payment_type}</td>
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

export default Orders;
