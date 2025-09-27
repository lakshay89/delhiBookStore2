// import React, { useEffect, useState } from "react";
// import { Link, useNavigate, useParams } from "react-router-dom";
// import { ToastContainer, toast } from "react-toastify";
// import "react-toastify/dist/ReactToastify.css";
// import axiosInstance, {
//   getData,
//   postData,
//   serverURL,
// } from "../../services/FetchNodeServices";
// import JoditEditor from "jodit-react";
// import { Autocomplete, TextField } from "@mui/material";
// import { fileLimit } from "../../services/fileLimit";

// const EditCategory = () => {
//   const { id } = useParams();
//   const navigate = useNavigate();

//   const [formData, setFormData] = useState({
//     name: "",
//     image: null,
//     status: false,
//     oldImage: null,
//     Parent_id: "",
//   });
//   const [btnLoading, setBtnLoading] = useState(false);

//   useEffect(() => {
//     const fetchCategory = async () => {
//       try {
//         const response = await axiosInstance.get(
//           `/api/v1/mainCategory/get-single-mainCategory/${id}`
//         );

//         if (response?.status === 200) {
//           setFormData({
//             name: response?.data?.Parent_name || "",
//             Parent_id: response?.data?.Parent_id || "",
//             // status: response?.data?.isActive || false,
//             // oldImage: response?.data?.categoryImage || null,
//             // image: null,
//           });
//         }
//       } catch (error) {
//         toast.error("Error fetching category data");
//         console.error("Fetch category error:", error);
//       }
//     };

//     fetchCategory();
//   }, [id]);

//   const handleChange = (e) => {
//     const { name, type, checked, value, files } = e.target;
//     if (type === "file") {
//       setFormData((prev) => ({ ...prev, image: files[0] }));
//     } else if (type === "checkbox") {
//       setFormData((prev) => ({ ...prev, status: checked }));
//     } else {
//       setFormData((prev) => ({ ...prev, [name]: value }));
//     }
//   };

//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     setBtnLoading(true);
//     if (!fileLimit(formData?.image)) return;
//     const payload = new FormData();
//     payload.append("Parent_name", formData.name);
//     payload.append("Parent_id", formData.Parent_id);
//     // if (formData.image) {
//     //   payload.append("image", formData.image);
//     // }
//     // payload.append("isActive", formData.status);
//     const hasImage = !!formData.image;
//     try {
//       const response = await axiosInstance.put(
//         `/api/v1/mainCategory/update-mainCategory/${id}`,
//         payload
//       );
//       if (response.status === 200) {
//         toast.success(
//           response?.data?.message || "Category updated successfully"
//         );
//         navigate("/all-maincategory");
//       }
//     } catch (error) {
//       toast.error(error?.response?.data?.message || "Error updating category");
//       console.error("Update category error:", error);
//     } finally {
//       setBtnLoading(false);
//     }
//   };

//   return (
//     <>
//       <ToastContainer />
//       <div className="bread">
//         <div className="head">
//           <h4>Edit Main Category</h4>
//         </div>
//         <div className="links">
//           <Link to="/all-maincategory" className="add-new">
//             Back <i className="fa-regular fa-circle-left"></i>
//           </Link>
//         </div>
//       </div>

//       <div className="d-form">
//         <form className="row g-3" onSubmit={handleSubmit}>
//           <div className="col-md-4">
//             <label className="form-label">Main Category Name</label>
//             <input
//               type="text"
//               name="name"
//               className="form-control"
//               value={formData.name}
//               onChange={handleChange}
//               required
//             />
//           </div>
//           <div className="col-md-4">
//             <label className="form-label">Parent Id</label>
//             <input
//               type="text"
//               name="Parent_id"
//               className="form-control"
//               value={formData.Parent_id}
//               onChange={handleChange}
//               required
//             />
//           </div>
//           {/* 
//             <div className="col-md-4">
//               <label className="form-label">Category Image</label>
//               <input
//                 type="file"
//                 name="image"
//                 className="form-control"
//                 onChange={handleChange}
//               />
//               {formData.oldImage && (
//                 <img
//                   src={`${formData.oldImage}`}
//                   alt="Old"
//                   width="100"
//                   style={{ marginTop: "10px" }}
//                 />
//               )}
//             </div>

//             <div className="col-12">
//               <div className="form-check">
//                 <input
//                   className="form-check-input"
//                   type="checkbox"
//                   name="status"
//                   id="status"
//                   checked={formData.status}
//                   onChange={handleChange}
//                 />
//                 <label className="form-check-label" htmlFor="status">
//                   Active on Homepage
//                 </label>
//               </div>
//             </div> */}

//           <div className="col-12 text-center">
//             <button type="submit" className="btn " disabled={btnLoading}>
//               {btnLoading ? "Please Wait..." : "Update Main Category"}
//             </button>
//           </div>
//         </form>
//       </div>
//     </>
//   );
// };

// export default EditCategory;


import React, { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import axiosInstance, { serverURL } from "../../services/FetchNodeServices";
import { fileLimit } from "../../services/fileLimit";

const EditCategory = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    name: "",
    image: null,
    previewImage: null, // for preview
    oldImage: null,
    status: false,
    Parent_id: "",
  });

  const [btnLoading, setBtnLoading] = useState(false);

  // Fetch existing category data
  useEffect(() => {
    const fetchCategory = async () => {
      try {
        const response = await axiosInstance.get(
          `/api/v1/mainCategory/get-single-mainCategory/${id}`
        );

        if (response?.status === 200) {
          setFormData((prev) => ({
            ...prev,
            name: response?.data?.Parent_name || "",
            Parent_id: response?.data?.Parent_id || "",
            oldImage: response?.data?.Image || null,
            // status: response?.data?.status ?? false,
          }));
        }
      } catch (error) {
        toast.error("Error fetching category data");
        console.error("Fetch category error:", error);
      }
    };

    fetchCategory();
  }, [id]);

  // Handle input changes
  const handleChange = (e) => {
    const { name, type, checked, value, files } = e.target;
    if (type === "file" && files[0]) {
      setFormData((prev) => ({
        ...prev,
        image: files[0],
        previewImage: URL.createObjectURL(files[0]), // live preview
      }));
    } else if (type === "checkbox") {
      setFormData((prev) => ({ ...prev, status: checked }));
    } else {
      setFormData((prev) => ({ ...prev, [name]: value }));
    }
  };

  // Handle submit
  const handleSubmit = async (e) => {
    e.preventDefault();
    setBtnLoading(true);

    try {
      const uploadData = new FormData();
      uploadData.append("Parent_name", formData.name);
      uploadData.append("Parent_id", formData.Parent_id);
      // uploadData.append("status", formData.status);

      if (formData.image) {
        if (!fileLimit(formData.image)) {
          setBtnLoading(false);
          return;
        }
        uploadData.append("image", formData.image);
      }

      const response = await axiosInstance.put(
        `/api/v1/mainCategory/update-mainCategory/${id}`,
        uploadData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );

      if (response.status === 200) {
        toast.success(response?.data?.message || "Category updated successfully");
        navigate("/all-maincategory");
      }
    } catch (error) {
      toast.error(error?.response?.data?.message || "Error updating category");
      console.error("Update category error:", error);
    } finally {
      setBtnLoading(false);
    }
  };

  return (
    <>
      <ToastContainer />
      <div className="bread">
        <div className="head">
          <h4>Edit Main Category</h4>
        </div>
        <div className="links">
          <Link to="/all-maincategory" className="add-new">
            Back <i className="fa-regular fa-circle-left"></i>
          </Link>
        </div>
      </div>

      <div className="d-form">
        <form className="row g-3" onSubmit={handleSubmit}>
          <div className="col-md-4">
            <label className="form-label">Main Category Name</label>
            <input
              type="text"
              name="name"
              className="form-control"
              value={formData.name}
              onChange={handleChange}
              required
            />
          </div>

          <div className="col-md-4">
            <label className="form-label">Parent Id</label>
            <input
              type="text"
              name="Parent_id"
              className="form-control"
              value={formData.Parent_id}
              onChange={handleChange}
              required
            />
          </div>

          <div className="col-md-4">
            <label className="form-label">Main Category Image</label>
            <input
              type="file"
              name="image"
              className="form-control"
              onChange={handleChange}
            />

            {/* Show new preview if selected */}
            {formData.previewImage ? (
              <img
                src={formData?.previewImage}
                alt="Preview"
                width="100"
                style={{ marginTop: "10px", border: "1px solid #ddd" }}
              />
            ) : (
              formData.oldImage && (
                <img
                  src={`${serverURL}/public/image/${formData?.oldImage}`}
                  alt="Old"
                  width="100"
                  style={{ marginTop: "10px", border: "1px solid #ddd" }}
                />
              )
            )}
          </div>

          {/* <div className="col-12">
            <div className="form-check">
              <input
                className="form-check-input"
                type="checkbox"
                name="status"
                id="status"
                checked={formData.status}
                onChange={handleChange}
              />
              <label className="form-check-label" htmlFor="status">
                Active on Homepage
              </label>
            </div>
          </div> */}

          <div className="col-12 text-center">
            <button type="submit" className="btn btn-primary" disabled={btnLoading}>
              {btnLoading ? "Please Wait..." : "Update Main Category"}
            </button>
          </div>
        </form>
      </div>
    </>
  );
};

export default EditCategory;
