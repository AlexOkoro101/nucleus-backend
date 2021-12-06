import React, { useEffect, useState } from "react";
import { Card, CardHeader, CardBody, CardFooter, Row, Col,  Button,
    CardTitle,
    FormGroup,
    Form,
    Input,
    Table,
    } from "reactstrap";
import {useParams} from 'react-router-dom';
import {enviroment} from '../../../variables/enviroment';
import {useHistory} from "react-router-dom";

function InsurerDetails() {
    const {id} = useParams()
    var Spinner = require('react-spinkit');
    const history = useHistory();
    const [userToken, setuserToken] = useState(null)
    const [insurerDetail, setinsurerDetail] = useState(null)

    const [isLoading, setisLoading] = useState(false)
    const [error, seterror] = useState(null)


    const [name, setname] = useState("")
    const [alias, setalias] = useState("")
    const [phone, setphone] = useState("")
    const [email, setemail] = useState("")
    const [address, setaddress] = useState("")

    useEffect(() => {
        getToken()
        return () => {
          getToken()
        }
      }, [])

    //   useEffect(() => {
    //       const item = document.getElementsByClassName('table-responsive')
    //       console.log(item[0])
    //       item[0]?.classList.add('provider-table')
    //   }, [])

      const getToken = () => {
        const user = localStorage.getItem("user");
    
        if(!user) return;
    
        const formatItem = JSON.parse(user);
    
        if(formatItem?.token) {
            setuserToken(formatItem?.token)
            getInsurerDetails(formatItem?.token)
            // getPlans(formatItem?.token)
        }
      }

    const getInsurerDetails = (token) => {
        setisLoading(true)
        seterror(null)

        var myHeaders = new Headers();
        myHeaders.append("Authorization", `Bearer ${token}`);

        var requestOptions = {
        method: 'GET',
        headers: myHeaders,
        redirect: 'follow'
        };

        fetch(enviroment.BASE_URL + "backend/insurers/" + id, requestOptions)
        .then(response => {
            setisLoading(false)
            return response.text()
        })
        .then(result => {
            const item = JSON.parse(result)
            console.log(item)
            setinsurerDetail(item.data)
            setformDetail(item.data)
        })
        .catch(error => {
            seterror(error)
            console.log('error', error)
        });
    }

    // const getPlans = (token) => {
    //     var myHeaders = new Headers();
    //     myHeaders.append("Authorization", `Bearer ${token}`);

    //     var requestOptions = {
    //     method: 'GET',
    //     headers: myHeaders,
    //     redirect: 'follow'
    //     };

    //     fetch(enviroment.BASE_URL + "backend/insurers", requestOptions)
    //     .then(response => {
    //         setisLoading(false)
    //         return response.text()
    //     })
    //     .then(result => {
    //         const item = JSON.parse(result)
    //         console.log("plans", item)
    //         // setplanDetail(item.data)
    //         setinsurers(item.data.data)
    //     })
    //     .catch(error => {
    //         seterror(error)
    //         console.log('error', error)
    //     });
    // }

    const setformDetail = (data) => {
        setname(data.insurer_name)
        setalias(data.insurer_alias)
        setphone(data.insurer_phone)
        setemail(data.insurer_email)
        setaddress(data.insurer_address)
        
    }

    const updateInsurer = () => {
        setisLoading(true)
        seterror(null)

        const updateObj = {
            insurerName: name,
            insurerAddress: address,
            insurerAlias: alias,
            insurerPhone: phone,
            insurerEmail: email
        }

        var myHeaders = new Headers();
        myHeaders.append("Content-Type", "application/json");
        myHeaders.append("Authorization", `Bearer ${userToken}`);

        var raw = JSON.stringify(updateObj);

        var requestOptions = {
        method: 'PUT',
        headers: myHeaders,
        body: raw,
        redirect: 'follow'
        };

        fetch(enviroment.BASE_URL + "backend/insurers/" + insurerDetail.insurer_id, requestOptions)
        .then(response => {
            setisLoading(false)
            return response.text()
        })
        .then(result => {
            console.log(result)
            const item = JSON.parse(result)
            if(item.status) {
                history.push("/admin/insurers")
            }
        })
        .catch(error => {
            console.log('error', error)
            seterror(error)
        });
    }

    return (
        <>
        <div className="content">
            {isLoading && (
                 <Spinner name='circle' color="#663391"  fadeIn="none"/>
            )}
            {insurerDetail && (
            <Row>
                <Col md="4">
                    
                    <Card>
                        <CardBody>
                            <div className="author">
                            <a href="#">
                                <h5 className="title">{insurerDetail?.insurer_name}</h5>
                            </a>
                            <p className="description">
                                <span className={insurerDetail?.insurer_status ? "plan-active" : "plan-inactive"}>
                                    {insurerDetail?.insurer_status ? "Active" : "Inactive"}
                                </span>
                                <span style={{display: "block"}}>{insurerDetail?.insurer_email}</span>
                            </p>
                            </div>
                        </CardBody>
                        <CardFooter>
                            <hr />
                            <div className="button-container">
                            <Row>
                                <Col className="ml-auto" md="12">
                                <h5>
                                    <small>Phone number</small><br />
                                    {insurerDetail?.insurer_phone}
                                </h5>
                                </Col>
                                
                                <Col className="mr-auto" md="12">
                                <h5>
                                    <small>Address</small><br />
                                    {insurerDetail?.insurer_address}
                                </h5>
                                </Col>
                            </Row>
                            </div>
                        </CardFooter>
                    </Card>  
                    
                </Col>  
                <Col md="8">
                    <Card className="card-user">
                    <CardHeader>
                        <CardTitle tag="h5">Edit Insurer</CardTitle>
                    </CardHeader>
                    <CardBody>
                        <Form>
                        <Row>
                            <Col className="pr-1" md="6">
                            <FormGroup>
                                <label>Name</label>
                                <Input
                                defaultValue={name}
                                onChange={(e) => setname(e.target.value)}
                                placeholder="Plan Name"
                                type="text"
                                />
                            </FormGroup>
                            </Col>
                            <Col className="pl-1" md="6">
                            <FormGroup>
                                <label>Alias</label>
                                <Input 
                                placeholder="Alias" 
                                type="text" 
                                defaultValue={alias}
                                onChange={(e) => setalias(e.target.value)}
                                />
                            </FormGroup>
                            </Col>
                        </Row>
                        <Row>
                            <Col className="pr-1" md="6">
                            <FormGroup>
                                <label>Phone</label>
                                <Input 
                                placeholder="Phone number" 
                                type="text" 
                                defaultValue={phone}
                                onChange={(e) => setphone(e.target.value)}
                                />
                            </FormGroup>
                            </Col>
                            <Col className="pl-1" md="6">
                            <FormGroup>
                                <label>Email</label><br />
                                <Input 
                                placeholder="Email" 
                                type="email" 
                                defaultValue={email}
                                onChange={(e) => setemail(e.target.value)}
                                />
                            </FormGroup>
                            </Col>
                        </Row>
                        <Row>
                            <Col md="12">
                            <FormGroup>
                                <label>Address</label>
                                <Input
                                defaultValue={address}
                                onChange={(e) => setaddress(e.target.value)}
                                placeholder="Address"
                                type="text"
                                />
                            </FormGroup>
                            </Col>
                        </Row>
                        
                        <Row>
                            <div className="update ml-auto mr-auto">
                            <Button
                                onClick={updateInsurer}
                                className="btn-round"
                                color="primary"
                                type="button"
                            >
                                {isLoading && (
                                    <Spinner name='circle' color="#ffffff" fadeIn="none" className="button-loader"/>
                                )}
                                Update Insurer
                            </Button>
                            </div>
                        </Row>
                        </Form>
                    </CardBody>
                    </Card>
                </Col>
                
            </Row>
            )}   
        </div>
        </>
    )
}

export default InsurerDetails
