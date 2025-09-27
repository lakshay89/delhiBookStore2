import { Currency } from "../models/currency.model.js";

const updateThreeCurrency = async (req, res) => {
  try {
    const { INR, EUR, GBP } = req.body || {};
    const currency = await Currency.findOne();
    if (!currency) {
      await Currency.create({
        INR,
        EUR,
        GBP,
      });
      return res.status(200).json("currency updated successfully");
    }
    currency.INR = INR ?? currency.INR;
    currency.EUR = EUR ?? currency.EUR;
    currency.GBP = GBP ?? currency.GBP;
    await currency.save();
    return res.status(200).json("currency updated successfully");
  } catch (error) {
    console.log("error in update three currency", error);
    return res.status(500).json("Internal server error");
  }
};

const getCurrency=async(req,res)=>{
  try {
    const currency = await Currency.findOne();
    if(!currency){
      return res.status(200).json({INR:86,EUR:1.1,GBP:0.9})
    }
    return res.status(200).json(currency)
  } catch (error) {
    console.log("error in get currency", error);
    return res.status(500).json("Internal server error");
  }
}

export { updateThreeCurrency,getCurrency };
