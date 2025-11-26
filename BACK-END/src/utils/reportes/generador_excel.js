const ExcelJS = require("exceljs");

// Genera un reporte en Excel y retorna el buffer
const generarExcel = async (titulo, datos, columnas) => {
  const workbook = new ExcelJS.Workbook();
  const worksheet = workbook.addWorksheet("Reporte");

  worksheet.columns = columnas.map((col) => ({
    header: col,
    key: col.toLowerCase().replace(/ /g, "_"),
    width: 15,
  }));

  worksheet.getRow(1).font = { bold: true, color: { argb: "FFFFFFFF" } };
  worksheet.getRow(1).fill = { type: "pattern", pattern: "solid", fgColor: { argb: "FF4472C4" } };

  datos.forEach((row) => {
    worksheet.addRow(row);
  });

  const buffer = await workbook.xlsx.writeBuffer();
  return buffer;
};

module.exports = {
  generarExcel,
};
