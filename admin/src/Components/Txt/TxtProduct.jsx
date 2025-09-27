import React, { useState } from "react";
import axiosInstance from "../../services/FetchNodeServices";
import { toast } from "react-toastify";
import Swal from "sweetalert2";

const TxtProduct = () => {
  const [jsonData, setJsonData] = useState([]);
  const [disabled, setDisabled] = useState(false);

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (!file || file.type !== "text/plain") {
      toast.error("Please upload a valid .txt file");
      return;
    }

    const reader = new FileReader();
    reader.onload = (event) => {
      const text = event.target.result;
      const parsedJson = convertTxtToJson(text);
      setJsonData(parsedJson);
    };

    reader.readAsText(file);
  };

  const convertTxtToJson = (text) => {
    const lines = text.trim().split("\n");
    const headers = lines[0].split("##").map((h) => h.trim());

    return lines.slice(1).map((line) => {
      const values = line.split("##").map((v) => v.trim());
      const obj = {};
      headers.forEach((key, index) => {
        obj[key] = values[index] ?? "";
      });
      return obj;
    });
  };

  const CHUNK_SIZE = 5000;

  const uploadInChunks = async (data) => {
    const totalChunks = Math.ceil(data.length / CHUNK_SIZE);
    for (let i = 0; i < data.length; i += CHUNK_SIZE) {
      const chunk = data.slice(i, i + CHUNK_SIZE);
      const currentChunk = i / CHUNK_SIZE + 1;
      const percent = Math.round((currentChunk / totalChunks) * 100);

      Swal.update({
        html: `
          <p style="margin-top: 10px; font-size: 15px; color: #555;">
            Uploading chunk ${currentChunk} of ${totalChunks}... (${percent}%)
          </p>
          <div class="progress" style="height: 15px;">
            <div class="progress-bar progress-bar-striped bg-success" role="progressbar" style="width: ${percent}%;" aria-valuenow="${percent}" aria-valuemin="0" aria-valuemax="100">${percent}%</div>
          </div>
        `,
      });

      try {
        await axiosInstance.post(
          "/api/v1/product/multiple-product",
          {
            products: chunk,
          },
          {
            headers: {
              "Content-Type": "application/json; charset=utf-8",
            },
          }
        );
      } catch (error) {
        console.error(`Chunk ${currentChunk} upload failed`, error);
        throw error; // Stop further uploading
      }
    }
  };

  const handleSubmit = async () => {
    console.log("products", jsonData);

    if (!jsonData.length) {
      alert("No data to upload. Please upload a .txt file first.");
      return;
    }
    if (!jsonData[0]?.PRODUCTS_NAME) {
      toast.error("PRODUCTS_NAME field is required.");
      return;
    }
    if (!jsonData[0]?.PRODUCTS_ID) {
      toast.error("PRODUCTS_ID field is required.");
      return;
    }
    if (!jsonData[0]?.PRODUCTS_MRP_IN_DOLLAR) {
      toast.error("PRODUCTS_MRP_IN_DOLLAR field is required.");
      return;
    }
    if (!jsonData[0]?.PRODUCTS_SP_IN_DOLLAR) {
      toast.error("PRODUCTS_SP_IN_DOLLAR field is required.");
      return;
    }
    if (!jsonData[0]?.ISBN13) {
      toast.error("ISBN13 field is required.");
      return;
    }

    Swal.fire({
      title: "<strong>📦 Uploading Products</strong>",
      html: `
        <p style="margin-top: 10px; font-size: 15px; color: #555;">
          Please wait while we upload products to <b>Delhi Book Store</b> 📚
        </p>
        <div class="progress" style="height: 15px;">
          <div class="progress-bar progress-bar-striped bg-success" role="progressbar" style="width: 0%;" aria-valuenow="0" aria-valuemin="0" aria-valuemax="100">0%</div>
        </div>
      `,
      allowOutsideClick: false,
      showConfirmButton: false,
      didOpen: () => Swal.showLoading(),
      customClass: {
        popup: "rounded-xl shadow-lg border border-[#da7921]",
        title: "text-lg text-[#da7921]",
      },
    });

    try {
      setDisabled(true);
      await uploadInChunks(jsonData);

      Swal.close();
      Swal.fire({
        icon: "success",
        title: "Products Uploaded!",
        html: `
          <p style="margin-top: 10px; font-size: 15px; color: #444;">
            All products have been added to <b>Delhi Book Store</b>.
          </p>
        `,
        confirmButtonText: "Done",
        confirmButtonColor: "#da7921",
        background: "#f0fff4",
        customClass: {
          popup: "rounded-xl shadow-lg",
          title: "text-xl font-semibold text-green-700",
        },
      });

      setDisabled(false);
      setJsonData([]);
    } catch (error) {
      setDisabled(false);
      Swal.close();
      toast.error("Upload failed.");
    }
  };

  return (
    <>
      <div className="container mt-5">
        <div className="card shadow">
          <div className="card-body text-center">
            <div className="p-4 mb-4 text-start">
              <h4 className="card-title mb-3">Upload Products (Txt)</h4>
             file Name:  <span style={{ color: "red",fontSize:"18px" }}>Originalproduct.txt</span>

            </div>

            <input
              type="file"
              accept=".txt"
              onChange={handleFileChange}
              className="form-control mb-3"
            />

            {jsonData.length > 0 && (
              <div className="alert alert-success">
                {jsonData.length} products ready to upload.
              </div>
            )}
            <button
              onClick={handleSubmit}
              disabled={disabled || jsonData.length === 0}
              className="btn"
              style={{ backgroundColor: "#6f42c1", color: "white" }}
            >
              Submit
            </button>
          </div>
        </div>
      </div>
    </>
  );
};

export default TxtProduct;
