import XLSX from "xlsx";
import FileSaver from "file-saver";
export function exportExcel({ id, filename }) {
    return new Promise(function(resolve) {
        var xlsxParam = { raw: true }; // 导出的内容只做解析，不进行格式转换
        var wb = XLSX.utils.table_to_book(document.querySelector(id), xlsxParam);
        var wbout = XLSX.write(wb, {
            bookType: "xlsx",
            bookSST: true,
            type: "array",
        });
        try {
            FileSaver.saveAs(
                new Blob([wbout], { type: "application/octet-stream" }),
                filename + ".xlsx"
            );
        } catch (e) {
            if (typeof console !== "undefined") console.log(e, wbout);
        }
        resolve("success");
    });
}