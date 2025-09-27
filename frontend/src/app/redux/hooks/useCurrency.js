import { useSelector } from "react-redux";

export const useCurrency = () => {
  const { currency, exchangeRate, country } = useSelector((state) => state.currency);

  const convert = (basePriceUSD, roundMethod) => {
    const amount = basePriceUSD * exchangeRate;
    let roundedAmount;
    if (roundMethod === "ceil") {
      roundedAmount = Math.ceil(amount);
    } else if (roundMethod === "floor") {
      roundedAmount = Math.floor(amount);
    } else {
      roundedAmount = Math.round(amount);
    }

    return new Intl.NumberFormat("en-IN", {
      style: "currency",
      currency,
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(roundedAmount);
  };

  const convertRaw = (basePriceUSD) => {
    const amount = basePriceUSD * exchangeRate;
    return Math.round(amount);
  };

  const currencySymbol = new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency,
    currencyDisplay: "narrowSymbol",
  }).formatToParts(1).find((part) => part.type === "currency")?.value;

  // console.log("GGG=>", convert(12), currency, exchangeRate, country);
  return { currency, exchangeRate, convert, currencySymbol, convertRaw, country };
};


// import { useSelector } from "react-redux";

// export const useCurrency = () => {
//   const { currency, exchangeRate, country } = useSelector(
//     (state) => state.currency
//   );

//   // 🔹 Helper: pick correct locale based on country
//   const getLocale = () => {
//     switch (country) {
//       case "India":
//         return "en-IN";
//       case "USA":
//         return "en-US";
//       case "UK":
//         return "en-GB";
//       case "Germany":
//         return "de-DE";
//       default:
//         return "en-US"; // fallback
//     }
//   };

//   // 🔹 Convert price from USD → Target currency (formatted)
//   const convert = (basePriceUSD, roundMethod) => {
//     const amount = basePriceUSD * exchangeRate;

//     let roundedAmount;
//     if (roundMethod === "ceil") {
//       roundedAmount = Math.ceil(amount);
//     } else if (roundMethod === "floor") {
//       roundedAmount = Math.floor(amount);
//     } else {
//       roundedAmount = Math.round(amount);
//     }

//     return new Intl.NumberFormat(getLocale(), {
//       style: "currency",
//       currency,
//       minimumFractionDigits: 0,
//       maximumFractionDigits: 0,
//     }).format(roundedAmount);
//   };

//   // 🔹 Convert without formatting (raw number)
//   const convertRaw = (basePriceUSD) => {
//     const amount = basePriceUSD * exchangeRate;
//     return Math.round(amount);
//   };

//   // 🔹 Currency symbol only
//   const currencySymbol = new Intl.NumberFormat(getLocale(), {
//     style: "currency",
//     currency,
//     currencyDisplay: "narrowSymbol",
//   })
//     .formatToParts(1)
//     .find((part) => part.type === "currency")?.value;

//   return { currency, exchangeRate, convert, currencySymbol, convertRaw, country };
// };
