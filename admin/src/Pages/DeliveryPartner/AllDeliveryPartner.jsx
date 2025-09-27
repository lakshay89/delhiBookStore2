import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import Swal from "sweetalert2";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import axiosInstance from "../../services/FetchNodeServices";

const AllDeliveryPartner = () => {
  const [deliveryPartners, setDeliveryPartners] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  const fetchDeliveryPartners = async () => {
    try {
      const response = await axiosInstance.get(
        "/api/v1/delivery-partner/get-all-divery-partners"
      );
      if (response.status === 200) {
        setDeliveryPartners(response?.data || []);
      }
    } catch (error) {
      toast.error("Error fetching delivery partners");
      console.error("Error:", error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchDeliveryPartners();
  }, []);

  const handleDelete = async (id) => {
    const confirmDelete = await Swal.fire({
      title: "Are you sure?",
      text: "This will delete the delivery partner.",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#d33",
      cancelButtonColor: "#3085d6",
      confirmButtonText: "Yes, delete it!",
    });

    if (confirmDelete.isConfirmed) {
      try {
        const response = await axiosInstance.delete(
          `/api/v1/delivery-partner/delete-divery-partner/${id}`
        );
        if (response.status === 200) {
          setDeliveryPartners((prev) => prev.filter((item) => item._id !== id));
          Swal.fire("Deleted!", "Delivery partner deleted.", "success");
        }
      } catch (error) {
        Swal.fire("Error!", "Failed to delete delivery partner.", "error");
      }
    }
  };

  if (isLoading) return <p>Loading Delivery Partners...</p>;

  return (
    <>
      <ToastContainer />
      <div className="bread">
        <div className="head">
          <h4>All Delivery Partners</h4>
        </div>
        <div className="links">
          <Link to="/add-delivery-partner" className="add-new">
            Add New <i className="fa-solid fa-plus"></i>
          </Link>
        </div>
      </div>

      <section className="main-table">
        <table className="table table-bordered table-striped table-hover">
          <thead>
            <tr>
              <th>Sr.No.</th>
              <th>Name</th>
              <th>Link</th>
              <th>Edit</th>
              <th>Delete</th>
            </tr>
          </thead>
          <tbody>
            {deliveryPartners?.length > 0 ? (
              deliveryPartners.map((partner, index) => (
                <tr key={partner._id}>
                  <td>{index + 1}</td>
                  <td>{partner.name}</td>
                  <td>
                    <a
                      href={partner.link}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="btn btn-primary"
                    >
                      Visit Link
                    </a>
                  </td>

                  <td>
                    <Link
                      to={`/edit-delivery-partner/${partner._id}`}
                      className="bt edit"
                    >
                      Edit <i className="fa-solid fa-pen-to-square"></i>
                    </Link>
                  </td>
                  <td>
                    <button
                      className="bt delete"
                      onClick={() => handleDelete(partner._id)}
                    >
                      Delete <i className="fa-solid fa-trash"></i>
                    </button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="7" className="text-center">
                  No Delivery Partners Found
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </section>
    </>
  );
};

export default AllDeliveryPartner;
