import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import axiosInstance from "../../services/FetchNodeServices";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const AllSettings = () => {
  const [allSettings, setAllSettings] = useState([]);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    fetchNumbers();
  }, []);

  const fetchNumbers = async () => {
    try {
      setLoading(true);
      const response = await axiosInstance.get(
        "/api/v1/setting/get-all-setting"
      );
      setAllSettings(response?.data?.data || []);
    } catch (error) {
      toast.error("Error fetching numbers");
      console.error("Error fetching data:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this number?")) return;

    try {
      await axiosInstance.delete(`/api/v1/setting/delete-setting/${id}`);
      toast.success("Number deleted successfully");
      fetchNumbers(); // refresh list
    } catch (error) {
      toast.error("Error deleting number");
      console.error("Error deleting number:", error);
    }
  };

  return (
    <>
      <div className="bread">
        <div className="head">
          <h4>All Numbers</h4>
        </div>
        <div className="links">
          <Link to="/add-setting" className="add-new">
            Add New <i className="fa-solid fa-plus"></i>
          </Link>
        </div>
      </div>

      <section className="mt-2 main-table table-responsive">
        {loading ? (
          <p className="text-center">Loading...</p>
        ) : (
          <table className="table table-bordered table-striped table-hover">
            <thead>
              <tr>
                <th scope="col">S No.</th>
                <th scope="col">Number</th>
                <th scope="col" style={{ width: "200px" }}>
                  Actions
                </th>
              </tr>
            </thead>
            <tbody>
              {allSettings.length > 0 ? (
                allSettings.map((item, index) => (
                  <tr key={item._id}>
                    <td>{index + 1}</td>
                    <td>{item.phone}</td>
                    <td className="d-flex gap-2">
                      <button
                        className="btn btn-primary btn-sm"
                        onClick={() => navigate(`/edit-setting/${item._id}`)}
                      >
                        Edit <i className="fa-solid fa-pen"></i>
                      </button>
                      <button
                        className="btn btn-danger btn-sm"
                        onClick={() => handleDelete(item._id)}
                      >
                        Delete <i className="fa-solid fa-trash"></i>
                      </button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="2" className="text-center">
                    No numbers found
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        )}
      </section>
    </>
  );
};

export default AllSettings;
