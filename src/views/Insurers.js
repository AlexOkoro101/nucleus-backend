import React, { useEffect, useState, useRef } from "react";
import { useHistory } from "react-router";
// reactstrap components
import { Card, CardHeader, CardBody, Row, Col, Table, Button, Modal, ModalHeader, ModalBody, ModalFooter, Input, FormGroup } from "reactstrap";
import { enviroment } from "variables/enviroment";
import NotificationAlert from "react-notification-alert";

function Insurers() {
  const notificationAlert = useRef();
  var Spinner = require('react-spinkit');
  const [token, settoken] = useState(null)
  const [insurers, setinsurers] = useState(null)
  const [isLoading, setisLoading] = useState(false)
  const [modalIsLoading, setmodalIsLoading] = useState(false)
  const [error, seterror] = useState(null)
  const [modal, setmodal] = useState(false)
  const [insurerId, setinsurerId] = useState(null)
  // const [file, setfile] = useState(null)

  const [name, setname] = useState("")
  const [alias, setalias] = useState("")
  const [phone, setphone] = useState("")
  const [email, setemail] = useState("")
  const [status, setstatus] = useState(false)
  const [address, setaddress] = useState("")

  //Route hook
  const history = useHistory()



  useEffect(() => {
    getToken()
    return () => {
      getToken()
    }
  }, [modal])

  const getToken = () => {
    const user = localStorage.getItem("user");

    if(!user) return;

    const formatItem = JSON.parse(user);

    if(formatItem?.token) {
      settoken(formatItem?.token)
      getInsurers(formatItem?.token)
    }
  }


  const getInsurers = (token) => {
    setisLoading(true)
    seterror(null)

    var myHeaders = new Headers();
    myHeaders.append("Authorization", `Bearer ${token}`);

    var requestOptions = {
      method: 'GET',
      headers: myHeaders,
      redirect: 'follow'
    };

    fetch(enviroment.BASE_URL + "backend/insurers?name&alias&phone", requestOptions)
      .then(response => {
        setisLoading(false)
        return response.text()
      })
      .then(result => {
        const item = JSON.parse(result)
        console.log(item)
        setinsurers(item.data.data)
      })
      .catch(error => {
        seterror(error)
        console.log('error', error)
      });
  }



  const submitInsurer = () => {
    setmodalIsLoading(true)
    seterror(null)


    var myHeaders = new Headers();
    myHeaders.append("Content-Type", "application/json");
    myHeaders.append("Accept", "application/json");
    myHeaders.append("Authorization", `Bearer ${token}`);

    var raw = JSON.stringify({
      insurerName: name,
      insurerAddress: address,
      insurerAlias: alias,
      insurerPhone: phone,
      insurerEmail: email,
      insurerStatus: status
    });

    console.log(raw)

    var requestOptions = {
      method: 'POST',
      headers: myHeaders,
      body: raw,
      redirect: 'follow'
    };

    fetch(enviroment.BASE_URL + "backend/insurers", requestOptions)
      .then(response => {
        setmodalIsLoading(false)
        return response.text()
      })
      .then(result => {
        console.log("insurer", result)
        const item = JSON.parse(result)

        if(item?.status === true) {
          setmodal(!modal)
          notificationAlert.current.notificationAlert({
            place: "tr",
            message: (
              <div>
                <div>Insurer Added.</div>
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
                <div>Operation failed!</div>
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

            {insurers && (
              <>
                <div className="text-right">
                  <Button
                  className="btn-round"
                    color="primary"
                    type="button"
                    onClick={() => setmodal(true)}
                  >Create Insurer</Button>
                </div>
                <Card>
                  
                  <CardHeader>All Insurers</CardHeader>
                  <CardBody>
                  <Table responsive>
                      <thead className="text-primary">
                        <tr>
                          <th>Name</th>
                          <th>Address</th>
                          <th>Phone</th>
                          <th>Email</th>
                          <th>Status</th>
                          <th className="text-right">Date Created</th>
                        </tr>
                      </thead>
                      <tbody>
                        {insurers?.slice(0).reverse().map((insurer) => (
                          <tr key={insurer.insurer_id} className="plans-row">
                            <td onClick={() => {history.push('/admin/insurers/' + insurer.insurer_id)}}>{insurer.insurer_name}</td>
                            <td onClick={() => {history.push('/admin/insurers/' + insurer.insurer_id)}}>{insurer.insurer_address}</td>
                            <td onClick={() => {history.push('/admin/insurers/' + insurer.insurer_id)}}>{insurer.insurer_phone}</td>
                            <td onClick={() => {history.push('/admin/insurers/' + insurer.insurer_id)}}>{insurer.insurer_email}</td>
                            <td onClick={() => {history.push('/admin/insurers/' + insurer.insurer_id)}}>{insurer.insurer_status === 1 ? 'Active' : "Inactive"}</td>
                            <td onClick={() => {history.push('/admin/insurers/' + insurer.insurer_id)}} className="text-right">
                              {new Date(insurer.create_time).toLocaleDateString("en-NG",
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
                Add Insurer
              </ModalHeader>
              <ModalBody>
                <Row>
                  <Col md="6">
                      <FormGroup>
                        <label>Name</label>
                        <Input
                          name="name"
                          value={name}
                          onChange={(e) => setname(e.target.value)}
                        ></Input>
                      </FormGroup>
                  </Col>
                  <Col md="6">
                      <FormGroup>
                        <label>Alias</label>
                        <Input
                          type="text"
                          name="alias"
                          value={alias}
                          onChange={(e) => setalias(e.target.value)}
                        ></Input>
                      </FormGroup>
                  </Col>
                </Row>
                <Row>
                  <Col md="6">
                      <FormGroup>
                        <label>Phone</label>
                        <Input
                          type="text"
                          name="phone"
                          value={phone}
                          onChange={(e) => setphone(e.target.value)}
                        ></Input>
                      </FormGroup>
                  </Col>
                  <Col md="6">
                      <FormGroup>
                        <label>Email</label>
                        <Input
                          type="email"
                          name="email"
                          value={email}
                          onChange={(e) => setemail(e.target.value)}
                        ></Input>
                      </FormGroup>
                  </Col>
                </Row>
                <Row>
                  <Col md="4">
                      <FormGroup>
                        <label>Status</label>
                        <select name="status" id="status" className="plan-select" value={status} onChange={(e) => setstatus(e.target.value)}>
                          <option value={true}>Active</option>
                          <option value={false}>Inactive</option>
                        </select>
                      </FormGroup>
                  </Col>
                  <Col md="8">
                      <FormGroup>
                        <label>Address</label>
                        <Input
                          type="text"
                          name="address"
                          value={address}
                          onChange={(e) => setaddress(e.target.value)}
                        ></Input>
                      </FormGroup>
                  </Col>
                </Row>
              </ModalBody>
              <ModalFooter>
                <Button
                  color="primary"
                  onClick={submitInsurer}
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

export default Insurers;
