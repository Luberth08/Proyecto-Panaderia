const PDFDocument = require("pdfkit");
const fs = require("fs");
const path = require("path");

// Genera un reporte en PDF y retorna el buffer
const generarPDF = async (titulo, datos, columnas) => {
  return new Promise((resolve, reject) => {
    const doc = new PDFDocument();
    const chunks = [];

    doc.on("data", (chunk) => chunks.push(chunk));
    doc.on("end", () => resolve(Buffer.concat(chunks)));
    doc.on("error", reject);

    doc.fontSize(20).text(titulo, { align: "center" });
    doc.moveDown(0.5);
    doc.fontSize(10).text(`Fecha de generación: ${new Date().toLocaleString()}`, { align: "right" });
    doc.moveDown(1);

    const tableTop = doc.y;
    const columnX = [50, 150, 250, 350, 450];
    const rowHeight = 25;

    columnas.forEach((col, i) => {
      doc.fontSize(10).text(col, columnX[i], tableTop, { width: 100, align: "left" });
    });

    doc.moveTo(50, tableTop + rowHeight - 5).lineTo(550, tableTop + rowHeight - 5).stroke();

    let currentY = tableTop + rowHeight + 5;
    datos.forEach((row, rowIndex) => {
      columnas.forEach((col, colIndex) => {
        const value = row[col.toLowerCase().replace(/ /g, "_")] || "";
        doc.fontSize(9).text(value.toString(), columnX[colIndex], currentY, { width: 100 });
      });

      currentY += rowHeight;
      if (currentY > doc.page.height - 50) {
        doc.addPage();
        currentY = 50;
      }
    });

    doc.end();
  });
};

module.exports = {
  generarPDF,
};
