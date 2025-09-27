import React, { useEffect, useState } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import axiosInstance from "../../services/FetchNodeServices";

const EditDeliveryPartner = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    link: "",
  });

  // Fetch current data
  const fetchDeliveryPartner = async () => {
    try {
      const response = await axiosInstance.get(
        `/api/v1/delivery-partner/get-divery-partner/${id}`
      );
      if (response.status === 200) {
        setFormData({
          name: response.data?.name || "",
          link: response.data?.link || "",
        });
      } else {
        toast.error("Failed to fetch delivery partner");
      }
    } catch (error) {
      toast.error("Error loading data");
      console.error("Fetch error:", error);
    }
  };

  useEffect(() => {
    fetchDeliveryPartner();
  }, [id]);

  // Handle input change
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  // Submit updated data
  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);

    if (!formData.name || !formData.link) {
      toast.error("Name and Link are required");
      setIsLoading(false);
      return;
    }
    formData.name =
      formData.name.charAt(0).toUpperCase() + formData.name.slice(1);
    try {
      const response = await axiosInstance.put(
        `/api/v1/delivery-partner/update-divery-partner/${id}`,
        formData
      );
      if (response.status === 200) {
        toast.success("✅ Delivery Partner updated successfully!");
        navigate("/all-delivery-partners");
      } else {
        toast.error(
          response?.data?.message || "Error updating delivery partner"
        );
      }
    } catch (error) {
      toast.error(error?.response?.data?.message || "Update failed");
      console.error("Update error:", error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      <ToastContainer />
      <div className="bread">
        <div className="head">
          <h4>Edit Delivery Partner</h4>
        </div>
        <div className="links">
          <Link to="/all-delivery-partners" className="add-new">
            Back <i className="fa-regular fa-circle-left"></i>
          </Link>
        </div>
      </div>

      <div className="d-form">
        <form className="row g-3" onSubmit={handleSubmit}>
          <div className="col-md-6">
            <label htmlFor="name" className="form-label">
              Partner Name *
            </label>
            <input
              type="text"
              name="name"
              className="form-control"
              id="name"
              value={formData.name}
              onChange={handleChange}
              required
            />
          </div>

          <div className="col-md-6">
            <label htmlFor="link" className="form-label">
              Tracking Link *
            </label>
            <input
              type="url"
              name="link"
              className="form-control"
              id="link"
              value={formData.link}
              onChange={handleChange}
              required
            />
          </div>

          <div className="col-md-12 mt-3">
            <button type="submit" className="btn" disabled={isLoading}>
              {isLoading ? "Updating..." : "Update Delivery Partner"}
            </button>
          </div>
        </form>
      </div>
    </>
  );
};

export default EditDeliveryPartner;
