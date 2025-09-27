
import { Feedback } from "../models/feedback.model.js";
import { Order } from "../models/order.model.js";

const createFeedback = async (req, res) => {
    try {
        const { orderId, userId, rating, feedback, isActive } = req.body;
        console.log("req.body:==>", req.body)
        if (!orderId) {
            return res.status(400).json({ message: "order Id is required" });
        }

        const orderExists = await Order.findById(orderId);
        if (!orderExists) {
            return res.status(400).json({ message: "order does not exist" });
        }

        const newFeedback = await Feedback.create({ userId, orderId, rating, masseg: feedback, isActive: isActive === "true" ?? false, });

        return res.status(201).json({ message: "Feedback created", data: newFeedback });
    } catch (error) {
        console.error("Create Feedback Error:", error);
        res.status(500).json({ message: "Server error in create Feedback" });
    }
};

const getAllFeedback = async (req, res) => {
    try {
        const feedback = await Feedback.find().populate("userId", "fullName email profileImage").populate("orderId");
        return res.status(200).json({ success: true, feedback });
    } catch (error) {
        console.error("Get All feedback Error:", error);
        res.status(500).json({ message: "Server error in get all feedback" });
    }
};

const getSingleFeedback = async (req, res) => {
    try {
        const { id } = req.params;
        console.log("GGGG:==>", id);

        // ✅ Use findOne with orderId, not findById
        const feedback = await Feedback.find({ orderId: id }).populate("userId", "fullName email profileImage").populate("orderId");

        if (!feedback) {
            return res.status(404).json({ message: "Feedback not found for this order" });
        }

        return res.status(200).json({ success: true, feedback, });
    } catch (error) {
        console.error("Get Single Feedback Error:", error);
        res.status(500).json({
            success: false,
            message: "Server error in get single feedback",
            error: error.message
        });
    }
};

const updateFeedback = async (req, res) => {
    try {
        const { isActive } = req.body;
        console.log("req.body:==>", req.body)
        const feedback = await Feedback.findById(req.params.id);
        if (!feedback) {
            return res.status(404).json({ message: "feedback not found" });
        }

        if (isActive !== undefined) feedback.isActive = isActive;

        await feedback.save();
        res.status(200).json({ message: "Feedback updated", success: true, feedback });
    } catch (error) {
        console.error("Update Feedback Error:", error);
        res.status(500).json({ message: "Server error in update Feedback" });
    }
};

const deleteFeedback = async (req, res) => {
    try {
        const feedback = await Feedback.findByIdAndDelete(req.params.id);
        if (!feedback) {
            return res.status(404).json({ message: "feedback not found" });
        }
        res.status(200).json({success: true, message: "feedback deleted" });
    } catch (error) {
        console.error("Delete feedback Error:", error);
        return res.status(500).json({ message: "Server error in delete feedback" });
    }
};

export {
    createFeedback,
    getSingleFeedback,
    getAllFeedback,
    updateFeedback,
    deleteFeedback,
};