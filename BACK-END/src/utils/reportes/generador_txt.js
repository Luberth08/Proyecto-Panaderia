// Genera un reporte en TXT
const generarTXT = async (titulo, datos, columnas) => {
  let contenido = `${"=".repeat(80)}\n`;
  contenido += `${titulo.toUpperCase().padEnd(80)}\n`;
  contenido += `${"=".repeat(80)}\n`;
  contenido += `Fecha de generación: ${new Date().toLocaleString()}\n`;
  contenido += `${"=".repeat(80)}\n\n`;

  const columnWidths = columnas.map((col) => Math.max(col.length, 15));

  const headerRow = columnas
    .map((col, i) => col.padEnd(columnWidths[i]))
    .join(" | ");
  contenido += headerRow + "\n";
  contenido += `${"-".repeat(headerRow.length)}\n`;

  datos.forEach((row) => {
    const rowData = columnas.map((col, i) => {
      const value = (row[col.toLowerCase().replace(/ /g, "_")] || "").toString();
      return value.padEnd(columnWidths[i]);
    });
    contenido += rowData.join(" | ") + "\n";
  });

  contenido += `${"=".repeat(80)}\n`;

  return Buffer.from(contenido);
};

module.exports = {
  generarTXT,
};
