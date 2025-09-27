import Razorpay from "razorpay";
import { Cart } from "../models/cart.model.js";
import ShortUniqueId from "short-unique-id";
import { Coupon } from "../models/coupon.model.js";
import { Order } from "../models/order.model.js";
import { Product } from "../models/product.model.js";
import crypto from "crypto";
import { PaymentSession } from "../models/paymentSession.js";
import { ShippingCost } from "../models/shippingCost.model.js";
import {
  sendOrderDeliveredEmail,
  sendOrderShippedEmail,
  sendOrderThankYouEmail,
} from "../utils/sendMail.js";
import { Currency } from "../models/currency.model.js";
import { CountryCurrency } from "../models/countryCurrency.model.js";

const razorpay = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID,
  key_secret: process.env.RAZORPAY_KEY_SECRET,
});

const createOrder = async (req, res) => {
  try {
    const userId = req?.user?._id;
    const {
      firstName,
      lastName,
      email,
      address,
      city,
      state,
      phone,
      zipCode,
      country,
      couponCode,
      paymentMethod,
      countryCode,
    } = req.body || {};

    if (!paymentMethod) {
      return res.status(400).json({ message: "Payment method is required" });
    }
    if (paymentMethod === "COD") {
      if (
        !firstName ||
        !lastName ||
        !email ||
        !phone ||
        !address ||
        !city ||
        !state ||
        !zipCode ||
        !country
      ) {
        return res.status(400).json({ message: "All fields are required" });
      }
    }

    if (!userId) {
      return res.status(400).json({ message: "you are not logged in" });
    }

    let mapping = await CountryCurrency.findOne({
      countryCode,
      isActive: true,
    });

    const currency = mapping?.currency ?? "USD";
    let exchangeRate = 1;
    if (currency !== "USD") {
      const dBCurrencyExchangeRate = await Currency.findOne();
      if (dBCurrencyExchangeRate) {
        if (currency === "INR") {
          exchangeRate = dBCurrencyExchangeRate?.INR || 1;
        } else {
          const inr = dBCurrencyExchangeRate?.INR;
          exchangeRate = inr / dBCurrencyExchangeRate?.[currency] || 1;
        }
      }
    }
    const cart = await Cart.findOne({ user: userId });

    if (!cart) {
      return res.status(400).json({ message: "Cart not found" });
    }
    if (!cart || cart.items.length === 0) {
      return res.status(404).json({ message: "Cart is empty" });
    }

    let shippingCost = 0;
    let totalAmount = cart.totalAmount;

    if (countryCode) {
      const shippingCharge = await ShippingCost.findOne({ countryCode });

      if (shippingCharge) {
        shippingCost = shippingCharge.shippingCost;
      }
    }
    const uid = new ShortUniqueId({ length: 6, dictionary: "alphanum_upper" });
    const datePart = new Date().toISOString().slice(0, 10).replace(/-/g, "");
    const now = new Date();
    const timePart = now.toTimeString().split(" ")[0].replace(/:/g, "");
    const orderId = `ORD-${datePart}${timePart}-${uid.rnd()}`;
    let discount = 0;

    if (couponCode) {
      const coupon = await Coupon.findOne({ couponCode, isActive: true });
      if (coupon) {
        if (coupon.maxAmount < totalAmount) {
          return res.status(400).json({
            message:
              "Coupon is not valid, TotalAmount is greater than max amount ",
          });
        }
        if (coupon.minAmount > totalAmount) {
          return res.status(400).json({
            message:
              "Coupon is not valid, TotalAmount is less than min amount ",
          });
        }
        if (coupon.discount > 100) {
          discount = coupon.discount;
        } else {
          discount = (totalAmount * coupon.discount) / 100;
        }
        totalAmount -= discount;
      }
    }
    totalAmount += shippingCost;
    const totalAmountPrice = totalAmount * exchangeRate;

    let razorpayOrder = null;
    if (paymentMethod === "Online") {
      try {
        razorpayOrder = await razorpay.orders.create({
          amount: Math.ceil(totalAmountPrice) * 100,
          currency: currency,
          receipt: orderId,
          notes: {
            userId: userId.toString(),
            couponCode: couponCode || "",
          },
        });
        await PaymentSession.create({
          user: userId,
          razorpayOrderId: razorpayOrder.id,
          orderUniqueId: orderId,
          couponCode: couponCode || null,
          items: cart.items,
          couponDiscount: discount,
          totalAmount,
          shippingAddress: {
            firstName,
            lastName,
            email,
            address,
            city,
            state,
            phone,
            zipCode,
            country,
          },
          shippingCost,
          dollarPriceAtOrder: exchangeRate,
        });
        return res.status(200).json({
          message: "Razorpay order created successfully",
          razorpayOrderId: razorpayOrder.id,
          totalAmount,
          razorpayKeyId: process.env.RAZORPAY_KEY_ID,
          shippingCost,
          couponCode: couponCode || null,
          items: cart.items,
          discount,
          orderUniqueId: orderId,
          dollarPriceAtOrder: exchangeRate,
          // _id
        });
      } catch (error) {
        console.error("Error in razorpay order:", error);
        return res.status(500).json({
          message:
            error?.error?.description ||
            "Internal server error in razorpay order",
        });
      }
    }

    if (paymentMethod === "COD") {
      // before
      // totalAmount: totalAmount * 100,

      const order = await Order.create({
        user: userId,
        orderUniqueId: orderId,
        totalAmount: totalAmount,
        shippingCost,
        couponCode: couponCode || null,
        couponDiscount: discount,
        paymentStatus: "Pending",
        orderStatus: "Placed",
        paymentMethod,
        totalAmount,
        items: cart.items,
        shippingAddress: {
          firstName,
          lastName,
          email,
          address,
          city,
          state,
          phone,
          zipCode,
          country,
        },
        dollarPriceAtOrder: exchangeRate,
      });

      for (const item of cart.items) {
        const product = await Product.findById(item.productId);
        if (product) {
          if (product.stock < item.quantity) {
            return res.status(400).json({ message: "Quantity exceeds stock" });
          }
          product.stock -= item.quantity;
          await product.save();
        }
      }

      cart.items = [];
      cart.totalAmount = 0;
      await cart.save();
      res.status(200).json({ order: order, message: "Order created successfully" });
      const fullName = `${firstName} ${lastName}`;
      setImmediate(async () => {
        try {
          await sendOrderThankYouEmail(
            email?.trim(),
            fullName,
            orderId,
            new Date().toLocaleDateString("en-IN", {
              day: "2-digit",
              month: "short",
              year: "numeric",
            }),
            Math.ceil(totalAmountPrice)
          );
        } catch (error) {
          console.log("send order thankyou email error", error);
        }
      });
      return;
    }

    return res.status(400).json({ message: "Invalid payment method" });
  } catch (error) {
    console.log("create order error", error);
    return res.status(500).json({ message: "create order server error" });
  }
};

const verifyPayment = async (req, res) => {
  const { razorpay_order_id, razorpay_payment_id, razorpay_signature } =
    req.body || {};

  const userId = req?.user?._id;
  const sign = crypto
    .createHmac("sha256", process.env.RAZORPAY_KEY_SECRET)
    .update(`${razorpay_order_id}|${razorpay_payment_id}`)
    .digest("hex");

  if (sign === razorpay_signature) {
    const isOrderExists = await Order.find({
      $and: [{ "paymentInfo.orderId": razorpay_order_id }, { user: userId }],
    });

    if (isOrderExists.length > 0) {
      return res
        .status(400)
        .json({ message: "Order has been already created" });
    }
    const paymentSessionDetails = await PaymentSession.findOne({
      razorpayOrderId: razorpay_order_id,
    }).sort({ createdAt: -1 });
    if (!paymentSessionDetails) {
      return res.status(400).json({ message: "Payment session not found" });
    }
    await Order.create({
      user: userId,
      orderUniqueId: paymentSessionDetails?.orderUniqueId,
      totalAmount: paymentSessionDetails?.totalAmount,
      shippingCost: paymentSessionDetails?.shippingCost,
      couponCode: paymentSessionDetails?.couponCode || null,
      couponDiscount: paymentSessionDetails?.couponDiscount || 0,
      paymentStatus: "Pending",
      orderStatus: "Placed",
      paymentMethod: "Online",
      items: paymentSessionDetails?.items,
      shippingAddress: paymentSessionDetails?.shippingAddress,
      paymentInfo: {
        orderId: razorpay_order_id,
        paymentId: razorpay_payment_id,
        razorpaySignature: razorpay_signature,
      },
      paymentStatus: "Paid",
      dollarPriceAtOrder: paymentSessionDetails?.dollarPriceAtOrder,
    });
    await PaymentSession.deleteMany({
      user: userId,
    });
    const cart = await Cart.findOne({ user: userId });

    cart?.items?.length > 0 &&
      cart.items.forEach(async (item) => {
        const product = await Product.findById(item.productId);
        if (product) {
          product.stock -= item.quantity;
          await product.save();
        }
      });
    cart.items = [];
    cart.totalAmount = 0;
    await cart.save();
    res.status(200).json({ success: true, message: "Payment verified" });

    const fullName =
      `${paymentSessionDetails?.shippingAddress?.firstName} ${paymentSessionDetails?.shippingAddress?.lastName}` ||
      "Reader";
    const totalAmountPrice =
      paymentSessionDetails?.totalAmount *
      paymentSessionDetails?.dollarPriceAtOrder;
    const now = new Date().toLocaleDateString("en-IN", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    });
    setImmediate(async () => {
      try {
        await sendOrderThankYouEmail(
          paymentSessionDetails?.shippingAddress?.email,
          fullName,
          paymentSessionDetails?.orderUniqueId,
          now,
          Math.ceil(totalAmountPrice)
        );
      } catch (error) {
        console.log("send order thankyou email error", error);
      }
    });
  } else {
    return res
      .status(400)
      .json({ success: false, message: "Invalid signature" });
  }
};

const getAllOrders = async (req, res) => {
  try {
    const orders = await Order.find({ user: req?.user?._id })
      .populate("items.productId")
      .populate("deliveryPartner");
    return res.status(200).json({ orders });
  } catch (error) {
    console.log("get all orders error", error);
    return res.status(500).json({ message: "get all orders server error" });
  }
};

const getAllOrdersAdmin = async (req, res) => {
  try {
    const orders = await Order.find()
      .populate("items.productId")
      .populate("deliveryPartner");
    return res.status(200).json({ orders });
  } catch (error) {
    console.log("get all orders error", error);
    return res.status(500).json({ message: "get all orders server error" });
  }
};

const GetOrderById = async (req, res) => {
  try {
    const { id } = req.params;
    const order = await Order.findById(id)
      .populate("items.productId")
      .populate({ path: "user", select: "-password" });
    return res.status(200).json({ message: "Order found", order });
  } catch (error) {
    return res.status(500).json({ message: "Internal server error", error });
  }
};

const UpdateCheckout = async (req, res) => {
  try {
    const { id } = req.params;
    const { orderStatus, paymentStatus, deliveryPartner, trackingId } =
      req.body || {};
    const checkout = await Order.findById(id);
    const email = checkout?.shippingAddress?.email;
    const fullName =
      `${checkout?.shippingAddress?.firstName} ${checkout?.shippingAddress?.lastName}` ||
      checkout?.shippingAddress?.firstName;
    if (orderStatus === "Shipped") {
      await sendOrderShippedEmail(
        email,
        fullName,
        checkout?.orderUniqueId,
        trackingId,
        deliveryPartner
      );
      checkout.shippedAt = Date.now();
    }
    if (orderStatus === "Delivered") {
      await sendOrderDeliveredEmail(email, fullName, checkout?.orderUniqueId);
      checkout.deliveredAt = Date.now();
    }
    checkout.paymentStatus = paymentStatus ?? checkout.paymentStatus;
    checkout.orderStatus = orderStatus ?? checkout.orderStatus;
    if (deliveryPartner) {
      checkout.deliveryPartner = deliveryPartner;
    }
    if (trackingId) {
      checkout.trackingId = trackingId;
    }

    await checkout.save();

    return res.status(200).json({ message: "Checkout updated", checkout });
  } catch (error) {
    console.log("update checkout error", error);

    return res.status(500).json({ message: "Internal server error", error });
  }
};

const DeleteOrder = async (req, res) => {
  try {
    const { id } = req.params;
    const order = await Order.findByIdAndDelete(id);
    if (!order) {
      return res.status(404).json({ message: "Order not found" });
    }
    return res.status(200).json({ message: "Order deleted successfully" });
  } catch (error) {
    return res.status(500).json({ message: "Internal server error", error });
  }
};

export {
  createOrder,
  verifyPayment,
  getAllOrders,
  GetOrderById,
  UpdateCheckout,
  DeleteOrder,
  getAllOrdersAdmin,
};
