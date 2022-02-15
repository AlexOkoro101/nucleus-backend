import React, { useEffect, useState } from "react";
import { Card, CardHeader, CardBody, CardFooter, Row, Col,  Button,
    CardTitle,
    FormGroup,
    Form,
    Input,
    } from "reactstrap";
import {useParams} from 'react-router-dom';
import {enviroment} from '../../../variables/enviroment';
import {useHistory} from "react-router-dom";

function CreatePlan() {
    var Spinner = require('react-spinkit');
    const history = useHistory();
    const [userToken, setuserToken] = useState(null)

    const [isLoading, setisLoading] = useState(false)
    const [error, seterror] = useState(null)

    const [insurers, setinsurers] = useState(null)

    const [name, setname] = useState("")
    const [amount, setamount] = useState("")
    const [tenure, settenure] = useState("15 Months")
    const [insurer, setinsurer] = useState("3")
    const [website, setwebsite] = useState("")
    const [status, setstatus] = useState("1")
    const [category, setcategory] = useState("Individual")
    const [generalConsultation, setgeneralConsultation] = useState(false)
    const [glasses, setglasses] = useState(false)
    const [specialConsultation, setspecialConsultation] = useState(false)
    const [paedetrics, setpaedetrics] = useState(false)
    const [admission, setadmission] = useState(false)
    const [mentalCare, setmentalCare] = useState(false)
    const [fertilityCare, setfertilityCare] = useState(false)
    const [antenatalCare, setantenatalCare] = useState(false)
    const [opticalCare, setopticalCare] = useState(false)
    const [dentalCare, setdentalCare] = useState(false)

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
            getInsurers(formatItem?.token)
            setuserToken(formatItem?.token)
        }
    }

    const getInsurers = (token) => {
        var myHeaders = new Headers();
        myHeaders.append("Authorization", `Bearer ${token}`);

        var requestOptions = {
        method: 'GET',
        headers: myHeaders,
        redirect: 'follow'
        };

        fetch(enviroment.BASE_URL + "backend/insurers", requestOptions)
        .then(response => {
            setisLoading(false)
            return response.text()
        })
        .then(result => {
            const item = JSON.parse(result)
            console.log("plans", item)
            // setplanDetail(item.data)
            setinsurers(item.data.data)
        })
        .catch(error => {
            seterror(error)
            console.log('error', error)
        });
    }


    const createPlan = () => {
        setisLoading(true)
        seterror(null)

        const updateObj = {
            name: name,
            amount: amount,
            planWebsite: website,
            tenure: tenure,
            insurer: insurer,
            status: status,
            category: category,
            services: {
                general_consulation: generalConsultation,
                glasses: glasses,
                specialist_consultation: specialConsultation,
                paedetrics: paedetrics,
                admission: admission,
                mental_care: mentalCare,
                fertility_care: fertilityCare,
                antenatal_care: antenatalCare,
                optical_care: opticalCare,
                dental_care: dentalCare
            }
        }

        var myHeaders = new Headers();
        myHeaders.append("Content-Type", "application/json");
        myHeaders.append("Authorization", `Bearer ${userToken}`);

        var raw = JSON.stringify(updateObj);

        var requestOptions = {
        method: 'POST',
        headers: myHeaders,
        body: raw,
        redirect: 'follow',
        };

        fetch(enviroment.BASE_URL + "backend/plans", requestOptions)
        .then(response => {
            setisLoading(false)
            return response.text()
        })
        .then(result => {
            console.log(result)
            const item = JSON.parse(result)
            if(item.status) {
                history.push("/admin/plans")
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
            <Row>
                <Col md="8">
                    <Card className="card-user">
                        <CardHeader>
                            <CardTitle tag="h5">Create Plan</CardTitle>
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
                                    <label>Amount</label>
                                    <Input 
                                    placeholder="Amount" 
                                    type="number" 
                                    defaultValue={amount}
                                    onChange={(e) => setamount(e.target.value)}
                                    />
                                </FormGroup>
                                </Col>
                            </Row>
                            <Row>
                                <Col className="pr-1" md="6">
                                <FormGroup>
                                    <label>Tenure</label>
                                    <select 
                                    className="plan-select"
                                    value={tenure}
                                    onChange={(e) => settenure(e.target.value)}
                                    >
                                        <option value="1 Month">1 Month</option>
                                        <option value="2 Months">2 Months</option>
                                        <option value="3 Months">3 Months</option>
                                        <option value="4 Months">4 Months</option>
                                        <option value="5 Months">5 Months</option>
                                        <option value="6 Months">6 Months</option>
                                        <option value="7 Months">7 Months</option>
                                        <option value="8 Months">8 Months</option>
                                        <option value="9 Months">9 Months</option>
                                        <option value="10 Months">10 Months</option>
                                        <option value="11 Months">11 Months</option>
                                        <option value="12 Months">12 Months</option>
                                    </select>
                                </FormGroup>
                                </Col>
                                <Col className="pl-1" md="6">
                                <FormGroup>
                                    <label>Insurer</label><br />
                                    <select className="plan-select" value={insurer} onChange={(e) => setinsurer(e.target.value)}>
                                        {insurers?.map((insurer) => (
                                            <option key={insurer?.insurer_id} value={`${insurer?.insurer_id}`}>{insurer?.insurer_name}</option>
                                        ))}
                                    </select>
                                </FormGroup>
                                </Col>
                            </Row>
                            <Row>
                                <Col md="12">
                                <FormGroup>
                                    <label>Website</label>
                                    <Input
                                    defaultValue={website}
                                    onChange={(e) => setwebsite(e.target.value)}
                                    placeholder="Website"
                                    type="text"
                                    />
                                </FormGroup>
                                </Col>
                            </Row>
                            <Row>
                                <Col className="pr-1" md="6">
                                <FormGroup>
                                    <label>Status</label>
                                    <select 
                                    className="plan-select"
                                    value={status}
                                    onChange={(e) => setstatus(e.target.value)}
                                    >
                                        <option value="1">True</option>
                                        <option value="0">False</option>
                                    </select>
                                </FormGroup>
                                </Col>
                                <Col className="pl-1" md="6">
                                <FormGroup>
                                    <label>Category</label>
                                    <select 
                                    className="plan-select"
                                    value={category}
                                    onChange={(e) => setcategory(e.target.value)}
                                    >
                                        <option value="INDIVIDUAL">Individual</option>
                                        <option value="FAMILY">Family</option>
                                        <option value="SME">SME</option>
                                        <option value="ELDERLY">Elderly</option>
                                    </select>
                                </FormGroup>
                                </Col>
                                
                            </Row>
                            <label>Services</label>
                            <hr />
                            <Row>
                                <Col md="6" className="px-5">
                                <FormGroup>
                                    <Input type="checkbox" onChange={() => {setgeneralConsultation(!generalConsultation)}} checked={generalConsultation}/>
                                    <label>General Consulation</label>
                                </FormGroup>
                                </Col>

                                <Col md="6" className="px-5">
                                <FormGroup>
                                    <Input type="checkbox" onChange={() => setglasses(!glasses)} checked={glasses}/>
                                    <label>Glasses</label>
                                </FormGroup>
                                </Col>

                                <Col md="6" className="px-5">
                                <FormGroup>
                                    <Input type="checkbox" onChange={() => setspecialConsultation(!specialConsultation)} checked={specialConsultation}/>
                                    <label>Specialist Consultation</label>
                                </FormGroup>
                                </Col>

                                <Col md="6" className="px-5">
                                <FormGroup>
                                    <Input type="checkbox" onChange={() => {setpaedetrics(!paedetrics)}} checked={paedetrics}/>
                                    <label>Paedetrics</label>
                                </FormGroup>
                                </Col>

                                <Col md="6" className="px-5">
                                <FormGroup>
                                    <Input type="checkbox" onChange={() => {setadmission(!admission)}} checked={admission}/>
                                    <label>Admission</label>
                                </FormGroup>
                                </Col>

                                <Col md="6" className="px-5">
                                <FormGroup>
                                    <Input type="checkbox" onChange={() => {setmentalCare(!mentalCare)}} checked={mentalCare}/>
                                    <label>Mental Care</label>
                                </FormGroup>
                                </Col>

                                <Col md="6" className="px-5">
                                <FormGroup>
                                    <Input type="checkbox" onChange={() => {setfertilityCare(!fertilityCare)}} checked={fertilityCare} />
                                    <label>Fertility Care</label>
                                </FormGroup>
                                </Col>

                                <Col md="6" className="px-5">
                                <FormGroup>
                                    <Input type="checkbox" onChange={() => {setantenatalCare(!antenatalCare)}} checked={antenatalCare}/>
                                    <label>Antenatal Care</label>
                                </FormGroup>
                                </Col>

                                <Col md="6" className="px-5">
                                <FormGroup>
                                    <Input type="checkbox" onChange={() => {setopticalCare(!opticalCare)}} checked={opticalCare}/>
                                    <label>Optical Care</label>
                                </FormGroup>
                                </Col>

                                <Col md="6" className="px-5">
                                <FormGroup>
                                    <Input type="checkbox" onChange={() => {setdentalCare(!dentalCare)}} checked={dentalCare}/>
                                    <label>Dental Care</label>
                                </FormGroup>
                                </Col>
                            </Row>
                            <Row>
                                <div className="update ml-auto mr-auto">
                                <Button
                                    onClick={createPlan}
                                    className="btn-round"
                                    color="primary"
                                    type="button"
                                >
                                    {isLoading && (
                                        <Spinner name='circle' color="#ffffff" fadeIn="none" className="button-loader"/>
                                    )}
                                    Create Plan
                                </Button>
                                </div>
                            </Row>
                            </Form>
                        </CardBody>
                    </Card>
                </Col>
            </Row>
        </div>
        </>
    )
}

export default CreatePlan
