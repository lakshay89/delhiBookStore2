import React, { useState } from "react";
import axiosInstance from "../../services/FetchNodeServices";
import { toast } from "react-toastify";
import Swal from "sweetalert2";
const TxtProductsSubCategory = () => {
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

      // Update Swal progress bar
      Swal.getHtmlContainer().querySelector(".progress-bar").style.width = `${percent}%`;
      Swal.getHtmlContainer().querySelector(".progress-text").innerText = `${percent}%`;

      try {
        await axiosInstance.post(
          "/api/v1/product/multiple-subcategory-to-product",
          { subCategories: chunk }
        );
        console.log(`✅ Uploaded chunk ${currentChunk}`);
      } catch (error) {
        console.error("❌ Chunk upload failed:", error);
        throw error;
      }
    }
  };

  const handleSubmit = async () => {
    if (!jsonData.length) {
      alert("No data to upload. Please upload an Excel file first.");
      return;
    }
    if (!jsonData[0]?.CATEGORIES_ID) {
      toast.error("Product name is missing. The field name must be CATEGORIES_ID");
      return;
    }
    if (!jsonData[0]?.PRODUCTS_ID) {
      toast.error("Product ID is missing. The field name must be PRODUCTS_ID");
      return;
    }

    Swal.fire({
      title: "<strong>📚 Uploading Product's Category</strong>",
      html: `
    <p style="margin-top: 10px; font-size: 15px; color: #555;">
      Please wait while categories are uploading to <b>Delhi Book Store</b> 📖
    </p>
    <div style="margin-top: 20px; width: 100%; background: #e0e0e0; height: 20px; border-radius: 10px; overflow: hidden;">
      <div class="progress-bar" style="height: 100%; width: 0%; background-color: #da7921; transition: width 0.3s;"></div>
    </div>
    <div class="progress-text" style="margin-top: 8px; font-weight: bold; color: #444;">0%</div>
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

    try {
      setDisabled(true);
      await uploadInChunks(jsonData);
      Swal.close();
      Swal.fire({
        icon: "success",
        title: "Product's Category Uploaded!",
        html: `
         <p style="margin-top: 10px; font-size: 15px; color: #444;">
           All Category have been Attached to products
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
      setDisabled(false);
      setJsonData([]);
    } catch (error) {
      setDisabled(false);
      Swal.close();
      console.error("❌ Upload failed:", error);
      toast.error("Failed to upload main categories.");
    }
  };

  return (
    <>
      <div className="container mt-5">
        <div className="card shadow">
          <div className="card-body text-center">
            <div className="p-4 mb-4 text-start">
              <h4 className="card-title mb-3">
                Upload Product's Category (Txt)

              </h4>
              file Name:  <span style={{ color: "red", fontSize: "18px" }}>Originalprdtocat.txt</span>
            </div>

            <input
              type="file"
              accept=".txt"
              onChange={handleFileChange}
              className="form-control mb-3"
            />

            {jsonData.length > 0 && (
              <div className="alert alert-success">
                {jsonData.length} Product's Category ready to upload.
              </div>
            )}
            <button
              onClick={handleSubmit}
              disabled={disabled || jsonData.length === 0}
              className="btn"
              style={{ backgroundColor: "#6f42c1", color: "white" }}
            >
              {"Submit"}
            </button>
          </div>
        </div>
      </div>
    </>
  );
};

export default TxtProductsSubCategory;
