import React, { useState } from "react";
import * as XLSX from "xlsx";
import axiosInstance from "../../services/FetchNodeServices";
import { toast } from "react-toastify";
import DownloadProductTemplate from "../../Components/template/DownloadProductTemplate";
import Swal from "sweetalert2";

const ExcelProductUploader = () => {
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
    if (!products[0]?.PRODUCTS_NAME) {
      toast.error(
        "❌ Product name is missing. The field name must be PRODUCTS_NAME"
      );
      return;
    }
    if (!products[0]?.PRODUCTS_ID) {
      toast.error(
        "❌ Product ID is missing. The field name must be PRODUCTS_ID"
      );
      return;
    }
    if (!products[0]?.PRODUCTS_MRP_IN_DOLLAR) {
      toast.error(
        "❌ Product MRP in Dollar is missing. The field name must be PRODUCTS_MRP_IN_DOLLAR"
      );
      return;
    }
    if (!products[0]?.PRODUCTS_SP_IN_DOLLAR) {
      toast.error(
        "❌ Product SP in Dollar is missing. The field name must be PRODUCTS_SP_IN_DOLLAR"
      );
      return;
    }
    try {
      // setLoading(true);
      Swal.fire({
        title: "<strong>📚 Uploading Products</strong>",
        html: `
    <p style="margin-top: 10px; font-size: 15px; color: #555;">
      Please wait while we add your products to <b>Delhi Book Store</b> 📖
    </p>
    <div class="loader" style="margin-top: 20px;"></div>
  `,

        allowOutsideClick: false,
        showConfirmButton: false,
        didOpen: () => {
          Swal.showLoading();
        },
        customClass: {
          popup: "rounded-xl shadow-lg border border-[#da7921]",
          title: "text-lg text-[#da7921]",
        },
      });

      const res = await axiosInstance.post("/api/v1/product/multiple-product", {
        products,
      });
      Swal.close();
      Swal.fire({
        icon: "success",
        title: "✅ Products Uploaded!",
        html: `
    <p style="margin-top: 10px; font-size: 15px; color: #444;">
      All products have been successfully added to <b>Delhi Book Store</b>. 🎉
    </p>
  `,
        confirmButtonText: "Awesome!",
        confirmButtonColor: "#da7921",
        background: "#f0fff4",
        customClass: {
          popup: "rounded-xl shadow-lg",
          title: "text-xl font-semibold text-green-700",
        },
      });

      console.log("Server response:", res.data);

      setProducts([]);
    } catch (error) {
      console.error("Upload failed:", error);
      alert("❌ Failed to upload products.");
    } finally {
      // setLoading(false);
      Swal.close();
    }
  };

  return (
    <div className="container mt-5">
      <div className="card shadow">
        <div className="card-body text-center">
          <div className=" p-4 mb-4">
            <div className="d-flex flex-column align-items-start">
              <h4 className="card-title mb-4">Upload Products (Excel)</h4>

              <div>
                <DownloadProductTemplate />
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
              {products.length} products ready to upload
            </div>
          )}

          <button
            onClick={handleSubmit}
            disabled={loading || products.length === 0}
            className="btn "
            style={{ backgroundColor: "#6f42c1", color: "white" }}
          >
            {loading ? "Uploading..." : "Submit Products"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default ExcelProductUploader;
