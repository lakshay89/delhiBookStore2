import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Select from "react-select";
import { countryOptions } from "../../services/countryOptions"; // adjust path accordingly
import axiosInstance from "../../services/FetchNodeServices";

const CreateShippingCost = () => {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    country: "",
    countryCode: "",
    shippingCost: "",
  });

  const [isLoading, setIsLoading] = useState(false);

  const handleCountryChange = (selectedOption) => {
    console.log("Country code in formData:", formData.code);
    console.log("selected:", selectedOption);

    setFormData((prev) => ({
      ...prev,
      country: selectedOption.label,
      countryCode: selectedOption.code,
    }));
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);

    if (!formData.country || !formData.countryCode) {
      toast.error("Please select a country.");
      setIsLoading(false);
      return;
    }

    try {
      const res = await axiosInstance.post(
        "/api/v1/shipping/create-shipping-cost",
        formData
      );

      if (res.status === 201) {
        toast.success("Shipping cost created successfully");
        navigate("/all-shipping-cost");
      } else {
        toast.error("Failed to create shipping cost");
      }
    } catch (err) {
      toast.error(err?.response?.data?.message || "Server error");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      <ToastContainer />
      <div className="bread">
        <div className="head">
          <h4>Add Shipping Cost</h4>
        </div>
        <div className="links">
          <Link to="/all-shipping-cost" className="add-new">
            Back <i className="fa-regular fa-circle-left"></i>
          </Link>
        </div>
      </div>

      <div className="d-form">
        <form className="row g-3" onSubmit={handleSubmit}>
          <div className="col-md-4">
            <label className="form-label">Select Country</label>
            <Select
              options={countryOptions}
              onChange={handleCountryChange}
              placeholder="Choose a country..."
              isSearchable
              value={
                formData.countryCode
                  ? countryOptions.find(
                      (option) => option.code === formData.code
                    )
                  : null
              }
            />
          </div>

          <div className="col-md-4">
            <label className="form-label">Shipping Cost (in USD)</label>
            <input
              type="number"
              name="shippingCost"
              className="form-control"
              value={formData.shippingCost}
              onChange={handleChange}
              required
              min={0}
            />
          </div>

          <div className="col-md-12 mt-3">
            <button type="submit" className="btn" disabled={isLoading}>
              {isLoading ? "Submitting..." : "Add Shipping Cost"}
            </button>
          </div>
        </form>
      </div>
    </>
  );
};

export default CreateShippingCost;
