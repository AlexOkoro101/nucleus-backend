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

function OrderDetails() {
    const {id} = useParams()
    var Spinner = require('react-spinkit');
    const history = useHistory();
    const [userToken, setuserToken] = useState(null)
    const [orderDetail, setorderDetail] = useState(null)

    const [isLoading, setisLoading] = useState(false)
    const [error, seterror] = useState(null)


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
            getOrderDetails(formatItem?.token)
            // getPlans(formatItem?.token)
        }
      }

    const getOrderDetails = (token) => {
        setisLoading(true)
        seterror(null)

        var myHeaders = new Headers();
        myHeaders.append("Authorization", `Bearer ${token}`);

        var requestOptions = {
        method: 'GET',
        headers: myHeaders,
        redirect: 'follow'
        };

        fetch(enviroment.BASE_URL + "backend/orders/" + id, requestOptions)
        .then(response => {
            setisLoading(false)
            return response.text()
        })
        .then(result => {
            const item = JSON.parse(result)
            console.log(item)
            setorderDetail(item.data)
        })
        .catch(error => {
            seterror(error)
            console.log('error', error)
        });
    }



    return (
        <>
        <div className="content">
            {isLoading && (
                 <Spinner name='circle' color="#663391"  fadeIn="none"/>
            )}
            {orderDetail && (
            <Row>
                <Col md="12">
                    <Card className="card-user">
                    <CardHeader>
                        <CardTitle tag="h5">Order Details</CardTitle>
                    </CardHeader>
                    <CardBody>
                        <Table>
                            <thead className="text-primary bg-light">
                                <th  className="p-10" colSpan="4">Order Details</th>
                            </thead>
                            <tbody>
                                <tr>
                                    <td>
                                        <span className="font-bold">Ref</span><br />
                                        {orderDetail.order_ref || "N/A"}
                                    </td>
                                    <td>
                                        <span className="font-bold">Channel Ref</span><br />
                                        {orderDetail.order_channel_ref || "N/A"}
                                    </td>
                                    <td>
                                        <span className="font-bold">Plan ID</span><br />
                                        {orderDetail.order_plan_id || "N/A"}
                                    </td>
                                    <td>
                                        <span className="font-bold">HMO ID</span><br />
                                        {orderDetail.order_hmo_id || "N/A"}
                                    </td>
                                </tr>
                                <tr>
                                    <td>
                                        <span className="font-bold">Amount</span><br />
                                        N{orderDetail.order_amount || "N/A"}
                                    </td>
                                    <td>
                                        <span className="font-bold">Channel</span><br />
                                        {orderDetail.order_channel || "N/A"}
                                    </td>
                                    <td>
                                        <span className="font-bold">Status</span><br />
                                        {orderDetail.order_status || "N/A"}
                                    </td>
                                    <td>
                                        <span className="font-bold">Type</span><br />
                                        {orderDetail.order_type || "N/A"}
                                    </td>
                                </tr>
                                
                            </tbody>
                            <thead className="text-primary bg-light">
                                <th  className="p-10" colSpan="4">Plan Details</th>
                            </thead>
                            <tbody>
                                <tr>
                                    <td>
                                        <span className="font-bold">Name</span><br />
                                        {orderDetail?.plan?.plan_name || "N/A"}
                                    </td>
                                    <td>
                                        <span className="font-bold">Amount</span><br />
                                        N{orderDetail?.plan?.plan_amount || "N/A"}
                                    </td>
                                    <td>
                                        <span className="font-bold">Website</span><br />
                                        {orderDetail?.plan?.plan_website || "N/A"}
                                    </td>
                                    <td>
                                        <span className="font-bold">Tenure</span><br />
                                        {orderDetail?.plan?.plan_tenure || "N/A"}
                                    </td>
                                </tr>
                                <tr>
                                    <td>
                                        <span className="font-bold">Status</span><br />
                                        {orderDetail?.plan?.plan_status ? "Active" : "Inactive"}
                                    </td>
                                    <td>
                                        <span className="font-bold">Category</span><br />
                                        {orderDetail?.plan?.plan_category || "N/A"}
                                    </td>
                                    <td>
                                        <span className="font-bold">General Consultation</span><br />
                                        {orderDetail?.plan?.plan_general_consulation ? "Active" : "Inactive"}
                                    </td>
                                    <td>
                                        <span className="font-bold">Glasses</span><br />
                                        {orderDetail?.plan?.plan_glasses ? "Active" : "Inactive"}
                                    </td>
                                </tr>
                                <tr>
                                    <td>
                                        <span className="font-bold">Specialist Consultation</span><br />
                                        {orderDetail?.plan?.plan_specialist_consultation ? "Active" : "Inactive"}
                                    </td>
                                    <td>
                                        <span className="font-bold">Paedetrics</span><br />
                                        {orderDetail?.plan?.plan_paedetrics ? "Active" : "Inactive"}
                                    </td>
                                    <td>
                                        <span className="font-bold">Admission</span><br />
                                        {orderDetail?.plan?.plan_admission ? "Active" : "Inactive"}
                                    </td>
                                    <td>
                                        <span className="font-bold">Fertility Care</span><br />
                                        {orderDetail?.plan?.plan_fertility_care ? "Active" : "Inactive"}
                                    </td>
                                </tr>

                                <tr>
                                    <td>
                                        <span className="font-bold">Mental Care</span><br />
                                        {orderDetail?.plan?.plan_mental_care ? "Active" : "Inactive"}
                                    </td>
                                    <td>
                                        <span className="font-bold">Antenatal Care</span><br />
                                        {orderDetail?.plan?.plan_antenatal_care ? "Active" : "Inactive"}
                                    </td>
                                    <td>
                                        <span className="font-bold">Optical Care</span><br />
                                        {orderDetail?.plan?.plan_optical_care ? "Active" : "Inactive"}
                                    </td>
                                    <td>
                                        <span className="font-bold">Dental Care</span><br />
                                        {orderDetail?.plan?.plan_dental_care ? "Active" : "Inactive"}
                                    </td>
                                </tr>
                                
                            </tbody>
                            <thead className="text-primary bg-light">
                                <th  className="p-10" colSpan="4">Customers</th>
                            </thead>
                            <tbody>
                                {orderDetail?.entity.map((customer) => (
                                    <>
                                    <tr>
                                        <td>
                                            <span className="font-bold">Photo</span><br />
                                            {customer.entity_photo ? (
                                                <img src={customer.entity_photo} alt="" width="50" />
                                            ) : ("N/A")}
                                        </td>
                                        <td>
                                            <span className="font-bold">Name</span><br />
                                            {customer.entity_firstname} {customer.entity_lastname}
                                        </td>
                                        <td>
                                            <span className="font-bold">Email</span><br />
                                            {customer.entity_email}
                                        </td>
                                        <td>
                                            <span className="font-bold">Phone</span><br />
                                            {customer.entity_phone}
                                        </td>
                                    </tr>
                                    <tr>
                                        <td>
                                            <span className="font-bold">Sex</span><br />
                                            {customer.entity_sex || "N/A"}
                                        </td>
                                        <td>
                                            <span className="font-bold">DOB</span><br />
                                            {customer.entity_dob}
                                        </td>
                                        <td>
                                            <span className="font-bold">Address</span><br />
                                            {customer.entity_address}
                                        </td>
                                        <td>
                                            <span className="font-bold">Hospital</span><br />
                                            {customer.entity_hospital}
                                        </td>
                                    </tr>
                                    <tr>
                                        <td>
                                            <span className="font-bold">Condition</span><br />
                                            {customer.entity_condition == "1" ? "True" : "False"}
                                        </td>
                                        <td>
                                            <span className="font-bold">Type</span><br />
                                            {customer.entity_type || "N/A"}
                                        </td>
                                        <td>
                                            <span className="font-bold">Sponsor</span><br />
                                            {customer.entity_sponsor || "N/A"}
                                        </td>
                                        <td>
                                            <span className="font-bold">Agreement</span><br />
                                            {customer.entity_agreement ? "True" : "False"}
                                        </td>
                                    </tr>
                                    <tr className="bg-light">
                                        <td colSpan="4"></td>
                                    </tr>
                                    
                                    </>
                                ))}
                            </tbody>
                        </Table>
                    </CardBody>
                    </Card>
                </Col>
                
            </Row>
            )}   
        </div>
        </>
    )
}

export default OrderDetails
