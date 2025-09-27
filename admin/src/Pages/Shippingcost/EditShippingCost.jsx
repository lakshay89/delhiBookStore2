import React, { useEffect, useState } from "react";
import { useNavigate, useParams, Link } from "react-router-dom";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Select from "react-select";
import { countryOptions } from "../../services/countryOptions"; // Ensure it includes .code, .label
import axiosInstance from "../../services/FetchNodeServices";

const EditShippingCost = () => {
  const { id } = useParams(); // shipping cost ID from URL
  const navigate = useNavigate();
console.log("id", id);

  const [formData, setFormData] = useState({
    country: "",
    countryCode: "",
    shippingCost: "",
  });

  const [isLoading, setIsLoading] = useState(false);

  // Fetch existing shipping cost by ID
  const fetchShippingCost = async () => {
    try {
      const res = await axiosInstance.get(`/api/v1/shipping/get-shipping-cost/${id}`);
      if (res.status === 200) {
        const data = res.data;
        setFormData({
          country: data.country,
          countryCode: data.countryCode,
          shippingCost: data.shippingCost,
        });
      }
    } catch (err) {
      toast.error("Failed to load shipping cost");
    }
  };

  useEffect(() => {
    fetchShippingCost();
  }, [id]);

  const handleCountryChange = (selectedOption) => {
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
      const res = await axiosInstance.put(`/api/v1/shipping/update-shipping-cost/${id}`, formData);

      if (res.status === 200) {
        toast.success("Shipping cost updated successfully");
        navigate("/all-shipping-cost");
      } else {
        toast.error("Failed to update shipping cost");
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
          <h4>Edit Shipping Cost</h4>
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
                      (option) => option.code === formData.countryCode
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
              {isLoading ? "Updating..." : "Update Shipping Cost"}
            </button>
          </div>
        </form>
      </div>
    </>
  );
};

export default EditShippingCost;
