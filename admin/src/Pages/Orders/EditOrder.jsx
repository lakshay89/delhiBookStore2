// import React, { useEffect, useState } from "react";
// import { Link, useNavigate, useParams } from "react-router-dom";
// import { ToastContainer, toast } from "react-toastify";
// import "react-toastify/dist/ReactToastify.css";
// import axiosInstance, {
//   getData,
//   postData,
//   serverURL,
// } from "../../services/FetchNodeServices";

// const EditOrder = () => {
//   const { id } = useParams();
//   const [orderData, setOrderData] = useState({});
//   const [orderStatus, setOrderStatus] = useState("");
//   const [paymentStatus, setPaymentStatus] = useState("");
//   const [step, setStep] = useState(1);
//   const [email, setEmail] = useState("");
//   const [password, setPassword] = useState("");
//   const [token, setToken] = useState("");
//   const [loading, setLoading] = useState(true);
//   const [selectedPartner, setSelectedPartner] = useState("");
//   const [trackingId, setTrackingId] = useState("");
//   const [deliveryPartners, setDeliveryPartners] = useState([]);
//   const navigate = useNavigate();

//   // Fetch API data
//   const getApiData = async () => {
//     try {
//       const res = await axiosInstance.get(
//         `/api/v1/order/get-order-by-id/${id}`
//       );
//       if (res?.status === 200) {
//         setOrderData(res?.data?.order);
//         setOrderStatus(res?.data?.order?.orderStatus);
//         setPaymentStatus(res?.data?.order?.paymentStatus);
//         setSelectedPartner(res?.data?.order?.deliveryPartner);

//         setTrackingId(res?.data?.order?.trackingId);
//       }
//     } catch (error) {
//       console?.error("Error fetching order data:", error);
//       toast?.error("Failed to fetch order data.");
//     }
//   };

//   const fetchPartners = async () => {
//     try {
//       const res = await axiosInstance.get(
//         "/api/v1/delivery-partner/get-all-divery-partners"
//       );
//       setDeliveryPartners(res.data);
//     } catch (error) {
//       console.log("error", error);
//       toast?.error("Failed to fetch delivery partners.");
//     }
//   };

//   useEffect(() => {
//     getApiData();
//     fetchPartners();
//   }, []);

//   const handleChangeStatus = async (e, title) => {
//     const value = e?.target?.value || e;
//     if (title) {
//       title === "paymant" ? setPaymentStatus(value) : setOrderStatus(value);
//     }
//     console.log("value", value);
//   };

//   const isOrderStatusDisabled =
//     orderStatus === "Delivered" || orderStatus === "Cancelled";
//   const isPaymentStatusDisabled = paymentStatus === "Success";
//   //   const handleLogin2 = () => {
//   //     setStep(2);
//   //     setLoading(false);
//   //   };
//   const handleLogin2 = async () => {
//     const loading = toast.loading("Please wait...");
//     try {
//       const res = await axiosInstance.put(`/api/v1/order/update-order/${id}`, {
//         orderStatus,
//         paymentStatus,
//         deliveryPartner: selectedPartner,
//         trackingId,
//       });
//       if (res?.status === 200) {
//         toast.dismiss(loading);
//         toast?.success("Order updated successfully!");
//         setTimeout(() => {
//           navigate("/all-orders");
//         }, 1000);
//       }
//     } catch (error) {
//       toast.dismiss(loading);
//       console?.error("Error updating order:", error);
//       toast?.error("Failed to update order.");
//     }
//   };

//   const handleLogin = async (e) => {
//     setStep(2);
//     e.preventDefault();
//     setLoading(true);

//     const payload = { email, password };

//     try {
//       const response = await postData(
//         "api/shiprocket/login-via-shiprocket",
//         payload
//       );
//       console.log(response);
//       if (response.success === true) {
//         localStorage.setItem("shiprocketToken", response.data.token);
//         setToken(response?.data?.token);
//         toast.success("Login successful!");
//         setStep(3);
//       }
//     } catch (error) {
//       console?.log(error);
//       toast.error("Login failed! Check your credentials.");
//     } finally {
//       setLoading(false);
//     }
//   };

//   const handleDeliveryPartnerChange = (e) => {
//     const selectedId = e.target.value;
//     console.log("selectedId", selectedId);
//     setSelectedPartner(selectedId);
//   };

//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     try {
//       const response = await postData(
//         "api/shiprocket/shiped-order-shiprocket",
//         { ...orderData, token }
//       );

//       console.log(response);
//       if (response?.success === true) {
//         toast.success(
//           "Order successfully submitted to ShipRocket and status updated to Shipped!"
//         );
//         setStep(1);
//       }
//     } catch (error) {
//       console.log(error);
//       toast.error(error?.response?.data?.msg);
//     }
//   };

//   return (
//     <>
//       <div className="bread">
//         <div className="head">
//           {step === 1 ? (
//             <h4>Update Order</h4>
//           ) : step === 2 ? (
//             <h4>Login Ship Rocket</h4>
//           ) : (
//             <h4>Create Order</h4>
//           )}
//         </div>
//         <div className="links">
//           <Link to="/all-orders" className="btn btn-outline-secondary">
//             Back <i className="fa fa-arrow-left"></i>
//           </Link>
//         </div>
//       </div>

//       <div className="container mt-5">
//         <div className="row">
//           {step === 1 && (
//             <>
//               {" "}
//               <div className="col-lg-8">
//                 <div className="card shadow-lg">
//                   <div className="card-header bg-primary text-white justify-content-between d-flex">
//                     <h5 className="card-title">Order Details</h5>
//                     <button className="btn btn-light">
//                       📄 Download Invoice
//                     </button>
//                   </div>
//                   <div className="table-responsive">
//                     <table className="table table-bordered">
//                       <tbody>
//                         <tr>
//                           <th scope="row">Order ID</th>
//                           <td>{orderData?._id}</td>
//                         </tr>
//                         <tr>
//                           <th scope="row">User Name</th>
//                           <td>
//                             {orderData?.shippingAddress?.firstName}{" "}
//                             {orderData?.shippingAddress?.lastName}{" "}
//                           </td>
//                         </tr>
//                         <tr>
//                           <th scope="row">Email</th>
//                           <td>{orderData?.shippingAddress?.email}</td>
//                         </tr>
//                         <tr>
//                           <th scope="row">Phone Number</th>
//                           <td>{orderData?.shippingAddress?.phone}</td>
//                         </tr>
//                         <tr>
//                           <th scope="row">Address</th>
//                           <td>
//                             {orderData?.shippingAddress?.address},{" "}
//                             {orderData?.shippingAddress?.city},{" "}
//                             {orderData?.shippingAddress?.state},{" "}
//                             {orderData?.shippingAddress?.postalCode} ,
//                             {orderData?.shippingAddress?.country}
//                           </td>
//                         </tr>
//                         <tr>
//                           <th scope="row">Order Date</th>
//                           <td>
//                             {new Date(orderData?.createdAt).toLocaleString()}
//                           </td>
//                         </tr>
//                         <tr>
//                           <th scope="row">Final Price</th>
//                           <td>
//                             ₹
//                             {Math.ceil(
//                               orderData?.totalAmount *
//                               orderData?.dollarPriceAtOrder
//                             )}
//                           </td>
//                         </tr>
//                         <>
//                           <tr>
//                             <th scope="row">Order Status</th>
//                             <td>
//                               <select
//                                 className="form-select"
//                                 value={orderStatus}
//                                 onChange={(e) => handleChangeStatus(e, "order")}
//                                 disabled={isOrderStatusDisabled}
//                               >
//                                 <option value="Placed">Order Placed</option>
//                                 <option value="Confirmed">Order Confirmed</option>
//                                 <option value="Shipped">Order Shipped</option>
//                                 <option value="Delivered">Order Delivered</option>
//                                 <option value="Cancelled">Order Cancelled</option>
//                               </select>
//                             </td>
//                           </tr>

//                           {(orderStatus === "Shipped") && (
//                             <>
//                               <tr>
//                                 <th scope="row" style={{ paddingTop: '1rem' }}>Delivery Partner</th>
//                                 <td>
//                                   <select
//                                     className="form-select"
//                                     value={selectedPartner}
//                                     onChange={handleDeliveryPartnerChange}
//                                   >
//                                     <option value="">-- Select Partner --</option>
//                                     {deliveryPartners?.map((partner) => (
//                                       <option key={partner._id} value={partner._id}>
//                                         {partner.name}
//                                       </option>
//                                     ))}
//                                   </select>
//                                 </td>
//                               </tr>

//                               <tr>
//                                 <th scope="row">Tracking ID</th>
//                                 <td>
//                                   <input
//                                     type="text"
//                                     className="form-control"
//                                     placeholder="Enter Tracking ID"
//                                     value={trackingId}
//                                     onChange={(e) => setTrackingId(e.target.value)}
//                                     required
//                                   />
//                                 </td>
//                               </tr>
//                             </>
//                           )}
//                         </>

//                         <tr>
//                           <th scope="row">Payment Mode</th>
//                           <td>{orderData?.paymentMethod}</td>
//                         </tr>
//                         <tr>
//                           <th scope="row">Payment Id</th>
//                           <td>{orderData?.paymentInfo?.paymentId || "-"}</td>
//                         </tr>
//                         <tr>
//                           <th scope="row">Payment Status</th>
//                           <td>
//                             <select
//                               className="form-select"
//                               value={paymentStatus}
//                               // onChange={(e) => setPaymentStatus(e.target.value)}
//                               onChange={(e) =>
//                                 handleChangeStatus(e.target.value, "paymant")
//                               }
//                               disabled={isPaymentStatusDisabled}
//                             >
//                               <option value="Pending">Pending</option>
//                               <option value="Paid">Paid</option>
//                               <option value="Failed">Failed</option>
//                             </select>
//                           </td>
//                         </tr>
//                       </tbody>
//                     </table>
//                   </div>
//                 </div>
//               </div>
//               <div
//                 className="col-lg-4"
//                 style={{ overflowY: "scroll", height: "550px" }}
//               >
//                 <div className="card shadow-lg">
//                   <div className="card-header bg-info text-white">
//                     <h5 className="card-title">Ordered Items</h5>
//                   </div>
//                   <div className="card-body">
//                     {orderData?.items?.map((item, index) => (
//                       <div key={index} className="mb-3">
//                         <strong>{item?.productId?.productName}</strong>
//                         <br />
//                         <img
//                           src={`${serverURL}/public/image/${item?.productId?.images[0]}`}
//                           alt={item?.productId?.productName}
//                           style={{
//                             width: "100px",
//                             height: "100px",
//                             marginTop: "10px",
//                           }}
//                         />
//                         <h1 className="fs-6 my-2 mb-2">
//                           {item?.productId?.title}
//                         </h1>
//                         <p className="mb-1">
//                           Price: ₹
//                           {Math.round(
//                             (item?.productId?.finalPrice || item?.price) *
//                             orderData.dollarPriceAtOrder
//                           )}
//                         </p>
//                         <p className="mb-1">Quantity: {item?.quantity}</p>
//                         <hr />
//                       </div>
//                     ))}
//                   </div>
//                 </div>
//               </div>
//             </>
//           )}
//         </div>
//       </div>

//       {step === 2 || step === 3 ? (
//         ""
//       ) : (
//         <div className="">
//           {/* <button className="btn btn-primary" onClick={handleUpdate}>
//                   Save Changes
//               </button> */}
//           <button className="btn btn-primary" onClick={handleLogin2}>
//             Update Order
//           </button>
//         </div>
//       )}

//       {step === 2 && (
//         <div>
//           <form onSubmit={handleLogin}>
//             <div className="form-group">
//               <label htmlFor="email">Email</label>
//               <input type="email" className="form-control" id="email" placeholder="Enter email" value={email} onChange={(e) => setEmail(e.target.value)} required />
//             </div>
//             <div className="form-group mt-3">
//               <label htmlFor="password">Password</label>
//               <input type="password" className="form-control" id="password" placeholder="Enter password" value={password} onChange={(e) => setPassword(e.target.value)} required />
//             </div>
//             <button type="submit" className="btn btn-primary mt-4" disabled={loading}            >
//               {loading ? "Logging in..." : "Login"}
//             </button>
//           </form>
//         </div>
//       )}

//       {step === 3 && (
//         <div>
//           <form onSubmit={handleSubmit}>
//             <div className="form-group">
//               <label htmlFor="length">Package Length (cm)</label>
//               <input type="number" name="length" className="form-control" value={orderData.length} onChange={(e) => setOrderData((prev) => ({ ...prev, length: e.target.value }))} required />
//             </div>
//             <div className="form-group">
//               <label htmlFor="breadth">Package Breadth (cm)</label>
//               <input type="number" name="breadth" className="form-control" value={orderData.breadth} onChange={(e) => setOrderData((prev) => ({ ...prev, breadth: e.target.value }))} required />
//             </div>
//             <div className="form-group">
//               <label htmlFor="height">Package Height (cm)</label>
//               <input type="number" name="height" className="form-control" value={orderData.height} onChange={(e) => setOrderData((prev) => ({ ...prev, height: e.target.value }))} required />
//             </div>
//             <div className="form-group">
//               <label htmlFor="weight">Package Weight (kg)</label>
//               <input type="number" name="weight" className="form-control" value={orderData.weight} onChange={(e) => setOrderData((prev) => ({ ...prev, weight: e.target.value }))} required />
//             </div>
//             <button type="submit" className="btn btn-primary mt-4">
//               Submit
//             </button>
//           </form>
//         </div>
//       )}

//       <ToastContainer />
//     </>
//   );
// };

// export default EditOrder;

import React, { useEffect, useState, useRef } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import axiosInstance, { getData, postData, serverURL } from "../../services/FetchNodeServices";
import html2pdf from "html2pdf.js";

const EditOrder = () => {
  const { id } = useParams();
  const [orderData, setOrderData] = useState({});
  const [orderStatus, setOrderStatus] = useState("");
  const [paymentStatus, setPaymentStatus] = useState("");
  const [step, setStep] = useState(1);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [token, setToken] = useState("");
  const [loading, setLoading] = useState(true);
  const [selectedPartner, setSelectedPartner] = useState("");
  const [trackingId, setTrackingId] = useState("");
  const [deliveryPartners, setDeliveryPartners] = useState([]);
  const [orderFeedback, setOrderFeedback] = useState([]);
  const navigate = useNavigate();
  const invoiceRef = useRef();

  // ✅ PDF Download Handler
  const handleDownloadPDF = () => {
    const element = invoiceRef.current;
    const options = {
      margin: 0.5,
      filename: `Invoice-${orderData?._id || "order"}.pdf`,
      image: { type: "jpeg", quality: 0.98 },
      html2canvas: { scale: 2 },
      jsPDF: { unit: "in", format: "a4", orientation: "portrait" },
    };
    html2pdf().set(options).from(element).save();
  };

  // Fetch API data
  const getApiData = async () => {
    try {
      const res = await axiosInstance.get(`/api/v1/order/get-order-by-id/${id}`);
      if (res?.status === 200) {
        setOrderData(res?.data?.order);
        setOrderStatus(res?.data?.order?.orderStatus);
        setPaymentStatus(res?.data?.order?.paymentStatus);
        setSelectedPartner(res?.data?.order?.deliveryPartner);
        setTrackingId(res?.data?.order?.trackingId);
      }
    } catch (error) {
      console.error("Error fetching order data:", error);
      toast.error("Failed to fetch order data.");
    }
  };

  const fetchPartners = async () => {
    try {
      const res = await axiosInstance.get(
        "/api/v1/delivery-partner/get-all-divery-partners"
      );
      setDeliveryPartners(res.data);
    } catch (error) {
      console.log("error", error);
      toast?.error("Failed to fetch delivery partners.");
    }
  };


  useEffect(() => {
    getApiData();
    fetchPartners();
  }, []);

  const fetFeedback = async () => {
    try {
      const res = await axiosInstance.get(`/api/v1/feedback/get-feedback-by-order-id/${id}`)

      setOrderFeedback(res?.data?.feedback)
    } catch (error) {
      console.log("XXXXXX:==>", error)
    }
  }

  useEffect(() => {
    if (id) {
      fetFeedback()
    }
  }, [id])

  const handleChangeStatus = async (e, title) => {
    const value = e?.target?.value || e;
    if (title) {
      title === "paymant" ? setPaymentStatus(value) : setOrderStatus(value);
    }
  };

  const isOrderStatusDisabled = orderStatus === "Delivered" || orderStatus === "Cancelled";
  const isPaymentStatusDisabled = paymentStatus === "Success";

  const handleLogin2 = async () => {
    const loadingToast = toast.loading("Please wait...");
    try {
      const res = await axiosInstance.put(`/api/v1/order/update-order/${id}`, {
        orderStatus,
        paymentStatus,
        deliveryPartner: selectedPartner,
        trackingId,
      });
      if (res?.status === 200) {
        toast.dismiss(loadingToast);
        toast.success("Order updated successfully!");
        setTimeout(() => {
          navigate("/all-orders");
        }, 1000);
      }
    } catch (error) {
      toast.dismiss(loadingToast);
      console.error("Error updating order:", error);
      toast.error("Failed to update order.");
    }
  };

  const handleLogin = async (e) => {
    setStep(2);
    e.preventDefault();
    setLoading(true);

    const payload = { email, password };

    try {
      const response = await postData("api/shiprocket/login-via-shiprocket", payload);
      console.log(response);
      if (response.success === true) {
        localStorage.setItem("shiprocketToken", response.data.token);
        setToken(response?.data?.token);
        toast.success("Login successful!");
        setStep(3);
      }
    } catch (error) {
      console.log(error);
      toast.error("Login failed! Check your credentials.");
    } finally {
      setLoading(false);
    }
  };

  const handleDeliveryPartnerChange = (e) => {
    const selectedId = e.target.value;
    setSelectedPartner(selectedId);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await postData("api/shiprocket/shiped-order-shiprocket", { ...orderData, token });

      console.log(response);
      if (response?.success === true) {
        toast.success("Order successfully submitted to ShipRocket and status updated to Shipped!");
        setStep(1);
      }
    } catch (error) {
      console.log(error);
      toast.error(error?.response?.data?.msg);
    }
  };

  // Format date like "Thu, Aug 28, 2025"
  const formatDate = (dateString) => {
    if (!dateString) return "";
    const date = new Date(dateString);
    const days = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
    const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

    const day = days[date.getDay()];
    const month = months[date.getMonth()];
    const dayNum = date.getDate();
    const year = date.getFullYear();

    return `${day}, ${month} ${dayNum}, ${year}`;
  };


  const handleCheckboxChange = async (e, reviewId) => {
    const updatedStatus = e.target.checked;
    try {
      const response = await axiosInstance.put(`/api/v1/feedback/update-Status-feedback/${reviewId}`, { isActive: updatedStatus, });
      if (response?.data?.success === true) {
        const updatedReviews = orderFeedback.map((review) => review?._id === reviewId ? { ...review, isActive: updatedStatus } : review);
        setOrderFeedback(updatedReviews);
        toast.success('Review status updated successfully');
      }
    } catch (error) {
      toast.error("Error updating review status");
      console.error("Error updating review status:", error);
    }
  };


  // console.log("XXXXXX:==>", orderFeedback)
  return (
    <>
      <div className="bread">
        <div className="head">
          {step === 1 ? (
            <h4>Update Order</h4>
          ) : step === 2 ? (
            <h4>Login Ship Rocket</h4>
          ) : (
            <h4>Create Order</h4>
          )}
        </div>
        <div className="links">
          <Link to="/all-orders" className="btn btn-outline-secondary">
            Back <i className="fa fa-arrow-left"></i>
          </Link>
        </div>
      </div>

      <div className="container mt-2">
        <div className="row">
          {step === 1 && (
            <>
              <div className="col-lg-8">
                <div className="card shadow-lg">
                  <div className="card-header bg-primary text-white justify-content-between d-flex">
                    <h5 className="card-title">Order Details</h5>
                    <button className="btn btn-light" onClick={handleDownloadPDF}>
                      📄 Download Slip
                    </button>
                  </div>
                  <div className="table-responsive">
                    <table className="table table-bordered">
                      <tbody>
                        <tr>
                          <th scope="row">Order ID</th>
                          <td>{orderData?._id}</td>
                        </tr>
                        <tr>
                          <th scope="row">User Name</th>
                          <td>
                            {orderData?.shippingAddress?.firstName}{" "}
                            {orderData?.shippingAddress?.lastName}{" "}
                          </td>
                        </tr>
                        <tr>
                          <th scope="row">Email</th>
                          <td>{orderData?.shippingAddress?.email}</td>
                        </tr>
                        <tr>
                          <th scope="row">Phone Number</th>
                          <td>{orderData?.shippingAddress?.phone}</td>
                        </tr>
                        <tr>
                          <th scope="row">Address</th>
                          <td>
                            {orderData?.shippingAddress?.address},{" "}
                            {orderData?.shippingAddress?.city},{" "}
                            {orderData?.shippingAddress?.state},{" "}
                            {orderData?.shippingAddress?.postalCode} ,
                            {orderData?.shippingAddress?.country}
                          </td>
                        </tr>
                        <tr>
                          <th scope="row">Order Date</th>
                          <td>{new Date(orderData?.createdAt).toLocaleString()}</td>
                        </tr>
                        <tr>
                          <th scope="row">Final Price</th>
                          <td>
                            $
                            {Math.ceil(orderData?.totalAmount * orderData?.dollarPriceAtOrder)}
                          </td>
                        </tr>
                        <>
                          <tr>
                            <th scope="row">Order Status</th>
                            <td>
                              <select
                                className="form-select"
                                value={orderStatus}
                                onChange={(e) => handleChangeStatus(e, "order")}
                                disabled={isOrderStatusDisabled}
                              >
                                <option value="Placed">Order Placed</option>
                                <option value="Confirmed">Order Confirmed</option>
                                <option value="Shipped">Order Shipped</option>
                                <option value="Delivered">Order Delivered</option>
                                <option value="Cancelled">Order Cancelled</option>
                              </select>
                            </td>
                          </tr>

                          {orderStatus === "Shipped" && (
                            <>
                              <tr>
                                <th scope="row" style={{ paddingTop: "1rem" }}>
                                  Delivery Partner
                                </th>
                                <td>
                                  <select
                                    className="form-select"
                                    value={selectedPartner}
                                    onChange={handleDeliveryPartnerChange}
                                  >
                                    <option value="">-- Select Partner --</option>
                                    {deliveryPartners?.map((partner) => (
                                      <option key={partner?._id} value={partner?._id}>
                                        {partner?.name}
                                      </option>
                                    ))}
                                  </select>
                                </td>
                              </tr>

                              <tr>
                                <th scope="row">Tracking ID</th>
                                <td>
                                  <input
                                    type="text"
                                    className="form-control"
                                    placeholder="Enter Tracking ID"
                                    value={trackingId}
                                    onChange={(e) => setTrackingId(e.target.value)}
                                    required
                                  />
                                </td>
                              </tr>
                            </>
                          )}
                        </>

                        <tr>
                          <th scope="row">Payment Mode</th>
                          <td>{orderData?.paymentMethod}</td>
                        </tr>
                        <tr>
                          <th scope="row">Payment Id</th>
                          <td>{orderData?.paymentInfo?.paymentId || "-"}</td>
                        </tr>
                        <tr>
                          <th scope="row">Payment Status</th>
                          <td>
                            <select
                              className="form-select"
                              value={paymentStatus}
                              onChange={(e) => handleChangeStatus(e.target.value, "paymant")}
                              disabled={isPaymentStatusDisabled}
                            >
                              <option value="Pending">Pending</option>
                              <option value="Paid">Paid</option>
                              <option value="Failed">Failed</option>
                            </select>
                          </td>
                        </tr>
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>
              <div className="col-lg-4" style={{ overflowY: "scroll", height: "550px" }}>
                <div className="card shadow-lg">
                  <div className="card-header bg-info text-white">
                    <h5 className="card-title">Ordered Items</h5>
                  </div>
                  <div className="card-body">
                    {orderData?.items?.map((item, index) => (
                      <div key={index} className="mb-3">
                        <div>productId:- {item?.productId?.PRODUCTS_ID}</div>
                        <div>ISBN:- {item?.productId?.ISBN}</div>
                        <div>ISBN13:- {item?.productId?.ISBN13}</div>
                        <br />
                        <img
                          src={`${serverURL}/public/image/${item?.productId?.images[0]}`}
                          alt={item?.productId?.productName}
                          style={{
                            width: "100px",
                            height: "100px",
                            marginTop: "10px",
                          }}
                        />
                        <h1 className="fs-6 my-2 mb-2">{item?.productId?.title}</h1>
                        <p className="mb-1">
                          Price: $
                          {Math.round(
                            (item?.productId?.finalPrice || item?.price) * orderData.dollarPriceAtOrder
                          )}
                        </p>
                        <p className="mb-1">Quantity: {item?.quantity}</p>
                        <hr />
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </>
          )}
        </div>
      </div>

      {/* Invoice Template (Hidden until printed) */}
      <div style={{ display: "none" }}>
        <div
          ref={invoiceRef}
          style={{ padding: "20px", fontFamily: "Arial, sans-serif", maxWidth: "600px", margin: "0 auto", fontSize: "14px", lineHeight: "1.4", }}
        >
          {/* Header */}
          <div style={{ textAlign: "left", marginBottom: "15px" }}>
            <h1 style={{ fontSize: "24px", fontWeight: "bold", margin: "0 0 5px 0" }}>Ship to:</h1>
            <h2 style={{ fontSize: "18px", fontWeight: "bold", margin: "0 0 3px 0" }}>
              {orderData?.shippingAddress?.firstName} {orderData?.shippingAddress?.lastName}
            </h2>
            <h3 style={{ fontSize: "16px", margin: "0 0 3px 0", fontWeight: "normal" }}>
              {orderData?.shippingAddress?.address}
            </h3>
            <h4 style={{ fontSize: "14px", margin: "0 0 15px 0", fontWeight: "normal" }}>
              {orderData?.shippingAddress?.city}, {orderData?.shippingAddress?.state}{" "}
              {orderData?.shippingAddress?.postalCode}
            </h4>
          </div>

          <hr style={{ borderTop: "1px dashed #000", margin: "15px 0" }} />

          {/* Order Info */}
          <div style={{ marginBottom: "15px" }}>
            <p style={{ margin: "0 0 5px 0", fontWeight: "bold" }}>
              Order ID: {orderData?._id || "404-9537172-8890759"}
            </p>
            <p style={{ margin: "0 0 5px 0", fontStyle: "italic" }}>VPrime</p>
            <p style={{ margin: "0 0 10px 0" }}>Thank you for buying from DELHI BOOK STORE.</p>
          </div>

          {/* Delivery and Order Details Table */}
          <table style={{ width: "100%", borderCollapse: "collapse", marginBottom: "15px", fontSize: "12px" }}>
            <tbody>
              <tr>
                <td style={{ width: "50%", verticalAlign: "top", paddingRight: "10px" }}>
                  <p style={{ margin: "0 0 5px 0", fontWeight: "bold" }}>Delivery address:</p>
                  <p style={{ margin: "0 0 2px 0" }}>
                    {orderData?.shippingAddress?.firstName} {orderData?.shippingAddress?.lastName}
                  </p>
                  <p style={{ margin: "0 0 2px 0" }}>{orderData?.shippingAddress?.address}</p>
                  <p style={{ margin: "0 0 2px 0" }}>
                    {orderData?.shippingAddress?.city}, {orderData?.shippingAddress?.state}{" "}
                    {orderData?.shippingAddress?.postalCode}
                  </p>
                </td>
                <td style={{ width: "50%", verticalAlign: "top" }}>
                  <table style={{ width: "100%" }}>
                    <tbody>
                      <tr>
                        <td style={{ padding: "2px 0", textAlign: "right" }}>
                          <strong>Order Date:</strong> {formatDate(orderData?.createdAt)}
                        </td>
                      </tr>
                      <tr>
                        <td style={{ padding: "2px 0", textAlign: "right" }}>
                          <strong>Shipping Service:</strong> Standard
                        </td>
                      </tr>
                      <tr>
                        <td style={{ padding: "2px 0", textAlign: "right" }}>
                          <strong>Buyer Name:</strong> {orderData?.shippingAddress?.firstName}
                        </td>
                      </tr>
                      <tr>
                        <td style={{ padding: "2px 0", textAlign: "right" }}>
                          <strong>Seller Name:</strong> DELHI BOOK STORE
                        </td>
                      </tr>
                    </tbody>
                  </table>
                </td>
              </tr>
            </tbody>
          </table>

          <hr style={{ borderTop: "1px dashed #000", margin: "15px 0" }} />

          {/* Quantity Header */}
          <h3 style={{ fontSize: "16px", fontWeight: "bold", margin: "0 0 10px 0" }}>Quantity</h3>

          {/* Product Details Table */}
          <table style={{ width: "100%", borderCollapse: "collapse", marginBottom: "15px", fontSize: "12px" }}>
            <thead>
              <tr>
                <th style={{ textAlign: "left", borderBottom: "1px solid #000", padding: "5px 0", width: "60%" }}>
                  Product Details
                </th>
                <th style={{ textAlign: "right", borderBottom: "1px solid #000", padding: "5px 0", width: "20%" }}>
                  Unit price
                </th>
                <th style={{ textAlign: "right", borderBottom: "1px solid #000", padding: "5px 0", width: "20%" }}>
                  Order Totals
                </th>
              </tr>
            </thead>
            <tbody>
              {orderData?.items?.map((item, index) => (
                <tr key={index}>
                  <td style={{ padding: "10px 0", verticalAlign: "top" }}>
                    <p style={{ margin: "0 0 5px 0", fontWeight: "bold" }}>
                      {item?.productId?.title || item?.productId?.productName}
                    </p>
                    <p style={{ margin: "0 0 2px 0" }}>
                      SKU: {item?.productId?.sku || "9780814472811_DBS"}
                    </p>
                    {item?.productId?.asin && <p style={{ margin: "0 0 2px 0" }}>
                      ASIN: {item?.productId?.asin || "0814472818"}
                    </p>}
                    <p style={{ margin: "0 0 2px 0" }}>Condition: New</p>
                    <p style={{ margin: "0 0 5px 0", fontWeight: "bold" }}>
                      Order Item ID: {item?._id?.substring(0, 14) || "53402259347802"}
                    </p>
                    <p style={{ margin: "0 0 0 0" }}>
                      Condition note: Fast Shipping. Excellent & friendly Customer Service. We will respond to your mails
                      within 12 hours. You will be HAPPY with your purchase. Your satisfaction is guaranteed!
                    </p>
                  </td>
                  <td style={{ textAlign: "right", verticalAlign: "top", padding: "10px 5px" }}>
                    ${item?.productId?.finalPrice || item?.price || "450.00"}
                  </td>
                  <td style={{ textAlign: "right", verticalAlign: "top", padding: "10px 0" }}>
                    <p style={{ margin: "0 0 3px 0" }}>
                      Item subtotal: ${((item?.productId?.finalPrice || item?.price || 450) * (item?.quantity || 1)).toFixed(2)}
                    </p>
                    <p style={{ margin: "0 0 0 0" }}>
                      Item total: ${((item?.productId?.finalPrice || item?.price || 450) * (item?.quantity || 1)).toFixed(2)}
                    </p>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          <hr style={{ borderTop: "1px dashed #000", margin: "15px 0" }} />

          {/* COD Amount */}
          <div style={{ marginBottom: "15px" }}>
            <h3 style={{ fontSize: "16px", fontWeight: "bold", margin: "0 0 5px 0" }}>
              COD Collectible Amount
            </h3>
            <p style={{ fontSize: "18px", fontWeight: "bold", margin: "0" }}>
              ${orderData?.totalAmount || "457.00"}
            </p>
          </div>

          <hr style={{ borderTop: "1px dashed #000", margin: "15px 0" }} />

          {/* COD Amount Again */}
          <div style={{ marginBottom: "15px" }}>
            <p style={{ fontSize: "16px", fontWeight: "bold", margin: "0 0 10px 0" }}>
              COD Collectible Amount: ${orderData?.totalAmount || "457.00"}
            </p>
          </div>

          {/* Footer */}
          <div style={{ fontSize: "12px", marginTop: "20px" }}>
            <p style={{ margin: "0 0 10px 0" }}>
              Thanks for buying on Amazon Marketplace. To provide feedback for the seller please visit
              www.amazon.in/feedback. To contact the seller, go to Your Orders in Your Account. Click the seller's name
              under the appropriate product. Then, in the "Further Information" section, click "Contact the Seller."
            </p>
          </div>
        </div>
      </div>

      {step === 2 || step === 3 ? (
        ""
      ) : (
        <div className="text-center mt-4">

          <button className="btn btn-primary" onClick={handleLogin2}>
            Update Order
          </button>

          {orderFeedback?.length > 0 && (
            <div className="table-responsive">
              <h2 style={{ marginTop: "20px" }}>Feedback</h2>
              <table className="table table-bordered table-striped">
                <thead className="table-dark">
                  <tr>
                    <th>#</th>
                    <th>Show In Home</th>
                    <th>User Email</th>
                    <th>Phone</th>
                    <th>City</th>
                    {/* <th>Order Status</th> */}
                    {/* <th>Total Amount</th> */}
                    <th>Message</th>
                    <th>Rating</th>
                  </tr>
                </thead>
                <tbody>
                  {orderFeedback.map((item, index) => (
                    <tr key={item._id || index}>
                      <td>{index + 1}</td>
                      <td>
                        <input
                          type="checkbox"
                          checked={item?.isActive || false}
                          onChange={(e) => handleCheckboxChange(e, item?._id)}
                        />
                      </td>
                      <td>{item?.userId?.email}</td>
                      <td>{item?.orderId?.shippingAddress?.phone}</td>
                      <td>{item?.orderId?.shippingAddress?.city}</td>
                      <td>{item?.masseg}</td>
                      <td>
                        {"⭐".repeat(item?.rating) || "No Rating"}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      )}

      {step === 2 && (
        <div className="container mt-4">
          <div className="row justify-content-center">
            <div className="col-md-6">
              <div className="card">
                <div className="card-header">
                  <h5 className="card-title">Ship Rocket Login</h5>
                </div>
                <div className="card-body">
                  <form onSubmit={handleLogin}>
                    <div className="form-group">
                      <label htmlFor="email">Email</label>
                      <input type="email" className="form-control" id="email" placeholder="Enter email" value={email} onChange={(e) => setEmail(e.target.value)} required />
                    </div>
                    <div className="form-group mt-3">
                      <label htmlFor="password">Password</label>
                      <input type="password" className="form-control" id="password" placeholder="Enter password" value={password} onChange={(e) => setPassword(e.target.value)} required />
                    </div>
                    <button type="submit" className="btn btn-primary mt-4" disabled={loading}>
                      {loading ? "Logging in..." : "Login"}
                    </button>
                  </form>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {step === 3 && (
        <div className="container mt-4">
          <div className="row justify-content-center">
            <div className="col-md-6">
              <div className="card">
                <div className="card-header">
                  <h5 className="card-title">Ship Order</h5>
                </div>
                <div className="card-body">
                  <form onSubmit={handleSubmit}>
                    <div className="form-group">
                      <label htmlFor="length">Package Length (cm)</label>
                      <input type="number" name="length" className="form-control" value={orderData.length} onChange={(e) => setOrderData((prev) => ({ ...prev, length: e.target.value }))} required />
                    </div>
                    <div className="form-group mt-3">
                      <label htmlFor="breadth">Package Breadth (cm)</label>
                      <input type="number" name="breadth" className="form-control" value={orderData.breadth} onChange={(e) => setOrderData((prev) => ({ ...prev, breadth: e.target.value }))} required />
                    </div>
                    <div className="form-group mt-3">
                      <label htmlFor="height">Package Height (cm)</label>
                      <input type="number" name="height" className="form-control" value={orderData.height} onChange={(e) => setOrderData((prev) => ({ ...prev, height: e.target.value }))} required />
                    </div>
                    <div className="form-group mt-3">
                      <label htmlFor="weight">Package Weight (kg)</label>
                      <input type="number" name="weight" className="form-control" value={orderData.weight} onChange={(e) => setOrderData((prev) => ({ ...prev, weight: e.target.value }))} required />
                    </div>
                    <button type="submit" className="btn btn-primary mt-4">
                      Submit
                    </button>
                  </form>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      <ToastContainer />
    </>
  );
};

export default EditOrder;