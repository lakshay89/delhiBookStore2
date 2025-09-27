import React, { useState } from "react";
import axiosInstance from "../../services/FetchNodeServices";
import { toast } from "react-toastify";
import Swal from "sweetalert2";
const TxtToJsonConverter = () => {
  const [jsonData, setJsonData] = useState([]);
  const [uploading, setUploading] = useState(false);
  const [uploadStatus, setUploadStatus] = useState("");
  const [disabled, setDisabled] = useState(false);
  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (!file || file.type !== "text/plain") {
      alert("Please upload a valid .txt file");
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

  const handleSubmit = async () => {
    if (jsonData.length === 0) {
      toast.error("No data to upload. Please upload a file first.");
      return;
    }
    console.log("JSON data:", jsonData[0]);

    if (!jsonData[0]?.Categories_id) {
      toast.error("Categories_id not found in the Txt file.");
      return;
    }
    if (!jsonData[0]?.Categories_name) {
      toast.error("Categories_name not found in the Txt file.");
      return;
    }
    if (!Object.prototype.hasOwnProperty.call(jsonData[0], "Parent_id")) {
      toast.error("Parent_id not found in the Txt file.");
      return;
    }
   Swal.fire({
  title: 'Uploading...',
  text: 'Please wait while categories are uploading.',
  allowOutsideClick: false,
  allowEscapeKey: false,
  didOpen: () => {
    Swal.showLoading();
  }
});
    try {
      setDisabled(true);
      const response = await axiosInstance.post(
        "/api/v1/mainCategory/upload-all-level-categories",
        { categories: jsonData }
      );
    Swal.close();
      Swal.fire({
        icon: "success",
        title: "Success!",
        text: "Categories uploaded successfully.",
        confirmButtonColor: "#3085d6",
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
              <h4 className="card-title mb-3">Upload Main Categories (Txt)</h4>
             file Name:  <span style={{ color: "red",fontSize:"18px" }}>Originalcategory.txt</span>
            </div>

            <input
              type="file"
              accept=".txt"
              onChange={handleFileChange}
              className="form-control mb-3"
            />

            {jsonData.length > 0 && (
              <div className="alert alert-success">
                categories ready to upload.
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

export default TxtToJsonConverter;
