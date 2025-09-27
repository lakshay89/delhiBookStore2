import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import Swal from "sweetalert2";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import axiosInstance from "../../services/FetchNodeServices";

const AllShippingCost = () => {
  const [shippingCosts, setShippingCosts] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  const fetchShippingCosts = async () => {
    try {
      const response = await axiosInstance.get(
        "/api/v1/shipping/get-all-shipping-cost"
      );
      if (response.status === 200) {
        setShippingCosts(response?.data || []);
      }
    } catch (error) {
      toast.error("Error fetching shipping costs");
      console.error("Error:", error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchShippingCosts();
  }, []);

  const handleDelete = async (id) => {
    const confirmDelete = await Swal.fire({
      title: "Are you sure?",
      text: "This will delete the shipping cost.",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#d33",
      cancelButtonColor: "#3085d6",
      confirmButtonText: "Yes, delete it!",
    });

    if (confirmDelete.isConfirmed) {
      try {
        const response = await axiosInstance.delete(
          `/api/v1/shipping/delete-shipping-cost/${id}`
        );
        if (response.status === 200) {
          setShippingCosts((prev) => prev.filter((item) => item._id !== id));
          Swal.fire("Deleted!", "Shipping cost has been deleted.", "success");
        }
      } catch (error) {
        Swal.fire("Error!", "Failed to delete shipping cost.", "error");
      }
    }
  };

  if (isLoading) return <p>Loading Shipping Costs...</p>;

  return (
    <>
      <ToastContainer />
      <div className="bread">
        <div className="head">
          <h4>All Shipping Costs</h4>
        </div>
        <div className="links">
          <Link to="/add-shipping-cost" className="add-new">
            Add New <i className="fa-solid fa-plus"></i>
          </Link>
        </div>
      </div>

      <section className="main-table">
        <table className="table table-bordered table-striped table-hover">
          <thead>
            <tr>
              <th scope="col">Sr.No.</th>
              <th scope="col">Country</th>
              <th scope="col">Country Code</th>
              <th scope="col">Shipping Cost (USD)</th>
              <th scope="col">Edit</th>
              <th scope="col">Delete</th>
            </tr>
          </thead>
          <tbody>
            {shippingCosts?.length > 0 ? (
              shippingCosts.map((item, index) => (
                <tr key={item._id}>
                  <td>{index + 1}</td>
                  <td>{item.country}</td>
                  <td>{item.countryCode}</td>
                  <td> {item.shippingCost}$</td>
                  <td>
                    <Link
                      to={`/edit-shipping-cost/${item?._id}`}
                      className="bt edit"
                    >
                      Edit <i className="fa-solid fa-pen-to-square"></i>
                    </Link>
                  </td>
                  <td>
                    <button
                      className="bt delete"
                      onClick={() => handleDelete(item._id)}
                    >
                      Delete <i className="fa-solid fa-trash"></i>
                    </button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="5" className="text-center">
                  No Shipping Costs Found
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </section>
    </>
  );
};

export default AllShippingCost;
