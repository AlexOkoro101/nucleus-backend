import React, { useEffect, useState, useRef } from "react";
import { useHistory } from "react-router";
// reactstrap components
import { Card, CardHeader, CardBody, Row, Col, Table, Button, Modal, ModalHeader, ModalBody, ModalFooter, Input, Badge, Pagination, PaginationItem, PaginationLink, FormGroup } from "reactstrap";
import { enviroment } from "variables/enviroment";
import NotificationAlert from "react-notification-alert";
import ReactPaginate from 'react-paginate'

function Corporate() {
  const notificationAlert = useRef();
  var Spinner = require('react-spinkit');
  const [token, settoken] = useState(null)
  const [orders, setorders] = useState(null)
  const [isLoading, setisLoading] = useState(false)
  const [modalIsLoading, setmodalIsLoading] = useState(false)
  const [error, seterror] = useState(null)
  const [modal, setmodal] = useState(false)
  const [orderId, setorderId] = useState(null)

  //fund wallet states
  const [fundWalletModal, setFundWalletModal] = useState(false);
  const [walletlIsLoading, setWalletIsLoading] = useState(false);
  const [selectedChannelId, setSelectedChannelId] = useState(null);
  const [fundAmount, setFundAmount] = useState('');

  //Route hook
  const history = useHistory()

  const [pageCount, setpageCount] = useState(0)
  const [totalPage, settotalPage] = useState(0)



  useEffect(() => {
    getToken()
    return () => {
      getToken()
    }
  }, [])

  useEffect(() => {
    const item = document.getElementsByClassName('table-responsive')
    item[0]?.classList.add('provider-table')
  }, [orders])


  const getToken = () => {
    const user = localStorage.getItem("user");

    if(!user) return;

    const formatItem = JSON.parse(user);

    if(formatItem?.token) {
      settoken(formatItem?.token)
      getOrders(formatItem?.token)
    }
  }


  const getOrders = (token) => {
    setisLoading(true)
    seterror(null)

    var myHeaders = new Headers();
    myHeaders.append("Authorization", `Bearer ${token}`);

    var requestOptions = {
      method: 'GET',
      headers: myHeaders,
      redirect: 'follow'
    };

    fetch(enviroment.BASE_URL + `backend/corporates`, requestOptions)
      .then(response => {
        setisLoading(false)
        return response.text()
      })
      .then(result => {
        const item = JSON.parse(result)
        console.log(item)
        setorders(item.data.data)
        setpageCount(item.data.current_page)
        settotalPage(item.data.last_page)
      })
      .catch(error => {
        seterror(error)
        console.log('error', error)
      });
  }

  const fetchOrders = (currentPage) => {
    setisLoading(true)
    seterror(null)

    var myHeaders = new Headers();
    myHeaders.append("Authorization", `Bearer ${token}`);

    var requestOptions = {
      method: 'GET',
      headers: myHeaders,
      redirect: 'follow'
    };

    fetch(enviroment.BASE_URL + `backend/corporates?page=${currentPage}`, requestOptions)
      .then(response => {
        setisLoading(false)
        return response.text()
      })
      .then(result => {
        const item = JSON.parse(result)
        console.log(item)
        setorders(item.data.data)
      })
      .catch(error => {
        seterror(error)
        console.log('error', error)
      });
  }


  const handlePageChange = (data) => {
    console.log(data.selected)

    let currentPage = data.selected + 1

    fetchOrders(currentPage)
  }

  const handleFundClick = (id) => {
    setSelectedChannelId(id);
    setFundWalletModal(true);

  }

  const submitFunds = () => {
    setWalletIsLoading(true)
    seterror(null)

    const myHeaders = new Headers();
    myHeaders.append("Accept", "application/json");
    myHeaders.append("Authorization", `Bearer ${token}`);
    myHeaders.append("Content-Type", "application/json");

    const payload = JSON.stringify({
      amount: Number(fundAmount),
      corporateId: selectedChannelId,
    });


    var requestOptions = {
      method: 'POST',
      headers: myHeaders,
      body: payload,
      redirect: 'follow'
    };

    fetch(enviroment.BASE_URL + "backend/channel/fund-wallet", requestOptions)
      .then(response => {
        setWalletIsLoading(false)
        return response.text()
      })
      .then(result => {
        console.log("fund", result)
        const item = JSON.parse(result)

        if(item?.status === true) {
          setFundWalletModal((prev) => !prev)
          notificationAlert.current.notificationAlert({
            place: "tr",
            message: (
              <div>
                <div>Channel Funded Successfully.</div>
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

            {orders && (
              <>
                <Card>
                  
                  <CardHeader>All Corporates</CardHeader>
                  <CardBody>
                  <Table responsive>
                      <thead className="text-primary">
                        <tr>
                          <th>Corporate Name</th>
                          <th>Address</th>
                          <th>Email</th>
                          <th>Phone</th>
                          <th>Industry</th>
                          <th>CAC Number</th>
                          <th>Created At</th>
                          <th className="text-right">Action</th>
                        </tr>
                      </thead>
                      <tbody>
                        {orders?.map((order, index) => (
                          <tr key={index} className="plans-row">
                            <td>{order.corporate_name}</td>
                            <td>{order.corporate_address}</td>
                            <td>{order.corporate_email}</td>
                            <td>{order.corporate_phone || "N/A"}</td>
                            <td>{order.corporate_industry}</td>
                            <td>{order.corporate_cacNo || "N/A"}</td>
                            <td> 
                              {new Date(order.created).toLocaleDateString("en-NG",
                                  {
                                      year: "numeric",
                                      day: "numeric",
                                      month: "long",
                                  }
                              )}
                            </td>
                            <td className="text-right">
                              <Button
                                color="primary"
                                type="button"
                                size="sm"
                                outline
                                onClick={() => handleFundClick(order?.corporate_id)}
                              >
                                  Fund wallet
                              </Button>
                            </td>
                          </tr>

                        ))}
                        
                      </tbody>
                    </Table>
                  </CardBody>
                </Card>
                <ReactPaginate
                  previousLabel={'previous'}
                  nextLabel={'next'}
                  pageCount={totalPage}
                  onPageChange={handlePageChange}
                  containerClassName={'pagination justify-content-center'}
                  pageClassName={'page-item'}
                  pageLinkClassName={'page-link'}
                  previousClassName={'page-item'}
                  nextClassName={'page-item'}
                  nextLinkClassName={'page-link'}
                  previousLinkClassName={'page-link'}
                  activeClassName={'active'}
                ></ReactPaginate>
              </>

            )}
            
            
          </Col>
        </Row>
      </div>
      <Modal
        isOpen={fundWalletModal}
      >
        <ModalHeader toggle={() => setmodal(!fundWalletModal)}>
          Fund Channel
        </ModalHeader>
        <ModalBody>
          <Col md="8">
            <FormGroup>
              <label>Amount</label>
              <Input
                id="name"
                name="name"
                type="number"
                value={fundAmount}
                onChange={(e) => setFundAmount(e.target.value)}
              />
            </FormGroup>
          </Col>
        </ModalBody>
        <ModalFooter>
          <Button
            color="primary"
            onClick={submitFunds}
          >
            {walletlIsLoading && (
              <Spinner name='circle' color="#ffffff" fadeIn="none" className="button-loader" />
            )}
            Submit
          </Button>
          {' '}
          <Button onClick={() => setFundWalletModal((prev) => !prev)}>
            Cancel
          </Button>
        </ModalFooter>
      </Modal>
    </>
  );
}

export default Corporate;
