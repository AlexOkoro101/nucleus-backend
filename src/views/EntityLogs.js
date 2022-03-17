import React, { useEffect, useState, useRef } from "react";
import { useHistory } from "react-router";
// reactstrap components
import { Card, CardHeader, CardBody, Row, Col, Table, Button, Modal, ModalHeader, ModalBody, ModalFooter, Input } from "reactstrap";
import { enviroment } from "variables/enviroment";
import NotificationAlert from "react-notification-alert";
import ReactPaginate from 'react-paginate'
import DateRangePicker from '@wojtekmaj/react-daterange-picker';

function EntityLogs() {
  const notificationAlert = useRef();
  var Spinner = require('react-spinkit');
  const [token, settoken] = useState(null)
  const [entities, setentities] = useState(null)
  const [isLoading, setisLoading] = useState(false)
  const [modalIsLoading, setmodalIsLoading] = useState(false)
  const [error, seterror] = useState(null)
  const [modal, setmodal] = useState(false)
  const [planId, setplanId] = useState(null)
  const [file, setfile] = useState(null)

  const [totalPage, settotalPage] = useState(0)

  //date filter
  const [date, setdate] = useState([new Date(), new Date()]);
  const [firstdate, setfirstdate] = useState(null)
  const [seconddate, setseconddate] = useState(null)
  const [filterEmail, setfilterEmail] = useState("")

  //Route hook
  const history = useHistory()

  useEffect(() => {
    const item = document.getElementsByClassName('table-responsive')
    item[0]?.classList.add('provider-table')
  }, [entities])


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
      getEntities(formatItem?.token)
    }
  }


  const getEntities = (token) => {
    setisLoading(true)
    seterror(null)

    var myHeaders = new Headers();
    myHeaders.append("Authorization", `Bearer ${token}`);

    var requestOptions = {
      method: 'GET',
      headers: myHeaders,
      redirect: 'follow'
    };

    fetch(enviroment.BASE_URL + "backend/entities", requestOptions)
      .then(response => {
        
        return response.text()
      })
      .then(result => {
        setisLoading(false)
        const item = JSON.parse(result)
        console.log(item)
        setentities(item.data.data)
        settotalPage(item.data.last_page)
      })
      .catch(error => {
        seterror(error)
        console.log('error', error)
      });
  }

  const fetchEntities = (currentPage) => {
    setisLoading(true)
    seterror(null)

    var myHeaders = new Headers();
    myHeaders.append("Authorization", `Bearer ${token}`);

    var requestOptions = {
      method: 'GET',
      headers: myHeaders,
      redirect: 'follow'
    };

    fetch(enviroment.BASE_URL + `backend/entities?page=${currentPage}`, requestOptions)
      .then(response => {
        
        return response.text()
      })
      .then(result => {
        setisLoading(false)
        const item = JSON.parse(result)
        console.log(item)
        setentities(item.data.data)
      })
      .catch(error => {
        seterror(error)
        console.log('error', error)
      });
  }

  const handlePageChange = (data) => {
    console.log(data.selected)

    let currentPage = data.selected + 1

    fetchEntities(currentPage)
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

    fetch(enviroment.BASE_URL + `backend/entities?startDate=${firstdate}&endDate=${seconddate}&email=${filterEmail}`, requestOptions)
      .then(response => {
        
        return response.text()
      })
      .then(result => {
        setisLoading(false)
        const item = JSON.parse(result)
        console.log(item)
        setentities(item.data.data)
        settotalPage(item.data.last_page)
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

            {entities && (
              <>
                <div className="text-right">
                  <Button
                  className="btn-round"
                    color="primary"
                    type="button"
                    
                  >Export</Button>
                </div>
                <Card>
                  
                  <Row>
                  <Col md="6">
                    <CardHeader>All Enrollee Logs</CardHeader>

                  </Col>
                  <Col md="6">
                    <Input 
                      placeholder="Filter with email" 
                      className="w-auto inline filter-email"
                      value={filterEmail}
                      onChange={(val) => setfilterEmail(val.target.value)}
                    ></Input>

                    <DateRangePicker
                     className="filter"
                     onChange={(val) => filterDate(val)} 
                     value={date}
                     clearIcon={null} 
                     
                    />

                    <Button color="info" className="filter-button" onClick={filterOrder}>Filter</Button>
                  </Col>

                </Row>
                  <CardBody>
                  <Table responsive>
                      <thead className="text-primary">
                        <tr>
                          <th>Photo</th>
                          <th>Name</th>
                          <th>Sex</th>
                          <th>DOB</th>
                          <th>Address</th>
                          <th>Phone</th>
                          <th>Email</th>
                          <th>Hospital</th>
                          <th>Type</th>
                          <th className="text-right">Date created</th>
                        </tr>
                      </thead>
                      <tbody>
                        {entities?.slice(0).reverse().map((entity) => (
                          <tr key={entity.entity_id} className="plans-row" onClick={() => {history.push('/admin/entities/' + entity.entity_id)}}>
                            <td>
                              <img src={entity.entity_photo} alt="" width="50" height="50" />
                            </td>
                            <td>{entity.entity_firstname} {entity.entity_lastname}</td>
                            <td>{entity.entity_sex || "N/A"}</td>
                            <td>{entity.entity_dob || "N/A"}</td>
                            <td>{entity.entity_address}</td>
                            <td>{entity.entity_phone}</td>
                            <td>{entity.entity_email}</td>
                            <td>{entity.entity_hospital || "N/A"}</td>
                            <td>{entity.entity_type || "N/A"}</td>
                            <td className="text-right"> 
                              {new Date(entity.create_time).toLocaleDateString("en-NG",
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

export default EntityLogs;
