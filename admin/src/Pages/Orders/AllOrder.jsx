import React, { useEffect, useRef, useState } from "react";
import axiosInstance, { serverURL } from "../../services/FetchNodeServices";
import { Link } from "react-router-dom";
import Swal from "sweetalert2";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import * as XLSX from "xlsx";
import { saveAs } from "file-saver";
import html2pdf from "html2pdf.js";
import CallBackImg from "../../services/DBSLOGO.jpg";

const AllOrder = () => {
  const [orders, setOrders] = useState([]);
  const [filteredOrders, setFilteredOrders] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [filterOption, setFilterOption] = useState("");
  const [selectedOrders, setSelectedOrders] = useState([]);
  const [selectAll, setSelectAll] = useState(false);
  const invoiceRef = useRef(null);
  const [reviews, setReviews] = useState([]);


  // Fetch orders
  const fetchOrders = async () => {
    try {
      const response = await axiosInstance.get("/api/v1/order/get-all-orders-admin");
      if (response.status === 200) {
        const reversed = response?.data.orders?.reverse();
        setOrders(reversed);
        setFilteredOrders(reversed);
      }
    } catch (error) {
      console.error("Error fetching orders:", error);
      toast.error("Failed to fetch orders.");
    }
  };

  // Delete order
  const deleteOrder = async (orderId) => {
    try {
      const confirmation = await Swal.fire({
        title: "Are you sure?",
        text: "This action cannot be undone!",
        icon: "warning",
        showCancelButton: true,
        confirmButtonText: "Yes, delete it!",
        cancelButtonText: "Cancel",
      });

      if (confirmation.isConfirmed) {
        const response = await axiosInstance.delete(
          `/api/v1/order/delete-order/${orderId}`
        );
        if (response?.status === 200) {
          const updated = orders.filter((order) => order._id !== orderId);
          setOrders(updated);
          setFilteredOrders(updated);
          setSelectedOrders((prev) => prev.filter((id) => id !== orderId));
          toast.success("Order deleted successfully.");
        }
      }
    } catch (error) {
      console.error("Error deleting order:", error);
      toast.error("Failed to delete order.");
    }
  };

  // Search
  const handleSearch = (e) => {
    const query = e.target.value?.toLowerCase();
    setSearchQuery(query);

    const filtered = orders.filter((order) => {
      const idMatch = order.orderUniqueId?.toLowerCase().includes(query);
      const emailMatch = order.shippingAddress?.email?.toLowerCase().includes(query);
      const nameMatch = order.shippingAddress?.firstName?.toLowerCase().includes(query) || order.shippingAddress?.lastName
        ?.toLowerCase()
        .includes(query);
      return idMatch || nameMatch || emailMatch;
    });
    setFilteredOrders(filtered);
  };

  // Filter
  const handleFilterChange = (e) => {
    setFilterOption(e.target.value);
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  useEffect(() => {
    let filtered = [...orders];

    const today = new Date();
    if (filterOption === "today") {
      filtered = filtered.filter(
        (order) =>
          new Date(order.createdAt).toDateString() === today.toDateString()
      );
    } else if (filterOption === "yesterday") {
      const yesterday = new Date();
      yesterday.setDate(today.getDate() - 1);
      filtered = filtered.filter(
        (order) =>
          new Date(order.createdAt).toDateString() === yesterday.toDateString()
      );
    } else if (filterOption === "thisWeek") {
      const startOfWeek = new Date();
      startOfWeek.setDate(today.getDate() - today.getDay());
      filtered = filtered.filter(
        (order) => new Date(order.createdAt) >= startOfWeek
      );
    } else if (filterOption === "thisMonth") {
      const startOfMonth = new Date(today.getFullYear(), today.getMonth(), 1);
      filtered = filtered.filter(
        (order) => new Date(order.createdAt) >= startOfMonth
      );
    } else if (filterOption === "thisYear") {
      const startOfYear = new Date(today.getFullYear(), 0, 1);
      filtered = filtered.filter(
        (order) => new Date(order.createdAt) >= startOfYear
      );
    }

    setFilteredOrders(filtered);
  }, [filterOption, orders]);

  // Handle checkbox selection
  const handleSelectOrder = (orderId) => {
    setSelectedOrders((prev) =>
      prev.includes(orderId)
        ? prev.filter((id) => id !== orderId)
        : [...prev, orderId]
    );
  };

  const handleSelectAll = () => {
    if (selectAll) {
      setSelectedOrders([]);
    } else {
      const allIds = filteredOrders.map((order) => order._id);
      setSelectedOrders(allIds);
    }
    setSelectAll(!selectAll);
  };

  const handleDownloadSelected = () => {
    const selectedData = orders.filter((order) =>
      selectedOrders.includes(order._id)
    );

    if (selectedData.length === 0) {
      toast.warn("Please select at least one order.");
      return;
    }

    const formattedData = selectedData.map((order, index) => {
      const productList = order.items
        ?.map(
          (item, i) =>
            `${i + 1}. ${item.productId?.title || item.name} x${item.quantity} - ₹${Math.round(
              (item.productId?.finalPrice || item.price) * order.dollarPriceAtOrder
            )}`
        )
        .join("\n");

      return {
        "Sr. No": index + 1,
        "Order ID": order.orderUniqueId,
        "Items Count": order.items?.length,
        "Products Ordered": productList || "—",
        "ISBN 13": order.items?.map((item) => item.productId?.ISBN13 || "N/A").join(", "),
        "Total Amount (INR)": Math.ceil(
          order.totalAmount * order.dollarPriceAtOrder
        ),
        "Order Status": order.orderStatus,
        "Payment Mode": order.paymentMethod,
        "Payment Status": order.paymentStatus,
        "Order Date": new Date(order.createdAt).toLocaleString("en-IN"),
      };
    });

    const worksheet = XLSX.utils.json_to_sheet(formattedData);

    worksheet["!cols"] = [
      { wch: 8 }, // Sr. No
      { wch: 25 }, // Order ID
      { wch: 12 }, // Items Count
      { wch: 50 }, // Products Ordered
      { wch: 20 }, // Total Amount (INR)
      { wch: 20 }, // Order Status
      { wch: 18 }, // Payment Mode
      { wch: 20 }, // Payment Status
      { wch: 28 }, // Order Date
    ];

    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Selected Orders");

    const excelBuffer = XLSX.write(workbook, {
      bookType: "xlsx",
      type: "array",
    });

    const fileData = new Blob([excelBuffer], {
      type: "application/octet-stream",
    });

    saveAs(fileData, `Selected_Orders_${new Date().getTime()}.xlsx`);
  };

  // Calculate total amount in INR
  const calculateTotalInINR = (order) => {
    return Math.ceil(order.totalAmount * order.dollarPriceAtOrder);
  };

  const handleDownloadPDF = (order) => {
    const element = invoiceRef.current;
    const options = {
      margin: 0.5,
      filename: `Invoice-${order?._id || "order"}.pdf`,
      image: { type: "jpeg", quality: 0.98 },
      html2canvas: { scale: 2 },
      jsPDF: { unit: "in", format: "a4", orientation: "portrait" },
    };
    html2pdf().set(options).from(element).save();
  };

  // Format date for invoice
  const formatDate = (dateString) => {
    if (!dateString) return "N/A";
    return new Date(dateString).toLocaleDateString("en-IN", {
      year: "numeric",
      month: "long",
      day: "numeric"
    });
  };

  useEffect(() => {
    const fetchReviews = async () => {
      // setIsLoading(true);
      try {
        const response = await axiosInstance.get(`/api/v1/feedback/get-all-feedback`);
        if (response?.data?.success === true) {
          setReviews(response?.data?.feedback || []);
        }
      } catch (error) {
        console.error("Error fetching reviews:", error);
        toast.error("Failed to fetch reviews!");
      } finally {
        // setIsLoading(false);
      }
    };

    fetchReviews();
  }, []);

  const feedback = (id) => {
    const data = reviews.filter((item) => item?.orderId?._id === id);
    console.log("data ==>", data)
    return data;
  }

  console.log("filteredOrders:==>", filteredOrders)
  return (
    <>
      <ToastContainer />

      <div className="px-4 py-2 shadow-md rounded-md mb-2">
        {/* Header */}
        <div className="bread mb-3">
          <div className="head">
            <h4>All Orders</h4>
          </div>
        </div>
        {/* Filter & Search Row */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          {/* Filter & Download Section */}
          <div className="d-flex justify-content-between align-items-center gap-3">
            <select
              onChange={handleFilterChange}
              value={filterOption}
              className="border border-gray-300 rounded-md px-3 py-2 text-sm text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="">All Orders</option>
              <option value="today">Today's Orders</option>
              <option value="yesterday">Yesterday's Orders</option>
              <option value="thisWeek">This Week's Orders</option>
              <option value="thisMonth">This Month's Orders</option>
              <option value="thisYear">This Year's Orders</option>
            </select>

            <div className="w-full md:w-72 gap-2 d-flex align-items-center" >
              <input
                type="text"
                placeholder="Search by Order ID or Name..."
                value={searchQuery}
                onChange={handleSearch}
                className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />

              <button
                type="button"
                className="btn btn-sm d-flex align-items-center gap-1 px-4 py-2 shadow-sm text-white"
                style={{ backgroundColor: '#840adc' }}
                onClick={handleDownloadSelected}
              >
                <i className="fas fa-download"></i> Download Selected
              </button>
            </div>

          </div>

          {/* Search Section */}

        </div>
      </div>

      <section className="main-table">
        <table className="table table-bordered table-striped table-hover">
          <thead>
            <tr>
              <th className="align-middle">
                <div className="d-flex align-items-center">
                  <input
                    type="checkbox"
                    checked={selectAll}
                    onChange={handleSelectAll}
                    className="me-2"
                  />
                  <span></span>
                </div>
              </th>
              <th>Sr.No.</th>
              <th>Order Detail</th>
              <th>Product Detail</th>
              <th>Paymant Detail</th>
              <th>Feedback</th>
              <th>Order Date</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredOrders?.length > 0 ? (
              filteredOrders.map((order, index) => (
                <tr key={order?._id}>
                  <td className="align-middle">
                    <input
                      type="checkbox"
                      checked={selectedOrders.includes(order._id)}
                      onChange={() => handleSelectOrder(order._id)}
                    />
                  </td>
                  <th scope="row" className="align-middle">{index + 1}</th>
                  <td className="align-middle">
                    <div className="order-details" style={{ width: "18vw", maxHeight: "20vh", overflowY: "auto", scrollbarWidth: "none", msOverflowStyle: "none", }}>
                      <div><strong>ID:</strong> {order.orderUniqueId}</div>
                      <div><strong>Name:</strong> {order.shippingAddress.firstName + " " + order.shippingAddress.lastName}</div>
                      <div><strong>Email:</strong> {order.shippingAddress?.email || "N/A"}</div>
                      <div><strong>Phone:</strong> {order.shippingAddress?.phone || "N/A"}</div>
                      <div style={{ fontSize: "14px", marginBottom: "4px", wordWrap: "break-word", whiteSpace: "normal", }}  >
                        <div><strong>Address:</strong> {order.shippingAddress.address}, {order.shippingAddress.city}, {order.shippingAddress.state} {order.shippingAddress.zipCode}</div>
                      </div>
                    </div>
                  </td>

                  <td className="align-middle" style={{ width: "5%" }}>
                    <div className="product-details-container" style={{ width: "22vw", maxHeight: "20vh", overflowY: "auto", }}>
                      {/* scrollbarWidth: "none", msOverflowStyle: "none", */}
                      {order.items?.map((item, idx) => (
                        <div
                          key={idx}
                          style={{ display: "flex", alignItems: "flex-start", padding: "6px 0", borderBottom: "1px solid #f0f0f0", }}                        >
                          {/* Product Image */}
                          <div className="product-image me-2" style={{ flex: "0 0 60px", height: "80px", alignItems: 'center' }}                          >
                            <img
                              src={item?.productId?.images?.length > 0 ? `${serverURL}/public/image/${item?.productId?.images[0]}` : CallBackImg}
                              alt={"Product"} className="img-thumbnail" style={{ width: "60px", height: "80px", objectFit: "cover", borderRadius: "4px", }} />
                          </div>

                          {/* Product Details */}
                          <div style={{ flex: 1, minWidth: 0 }}>
                            <div style={{ fontSize: "14px", marginBottom: "4px", wordWrap: "break-word", whiteSpace: "normal", }}  >
                              <strong>product Name:- </strong> {item.productId?.title || item.name || "N/A"}
                            </div>
                            <div style={{ fontSize: "13px" }}>
                              <strong>Qty:</strong> {item.quantity}
                            </div>
                            <div style={{ fontSize: "13px" }}>
                              <strong>Price:</strong> $
                              {Math.round(item.productId?.finalPrice || item.price)}
                            </div>
                            {item.productId?.ISBN13 && (
                              <div style={{ fontSize: "13px" }}>
                                <strong>ISBN13:</strong> {item.productId.ISBN13}
                              </div>
                            )}
                          </div>
                          {/* <hr style={{border: "1px solid #130707ff", }} /> */}
                        </div>
                      ))}
                    </div>
                  </td>

                  <td className="align-middle">
                    <div className="payment-details">
                      <div><strong>Totale Amount:- </strong> ${order.totalAmount}</div>
                      <div><strong>Ordet Status:- </strong> {order.orderStatus}</div>
                      <div><strong>Payment Method:- </strong> {order.paymentMethod}</div>
                      <div><strong>Payment Status:- </strong> {order.paymentStatus}</div>
                    </div>
                  </td>
                  <td className="align-middle">
                    <div className="payment-details">
                      <span
                        style={{
                          display: "inline-block", padding: "5px 12px", borderRadius: "20px", fontSize: "12px", fontWeight: "500", backgroundColor: feedback(order?._id)?.length > 0 ? "#d1e7dd" : "#f8d7da",
                          color: feedback(order?._id)?.length > 0 ? "#0f5132" : "#842029",
                        }}
                      >
                        {feedback(order?._id)?.length > 0 ? "True" : "False"}
                      </span>
                    </div>
                  </td>
                  <td className="align-middle">
                    <div style={{ fontSize: "14px", marginBottom: "4px", wordWrap: "break-word", whiteSpace: "normal", }}>
                      {new Date(order.createdAt).toLocaleString("en-IN", {
                        year: "numeric", month: "long", day: "numeric", hour: "numeric", minute: "numeric", hour12: true,
                      })}
                    </div>
                  </td>
                  <td className="align-middle">
                    <div className="d-flex flex-column gap-2">
                      <button style={{ background: "linear-gradient(90deg, #6366f1, #a855f7, #ec4899)", color: "white", border: "none", padding: "6px 14px", borderRadius: "10px", fontWeight: "600", cursor: "pointer", }} onClick={handleDownloadPDF} >
                        <i className="fa-solid fa-download me-1"></i>
                        Download Slip
                      </button>
                      <Link to={`/order-details/${order?._id}`} className="btn btn-primary btn-sm" >
                        <i className="fa-solid fa-pen-to-square me-1"></i>
                        Update
                      </Link>
                      <button
                        className="btn btn-danger btn-sm"
                        onClick={() => deleteOrder(order._id)}
                      >
                        <i className="fa-solid fa-trash me-1"></i>
                        Delete
                      </button>
                    </div>
                  </td>


                  <div style={{ display: "none" }}>
                    <div
                      ref={invoiceRef}
                      style={{ padding: "20px", fontFamily: "Arial, sans-serif", maxWidth: "600px", margin: "0 auto", fontSize: "14px", lineHeight: "1.4", }}
                    >
                      {/* Header */}
                      <div style={{ textAlign: "left", marginBottom: "15px" }}>
                        <h1 style={{ fontSize: "24px", fontWeight: "bold", margin: "0 0 5px 0" }}>Ship to:</h1>
                        <h2 style={{ fontSize: "18px", fontWeight: "bold", margin: "0 0 3px 0" }}>
                          {order?.shippingAddress?.firstName} {order?.shippingAddress?.lastName}
                        </h2>
                        <h3 style={{ fontSize: "16px", margin: "0 0 3px 0", fontWeight: "normal" }}>
                          {order?.shippingAddress?.address}
                        </h3>
                        <h4 style={{ fontSize: "14px", margin: "0 0 15px 0", fontWeight: "normal" }}>
                          {order?.shippingAddress?.city}, {order?.shippingAddress?.state}{" "}
                          {order?.shippingAddress?.postalCode}
                        </h4>
                      </div>

                      <hr style={{ borderTop: "1px dashed #000", margin: "15px 0" }} />

                      {/* Order Info */}
                      <div style={{ marginBottom: "15px" }}>
                        <p style={{ margin: "0 0 5px 0", fontWeight: "bold" }}>
                          Order ID: {order?._id || "404-9537172-8890759"}
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
                                {order?.shippingAddress?.firstName} {order?.shippingAddress?.lastName}
                              </p>
                              <p style={{ margin: "0 0 2px 0" }}>{order?.shippingAddress?.address}</p>
                              <p style={{ margin: "0 0 2px 0" }}>
                                {order?.shippingAddress?.city}, {order?.shippingAddress?.state}{" "}
                                {order?.shippingAddress?.postalCode}
                              </p>
                            </td>
                            <td style={{ width: "50%", verticalAlign: "top" }}>
                              <table style={{ width: "100%" }}>
                                <tbody>
                                  <tr>
                                    <td style={{ padding: "2px 0", textAlign: "right" }}>
                                      <strong>Order Date:</strong> {formatDate(order?.createdAt)}
                                    </td>
                                  </tr>
                                  <tr>
                                    <td style={{ padding: "2px 0", textAlign: "right" }}>
                                      <strong>Shipping Service:</strong> Standard
                                    </td>
                                  </tr>
                                  <tr>
                                    <td style={{ padding: "2px 0", textAlign: "right" }}>
                                      <strong>Buyer Name:</strong> {order?.shippingAddress?.firstName}
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
                          {order?.items?.map((item, index) => (
                            <tr key={index}>
                              <td style={{ padding: "10px 0", verticalAlign: "top" }}>
                                <p style={{ margin: "0 0 5px 0", fontWeight: "bold" }}>
                                  {item?.productId?.title || item?.productId?.productName}
                                </p>
                                <p style={{ margin: "0 0 2px 0" }}>
                                  SKU: {item?.productId?.sku || "9780814472811_DBS"}
                                </p>
                                <p style={{ margin: "0 0 2px 0" }}>
                                  ASIN: {item?.productId?.asin || "0814472818"}
                                </p>
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
                          ${order?.totalAmount || "457.00"}
                        </p>
                      </div>

                      <hr style={{ borderTop: "1px dashed #000", margin: "15px 0" }} />

                      {/* COD Amount Again */}
                      <div style={{ marginBottom: "15px" }}>
                        <p style={{ fontSize: "16px", fontWeight: "bold", margin: "0 0 10px 0" }}>
                          COD Collectible Amount: ${order?.totalAmount || "457.00"}
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

                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="10" className="text-center py-4">
                  No orders found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </section>
    </>
  );
};

export default AllOrder;
