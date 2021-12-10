import React, { useEffect, useState, useRef } from "react";
import { useHistory } from "react-router";
// reactstrap components
import { Card, CardHeader, CardBody, Row, Col, Table, Button, Modal, ModalHeader, ModalBody, ModalFooter, Input } from "reactstrap";
import { enviroment } from "variables/enviroment";
import NotificationAlert from "react-notification-alert";

function USSDLogs() {
  const notificationAlert = useRef();
  var Spinner = require('react-spinkit');
  const [token, settoken] = useState(null)
  const [ussds, setussds] = useState(null)
  const [isLoading, setisLoading] = useState(false)
  const [modalIsLoading, setmodalIsLoading] = useState(false)
  const [error, seterror] = useState(null)
  const [modal, setmodal] = useState(false)
  const [planId, setplanId] = useState(null)
  const [file, setfile] = useState(null)

  //Route hook
  const history = useHistory()

  useEffect(() => {
    const item = document.getElementsByClassName('table-responsive')
    item[0]?.classList.add('provider-table')
  }, [ussds])


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
      getUSSDs(formatItem?.token)
    }
  }


  const getUSSDs = (token) => {
    setisLoading(true)
    seterror(null)

    var myHeaders = new Headers();
    myHeaders.append("Authorization", `Bearer ${token}`);

    var requestOptions = {
      method: 'GET',
      headers: myHeaders,
      redirect: 'follow'
    };

    fetch(enviroment.BASE_URL + "backend/ussd-logs", requestOptions)
      .then(response => {
        setisLoading(false)
        return response.text()
      })
      .then(result => {
        const item = JSON.parse(result)
        console.log(item)
        setussds(item.data.data)
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

            {ussds && (
              <>
                <div className="text-right">
                  <Button
                  className="btn-round"
                    color="primary"
                    type="button"
                    
                  >Export</Button>
                </div>
                <Card>
                  
                  <CardHeader>All Entities</CardHeader>
                  <CardBody>
                  <Table responsive>
                      <thead className="text-primary">
                        <tr>
                          <th>Session ID</th>
                          <th>Order Ref</th>
                          <th>MSISDN</th>
                          <th>Entry code</th>
                          <th>Date</th>
                          <th>Operation</th>
                          <th>Last Step</th>
                          <th>Completed</th>
                          <th className="text-right">Date created</th>
                        </tr>
                      </thead>
                      <tbody>
                        {ussds?.slice(0).reverse().map((ussd) => (
                          <tr key={ussd.id} className="plans-row">
                            <td>
                              {ussd.session_id}
                            </td>
                            <td >{ussd.order_ref}</td>
                            <td>{ussd.msisdn}</td>
                            <td>{ussd.entry_code}</td>
                            <td>
                              {new Date(ussd.date).toLocaleDateString("en-NG",
                                    {
                                        year: "numeric",
                                        day: "numeric",
                                        month: "long",
                                    }
                                )}
                            </td>
                            <td>{ussd.operation || "N/A"}</td>
                            <td>{ussd.last_step}</td>
                            <td>{ussd.completed ? "True" : "False"}</td>
                            <td className="text-right"> 
                              {new Date(ussd.create_time).toLocaleDateString("en-NG",
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

export default USSDLogs;
