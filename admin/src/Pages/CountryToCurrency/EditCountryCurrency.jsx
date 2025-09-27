import React, { useEffect, useState, useMemo } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Select from "react-select";
import axiosInstance from "../../services/FetchNodeServices";
import { Country } from "country-state-city";

const EditCountryCurrency = () => {
    const [isLoading, setIsLoading] = useState(false);
    const [formData, setFormData] = useState({
        countryCode: "",
        currency: "",
        isActive: true,
    });
    const [countries, setCountries] = useState([]);

    const navigate = useNavigate();
    const { id } = useParams();

    // Fetch countries list
    useEffect(() => {
        const allCountries = Country.getAllCountries();
        setCountries(allCountries);
    }, []);

    // ✅ Country options
    const countryOptions = useMemo(() => {
        return countries.map((country) => ({
            value: country.isoCode,
            label: `${country.flag} ${country.name} (${country.isoCode})`,
            currency: country.currency,
        }));
    }, [countries]);

    // ✅ Currency options (unique with representative country)
    const currencyOptions = useMemo(() => {
        const seen = new Set();
        return countries
            .filter((c) => c.currency && !seen.has(c.currency) && seen.add(c.currency))
            .map((c) => ({
                value: c.currency,
                label: `${c.currency} - ${c.name}`,
            }));
    }, [countries]);

    // Fetch existing record
    useEffect(() => {
        const fetchCountryCurrency = async () => {
            try {
                const response = await axiosInstance.get(`/api/v1/country-currency/get-country-currency/${id}`);
                // console.log("CCCCCC==>", response);
                if (response.status === 200 && response.data) {
                    setFormData({
                        countryCode: response.data.countryCode || "",
                        currency: response.data.currency || "",
                        isActive: response.data.isActive ?? true,
                    });
                }
            } catch (error) {
                toast.error("Error fetching country currency data");
                console.error("Error fetching:", error);
            }
        };

        fetchCountryCurrency();
    }, [id]);

    // Handle country select
    const handleCountryChange = (selectedOption) => {
        const selectedCountry = countries.find(
            (c) => c.isoCode === selectedOption?.value
        );

        setFormData((prev) => ({
            ...prev,
            countryCode: selectedOption?.value || "",
            currency: selectedCountry?.currency || prev.currency,
        }));
    };

    // Handle currency select
    const handleCurrencyChange = (selectedOption) => {
        setFormData((prev) => ({
            ...prev,
            currency: selectedOption?.value || "",
        }));
    };

    // Handle checkbox
    const handleCheckbox = (e) => {
        setFormData((prev) => ({
            ...prev,
            isActive: e.target.checked,
        }));
    };

    // Submit handler
    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsLoading(true);

        if (!formData.countryCode || !formData.currency) {
            toast.error("Please fill all required fields");
            setIsLoading(false);
            return;
        }

        if (formData.countryCode.length !== 2) {
            toast.error("Country Code must be 2 letters (ISO format)");
            setIsLoading(false);
            return;
        }

        try {
            const response = await axiosInstance.put(`/api/v1/country-currency/update-country-currency/${id}`, formData);
            console.log("response==>", response);
            if (response.status === 200 || response.data.success) {
                toast.success(
                    response?.data?.message || "Country currency updated successfully"
                );
                navigate("/all-country-currency");
            } else {
                toast.error(
                    response?.data?.message || "Failed to update country currency"
                );
            }
        } catch (error) {
            const errorMessage =
                error?.response?.data?.message || "Error updating country currency";
            toast.error(errorMessage);
            console.error("Error updating country currency:", error);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <>
            <ToastContainer />
            <div className="bread">
                <div className="head">
                    <h4>Update Country Currency</h4>
                </div>
                <div className="links">
                    <Link to="/all-country-currency" className="add-new">
                        Back <i className="fa-regular fa-circle-left"></i>
                    </Link>
                </div>
            </div>

            <div className="d-form">
                <form className="row g-3" onSubmit={handleSubmit}>
                    {/* Country Select */}
                    <div className="col-md-4">
                        <label htmlFor="countryCode" className="form-label">
                            Select Country
                        </label>
                        <Select
                            options={countryOptions}
                            value={
                                formData.countryCode
                                    ? countryOptions.find(
                                        (opt) => opt.value === formData.countryCode
                                    )
                                    : null
                            }
                            onChange={handleCountryChange}
                            placeholder="Search & select country..."
                            isSearchable
                        />
                    </div>

                    {/* Currency Select */}
                    <div className="col-md-4">
                        <label htmlFor="currency" className="form-label">
                            Currency Code
                        </label>
                        <Select
                            options={currencyOptions}
                            value={
                                formData.currency
                                    ? currencyOptions.find(
                                        (opt) => opt.value === formData.currency
                                    )
                                    : null
                            }
                            onChange={handleCurrencyChange}
                            placeholder="Search & select currency..."
                            isSearchable
                        />
                    </div>

                    {/* Active Checkbox */}
                    <div className="col-md-4 d-flex align-items-center mt-4">
                        <label style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                            <input
                                type="checkbox"
                                name="isActive"
                                checked={formData.isActive}
                                onChange={handleCheckbox}
                                style={{ width: "18px", height: "18px", cursor: "pointer" }}
                            />
                            <span>{formData.isActive ? "Active" : "Inactive"}</span>
                        </label>
                    </div>

                    {/* Submit Button */}
                    <div className="col-md-12 mt-3 text-center">
                        <button
                            type="submit"
                            className="bt cursor-pointer"
                            disabled={isLoading}
                        >
                            {isLoading ? "Saving..." : "Update Country Currency"}
                        </button>
                    </div>
                </form>
            </div>
        </>
    );
};

export default EditCountryCurrency;
