import React, { useState } from "react";
import * as XLSX from "xlsx";
import axiosInstance from "../../services/FetchNodeServices";
import { toast } from "react-toastify";
import DownloadCategoryTemplate from "../../Components/template/DownloadCategoryTemplate";

const ExcelCategoryAndSubcategory = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(false);

  const handleExcelUpload = async (e) => {
  const file = e.target.files[0];
  if (!file) return;

  const loading = toast.loading("Parsing Excel file...", {
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
        toast.dismiss(loading);
        toast.error("❌ Excel file is empty!");
        return;
      }

      if (!jsonData[0]?.Categories_id) {
        toast.dismiss(loading);
        toast.error("❌ 'Categories_id' column is missing.");
        return;
      }

      if (!jsonData[0]?.Categories_name) {
        toast.dismiss(loading);
        toast.error("❌ 'Categories_name' column is missing.");
        return;
      }

      if (!jsonData[0]?.Parent_id) {
        toast.dismiss(loading);
        toast.error("❌ 'Parent_id' column is missing.");
        return;
      }

      setProducts(jsonData);
      toast.dismiss(loading);
      toast.success("✅ Excel file parsed successfully!");
      console.log("Excel data parsed:", jsonData);
    } catch (error) {
      console.error("Parsing failed:", error);
      toast.dismiss(loading);
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

    try {
      setLoading(true);
      const res = await axiosInstance.post(
        "/api/v1/category/add-category-and-subcategory",
        {
          categories: products,
        }
      );

      console.log("Server response:", res.data);
      alert("✅ Subcategories uploaded successfully.");
      setProducts([]);
    } catch (error) {
      toast.dismiss(loading);
      console.error("Upload failed:", error);
      alert("❌ Failed to upload subcategories.");
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
                Upload Category with Subcategory (Excel)
              </h4>
              <div>
                <DownloadCategoryTemplate />
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
              {products.length} category ready to upload
            </div>
          )}

          <button
            onClick={handleSubmit}
            disabled={loading || products.length === 0}
            className="bt cursor-pointer"
            style={{ backgroundColor: "#6f42c1", color: "white" }}
          >
            {loading ? "Uploading..." : "Submit Categories"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default ExcelCategoryAndSubcategory;
