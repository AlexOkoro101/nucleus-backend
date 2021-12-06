import React, { useState, useEffect } from "react";
// reactstrap components
import {
  Card,
  CardHeader,
  CardBody,
  CardTitle,
  Table,
  Row,
  Col,
  Button,
  Badge,
  Modal,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Input,
  FormGroup,
} from "reactstrap";
import axios from "axios"; // http
import NotificationAlert from "react-notification-alert";
import "react-loader-spinner/dist/loader/css/react-spinner-loader.css";
import Loader from "react-loader-spinner";
import { useHistory } from "react-router-dom";
import { enviroment } from "variables/enviroment";

const Admins = () => {
  var Spinner = require('react-spinkit');
  const notificationAlert = React.useRef();
  const [data, setData] = useState([]);
  const [isLoading, setisLoading] = useState(false);
  const [error, seterror] = useState(null)
  const [token, settoken] = useState(null)
  const [modal, setmodal] = useState(false)
  const [modalIsLoading, setmodalIsLoading] = useState(false)
  const history = useHistory(); // redirect

  const [admins, setadmins] = useState(null)

  // filters
  // const [email, setEmail] = useState("");
  // const [phoneNumber, setPhoneNumber] = useState("");


  //Form input
  const [id, setid] = useState(null)
  const [firstName, setfirstName] = useState("")
  const [lastName, setlastName] = useState("")
  const [email, setemail] = useState("")
  const [phone, setphone] = useState("")
  const [gender, setgender] = useState("Female")
  const [accessLevel, setaccessLevel] = useState(1)
  const [password, setpassword] = useState("")
  const [status, setstatus] = useState(1)

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
      getAdmins(formatItem?.token)
    }
  }

  // get all admins
  const getAdmins = (token) => {
    setisLoading(true)
    seterror(null)

    var myHeaders = new Headers();
    myHeaders.append("Accept", "application/json");
    myHeaders.append("Authorization", `Bearer ${token}`);

    var requestOptions = {
      method: 'GET',
      headers: myHeaders,
      redirect: 'follow'
    };

    fetch(enviroment.BASE_URL + "backend/admin", requestOptions)
      .then(response => {
        setisLoading(false)
        return response.text()
      })
      .then(result => {
        const item = JSON.parse(result)
        console.log(item)
        setadmins(item.data)
      })
      .catch(error => {
        seterror(error)
        console.log('error', error)
      });
  };


  const showModal = (id) => {
    // console.log(id)
    setid(id)
    
    getSingleAdmin(id)
    
  }

  const populate = (data) => {
    setfirstName(data.firstname)
    setlastName(data.lastname)
    setemail(data.email)
    setphone(data.phone_number)
    setgender(data.gender)
    setmodal(true)
  }

  const getSingleAdmin = (id) => {
    var myHeaders = new Headers();
    myHeaders.append("Accept", "application/json");
    myHeaders.append("Authorization", `Bearer ${token}`);

    var requestOptions = {
      method: 'GET',
      headers: myHeaders,
      redirect: 'follow'
    };

    fetch(enviroment.BASE_URL + "backend/admin/" + id, requestOptions)
      .then(response => {
        return response.json()
      })
      .then(result => {
        console.log(result)
        if(result.status) {
          populate(result.data)
        }
      })
      .catch(error => console.log('error', error));
  }

  const updateAdmin= () => {
    setmodalIsLoading(true)

    var myHeaders = new Headers();
    myHeaders.append("Accept", "application/json");
    myHeaders.append("Authorization", `Bearer ${token}`);
    myHeaders.append("Content-Type", "application/json");

    var raw = JSON.stringify({
      firstname: firstName,
      lastname: lastName,
      email: email,
      phoneNumber: phone,
      gender: gender,
      accessLevel: accessLevel,
      status: status
    });

    var requestOptions = {
      method: 'PUT',
      headers: myHeaders,
      body: raw,
      redirect: 'follow'
    };

    fetch(enviroment.BASE_URL + "backend/admin/" + id, requestOptions)
      .then(response => {
        setmodalIsLoading(false)
       return response.json()
      })
      .then(result => {
        console.log(result)
        if(result.status) {
          setmodal(false)
          notificationAlert.current.notificationAlert({
            place: "tr",
            message: (
              <div>
                <div>Admin updated Successfully</div>
              </div>
            ),
            type: "success",
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

            {admins && (
              <>
                <div className="text-right">
                  <Button
                  className="btn-round"
                    color="primary"
                    type="button"
                    onClick={() => history.push('create-admin')}
                  >Create Admin</Button>
                </div>
                <Card>
                  <CardHeader>
                    All Admins
                  </CardHeader>
                  <CardBody>
                    <Table responsive>
                      <thead className="text-primary">
                        <tr>
                          <th>Full Name</th>
                          <th>Gender</th>
                          <th>Phone Number</th>
                          <th>Email</th>
                          <th>Account Type</th>
                          <th className="text-right">Actions</th>
                        </tr>
                      </thead>
                      <tbody>
                        {admins.map((item, index) => (
                          <tr key={index}>
                            <td>
                              {item.firstname} {item.lastname} {item.othernames}
                            </td>
                            <td>
                              {item.gender === "MALE" ? (
                                <Badge color="info" pill>
                                  MALE
                                </Badge>
                              ) : (
                                <Badge color="danger" pill>
                                  FEMALE
                                </Badge>
                              )}
                            </td>
                            <td>{item.phone_number}</td>
                            <td>{item.email}</td>
                            <td className="">
                              <Badge color="primary" pill>
                                {item.account_type}
                              </Badge>
                            </td>
                            <td className="text-right">
                              <Button
                               onClick={() => showModal(item.id)}
                               className="btn btn-default" size="sm">
                                UPDATE
                              </Button>
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
                Update Admin
              </ModalHeader>
              <ModalBody>
                <Row>
                  <Col md="6">
                    <FormGroup>
                      <label>First Name</label>
                      <Input
                        type="text"
                        value={firstName}
                        onChange={(e) => setfirstName(e.target.value)}
                      ></Input>

                    </FormGroup>
                  </Col>
                  <Col md="6">
                    <FormGroup>
                      <label>Last Name</label>
                      <Input
                        type="text"
                        value={lastName}
                        onChange={(e) => setlastName(e.target.value)}
                      ></Input>

                    </FormGroup>
                  </Col>
                </Row>
                <Row>
                  <Col md="6">
                    <FormGroup>
                      <label>Email</label>
                      <Input
                        type="email"
                        value={email}
                        onChange={(e) => setemail(e.target.value)}
                      ></Input>

                    </FormGroup>
                  </Col>
                  <Col md="6">
                    <FormGroup>
                      <label>Phone number</label>
                      <Input
                        type="text"
                        value={phone}
                        onChange={(e) => setphone(e.target.value)}
                      ></Input>

                    </FormGroup>
                  </Col>
                </Row>
                <Row>
                  <Col md="6">
                    <FormGroup>
                      <label>Gender</label>
                      <select className="plan-select" value={gender} onChange={(e) => setgender(e.target.value)}>
                          <option value="Male">Male</option>
                          <option value="Female">Female</option>
                      </select>

                    </FormGroup>
                  </Col>
                  <Col md="6">
                    <FormGroup>
                      <label>Access Level</label>
                      <select className="plan-select" value={accessLevel} onChange={(e) => setaccessLevel(e.target.value)}>
                          <option value={1}>Level 1</option>
                      </select>

                    </FormGroup>
                  </Col>
                </Row>
              </ModalBody>
              <ModalFooter>
                <Button
                  color="primary"
                  onClick={updateAdmin}
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
};

export default Admins;
