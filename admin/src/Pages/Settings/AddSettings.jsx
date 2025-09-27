import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import axiosInstance from "../../services/FetchNodeServices";

const AddSettings = () => {
    const [isLoading, setIsLoading] = useState(false);
    const [formData, setFormData] = useState({ phone: "" });

    const navigate = useNavigate();

    // Handle input change
    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData((prev) => ({ ...prev, [name]: value }));
    };

    // Handle submit
    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!formData.phone.trim()) {
            toast.error("Phone number is required");
            return;
        }

        setIsLoading(true);
        try {
            const body = { phone: formData.phone };
            const response = await axiosInstance.post("/api/v1/setting/create-setting", body, { headers: { "Content-Type": "application/json" } });
            if (response.status === 200 || response.status === 201) {
                toast.success(response?.data?.message || "Phone number added successfully ✅");
                navigate("/all-setting");
            } else {
                toast.error(response?.data?.message || "Something went wrong ❌");
            }
        } catch (error) {
            toast.error(error?.response?.data?.message || "Error while adding phone ❌");
            console.error("Add Phone Error:", error);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <>
            <ToastContainer />
            <div className="bread d-flex justify-content-between align-items-center mb-3">
                <h4>Add Phone Number</h4>
                <Link to="/all-setting" className="btn btn-secondary btn-sm">
                    <i className="fa-regular fa-circle-left me-1"></i> Back
                </Link>
            </div>

            <div className="d-form card p-4 shadow-sm">
                <form className="row g-3" onSubmit={handleSubmit}>
                    <div className="col-md-6">
                        <label className="form-label">Phone Number</label>
                        <input type="tel" name="phone" className="form-control" value={formData.phone} onChange={handleChange} placeholder="Enter phone number" required />
                    </div>

                    <div className="col-12 mt-3">
                        <button type="submit" className="btn btn-primary" disabled={isLoading}>
                            {isLoading ? "Saving..." : "Add Number"}
                        </button>
                    </div>
                </form>
            </div>
        </>
    );
};

export default AddSettings;
