import React, { useEffect, useState, useRef } from "react";
import { useHistory } from "react-router";
// reactstrap components
import { Card, CardHeader, CardBody, Row, Col, Table, Button, Modal, ModalHeader, ModalBody, ModalFooter, Input, Tooltip, FormGroup } from "reactstrap";
import { enviroment } from "variables/enviroment";
import NotificationAlert from "react-notification-alert";

function Channels() {
  const notificationAlert = useRef();
  var Spinner = require('react-spinkit');
  const [token, settoken] = useState(null)
  const [channels, setchannels] = useState(null)
  const [isLoading, setisLoading] = useState(false)
  const [modalIsLoading, setmodalIsLoading] = useState(false)
  const [error, seterror] = useState(null)
  const [modal, setmodal] = useState(false)

  const [name, setname] = useState("")
  const [type, settype] = useState("")
  const [email, setemail] = useState("")

  const [showApi, setshowApi] = useState(false)

  //Route hook
  const history = useHistory()



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
      getChannels(formatItem?.token)
    }
  }


  const getChannels = (token) => {
    setisLoading(true)
    seterror(null)

    var myHeaders = new Headers();
    myHeaders.append("Authorization", `Bearer ${token}`);

    var requestOptions = {
      method: 'GET',
      headers: myHeaders,
      redirect: 'follow'
    };

    fetch(enviroment.BASE_URL + "backend/channels", requestOptions)
      .then(response => {
        setisLoading(false)
        return response.text()
      })
      .then(result => {
        const item = JSON.parse(result)
        console.log(item.data.data)
        setchannels(item.data.data)
      })
      .catch(error => {
        seterror(error)
        console.log('error', error)
      });
  }

  const showModal = () => {
    setmodal(true)
    // setplanId(id)
  }

  const submitChannel = () => {
    setmodalIsLoading(true)
    seterror(null)


    var myHeaders = new Headers();
    myHeaders.append("Accept", "application/json");
    myHeaders.append("Authorization", `Bearer ${token}`);

    var raw = JSON.stringify({
      channelName: name,
      channelType: type,
      channelEmail: email
    });

    console.log(raw)

    var requestOptions = {
      method: 'POST',
      headers: myHeaders,
      body: raw,
      redirect: 'follow'
    };

    fetch(enviroment.BASE_URL + "backend/channels", requestOptions)
      .then(response => {
        setmodalIsLoading(false)
        return response.text()
      })
      .then(result => {
        console.log("hospital", result)
        const item = JSON.parse(result)

        if(item?.status == true) {
          setmodal(!modal)
          notificationAlert.current.notificationAlert({
            place: "tr",
            message: (
              <div>
                <div>Channel Added Successfully.</div>
              </div>
            ),
            type: "success",
            icon: "nc-icon nc-bell-55",
          });
        } else if(item?.message) {
          notificationAlert.current.notificationAlert({
            place: "tr",
            message: (
              <div>
                <div>Unsuccessful!</div>
              </div>
            ),
            type: "danger",
            icon: "nc-icon nc-bell-55",
          });
        }
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

            {channels && (
              <>
                <div className="text-right">
                  <Button
                  className="btn-round"
                    color="primary"
                    type="button"
                    onClick={() => setmodal(true)}
                  >Create Channel</Button>
                </div>
                <Card>
                  
                  <CardHeader>All Channels</CardHeader>
                  <CardBody>
                  <Table responsive>
                      <thead className="text-primary">
                        <tr>
                          <th>Name</th>
                          <th>API Key <Button color="light" className="api-button" onClick={() => setshowApi(!showApi)}>{showApi ? "Hide" : "Show"}</Button></th>
                          <th>Type</th>
                          <th>Link</th>
                          <th>Email</th>
                          <th className="text-right">Created</th>
                        </tr>
                      </thead>
                      <tbody>
                        {channels?.slice(0).reverse().map((channel) => (
                          <tr key={channel.channel_id}>
                            <td>{channel.channel_name}</td>
                            <td>
                            
                              {showApi ? (
                              channel.channel_api_key
                              ) : (
                                "*******************************"
                              )}
                           
                             </td>
                            <td>{channel.channel_type}</td>
                            <td>{channel.channel_link || "N/A"}</td>
                            <td>{channel.channel_email || "N/A"}</td>
                            <td className="text-right"> 
                            
                              {new Date(channel.create_time).toLocaleDateString("en-NG",
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
            <Modal
              isOpen={modal}
            >
              <ModalHeader toggle={() => setmodal(!modal)}>
                Add Channel
              </ModalHeader>
              <ModalBody>
                <Col md="8">
                  <FormGroup>
                    <label>Name</label>
                    <Input
                      id="name"
                      name="name"
                      type="text"
                      value={name}
                      onChange={(e) => setname(e.target.value)}
                    />
                  </FormGroup>
                </Col>
                <Col md="8">
                  <FormGroup>
                    <label>Type</label>
                    <select
                      className="plan-select"
                      id="type"
                      name="type"
                      value={type}
                      onChange={(e) => settype(e.target.value)}
                    >
                    <option value="web">Web</option>
                    <option value="mobile">Mobile</option>
                    </select>
                  </FormGroup>
                </Col>
                <Col md="8">
                  <FormGroup>
                    <label>Email</label>
                    <Input
                      id="email"
                      name="email"
                      type="email"
                      value={email}
                      onChange={(e) => setemail(e.target.value)}
                    />
                  </FormGroup>
                </Col>
              </ModalBody>
              <ModalFooter>
                <Button
                  color="primary"
                  onClick={submitChannel}
                >
                  {modalIsLoading && (
                    <Spinner name='circle' color="#ffffff" fadeIn="none" className="button-loader" />
                  )}
                  Submit
                </Button>
                {' '}
                <Button onClick={() => setmodal(!modal)}>
                  Cancel
                </Button>
              </ModalFooter>
            </Modal>
          </Col>
        </Row>
      </div>
    </>
  );
}

export default Channels;
