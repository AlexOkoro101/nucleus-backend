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
  const [entities, setentities] = useState(null)
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
        setisLoading(false)
        return response.text()
      })
      .then(result => {
        const item = JSON.parse(result)
        console.log(item)
        setentities(item.data.data)
      })
      .catch(error => {
        seterror(error)
        console.log('error', error)
      });
  }

  // const showModal = (id) => {
  //   setmodal(true)
  //   setplanId(id)


    
  // }

  // const submitHospital = () => {
  //   setmodalIsLoading(true)
  //   seterror(null)


  //   var myHeaders = new Headers();
  //   myHeaders.append("Accept", "application/json");
  //   myHeaders.append("Authorization", `Bearer ${token}`);

  //   var formdata = new FormData();
  //   formdata.append("file", file[0], file[0].name);
  //   formdata.append("plan", planId);

  //   var requestOptions = {
  //     method: 'POST',
  //     headers: myHeaders,
  //     body: formdata,
  //     redirect: 'follow'
  //   };

  //   fetch(enviroment.BASE_URL + "backend/hospitals", requestOptions)
  //     .then(response => {
  //       setmodalIsLoading(false)
  //       return response.text()
  //     })
  //     .then(result => {
  //       console.log("hospital", result)
  //       const item = JSON.parse(result)

  //       if(item?.status == true) {
  //         setmodal(!modal)
  //         notificationAlert.current.notificationAlert({
  //           place: "tr",
  //           message: (
  //             <div>
  //               <div>Upload Successful.</div>
  //             </div>
  //           ),
  //           type: "success",
  //           icon: "nc-icon nc-bell-55",
  //         });
  //       } else if(item?.message) {
  //         notificationAlert.current.notificationAlert({
  //           place: "tr",
  //           message: (
  //             <div>
  //               <div>Upload failed. file is invalid!</div>
  //             </div>
  //           ),
  //           type: "danger",
  //           icon: "nc-icon nc-bell-55",
  //         });
  //       }
  //     })
  //     .catch(error => console.log('error', error));
  // }


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
                  
                  <CardHeader>All Entities</CardHeader>
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
                          <th>Individual</th>
                          <th className="text-right">Date created</th>
                        </tr>
                      </thead>
                      <tbody>
                        {entities?.slice(0).reverse().map((entity) => (
                          <tr key={entity.entity_id} className="plans-row" onClick={() => {history.push('/admin/plans/' + entity.entity_id)}}>
                            <td>
                              <img src={entity.entity_photo} alt="" width="50" />
                            </td>
                            <td >{entity.entity_firstname} {entity.entity_lastname}</td>
                            <td>{entity.entity_sex}</td>
                            <td>{entity.entity_dob}</td>
                            <td>{entity.entity_address}</td>
                            <td>{entity.entity_phone}</td>
                            <td>{entity.entity_email}</td>
                            <td>{entity.entity_hospital}</td>
                            <td>{entity.entity_type}</td>
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
              </>

            )}
            <Modal
              isOpen={modal}
            >
              <ModalHeader toggle={() => setmodal(!modal)}>
                Add Hospital
              </ModalHeader>
              <ModalBody>
                <Input
                  id="hospital-file"
                  name="file"
                  type="file"
                  onChange={(e) => setfile(e.target.files)}
                />
              </ModalBody>
              <ModalFooter>
                <Button
                  color="primary"
                  // onClick={submitHospital}
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

export default USSDLogs;
