import React, { useEffect, useState } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import axiosInstance from "../../services/FetchNodeServices";

const EditSettings = () => {
    const { id } = useParams();
    const navigate = useNavigate();

    const [isLoading, setIsLoading] = useState(false);
    const [formData, setFormData] = useState({ phone: "" });

    // Fetch existing number
    useEffect(() => {
        fetchNumber();
    }, [id]);

    const fetchNumber = async () => {
        try {
            const res = await axiosInstance.get(`/api/v1/setting/get-single-setting/${id}`);
            if (res.status === 200) {
                setFormData({ phone: res?.data?.data?.phone });
            }
        } catch (err) {
            toast.error("Failed to fetch number");
        }
    };

    // Handle input change
    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    // Update number
    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsLoading(true);

        try {
            const response = await axiosInstance.put(`/api/v1/setting/update-setting/${id}`, formData);

            if (response.status === 200) {
                toast.success("Number updated successfully");
                navigate("/all-setting");
            } else {
                toast.error("Update failed");
            }
        } catch (error) {
            toast.error(error?.response?.data?.message || "Update error");
            console.error("Update Number Error:", error);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <>
            <ToastContainer />
            <div className="bread">
                <div className="head">
                    <h4>Edit Number</h4>
                </div>
                <div className="links">
                    <Link to="/all-setting" className="add-new">
                        Back <i className="fa-regular fa-circle-left"></i>
                    </Link>
                </div>
            </div>

            <div className="d-form">
                <form className="row g-3" onSubmit={handleSubmit}>
                    <div className="col-md-4">
                        <label className="form-label">Number</label>
                        <input type="text" name="phone" className="form-control" value={formData.phone} onChange={handleChange} required />
                    </div>

                    <div className="col-md-12 mt-3">
                        <button type="submit" className="btn" disabled={isLoading}>
                            {isLoading ? "Updating..." : "Update Number"}
                        </button>
                    </div>
                </form>
            </div>
        </>
    );
};

export default EditSettings;
