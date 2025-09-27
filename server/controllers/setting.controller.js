import Setting from "../models/setting.model.js";

// CREATE Setting
export const createSetting = async (req, res) => {
    try {
        const { phone } = req.body;

        if (!phone) {
            return res.status(400).json({ status: false, message: "Phone is required" });
        }

        const newSetting = new Setting({ phone });
        await newSetting.save();

        res.status(201).json({ status: true, message: "Setting created successfully", data: newSetting, });
    } catch (error) {
        res.status(500).json({ status: false, message: error.message });
    }
};

// GET All Settings
export const getAllSetting = async (req, res) => {
    try {
        const settings = await Setting.find().sort({ createdAt: -1 });
        res.status(200).json({ status: true, data: settings });
    } catch (error) {
        res.status(500).json({ status: false, message: error.message });
    }
};

// GET Single Setting by ID
export const getSettingById = async (req, res) => {
    try {
        const setting = await Setting.findById(req.params.id);
        if (!setting) {
            return res.status(404).json({ status: false, message: "Setting not found" });
        }
        res.status(200).json({ status: true, data: setting });
    } catch (error) {
        res.status(500).json({ status: false, message: error.message });
    }
};

// UPDATE Setting
export const updateSetting = async (req, res) => {
    try {
        const { phone } = req.body;

        const updatedSetting = await Setting.findByIdAndUpdate(
            req.params.id,
            { phone },
            { new: true, runValidators: true }
        );

        if (!updatedSetting) {
            return res.status(404).json({ status: false, message: "Setting not found" });
        }

        res.status(200).json({
            status: true,
            message: "Setting updated successfully",
            data: updatedSetting,
        });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

// DELETE Setting
export const deleteSetting = async (req, res) => {
    try {
        const deletedSetting = await Setting.findByIdAndDelete(req.params.id);

        if (!deletedSetting) {
            return res.status(404).json({ status: false, message: "Setting not found" });
        }

        res.status(200).json({ status: true, message: "Setting deleted successfully", });
    } catch (error) {
        res.status(500).json({ status: false, message: error.message });
    }
};
