import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import axiosInstance from "../../services/FetchNodeServices";

const AddDeliveryPartner = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    link: "",
  });

  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({ ...prevData, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);

    if (!formData.name || !formData.link) {
      toast.error("Name and link are required");
      setIsLoading(false);
      return;
    }
    formData.name =
      formData.name.charAt(0).toUpperCase() + formData.name.slice(1);
    try {
      const response = await axiosInstance.post(
        "/api/v1/delivery-partner/create-divery-partner",
        formData
      );

      if (response.status === 201) {
        toast.success("✅ Delivery Partner added successfully!");
        navigate("/all-delivery-partners");
      } else {
        toast.error(response?.data?.message || "Error adding delivery partner");
      }
    } catch (error) {
      toast.error(error?.response?.data?.message || "Something went wrong");
      console.error("Add Delivery Partner Error:", error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      <ToastContainer />
      <div className="bread">
        <div className="head">
          <h4>Add Delivery Partner</h4>
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
              {isLoading ? "Saving..." : "Add Delivery Partner"}
            </button>
          </div>
        </form>
      </div>
    </>
  );
};

export default AddDeliveryPartner;
