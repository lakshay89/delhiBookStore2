// import { User } from "../models/user.model.js";
// import bcrypt from "bcrypt";
// import crypto from "crypto";
// import { Otp } from "../models/otp.model.js";
// import {
//   sendOtpEmail,
//   sendWelcomeEmail,
//   sentResetPasswordMail,
// } from "../utils/sendMail.js";
// import { console } from "inspector";

// const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

// const cookieOptions = {
//   httpOnly: true,
//   secure: process.env.NODE_ENV === "production",
//   sameSite: process.env.NODE_ENV === "production" ? "None" : "Lax",
//   domain: process.env.NODE_ENV === "production" ? process.env.DOMAIN : undefined,
//   maxAge: 2592000000,
// };

// const sendOtpToUser = async (req, res) => {
//   try {
//     const { email, fullName } = req.body || {};
//     if (!email) {
//       return res.status(400).json({ message: "Email is required" });
//     }
//     if (!fullName) {
//       return res.status(400).json({ message: "fullName is required" });
//     }
//     if (!emailRegex.test(email)) {
//       return res.status(400).json({ message: "Invalid email" });
//     }
//     const isUserExists = await User.findOne({ email });
//     if (isUserExists) {
//       return res.status(400).json({ message: "User already exists" });
//     }
//     const expiresAt = new Date(Date.now() + 10 * 60 * 1000);

//     const otp = Math.floor(100000 + Math.random() * 900000);
//     const hashedOtp = crypto
//       .createHash("sha256")
//       .update(String(otp))
//       .digest("hex");

//     await Otp.create({ email, otp: hashedOtp, expiresAt });
//     res.status(200).json({ message: "Otp sent successfully" });
//     setImmediate(async () => {
//       try {
//         await sendOtpEmail(email, otp, fullName);
//       } catch (error) {
//         console.log("send otp to user error", error);
//       }
//     });
//   } catch (error) {
//     console.log("send otp to user error", error);
//     return res.status(500).json({ message: "send otp to user server error" });
//   }
// };
// const signUp = async (req, res) => {
//   try {
//     const { fullName, email, password, otp } = req.body || {};
//     if (!fullName || !email || !password) {
//       return res.status(400).json({ message: "All fields are required" });
//     }
//     if (!emailRegex.test(email)) {
//       return res.status(400).json({ message: "Invalid email" });
//     }
//     const existingUser = await User.findOne({ email });
//     if (existingUser) {
//       return res.status(400).json({ message: "User already exists" });
//     }
//     if (!otp) {
//       return res.status(400).json({ message: "Otp is required" });
//     }
//     const hashedOtp = crypto
//       .createHash("sha256")
//       .update(String(otp))
//       .digest("hex");
//     const otpData = await Otp.findOne({
//       $and: [{ email }, { otp: hashedOtp }, { expiresAt: { $gt: Date.now() } }],
//     });
//     if (!otpData) {
//       return res.status(400).json({ message: "Invalid otp or expired" });
//     }
//     await otpData.deleteOne();
//     const user = await User.create({ fullName, email, password });
//     const token = await user.generateJwtToken();
//     res.cookie("token", token, cookieOptions);

//     res.status(200).json({
//       message: "User created successfully",
//       user: {
//         id: user._id,
//         fullName: user.fullName,
//         email: user.email,
//         profileImage: user.profileImage,
//       },
//     });
//     setImmediate(() => {
//       sendWelcomeEmail(email, fullName).catch(console.error);
//     });
//   } catch (error) {
//     console.log("sign up error", error);
//     return res.status(500).json({ message: "sign up server error" });
//   }
// };

// const login = async (req, res) => {
//   try {
//     const { email, password } = req.body || {};
//     if (!email || !password) {
//       return res.status(400).json({ message: "All fields are required" });
//     }
//     if (!emailRegex.test(email))
//       return res.status(400).json({ message: "Invalid email" });
//     const user = await User.findOne({ email });
//     if (!user) return res.status(400).json({ message: "User not found" });

//     const isPasswordCorrect = await bcrypt.compare(password, user.password);

//     if (!isPasswordCorrect) {
//       return res.status(400).json({ message: "Incorrect password" });
//     }
//     const token = await user.generateJwtToken();
//     console.log("XXXXXXX:==>", token);
//     res.cookie("token", token, cookieOptions);

//     return res.status(200).json({
//       message: "User logged in successfully",
//       user: { id: user._id, fullName: user.fullName, email: user.email },
//     });
//   } catch (error) {
//     console.log("login error", error);
//     return res.status(500).json({ message: "login server error" });
//   }
// };

// const logout = async (req, res) => {
//   try {
//     console.log("logout==>", cookieOptions);
//     res.clearCookie("token", cookieOptions);
//     return res.status(200).json({ message: "User logged out successfully" });
//   } catch (error) {
//     console.log("logout error", error);
//     return res.status(500).json({ message: "logout server error" });
//   }
// };

// const GetSingleUser = async (req, res) => {
//   try {
//     const { _id } = req.user;
//     if (!_id) {
//       return res.status(400).json({ message: "User id is required" });
//     }
//     const user = await User.findById(_id).select(
//       "-password -resetPasswordToken -resetPasswordExpires -role"
//     );
//     return res.status(200).json({ message: "Single user", user });
//   } catch (error) {
//     console.log("get single user error", error);
//     res.status(500).json({ message: "get single user server error" });
//   }
// };

// const ForgotPassword = async (req, res) => {
//   try {
//     const { email } = req.body || {};
//     if (!email) {
//       return res.status(400).json({ message: "Email is required" });
//     }
//     if (!emailRegex.test(email)) {
//       return res.status(400).json({ message: "Invalid email" });
//     }
//     const user = await User.findOne({ email });
//     if (!user) {
//       return res.status(400).json({ message: "User not found" });
//     }
//     const token = crypto.randomBytes(32).toString("hex");

//     const hashedToken = crypto.createHash("sha256").update(token).digest("hex");
//     user.resetPasswordToken = hashedToken;
//     user.resetPasswordExpires = Date.now() + 1000 * 60 * 15;
//     await user.save();

//     res
//       .status(200)
//       .json({ message: "Reset password token sent to your email" });
//     setImmediate(async () => {
//       try {
//         await sentResetPasswordMail(email, token, user._id);
//       } catch (error) {
//         console.log("forgot password email error", error);
//       }
//     })
//   } catch (error) {
//     console.log("forgot password error", error);
//     return res.status(500).json({ message: "forgot password server error" });
//   }
// };

// const ResetPassword = async (req, res) => {
//   try {
//     const { id, token } = req.params || {};
//     const { password } = req.body || {};
//     if (!id || !token) {
//       return res.status(400).json({ message: "User id and token is required" });
//     }
//     if (!password) {
//       return res.status(400).json({ message: "Password is required" });
//     }
//     const user = await User.findById(id);
//     if (!user) {
//       return res.status(400).json({ message: "User not found" });
//     }
//     if (!user.resetPasswordToken) {
//       return res
//         .status(400)
//         .json({ message: "Reset password token not found" });
//     }
//     if (user.resetPasswordExpires < Date.now()) {
//       return res.status(400).json({ message: "Reset password token expired" });
//     }
//     const hashedToken = crypto.createHash("sha256").update(token).digest("hex");
//     if (hashedToken !== user.resetPasswordToken) {
//       return res.status(400).json({ message: "Invalid reset password token" });
//     }
//     user.password = password;
//     user.resetPasswordToken = undefined;
//     user.resetPasswordExpires = undefined;
//     await user.save();
//     return res.status(200).json({ message: "Password reset successfully" });
//   } catch (error) {
//     console.log("reset password error", error);
//     return res.status(500).json({ message: "reset password server error" });
//   }
// };

// const verifyLoggedIn = async (req, res) => {
//   try {
//     const { _id } = req.user;
//     if (!_id) {
//       return res.status(400).json({ message: "User id is required" });
//     }

//     const user = await User.findById(_id).select(
//       "-password -resetPasswordToken -resetPasswordExpires -role"
//     );

//     return res
//       .status(200)
//       .json({ message: "User logged in successfully", user });
//   } catch (error) {
//     console.log("verify logged in error", error);
//     return res.status(500).json({ message: "verify logged in server error" });
//   }
// };
// const adminLogin = async (req, res) => {
//   try {
//     const { email, password } = req.body || {};
//     if (!email || !password) {
//       return res.status(400).json({ message: "All fields are required" });
//     }
//     if (!emailRegex.test(email))
//       return res.status(400).json({ message: "Invalid email" });
//     const user = await User.findOne({ email });

//     if (!user) return res.status(400).json({ message: "User not found" });
//     if (user.role !== "admin") {
//       return res
//         .status(400)
//         .json({ message: "Unauthorized! You are not admin" });
//     }
//     const isPasswordCorrect = await bcrypt.compare(password, user.password);
//     if (!isPasswordCorrect) {
//       return res.status(400).json({ message: "Incorrect password" });
//     }
//     const token = await user.generateJwtToken();
//     res.cookie("token", token, cookieOptions);
//     return res.status(200).json({
//       message: "User logged in successfully",
//       user: { id: user._id, fullName: user.fullName, email: user.email },
//     });
//   } catch (error) {
//     console.log("admin login error", error);
//     return res.status(500).json({ message: "admin login server error" });
//   }
// };

// const verifyAdminLoggedIn = async (req, res) => {
//   try {
//     const user = req?.user;
//     if (user.role !== "admin") {
//       return res.status(403).json({
//         message: "Access Denied — This feature is restricted to administrators only.",
//       });
//     }
//     return res.status(200).json({ message: "Admin logged in", user });
//   } catch (error) {
//     console.log("verify admin logged in error", error);
//     res.status(500).json({ message: "verify admin logged in server error" });
//   }
// };

// const GetAllUsers = async (req, res) => {
//   try {
//     const users = await User.find();
//     return res
//       .status(200)
//       .json({ message: "Users fetched successfully", users });
//   } catch (error) {
//     console.log("get all users error", error);
//     return res.status(500).json({ message: "get all users server error" });
//   }
// };
// const updateProfile = async (req, res) => {
//   try {
//     const userId = req?.user?._id;
//     if (!userId) {
//       return res.status(400).json({ message: "you are not logged in" });
//     }
//     const { fullName, phone, city, address } = req.body;
//     const user = await User.findById(userId);
//     if (!user) {
//       return res.status(400).json({ message: "User not found" });
//     }
//     const localPath = req.file?.filename;
//     if (localPath) {
//       user.profileImage = localPath;
//     }
//     user.fullName = fullName || user.fullName;
//     user.phone = phone || user.phone;
//     user.city = city || user.city;
//     user.address = address || user.address;

//     await user.save();
//     return res
//       .status(200)
//       .json({ message: "Profile updated successfully", user });
//   } catch (error) {
//     console.log("update profile error", error);
//     return res.status(500).json({ message: "update profile server error" });
//   }
// };
// export {
//   signUp,
//   login,
//   logout,
//   adminLogin,
//   GetSingleUser,
//   ForgotPassword,
//   ResetPassword,
//   verifyLoggedIn,
//   updateProfile,
//   GetAllUsers,
//   verifyAdminLoggedIn,
//   sendOtpToUser,
// };

import { User } from "../models/user.model.js";
import bcrypt from "bcrypt";
import crypto from "crypto";
import { Otp } from "../models/otp.model.js";
import {
  sendOtpEmail,
  sendWelcomeEmail,
  sentResetPasswordMail,
} from "../utils/sendMail.js";

/**
 * NOTE:
 * - Assumes `User` pre-save hook hashes password and `generateJwtToken()` exists on the model instance.
 * - Assumes `Otp` has fields: email (String), otp (hashed String), expiresAt (Date), createdAt (Date default: now).
 * - All responses follow a consistent shape: { success, message, data }
 */

const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

const cookieOptionsBase = {
  httpOnly: true,
  secure: process.env.NODE_ENV === "production",
  sameSite: process.env.NODE_ENV === "production" ? "None" : "Lax",
  // domain: process.env.NODE_ENV === "production" ? process.env.DOMAIN : undefined,
  maxAge: 30 * 24 * 60 * 60 * 1000, // 30 days
  // path: "/",
};

const setAuthCookie = (res, token) => {
  console.log("XXXXXXXXXX:=>", token)
  res.cookie("token", token, cookieOptionsBase);
};

const clearAuthCookie = (res) => {
  // Use identical attributes to the one used when setting the cookie
  res.clearCookie("token", cookieOptionsBase);
};

const sanitizeUser = (user) => ({
  id: user._id,
  fullName: user.fullName,
  email: user.email,
  profileImage: user.profileImage,
  phone: user.phone,
  city: user.city,
  address: user.address,
  role: user.role,
});

// Prevent OTP spamming: allow new OTP only if previous expired or sent >60s ago
const canSendNewOtp = async (email) => {
  const lastOtp = await Otp.findOne({ email }).sort({ createdAt: -1 });
  if (!lastOtp) return true;
  const sixtySecondsAgo = Date.now() - 60 * 1000;
  return lastOtp.createdAt.getTime() < sixtySecondsAgo || lastOtp.expiresAt.getTime() < Date.now();
};

const sendOtpToUser = async (req, res) => {
  try {
    const { email, fullName } = req.body || {};

    if (!email) return res.status(400).json({ success: false, message: "Email is required" });
    if (!fullName) return res.status(400).json({ success: false, message: "Full name is required" });
    if (!emailRegex.test(email)) return res.status(400).json({ success: false, message: "Invalid email" });

    const isUserExists = await User.findOne({ email }).lean();
    if (isUserExists) return res.status(409).json({ success: false, message: "User already exists" });

    const allowed = await canSendNewOtp(email);
    if (!allowed) {
      return res.status(429).json({ success: false, message: "Please wait a moment before requesting another OTP" });
    }

    const expiresAt = new Date(Date.now() + 10 * 60 * 1000); // 10 min
    const otp = crypto.randomInt(100000, 1000000); // 6-digit
    const hashedOtp = crypto.createHash("sha256").update(String(otp)).digest("hex");

    // Ensure only one active OTP per email by deleting older, unexpired ones
    await Otp.deleteMany({ email });
    await Otp.create({ email, otp: hashedOtp, expiresAt });

    // Respond first, send email async
    res.status(200).json({ success: true, message: "OTP sent successfully" });

    setImmediate(async () => {
      try {
        await sendOtpEmail(email, otp, fullName);
      } catch (error) {
        console.error("sendOtpEmail error", error);
      }
    });
  } catch (error) {
    console.error("sendOtpToUser error", error);
    return res.status(500).json({ success: false, message: "Server error while sending OTP" });
  }
};

const signUp = async (req, res) => {
  try {
    const { fullName, email, password, otp } = req.body || {};

    if (!fullName || !email || !password) {
      return res.status(400).json({ success: false, message: "All fields are required" });
    }
    if (!emailRegex.test(email)) {
      return res.status(400).json({ success: false, message: "Invalid email" });
    }

    const existingUser = await User.findOne({ email }).lean();
    if (existingUser) {
      return res.status(409).json({ success: false, message: "User already exists" });
    }

    if (!otp) return res.status(400).json({ success: false, message: "OTP is required" });

    const hashedOtp = crypto.createHash("sha256").update(String(otp)).digest("hex");
    const otpData = await Otp.findOne({ email, otp: hashedOtp, expiresAt: { $gt: Date.now() } });

    if (!otpData) {
      return res.status(400).json({ success: false, message: "Invalid or expired OTP" });
    }

    await otpData.deleteOne();

    const user = await User.create({ fullName, email, password });
    const token = await user.generateJwtToken();
    setAuthCookie(res, token);

    res.status(201).json({
      success: true,
      message: "User created successfully",
      data: { user: sanitizeUser(user) },
    });

    setImmediate(() => {
      sendWelcomeEmail(email, fullName).catch((e) => console.error("sendWelcomeEmail error", e));
    });
  } catch (error) {
    console.error("signUp error", error);
    return res.status(500).json({ success: false, message: "Server error while signing up" });
  }
};

const login = async (req, res) => {
  try {
    const { email, password } = req.body || {};

    if (!email || !password) {
      return res.status(400).json({ success: false, message: "Email and password are required" });
    }
    if (!emailRegex.test(email)) return res.status(400).json({ success: false, message: "Invalid email" });

    const user = await User.findOne({ email });
    if (!user) return res.status(404).json({ success: false, message: "User not found" });

    const isPasswordCorrect = await bcrypt.compare(password, user.password);
    if (!isPasswordCorrect) {
      return res.status(401).json({ success: false, message: "Incorrect password" });
    }

    const token = await user.generateJwtToken();

    setAuthCookie(res, token);

    return res.status(200).json({
      success: true,
      message: "Logged in successfully",
      data: { user: sanitizeUser(user) },
    });
  } catch (error) {
    console.error("login error", error);
    return res.status(500).json({ success: false, message: "Server error while logging in" });
  }
};

const logout = async (_req, res) => {
  try {
    clearAuthCookie(res);
    return res.status(200).json({ success: true, message: "Logged out successfully" });
  } catch (error) {
    console.error("logout error", error);
    return res.status(500).json({ success: false, message: "Server error while logging out" });
  }
};

const GetSingleUser = async (req, res) => {
  try {
    const { _id } = req.user || {};
    if (!_id) return res.status(401).json({ success: false, message: "Unauthorized" });

    const user = await User.findById(_id).select(
      "-password -resetPasswordToken -resetPasswordExpires"
    );
    if (!user) return res.status(404).json({ success: false, message: "User not found" });

    return res.status(200).json({ success: true, message: "Single user", data: { user: sanitizeUser(user) } });
  } catch (error) {
    console.error("GetSingleUser error", error);
    res.status(500).json({ success: false, message: "Server error while fetching user" });
  }
};

const ForgotPassword = async (req, res) => {
  try {
    const { email } = req.body || {};

    if (!email) return res.status(400).json({ success: false, message: "Email is required" });
    if (!emailRegex.test(email)) return res.status(400).json({ success: false, message: "Invalid email" });

    const user = await User.findOne({ email });
    if (!user) return res.status(404).json({ success: false, message: "User not found" });

    const token = crypto.randomBytes(32).toString("hex");
    const hashedToken = crypto.createHash("sha256").update(token).digest("hex");

    user.resetPasswordToken = hashedToken;
    user.resetPasswordExpires = Date.now() + 15 * 60 * 1000; // 15 minutes
    await user.save();

    res.status(200).json({ success: true, message: "Reset password link has been emailed if the account exists" });

    setImmediate(async () => {
      try {
        await sentResetPasswordMail(email, token, user._id);
      } catch (error) {
        console.error("sentResetPasswordMail error", error);
      }
    });
  } catch (error) {
    console.error("ForgotPassword error", error);
    return res.status(500).json({ success: false, message: "Server error while initiating password reset" });
  }
};

const ResetPassword = async (req, res) => {
  try {
    const { id, token } = req.params || {};
    const { password } = req.body || {};

    if (!id || !token) return res.status(400).json({ success: false, message: "User id and token are required" });
    if (!password) return res.status(400).json({ success: false, message: "Password is required" });

    const user = await User.findById(id);
    if (!user) return res.status(404).json({ success: false, message: "User not found" });

    if (!user.resetPasswordToken) {
      return res.status(400).json({ success: false, message: "Reset password token not set" });
    }
    if (user.resetPasswordExpires < Date.now()) {
      return res.status(400).json({ success: false, message: "Reset password token expired" });
    }

    const hashedToken = crypto.createHash("sha256").update(token).digest("hex");
    if (hashedToken !== user.resetPasswordToken) {
      return res.status(400).json({ success: false, message: "Invalid reset password token" });
    }

    user.password = password; // expect pre-save hook to hash
    user.resetPasswordToken = undefined;
    user.resetPasswordExpires = undefined;
    await user.save();

    return res.status(200).json({ success: true, message: "Password reset successfully" });
  } catch (error) {
    console.error("ResetPassword error", error);
    return res.status(500).json({ success: false, message: "Server error while resetting password" });
  }
};

const verifyLoggedIn = async (req, res) => {
  try {
    const { _id } = req.user || {};
    if (!_id) return res.status(401).json({ success: false, message: "Unauthorized" });

    const user = await User.findById(_id).select("-password -resetPasswordToken -resetPasswordExpires");
    if (!user) return res.status(404).json({ success: false, message: "User not found" });

    return res.status(200).json({ success: true, message: "User authenticated", data: { user: sanitizeUser(user) } });
  } catch (error) {
    console.error("verifyLoggedIn error", error);
    return res.status(500).json({ success: false, message: "Server error while verifying session" });
  }
};

const adminLogin = async (req, res) => {
  try {
    const { email, password } = req.body || {};

    if (!email || !password) return res.status(400).json({ success: false, message: "Email and password are required" });
    if (!emailRegex.test(email)) return res.status(400).json({ success: false, message: "Invalid email" });

    const user = await User.findOne({ email });
    if (!user) return res.status(404).json({ success: false, message: "User not found" });
    if (user.role !== "admin") {
      return res.status(403).json({ success: false, message: "Unauthorized: Admins only" });
    }

    const isPasswordCorrect = await bcrypt.compare(password, user.password);
    if (!isPasswordCorrect) return res.status(401).json({ success: false, message: "Incorrect password" });

    const token = await user.generateJwtToken();
    setAuthCookie(res, token);

    return res.status(200).json({ success: true, message: "Admin logged in", data: { user: sanitizeUser(user) } });
  } catch (error) {
    console.error("adminLogin error", error);
    return res.status(500).json({ success: false, message: "Server error while admin login" });
  }
};

const verifyAdminLoggedIn = async (req, res) => {
  try {
    const user = req?.user;
    if (!user || user.role !== "admin") {
      return res.status(403).json({ success: false, message: "Access denied — administrators only" });
    }
    return res.status(200).json({ success: true, message: "Admin authenticated", data: { user: sanitizeUser(user) } });
  } catch (error) {
    console.error("verifyAdminLoggedIn error", error);
    res.status(500).json({ success: false, message: "Server error while verifying admin" });
  }
};

const GetAllUsers = async (_req, res) => {
  try {
    const users = await User.find().select("-password -resetPasswordToken -resetPasswordExpires");
    return res.status(200).json({ success: true, message: "Users fetched successfully", data: { users: users.map(sanitizeUser) } });
  } catch (error) {
    console.error("GetAllUsers error", error);
    return res.status(500).json({ success: false, message: "Server error while fetching users" });
  }
};

const updateProfile = async (req, res) => {
  try {
    const userId = req?.user?._id;
    if (!userId) return res.status(401).json({ success: false, message: "Unauthorized" });

    const { fullName, phone, city, address } = req.body || {};
    const updates = {};

    if (fullName) updates.fullName = String(fullName).trim();
    if (phone) updates.phone = String(phone).trim();
    if (city) updates.city = String(city).trim();
    if (address) updates.address = String(address).trim();

    if (req.file) {
      // Prefer `path`; fall back to `filename` depending on multer setup
      updates.profileImage = req.file.path || req.file.filename;
    }

    const user = await User.findByIdAndUpdate(userId, { $set: updates }, { new: true });
    if (!user) return res.status(404).json({ success: false, message: "User not found" });

    return res.status(200).json({ success: true, message: "Profile updated successfully", data: { user: sanitizeUser(user) } });
  } catch (error) {
    console.error("updateProfile error", error);
    return res.status(500).json({ success: false, message: "Server error while updating profile" });
  }
};

export {
  signUp,
  login,
  logout,
  adminLogin,
  GetSingleUser,
  ForgotPassword,
  ResetPassword,
  verifyLoggedIn,
  updateProfile,
  GetAllUsers,
  verifyAdminLoggedIn,
  sendOtpToUser,
};
