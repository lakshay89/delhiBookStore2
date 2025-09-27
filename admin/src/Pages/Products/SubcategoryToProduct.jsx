import React, { useState } from "react";
import * as XLSX from "xlsx";
import axiosInstance from "../../services/FetchNodeServices";
import { toast } from "react-toastify";
import DownloadSubCategoryTemplate from "../../Components/template/DownloadSubcategory";
import Swal from "sweetalert2";

const ExcelSubToProductUploader = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(false);

  const handleExcelUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    let loading = toast.loading("Parsing Excel file...", {
      position: "top-right",
    });
    const reader = new FileReader();
    reader.onload = async (evt) => {
      try {
        const data = new Uint8Array(evt.target.result);
        const workbook = XLSX.read(data, { type: "array" });
        const sheet = workbook.Sheets[workbook.SheetNames[0]];
        const jsonData = XLSX.utils.sheet_to_json(sheet);

        if (jsonData.length === 0) {
          alert("Excel file is empty!");
          return;
        }
        toast.update(loading, {
          render: "Excel file parsed successfully!",
          type: "success",
          isLoading: false,
          autoClose: 2000,
        });
        setProducts(jsonData);
        console.log("Excel data parsed:", jsonData);
      } catch (error) {
        console.error("Parsing failed:", error);
        toast.error("❌ Failed to parse Excel file.");
      }
    };

    reader.readAsArrayBuffer(file);
  };

  const handleSubmit = async () => {
    if (!products.length) {
      alert("No data to upload. Please upload an Excel file first.");
      return;
    }

    if (!products[0]?.Sub_CATEGORIES_ID) {
      alert(
        "Subcategory ID is missing. The field name must be Sub_CATEGORIES_ID"
      );
      return;
    }
    if (!products[0]?.PRODUCTS_ID) {
      alert("Product ID is missing. The field name must be PRODUCTS_ID");
      return;
    }
    try {
      setLoading(true);
      const res = await axiosInstance.post(
        "/api/v1/product/multiple-subcategory-to-product",
        {
          subCategories: products,
        }
      );

      console.log("Server response:", res.data);
    
      Swal.fire({
        icon: "success",
        title: "Success!",
        text: "✅ Products uploaded successfully.",
        confirmButtonColor: "#3085d6",
      });
      setProducts([]);
    } catch (error) {
      console.error("Upload failed:", error);
      alert("❌ Failed to upload products.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container mt-5">
      <div className="card shadow">
        <div className="card-body text-center">
          <div className=" p-4 mb-4">
            <div className="d-flex flex-column align-items-start">
              <h4 className="card-title mb-3">
                Upload Subcategory for Products (Excel)
              </h4>
              <div>
                <DownloadSubCategoryTemplate />
              </div>
            </div>
          </div>
          <input
            type="file"
            accept=".xlsx,.xls"
            onChange={handleExcelUpload}
            className="form-control mb-3"
          />

          {products.length > 0 && (
            <div className="alert alert-success" role="alert">
              {products.length} Subcategory's product ready to upload
            </div>
          )}

          <button
            onClick={handleSubmit}
            disabled={loading || products.length === 0}
            className="btn"
            style={{ backgroundColor: "#6f42c1", color: "white" }}
          >
            {loading ? "Uploading..." : "Submit Products"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default ExcelSubToProductUploader;
