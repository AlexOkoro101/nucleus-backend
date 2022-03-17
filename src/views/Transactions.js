import React, { useEffect, useState, useRef } from "react";
import { useHistory } from "react-router";
// reactstrap components
import { Card, CardHeader, CardBody, Row, Col, Table, Button, Modal, ModalHeader, ModalBody, ModalFooter, Input } from "reactstrap";
import { enviroment } from "variables/enviroment";
import NotificationAlert from "react-notification-alert";
import DateRangePicker from '@wojtekmaj/react-daterange-picker';

function Transactions() {
  const notificationAlert = useRef();
  var Spinner = require('react-spinkit');
  const [token, settoken] = useState(null)
  const [transactions, settransactions] = useState(null)
  const [isLoading, setisLoading] = useState(false)
  const [modalIsLoading, setmodalIsLoading] = useState(false)
  const [error, seterror] = useState(null)
  const [modal, setmodal] = useState(false)
  const [planId, setplanId] = useState(null)
  const [file, setfile] = useState(null)

  //date filter
  const [date, setdate] = useState([new Date(), new Date()]);
  const [firstdate, setfirstdate] = useState(null)
  const [seconddate, setseconddate] = useState(null)

  //Route hook
  const history = useHistory()

  useEffect(() => {
    const item = document.getElementsByClassName('table-responsive')
    item[0]?.classList.add('provider-table')
  }, [transactions])


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
      getTransactionss(formatItem?.token)
    }
  }


  const getTransactionss = (token) => {
    setisLoading(true)
    seterror(null)

    var myHeaders = new Headers();
    myHeaders.append("Authorization", `Bearer ${token}`);

    var requestOptions = {
      method: 'GET',
      headers: myHeaders,
      redirect: 'follow'
    };

    fetch(enviroment.BASE_URL + "backend/transactions", requestOptions)
      .then(response => {
        setisLoading(false)
        return response.text()
      })
      .then(result => {
        const item = JSON.parse(result)
        console.log(item)
        settransactions(item.data.data)
      })
      .catch(error => {
        seterror(error)
        console.log('error', error)
      });
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

    fetch(enviroment.BASE_URL + `backend/transactions?startDate=${firstdate}&endDate=${seconddate}&transactionID&status &ref&verified`, requestOptions)
      .then(response => {
        setisLoading(false)
        return response.text()
      })
      .then(result => {
        const item = JSON.parse(result)
        console.log(item)
        settransactions(item.data.data)
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

            {transactions && (
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
                  <Col md="8">
                    <CardHeader>All Tranactions</CardHeader>

                  </Col>
                  <Col md="4">
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
                          <th>ID</th>
                          <th>Ref</th>
                          <th>Amount</th>
                          <th>Status</th>
                          <th>Description</th>
                          <th>Verified</th>
                          <th className="text-right">Date created</th>
                        </tr>
                      </thead>
                      <tbody>
                        {transactions?.slice(0).reverse().map((transaction) => (
                          <tr key={transaction.id} className="plans-row">
                            <td>
                              {transaction.transaction_id}
                            </td>
                            <td >{transaction.ref}</td>
                            <td>N{transaction.amount}</td>
                            <td>{transaction.status}</td>
                            <td>
                              {transaction.description}
                            </td>
                            <td>{transaction.verified ? "True" : "False"}</td>
                            <td className="text-right"> 
                              {new Date(transaction.created_at).toLocaleDateString("en-NG",
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

export default Transactions;
