import React, { useState } from "react";
import * as XLSX from "xlsx";
import axiosInstance from "../../services/FetchNodeServices";
import { toast } from "react-toastify";
import DownloadMainCategoryTemplate from "../../Components/template/DownloadMainCategoryTemplate";
import Swal from "sweetalert2";

const ExcelMainCategoryUploader = () => {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(false);

 const handleExcelUpload = async (e) => {
  const file = e.target.files[0];
  if (!file) return;

  let toastId = toast.loading("Parsing Excel file...", {
    position: "top-right",
  });

  const reader = new FileReader();
  reader.onload = async (evt) => {
    try {
      const data = new Uint8Array(evt.target.result);
      const workbook = XLSX.read(data, { type: "array" });
      const sheet = workbook.Sheets[workbook.SheetNames[0]];
      const jsonData = XLSX.utils.sheet_to_json(sheet);

      toast.dismiss(toastId);

      if (jsonData.length === 0) {
        toast.error("❌ Excel file is empty!", { autoClose: 3000 });
        return;
      }

      const isValid = jsonData.every(
        (item) => item.Parent_name && item.Parent_id
      );

      if (!isValid) {
        toast.error("❌ Missing Parent_name or Parent_id in one or more rows.", {
          autoClose: 4000,
        });
        return;
      }

      toast.success("✅ Excel file parsed successfully!");
      setCategories(jsonData);
      console.log("Parsed categories:", jsonData);
    } catch (error) {
      console.error("Error parsing file:", error);
      toast.dismiss(toastId);
      toast.error("❌ Failed to parse Excel file.", { autoClose: 3000 });
    }
  };

  reader.readAsArrayBuffer(file);
};


  const handleSubmit = async () => {
    if (!categories.length) {
      toast.error("❌ No data to upload.");
      return;
    }
    if (!categories[0]?.Parent_id) {
      toast.error("❌ Please remove Parent_id from the Excel file.");
      return;
    }
    if (!categories[0]?.Parent_name) {
      toast.error("❌ Please remove Parent_name from the Excel file.");
      return;
    }
    try {
      setLoading(true);
      const res = await axiosInstance.post(
        "/api/v1/mainCategory/multiple-main-categories",
        {
          MainCategories: categories,
        }
      );

      console.log("Server response:", res.data);
      Swal.fire({
        icon: "success",
        title: "Success!",
        text: "✅ Categories uploaded successfully.",
        confirmButtonColor: "#3085d6",
      });

      setCategories([]);
    } catch (error) {
      console.error("Upload failed:", error);
      toast.error("❌ Failed to upload main categories.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container mt-5">
      <div className="card shadow">
        <div className="card-body text-center">
          <div className="p-4 mb-4 text-start">
            <h4 className="card-title mb-3">Upload Main Categories (Excel)</h4>
            <DownloadMainCategoryTemplate />
          </div>

          <input
            type="file"
            accept=".xlsx,.xls"
            onChange={handleExcelUpload}
            className="form-control mb-3"
          />

          {categories.length > 0 && (
            <div className="alert alert-success">
              {categories.length} categories ready to upload.
            </div>
          )}

          <button
            onClick={handleSubmit}
            disabled={loading || categories.length === 0}
            className="btn"
            style={{ backgroundColor: "#6f42c1", color: "white" }}
          >
            {loading ? "Uploading..." : "Submit Categories"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default ExcelMainCategoryUploader;
