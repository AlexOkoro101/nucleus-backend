import React, { useEffect, useState, useRef } from "react";
import { useHistory } from "react-router";
// reactstrap components
import { Card, CardHeader, CardBody, Row, Col, Table, Button, Modal, ModalHeader, ModalBody, ModalFooter, Input } from "reactstrap";
import { enviroment } from "variables/enviroment";
import NotificationAlert from "react-notification-alert";

function Plans() {
  const notificationAlert = useRef();
  var Spinner = require('react-spinkit');
  const [token, settoken] = useState(null)
  const [plans, setplans] = useState(null)
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
    console.log(item[0])
    item[0]?.classList.add('provider-table')
  }, [plans])


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
      getPlans(formatItem?.token)
    }
  }


  const getPlans = (token) => {
    setisLoading(true)
    seterror(null)

    var myHeaders = new Headers();
    myHeaders.append("Authorization", `Bearer ${token}`);

    var requestOptions = {
      method: 'GET',
      headers: myHeaders,
      redirect: 'follow'
    };

    fetch(enviroment.BASE_URL + "backend/plans", requestOptions)
      .then(response => {
        setisLoading(false)
        return response.text()
      })
      .then(result => {
        const item = JSON.parse(result)
        console.log(item)
        setplans(item.data.data)
      })
      .catch(error => {
        seterror(error)
        console.log('error', error)
      });
  }

  const showModal = (id) => {
    setmodal(true)
    setplanId(id)


    
  }

  const submitHospital = () => {
    setmodalIsLoading(true)
    seterror(null)


    var myHeaders = new Headers();
    myHeaders.append("Accept", "application/json");
    myHeaders.append("Authorization", `Bearer ${token}`);

    var formdata = new FormData();
    formdata.append("file", file[0], file[0].name);
    formdata.append("plan", planId);

    var requestOptions = {
      method: 'POST',
      headers: myHeaders,
      body: formdata,
      redirect: 'follow'
    };

    fetch(enviroment.BASE_URL + "backend/hospitals", requestOptions)
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
                <div>Upload Successful.</div>
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
                <div>Upload failed. file is invalid!</div>
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

            {plans && (
              <>
                <div className="text-right">
                  <Button
                  className="btn-round"
                    color="primary"
                    type="button"
                    onClick={() => history.push('/admin/create-plan')}
                  >Create Plan</Button>
                </div>
                <Card>
                  
                  <CardHeader>All Plans</CardHeader>
                  <CardBody>
                  <Table responsive>
                      <thead className="text-primary">
                        <tr>
                          <th>Name</th>
                          <th>Tenure</th>
                          <th>Amount</th>
                          <th>Status</th>
                          <th className="text-right">Action</th>
                        </tr>
                      </thead>
                      <tbody>
                        {plans?.slice(0).reverse().map((plan) => (
                          <tr key={plan.plan_id} className="plans-row">
                            <td onClick={() => {history.push('/admin/plans/' + plan.plan_id)}}>{plan.plan_name}</td>
                            <td onClick={() => {history.push('/admin/plans/' + plan.plan_id)}}>{plan.plan_tenure}</td>
                            <td onClick={() => {history.push('/admin/plans/' + plan.plan_id)}}>N{plan.plan_amount}</td>
                            <td onClick={() => {history.push('/admin/plans/' + plan.plan_id)}}>{plan.plan_status == 1 ? 'Active' : "Inactive"}</td>
                            <td className="text-right"> <Button color="info" onClick={() => showModal(plan.plan_id)}>Add Hospital</Button></td>
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
                  onClick={submitHospital}
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

export default Plans;
