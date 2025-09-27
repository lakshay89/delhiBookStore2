"use client";
import axiosInstance from "../../../redux/features/axiosInstance";
import { useRouter } from "next/navigation";
import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";

const FeedbackModal = ({ isOpen, onClose, orderId }) => {
  const router = useRouter();
  const { user, loading } = useSelector((state) => state.login);

  const [formData, setFormData] = useState({ name: "", email: "", rating: 0, feedback: "", orderId: orderId });
  const [submitted, setSubmitted] = useState(false);

  useEffect(() => {
    if (!loading && user) {
      setFormData((prev) => ({
        ...prev,
        // userId: user?.id || "",
        name: user.fullName || "",
        email: user.email || "",
        orderId: orderId
      }));
    }
  }, [user, loading]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleStarClick = (rating) => {
    setFormData((prev) => ({ ...prev, rating }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    console.log("Form submitted:", formData);

    try {
      const response = await axiosInstance.post("/feedback/create-feedback", { ...formData, userId: user?.id, orderId });
      console.log(response);
    } catch (error) {
      console.log(error);
    }
    setSubmitted(true);

    setTimeout(() => {
      setSubmitted(false);
      resetForm();
      onClose();

      // Optional: redirect after successful feedback
      router.push("/pages/checkout/success");
    }, 2000);
  };

  const resetForm = () => {
    setFormData({
      userId: user?._id || "",
      name: user?.fullName || "",
      email: user?.email || "",
      rating: 0,
      feedback: "",
    });
  };

  if (!isOpen) return null;

  const styles = {
    overlay: {
      position: "fixed",
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      backgroundColor: "rgba(0, 0, 0, 0.6)",
      display: "flex",
      justifyContent: "center",
      alignItems: "center",
      zIndex: 1000,
      padding: "20px",
    },
    modal: {
      background: "white",
      borderRadius: "12px",
      boxShadow: "0 10px 30px rgba(0, 0, 0, 0.25)",
      width: "100%",
      maxWidth: "600px",
      maxHeight: "90vh",
      overflowY: "auto",
      transition: "all 0.3s ease",
    },
    header: {
      background: "#02547D",
      color: "white",
      padding: "20px 25px",
      textAlign: "center",
      position: "relative",
    },
    closeButton: {
      position: "absolute",
      right: "15px",
      top: "15px",
      background: "transparent",
      border: "none",
      color: "white",
      fontSize: "24px",
      cursor: "pointer",
    },
    formBody: { padding: "25px" },
    formGroup: { marginBottom: "18px" },
    label: { display: "block", marginBottom: "6px", fontWeight: "500" },
    formControl: {
      width: "100%",
      padding: "10px 12px",
      border: "1px solid #ddd",
      borderRadius: "6px",
      fontSize: "14px",
    },
    textarea: { minHeight: "100px", resize: "vertical" },
    stars: { display: "flex", justifyContent: "center", gap: "5px" },
    star: { fontSize: "32px", cursor: "pointer", color: "#ddd" },
    starActive: { color: "#09e030ff" },
    btn: {
      background: "#4a6cf7",
      color: "white",
      border: "none",
      padding: "12px 18px",
      fontSize: "14px",
      borderRadius: "6px",
      cursor: "pointer",
      width: "100%",
      marginTop: "10px",
    },
    successMessage: { textAlign: "center", padding: "30px 20px" },
    successIcon: { fontSize: "50px", color: "#4caf50", marginBottom: "15px" },
  };

  return (
    <div style={styles.overlay} onClick={onClose}>
      <div style={styles.modal} onClick={(e) => e.stopPropagation()}>
        {/* {!submitted ? ( */}
        <>
          <div style={styles.header}>
            <button style={styles.closeButton} onClick={onClose}>
              &times;
            </button>
            <h1>Share Your Feedback</h1>
            <p>We value your opinion and strive to improve our services</p>
          </div>

          <div style={styles.formBody}>
            <form onSubmit={handleSubmit}>
              {/* Rating */}
              <div style={styles.formGroup}>
                <label>
                  How would you rate your order? <span>*</span>
                </label>
                <div style={styles.stars}>
                  {[1, 2, 3, 4, 5].map((rating) => (
                    <span
                      key={rating}
                      style={{
                        ...styles.star,
                        ...(formData.rating >= rating ? styles.starActive : {}),
                      }}
                      onClick={() => handleStarClick(rating)}
                    >
                      ★
                    </span>
                  ))}
                </div>
                <div style={{ textAlign: "center", marginTop: "5px" }}>
                  {formData.rating > 0
                    ? `${formData.rating}/5`
                    : "Not rated"}
                </div>
              </div>

              {/* Feedback */}
              <div style={styles.formGroup}>
                <label htmlFor="feedback">
                  Your Feedback <span>*</span>
                </label>
                <textarea id="feedback" name="feedback" style={{ ...styles.formControl, ...styles.textarea }} placeholder="Please share your experience..." value={formData.feedback} onChange={handleInputChange} required />
              </div>

              <button type="submit" style={styles.btn}>
                Submit Feedback
              </button>
            </form>
          </div>
        </>
        {/* // ) : (
        //   <div style={styles.successMessage}>
        //     <i className="fas fa-check-circle" style={styles.successIcon}></i>
        //     <p>Your feedback has been successfully submitted.</p>
        //     <button style={styles.btn} onClick={resetForm}>
        //       Submit Another Feedback
        //     </button>
        //   </div>
        // )} */}
      </div>
    </div>
  );
};

export default FeedbackModal;
