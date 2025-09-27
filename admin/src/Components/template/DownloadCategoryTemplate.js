import * as XLSX from "xlsx";
import { saveAs } from "file-saver";

const DownloadCategoryTemplate = () => {
  const handleDownload = () => {
    const worksheetData = [
      {
        Categories_id: "",
        Categories_name: "",
        Parent_id: "",
      },
    ];

    // Convert to worksheet
    const worksheet = XLSX.utils.json_to_sheet(worksheetData, {
      skipHeader: false,
    });

worksheet["!cols"] = [
      { wch: 18 },
      { wch: 18 },
      { wch: 10 },
      
    ];

    // Create workbook
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Categories Template");

    // Create buffer and save
    const excelBuffer = XLSX.write(workbook, {
      bookType: "xlsx",
      type: "array",
    });

    const fileData = new Blob([excelBuffer], {
      type: "application/octet-stream",
    });

    saveAs(fileData, "category_template.xlsx");
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

export default DownloadCategoryTemplate;
