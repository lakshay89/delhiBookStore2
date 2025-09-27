import * as XLSX from "xlsx";
import { saveAs } from "file-saver";

const DownloadProductTemplate = () => {
  const handleDownload = () => {
    const worksheetData = [
      {
        PRODUCTS_ID: "",
        PRODUCTS_NAME: "",
        ISBN: "",
        images: "",
        PRODUCTS_AUTH_NAME: "",
        PRODUCTS_PUBLISHER_NAME: "",
        PRODUCTS_MRP_IN_DOLLAR: "",
        PRODUCTS_SP_IN_DOLLAR: "",
        PRODUCTS_PUBLISH_DATE: "",
        PRODUCTS_LANGUAGE: "",
        PRODUCTS_PAGES: "",
        Description: "",
      },
    ];

    const worksheet = XLSX.utils.json_to_sheet(worksheetData);

    worksheet["!cols"] = [
      { wch: 18 },
      { wch: 18 },
      { wch: 10 },
      { wch: 12 },
      { wch: 25 },
      { wch: 25 },
      { wch: 25 },
      { wch: 25 },
      { wch: 26 },
      { wch: 20 },
      { wch: 20 },
      { wch: 20 },
    ];

    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Products Template");

    const excelBuffer = XLSX.write(workbook, {
      bookType: "xlsx",
      type: "array",
    });

    const fileData = new Blob([excelBuffer], {
      type: "application/octet-stream",
    });

    saveAs(fileData, "products_template.xlsx");
  };

  return (
    <button
      onClick={handleDownload}
      className="px-4 py-2 bg-black text-white rounded hover:bg-green-700 cursor-pointer"
    >
      Download Template
    </button>
  );
};

export default DownloadProductTemplate;
