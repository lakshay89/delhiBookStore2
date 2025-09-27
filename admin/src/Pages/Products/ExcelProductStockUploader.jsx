import React, { useState } from "react";
import * as XLSX from "xlsx";
import axiosInstance from "../../services/FetchNodeServices";
import { toast } from "react-toastify";
import DownloadProductStock from "../../Components/template/DownloadProductStock";

const ExcelProductStockUploader = () => {
  const [stockData, setStockData] = useState([]);
  const [loading, setLoading] = useState(false);

  const handleExcelUpload = async (e) => {
  const file = e.target.files[0];
  if (!file) return;

  const loadingToast = toast.loading("📤 Reading Excel file...", {
    position: "top-right",
    autoClose: false,
  });

  const reader = new FileReader();
  reader.onload = async (evt) => {
    try {
      const data = new Uint8Array(evt.target.result);
      const workbook = XLSX.read(data, { type: "array" });
      const sheet = workbook.Sheets[workbook.SheetNames[0]];
      const jsonData = XLSX.utils.sheet_to_json(sheet);

      toast.dismiss(loadingToast);

      if (jsonData.length === 0) {
        toast.error("❌ Excel file is empty!", { autoClose: 3000 });
        return;
      }

      const requiredFields = ["ISBN13", "stock"];
      const isValid = requiredFields.every((field) =>
        Object.keys(jsonData[0]).includes(field)
      );

      if (!isValid) {
        toast.error("❌ Columns must include: ISBN13 and stock", { autoClose: 3000 });
        return;
      }

      toast.success("✅ Excel parsed successfully!", { autoClose: 2000 });
      setStockData(jsonData);
    } catch (error) {
      console.error("Parsing error:", error);
      toast.dismiss(loadingToast);
      toast.error("❌ Failed to parse Excel file.", { autoClose: 3000 });
    }
  };

  reader.readAsArrayBuffer(file);
};


  const handleSubmit = async () => {
    if (!stockData.length) {
      toast.error(" No data to upload. Upload an Excel file first.");
      return;
    }

    try {
      setLoading(true);
      const res = await axiosInstance.post(
        "/api/v1/product/update-product-stock",
        {
          products: stockData,
        }
      );

      toast.success("Stock updated successfully.");
      setStockData([]);
    } catch (error) {
      console.error("Upload error:", error);
      toast.error("Failed to update stock.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container mt-5">
      <div className="card shadow">
        <div className="card-body text-center">
          <div className=" p-3 mb-4">
            <div className="d-flex flex-column align-items-start">
              <h4 className="card-title mb-4">Upload Product Stock (Excel)</h4>

              <div>
                <DownloadProductStock />
              </div>
            </div>
          </div>
          <input
            type="file"
            accept=".xlsx,.xls"
            onChange={handleExcelUpload}
            className="form-control mb-3"
          />

          {stockData.length > 0 && (
            <div className="alert alert-success" role="alert">
              {stockData.length} product stock entries ready to upload
            </div>
          )}

          <button
            onClick={handleSubmit}
            disabled={loading || stockData.length === 0}
            className="btn"
            style={{ backgroundColor: "#6f42c1", color: "white" }}
          >
            {loading ? "Uploading..." : "Submit Stock Updates"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default ExcelProductStockUploader;
