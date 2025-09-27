import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import Swal from "sweetalert2";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import axiosInstance from "../../services/FetchNodeServices";

const AllCountryCurrency = () => {
    const [countryCurrencies, setCountryCurrencies] = useState([]);
    const [isLoading, setIsLoading] = useState(true);

    // Fetch all country currencies
    useEffect(() => {
        const fetchCountryCurrencies = async () => {
            try {
                const response = await axiosInstance.get("/api/v1/country-currency/get-all-country-currency");
                console.log(response);
                if (response.status === 200) {
                    setCountryCurrencies(response?.data || []);
                }
            } catch (error) {
                toast.error("Error fetching country currencies");
                console.error("Error fetching country currencies:", error);
            } finally {
                setIsLoading(false);
            }
        };

        fetchCountryCurrencies();
    }, []);

    // Delete a country currency
    const handleDelete = async (id) => {
        const confirmDelete = await Swal.fire({
            title: "Are you sure?",
            text: "You won't be able to revert this!",
            icon: "warning",
            showCancelButton: true,
            confirmButtonColor: "#d33",
            cancelButtonColor: "#3085d6",
            confirmButtonText: "Yes, delete it!",
        });

        if (confirmDelete.isConfirmed) {
            try {
                const response = await axiosInstance.delete(`/api/v1/country-currency/delete-country-currency/${id}`);
                if (response.status === 200) {
                    setCountryCurrencies((prev) => prev.filter((item) => item._id !== id));
                    Swal.fire("Deleted!", "Country currency has been deleted.", "success");
                }
            } catch (error) {
                Swal.fire("Error!", "There was an error deleting the country currency.", "error");
                console.error("Error deleting country currency:", error);
            }
        }
    };

    // Toggle isActive
    const handleCheckboxChange = async (e, id) => {
        const updatedStatus = e.target.checked;
        try {
            const response = await axiosInstance.put(
                `/api/v1/country-currency/update/${id}`,
                {
                    isActive: updatedStatus,
                }
            );

            if (response.status === 200) {
                setCountryCurrencies((prev) =>
                    prev.map((item) =>
                        item._id === id ? { ...item, isActive: updatedStatus } : item
                    )
                );
                toast.success("Status updated successfully");
            }
        } catch (error) {
            toast.error("Error updating status");
            console.error("Error updating status:", error);
        }
    };

    // Loading state
    if (isLoading) {
        return <p>Loading Country Currencies...</p>;
    }

    return (
        <>
            <ToastContainer />
            <div className="bread">
                <div className="head">
                    <h4>All Country Currencies</h4>
                </div>
                <div className="links">
                    <Link to="/add-country-currency" className="add-new">
                        Add New <i className="fa-solid fa-plus"></i>
                    </Link>
                </div>
            </div>

            <section className="main-table">
                <table className="table table-bordered table-striped table-hover">
                    <thead>
                        <tr>
                            <th scope="col">Sr.No.</th>
                            <th scope="col">Country Code</th>
                            <th scope="col">Currency</th>
                            {/* <th scope="col">Currency</th> */}
                            <th scope="col">Active</th>
                            <th scope="col">Edit</th>
                            <th scope="col">Delete</th>
                        </tr>
                    </thead>
                    <tbody>
                        {countryCurrencies?.length > 0 ? (
                            countryCurrencies.map((item, index) => (
                                <tr key={item._id}>
                                    <th scope="row">{index + 1}</th>
                                    <td>{item?.countryCode}</td>
                                    <td>{item?.currency}</td>
                                    <td>
                                        <input
                                            type="checkbox"
                                            checked={item?.isActive}
                                            onChange={(e) => handleCheckboxChange(e, item._id)}
                                        />
                                    </td>
                                    <td>
                                        <Link
                                            to={`/edit-country-currency/${item?._id}`}
                                            className="bt edit"
                                        >
                                            Edit <i className="fa-solid fa-pen-to-square"></i>
                                        </Link>
                                    </td>
                                    <td>
                                        <button
                                            className="bt cursor-pointer delete"
                                            onClick={() => handleDelete(item?._id)}
                                        >
                                            Delete <i className="fa-solid fa-trash"></i>
                                        </button>
                                    </td>
                                </tr>
                            ))
                        ) : (
                            <tr>
                                <td colSpan="6" className="text-center">
                                    No Country Currencies found
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </section>
        </>
    );
};

export default AllCountryCurrency;
