import React, { useState, useEffect, useMemo } from "react";
import { Link, useNavigate } from "react-router-dom";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Select from "react-select"; // ✅ searchable select
import axiosInstance from "../../services/FetchNodeServices";
import { Country } from "country-state-city";

const AddCountryCurrency = () => {
    const [isLoading, setIsLoading] = useState(false);
    const [formData, setFormData] = useState({
        countryCode: "",
        currency: "",
        isActive: true,
    });
    const [countries, setCountries] = useState([]);
    const navigate = useNavigate();

    // Fetch countries list
    useEffect(() => {
        const allCountries = Country.getAllCountries();
        setCountries(allCountries);
    }, []);

    // ✅ Prepare searchable options for countries
    const countryOptions = useMemo(() => {
        return countries.map((country) => ({
            value: country.isoCode,
            label: `(${country.isoCode}) ${country.name}`,
            currency: country.currency,
            countryName: country.name,
            // ${country.flag} 
        }));
    }, [countries]);

    // ✅ Unique currency options with one representative country
    // const currencyOptions = useMemo(() => {
    //     const seen = new Set();
    //     return countries
    //         .filter((c) => c.currency && !seen.has(c.currency) && seen.add(c.currency))
    //         .map((c) => ({
    //             value: c.currency, label: `${c.currency} - ${c.name}`,
    //         }));
    // }, [countries]);

    const currencyOptions = [
        { value: "USD", label: "USD - United States Dollar" },
        { value: "EUR", label: "EUR - Euro" },
        { value: "GBP", label: "GBP - British Pound" },
        { value: "INR", label: "INR - Indian Rupee" },
    ]
    // Handle country select → auto-set currency
    const handleCountryChange = (selectedOption) => {
        const selectedCountry = countries.find(
            (c) => c.isoCode === selectedOption?.value
        );

        setFormData((prev) => ({
            ...prev,
            countryCode: selectedOption?.value || "",
            currency: selectedCountry?.currency || "",
        }));
    };

    // Handle currency select
    const handleCurrencyChange = (selectedOption) => {
        setFormData((prev) => ({
            ...prev,
            currency: selectedOption?.value || "",
        }));
    };

    // Handle form submission
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
            const response = await axiosInstance.post("/api/v1/country-currency/create-country-currency", formData);

            if (response.status === 201 || response.data.success) {
                toast.success(
                    response?.data?.message || "Country currency added successfully"
                );
                navigate("/all-country-currency");
            } else {
                toast.error(
                    response?.data?.message || "Failed to add country currency"
                );
            }
        } catch (error) {
            const errorMessage =
                error?.response?.data?.message || "Error adding country currency";
            toast.error(errorMessage);
            console.error("Error adding country currency:", error);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <>
            <ToastContainer />
            <div className="bread">
                <div className="head">
                    <h4>Add Country Currency</h4>
                </div>
                <div className="links">
                    <Link to="/all-country-currency" className="add-new">
                        Back <i className="fa-regular fa-circle-left"></i>
                    </Link>
                </div>
            </div>

            <div className="d-form" style={{ height: '60vh' }}>
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
                            value={formData.currency ? currencyOptions.find((opt) => opt.value === formData.currency) : null}
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
                                onChange={(e) =>
                                    setFormData((prev) => ({
                                        ...prev,
                                        isActive: e.target.checked,
                                    }))
                                }
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
                            {isLoading ? "Saving..." : "Add Country Currency"}
                        </button>
                    </div>
                </form>
            </div>
        </>
    );
};

export default AddCountryCurrency;
