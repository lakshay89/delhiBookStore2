import geoip from "geoip-lite";
import axios from "axios";
import cache from "../utils/cache.js";
import { CountryCurrency } from "../models/countryCurrency.model.js";
import { Currency } from "../models/currency.model.js";

const apiKey = process.env.EXCHANGE_API_KEY;

const countryToCurrency = {
  AE: "AED",
  AF: "AFN",
  AL: "ALL",
  AM: "AMD",
  AO: "AOA",
  AR: "ARS",
  AT: "EUR",
  AU: "AUD",
  AZ: "AZN",
  BD: "BDT",
  BE: "EUR",
  BG: "BGN",
  BH: "BHD",
  BI: "BIF",
  BJ: "XOF",
  BN: "BND",
  BO: "BOB",
  BR: "BRL",
  BW: "BWP",
  BY: "BYN",
  BZ: "BZD",
  CA: "CAD",
  CD: "CDF",
  CH: "CHF",
  CL: "CLP",
  CN: "CNY",
  CO: "COP",
  CR: "CRC",
  CZ: "CZK",
  DE: "EUR",
  DK: "DKK",
  DO: "DOP",
  DZ: "DZD",
  EC: "USD",
  EE: "EUR",
  EG: "EGP",
  ES: "EUR",
  ET: "ETB",
  FI: "EUR",
  FR: "EUR",
  GA: "XAF",
  GB: "GBP",
  GE: "GEL",
  GH: "GHS",
  GM: "GMD",
  GR: "EUR",
  GT: "GTQ",
  HK: "HKD",
  HN: "HNL",
  HR: "HRK",
  HT: "HTG",
  HU: "HUF",
  ID: "IDR",
  IE: "EUR",
  IL: "ILS",
  IN: "INR",
  IQ: "IQD",
  IR: "IRR",
  IS: "ISK",
  IT: "EUR",
  JM: "JMD",
  JO: "JOD",
  JP: "JPY",
  KE: "KES",
  KG: "KGS",
  KH: "KHR",
  KR: "KRW",
  KW: "KWD",
  KZ: "KZT",
  LA: "LAK",
  LB: "LBP",
  LK: "LKR",
  LR: "LRD",
  LT: "EUR",
  LU: "EUR",
  LV: "EUR",
  LY: "LYD",
  MA: "MAD",
  MD: "MDL",
  ME: "EUR",
  MG: "MGA",
  MK: "MKD",
  ML: "XOF",
  MM: "MMK",
  MN: "MNT",
  MR: "MRU",
  MT: "EUR",
  MU: "MUR",
  MV: "MVR",
  MW: "MWK",
  MX: "MXN",
  MY: "MYR",
  MZ: "MZN",
  NA: "NAD",
  NE: "XOF",
  NG: "NGN",
  NI: "NIO",
  NL: "EUR",
  NO: "NOK",
  NP: "NPR",
  NZ: "NZD",
  OM: "OMR",
  PA: "PAB",
  PE: "PEN",
  PG: "PGK",
  PH: "PHP",
  PK: "PKR",
  PL: "PLN",
  PR: "USD",
  PT: "EUR",
  QA: "QAR",
  RO: "RON",
  RS: "RSD",
  RU: "RUB",
  RW: "RWF",
  SA: "SAR",
  SD: "SDG",
  SE: "SEK",
  SG: "SGD",
  SI: "EUR",
  SK: "EUR",
  SL: "SLL",
  SN: "XOF",
  SO: "SOS",
  SR: "SRD",
  SS: "SSP",
  SV: "USD",
  SY: "SYP",
  TH: "THB",
  TJ: "TJS",
  TL: "USD",
  TN: "TND",
  TR: "TRY",
  TT: "TTD",
  TW: "TWD",
  TZ: "TZS",
  UA: "UAH",
  UG: "UGX",
  US: "USD",
  UY: "UYU",
  UZ: "UZS",
  VE: "VES",
  VN: "VND",
  YE: "YER",
  ZA: "ZAR",
  ZM: "ZMW",
  ZW: "ZWL",
};

async function getExchangeRates() {
  const cachedRates = cache.get("exchangeRates");
  if (cachedRates) return cachedRates;

  try {
    const res = await axios.get(
      `https://v6.exchangerate-api.com/v6/${apiKey}/latest/USD`,
      {
        headers: {
          "User-Agent": "YourAppName/1.0",
        },
      }
    );

    const rates = res.data.conversion_rates;
    cache.set("exchangeRates", rates);
    return rates;
  } catch (error) {
    console.error("exchange rate error", error);
    return null;
  }
}

// const detectCountry = async (req, res) => {
//   try {
//     const ip =
//       process.env.NODE_ENV === "development"
//         ? "106.51.64.142"
//         :  req.headers["x-forwarded-for"]?.split(",")[0]?.trim()  || req.connection.remoteAddress;

//     const geo = geoip.lookup(ip);
//     const countryCode = geo?.country || "US";
//     const currency = countryToCurrency[countryCode] || "USD";

//     const cacheKey = `currencyInfo-${countryCode}`;
//     let cachedCurrency = cache.get(cacheKey);

//     if (!cachedCurrency) {
//       const rates = await getExchangeRates();
//       const exchangeRate = rates?.[currency] || 1;
//       cachedCurrency = { country: countryCode, currency, exchangeRate };
//       cache.set(cacheKey, cachedCurrency);
//     }

//     return res.status(200).json(cachedCurrency);
//   } catch (error) {
//     console.error("detectCountry error", error);
//     return res.status(500).json({ message: "Internal server error" });
//   }
// };
// afganistan="23.88.192.50"

const detectCountry = async (req, res) => {
  try {
    const ip =
      process.env.NODE_ENV === "development"
        ? "106.51.64.142"
        : req.headers["x-forwarded-for"]?.split(",")[0]?.trim() ||
          req.connection.remoteAddress;

    const geo = geoip.lookup(ip);
    const countryCode = geo?.country || "US";

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

    // const cacheKey = `currencyInfo-${countryCode}`;
    // let cachedCurrency = cache.get(cacheKey);

    // if (!cachedCurrency) {
    //   const rates = await getExchangeRates();
    //   console.log("rates",rates);

    //   const exchangeRate = rates?.[currency] ?? 1;
    //   console.log("exchangeRate",exchangeRate);

    //   cachedCurrency = { country: countryCode, currency, exchangeRate };
    //   cache.set(cacheKey, cachedCurrency);
    // }

    return res.status(200).json({
      country: mapping?.countryCode ?? countryCode,
      currency,
      exchangeRate: exchangeRate,
      updatedAt: mapping?.updatedAt ?? new Date(),
    });
  } catch (error) {
    console.error("detectCountry error", error);
    return res.status(500).json({ message: "Internal server error" });
  }
};

const getCachedCurrencyInfo = (countryCode = "IN") => {
  return (
    cache.get(`currencyInfo-${countryCode}`) || {
      currency: "INR",
      exchangeRate: 86,
      country: "IN",
    }
  );
};

export {
  detectCountry,
  getExchangeRates,
  getCachedCurrencyInfo,
  countryToCurrency,
};
