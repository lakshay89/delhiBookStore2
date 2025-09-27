// import React, { useEffect, useState } from "react";
// import axios from "axios";
// import { Link } from "react-router-dom";
// import Swal from "sweetalert2";
// import { ToastContainer, toast } from "react-toastify";
// import "react-toastify/dist/ReactToastify.css";
// import axiosInstance, { getData, postData, serverURL, } from "../../services/FetchNodeServices";

// const AllCategory = () => {
//   const [categories, setCategories] = useState([]);
//   const [isLoading, setIsLoading] = useState(true);


//   // Fetch Categories on mount
//   useEffect(() => {
//     const fetchCategories = async () => {
//       try {
//         const response = await axiosInstance.get("/api/v1/category/get-all-categories");

//         if (response) {
//           setCategories(response.data?.reverse());
//         }
//       } catch (error) {
//         toast.error("Error fetching categories");
//         console.error("Error fetching categories:", error);
//       } finally {
//         setIsLoading(false);
//       }
//     };

//     fetchCategories();
//   }, []);

//   // Handle Delete Action
//   const handleDelete = async (id) => {
//     const confirmDelete = await Swal.fire({
//       title: "Are you sure?",
//       text: "You won't be able to revert this!",
//       icon: "warning",
//       showCancelButton: true,
//       confirmButtonColor: "#d33",
//       cancelButtonColor: "#3085d6",
//       confirmButtonText: "Yes, delete it!",
//     });

//     if (confirmDelete.isConfirmed) {
//       try {
//         const data = await axiosInstance.delete(
//           `/api/v1/category/delete-category/${id}`
//         );

//         if (data.status === 200) {
//           setCategories(categories.filter((category) => category._id !== id));
//           Swal.fire("Deleted!", "Your category has been deleted.", "success");
//         }
//       } catch (error) {
//         Swal.fire(
//           "Error!",
//           "There was an error deleting the category.",
//           "error"
//         );
//         console.error("Error deleting category:", error);
//       }
//     }
//   };

//   // Handle Category Status Change
//   const handleCheckboxChange = async (e, categoryId) => {
//     console.log("categoryId", categoryId);
//     let id = categoryId
//     const updatedStatus = e.target.checked;

//     try {
//       const response = await axiosInstance.post(
//         `/api/v1/category/update-category-status/${id}`,
//         {
//           isHome: updatedStatus,
//         }
//       );

//       if (response.status === 200) {
//         const updatedCategories = categories.map((category) => {
//           if (category._id === categoryId) {
//             category.isHome = updatedStatus;
//           }
//           return category;
//         });
//         setCategories(updatedCategories);
//       }
//     } catch (error) {
//       toast.error("Error updating category status");
//       console.error("Error updating category status:", error);
//     }
//   };

//   // Loading state
//   if (isLoading) {
//     return <p>Loading  categories...</p>;
//   }
//   return (
//     <>
//       <ToastContainer />
//       <div className="bread">
//         <div className="head">
//           <h4>All Category</h4>
//         </div>
//         <div className="links">
//           <Link to="/add-category" className="add-new">
//             Add New <i className="fa-solid fa-plus"></i>
//           </Link>
//           {/* <Link
//             to="/multiple-subcategory"
//             className="add-new"
//             style={{ marginLeft: "10px" }}
//           >
//             Multiple Sub Category <i className="fa-solid fa-plus"></i>
//           </Link> */}

//           {/* <Link
//             to="/multiple-subcategory-to-product-txt"
//             className="add-new"
//             style={{ marginLeft: "10px" }}
//           >
//             Add Multiple Categories <i className="fa-solid fa-plus"></i>
//           </Link> */}
//         </div>
//       </div>

//       {/* <div className="filteration">
//                 <div className="head">
//                 NOTE :- Do add only upto 5 diseases
//                 </div>
//                 <div className="search">

//                 </div>
//             </div> */}

//       <section className="main-table">
//         <table className="table table-bordered table-striped table-hover">
//           <thead>
//             <tr>
//               <th scope="col">Sr.No.</th>
//               <th scope="col">Name</th>
//               <th scope="col">Main Category</th>
//               <th scope="col">Image</th>
//               {/* <th scope="col">Show in Home</th> */}
//               <th scope="col">Edit</th>
//               <th scope="col">Delete</th>
//             </tr>
//           </thead>
//           <tbody>
//             {categories?.length > 0 ? (
//               categories?.map((category, index) => (
//                 <tr key={category._id}>
//                   <th scope="row">{index + 1}</th>
//                   <td>{category?.SubCategoryName}</td>
//                   <td>{category?.Parent_name?.Parent_name}</td>
//                   <td>
//                     <img
//                       src={`${serverURL}/public/image/${category?.categoryImage}`}
//                       alt={category?.SubCategoryName}
//                       style={{ width: "50px", height: "50px" }}
//                     />
//                   </td>
//                   {/* <td>
//                     <input
//                       type="checkbox"
//                       checked={category?.isHome}
//                       onChange={(e) => handleCheckboxChange(e, category._id)}
//                     />
//                   </td> */}
//                   <td>
//                     <Link
//                       to={`/edit-category/${category?._id}`}
//                       className="bt edit"
//                     >
//                       Edit <i className="fa-solid fa-pen-to-square"></i>
//                     </Link>
//                   </td>
//                   <td>
//                     <button
//                       className="bt delete cursor-pointer"
//                       title="Delete"
//                       onClick={() => handleDelete(category._id)}
//                     >
//                       Delete <i className="fa-solid fa-trash"></i>
//                     </button>
//                   </td>
//                 </tr>
//               ))
//             ) : (
//               <tr>
//                 <td colSpan="6" className="text-center">
//                   No sub categories found
//                 </td>
//               </tr>
//             )}
//           </tbody>
//         </table>
//       </section>
//     </>
//   );
// };

// export default AllCategory;


import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import Swal from "sweetalert2";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import axiosInstance, { serverURL } from "../../services/FetchNodeServices";
import { AsyncPaginate } from "react-select-async-paginate";

const AllCategory = () => {
  const [categories, setCategories] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedMainCategory, setSelectedMainCategory] = useState(null);

  // Fetch all categories initially
  useEffect(() => {
    fetchCategories();
  }, []);

  const fetchCategories = async () => {
    try {
      const response = await axiosInstance.get("/api/v1/category/get-all-categories");
      if (response?.status === 200) {
        setCategories(response.data || []);
      }
    } catch (error) {
      toast.error("Error fetching categories");
      console.error("Error fetching categories:", error);
    } finally {
      setIsLoading(false);
    }
  };

  // Load main categories dynamically for AsyncPaginate
  const loadMainCategoryOptions = async (searchQuery = "", loadedOptions, { page }) => {
    try {
      const res = await axiosInstance.get("/api/v1/mainCategory/get-all-mainCategories");
      if (res?.status === 200) {
        const options = res.data
          .filter((cat) =>
            cat?.Parent_name?.toLowerCase().includes(searchQuery.toLowerCase())
          )
          .sort((a, b) => a?.Parent_name?.localeCompare(b?.Parent_name))
          .map((cat) => ({
            value: cat._id,
            label: cat.Parent_name,
          }));

        return {
          options,
          hasMore: false,
          additional: { page: page + 1 },
        };
      }
    } catch (error) {
      console.error("Error loading main categories:", error);
      return { options: [], hasMore: false };
    }
  };

  // Handle delete category
  const handleDelete = async (id) => {
    const confirmDelete = await Swal.fire({
      title: "Are you sure?",
      text: "You won't be able to revert this!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#d33",
      cancelButtonColor: "#3085d6",
      confirmButtonText: "Yes, delete it!",
    });

    if (confirmDelete.isConfirmed) {
      try {
        const res = await axiosInstance.delete(`/api/v1/category/delete-category/${id}`);
        if (res.status === 200) {
          setCategories((prev) => prev.filter((category) => category._id !== id));
          Swal.fire("Deleted!", "Your category has been deleted.", "success");
        }
      } catch (error) {
        Swal.fire("Error!", "There was an error deleting the category.", "error");
        console.error("Error deleting category:", error);
      }
    }
  };

  // Filter categories based on selected main category + sort A-Z
  const filteredCategories = (
    selectedMainCategory
      ? categories.filter((cat) => cat?.Parent_name?._id === selectedMainCategory.value)
      : categories
  ).sort((a, b) => a?.SubCategoryName?.localeCompare(b?.SubCategoryName));

  if (isLoading) return <p>Loading categories...</p>;

  return (
    <>
      <ToastContainer />
      <div className="bread">
        <div className="head">
          <h4>All Categories</h4>
        </div>
        <div className="links d-flex align-items-center gap-3">
          {/* Search / Filter Main Category */}
          <div style={{ width: "350px", zIndex: 3 }}>
            <AsyncPaginate
              placeholder="Search or select main category..."
              classNamePrefix="react-select"
              debounceTimeout={500}
              value={selectedMainCategory}
              loadOptions={loadMainCategoryOptions}
              onChange={(option) => setSelectedMainCategory(option)}
              isClearable
              additional={{ page: 1 }}
            />
          </div>

          {/* Add New Category */}
          <Link to="/add-category" className="add-new">
            Add New <i className="fa-solid fa-plus"></i>
          </Link>
        </div>
      </div>

      {/* Categories Table */}
      <section className="main-table mt-3">
        <table className="table table-bordered table-striped table-hover">
          <thead>
            <tr>
              <th scope="col">Sr.No.</th>
              <th scope="col">Sub Category</th>
              <th scope="col">Main Category</th>
              <th scope="col">Image</th>
              <th scope="col">Edit</th>
              <th scope="col">Delete</th>
            </tr>
          </thead>
          <tbody>
            {filteredCategories.length > 0 ? (
              filteredCategories.map((category, index) => (
                <tr key={category._id}>
                  <th scope="row">{index + 1}</th>
                  <td>{category?.SubCategoryName}</td>
                  <td>{category?.Parent_name?.Parent_name}</td>
                  <td>
                    <img
                      src={`${serverURL}/public/image/${category?.categoryImage}`}
                      alt={category?.SubCategoryName}
                      style={{
                        width: "50px",
                        height: "50px",
                        objectFit: "cover",
                      }}
                    />
                  </td>
                  <td>
                    <Link to={`/edit-category/${category?._id}`} className="bt edit">
                      Edit <i className="fa-solid fa-pen-to-square"></i>
                    </Link>
                  </td>
                  <td>
                    <button
                      className="bt delete cursor-pointer"
                      title="Delete"
                      onClick={() => handleDelete(category._id)}
                    >
                      Delete <i className="fa-solid fa-trash"></i>
                    </button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="6" className="text-center">
                  No subcategories found
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </section>
    </>
  );
};

export default AllCategory;
