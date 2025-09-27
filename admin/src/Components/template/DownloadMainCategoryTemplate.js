import React from "react";
import * as XLSX from "xlsx";
import { saveAs } from "file-saver";

const DownloadMainCategoryTemplate = () => {
  const handleDownload = () => {
    const data = [
      {
        Parent_name: "",
        Parent_id: "",
      },
     
    ];

    const worksheet = XLSX.utils.json_to_sheet(data);
    worksheet["!cols"] = [{ wch: 18 }, { wch: 18 }];
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "MainCategories");
    const excelBuffer = XLSX.write(workbook, {
      bookType: "xlsx",
      type: "array",
    });
    const file = new Blob([excelBuffer], {
      type: "application/octet-stream",
    });
    saveAs(file, "main_category_template.xlsx");
  };

  return (
    <button  onClick={handleDownload}
      className="px-4 py-2 bg-black text-white rounded hover:bg-green-700 cursor-pointer"
    
    >
      Download Template
    </button>
  );
};

export default DownloadMainCategoryTemplate;
