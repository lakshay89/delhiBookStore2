import React, { useEffect, useState } from 'react';
import Swal from 'sweetalert2';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import axiosInstance, { getData, postData } from '../../services/FetchNodeServices';
import { formatDate } from '../../constant';

const AllReviews = () => {
    const [reviews, setReviews] = useState([]);
    const [isLoading, setIsLoading] = useState(false);

    // Fetch all reviews
    useEffect(() => {
        const fetchReviews = async () => {
            setIsLoading(true);
            try {
                const response = await axiosInstance.get(`/api/v1/feedback/get-all-feedback`);
                if (response?.data?.success === true) {
                    setReviews(response?.data?.feedback || []);
                }
            } catch (error) {
                console.error("Error fetching reviews:", error);
                toast.error("Failed to fetch reviews!");
            } finally {
                setIsLoading(false);
            }
        };

        fetchReviews();
    }, []);

    // Handle review deletion
    const handleDelete = async (reviewId) => {
        const confirm = await Swal.fire({
            title: "Are you sure?",
            text: "You won't be able to revert this!",
            icon: "warning",
            showCancelButton: true,
            confirmButtonText: "Yes, delete it!",
            cancelButtonText: "Cancel",
        });

        if (confirm.isConfirmed) {
            try {
                const data = await getData(`api/v1/feedback/delete-reviews/${reviewId}`);
                if (data.success === true) {
                    setReviews(reviews.filter((review) => review._id !== reviewId));
                    toast.success("Review deleted successfully!");
                }
            } catch (error) {
                console.error("Error deleting review:", error);
                toast.error("Failed to delete review!");
            }
        }
    };

    // Handle checkbox change to update review status
    const handleCheckboxChange = async (e, reviewId) => {
        const updatedStatus = e.target.checked;
        try {
            const response = await axiosInstance.put(`/api/v1/feedback/update-Status-feedback/${reviewId}`, { isActive: updatedStatus, });
            if (response?.data?.success === true) {
                const updatedReviews = reviews.map((review) => review?._id === reviewId ? { ...review, isActive: updatedStatus } : review);
                setReviews(updatedReviews);
                toast.success('Review status updated successfully');
            }
        } catch (error) {
            toast.error("Error updating review status");
            console.error("Error updating review status:", error);
        }
    };

    return (
        <>
            <ToastContainer />
            <div className="bread">
                <div className="head">
                    <h4>All Reviews List</h4>
                </div>
            </div>

            <section className="main-table">
                <table className="table table-bordered table-striped table-hover">
                    <thead>
                        <tr>
                            <th>S No.</th>
                            <th>User Email</th>
                            <th>User Name</th>
                            <th>Message</th>
                            <th>Rating</th>
                            <th>Order ID</th>
                            <th>City</th>
                            <th>Show on HomePage</th>
                            <th>Date</th>
                            <th>Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {isLoading ? (
                            <tr>
                                <td colSpan="11" className="text-center">Loading...</td>
                            </tr>
                        ) : reviews.length === 0 ? (
                            <tr>
                                <td colSpan="11" className="text-center">No Reviews found.</td>
                            </tr>
                        ) : (
                            reviews.map((review, index) => (
                                <tr key={review._id}>
                                    <td>{index + 1}</td>
                                    <td>{review?.userId?.email || "N/A"}</td>
                                    <td>{review?.userId?.fullName || "N/A"}</td>
                                    <td>{review?.masseg}</td>
                                    <td>{"⭐".repeat(review?.rating || 0)}</td>
                                    <td>{review?.orderId?.orderUniqueId || "N/A"}</td>
                                    <td>{review?.orderId?.shippingAddress?.city || "N/A"}</td>
                                    <td>
                                        <input
                                            type="checkbox"
                                            checked={review?.isActive || false}
                                            onChange={(e) => handleCheckboxChange(e, review?._id)}
                                        />
                                    </td>
                                    <td>{formatDate(review?.createdAt)}</td>
                                    <td>
                                        <button
                                            onClick={() => handleDelete(review._id)}
                                            className="btn btn-danger btn-sm"
                                        >
                                            <i className="fa-solid fa-trash"></i> Delete
                                        </button>
                                    </td>
                                </tr>
                            ))
                        )}
                    </tbody>
                </table>
            </section>
        </>
    );
};

export default AllReviews;
