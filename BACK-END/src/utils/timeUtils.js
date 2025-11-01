
// ----------------------------
// Convierte minutos a formato SQL TIME ('HH:MM:SS')
// ----------------------------
const toSqlTimeFromMinutes = (value) => {
  if (value === null || value === undefined || value === "") return null;

  const n = Number(value);
  if (Number.isNaN(n) || n < 0) return null;

  const totalSeconds = Math.floor(n * 60);
  const hours = Math.floor(totalSeconds / 3600);
  const minutes = Math.floor((totalSeconds % 3600) / 60);
  const seconds = totalSeconds % 60;

  const hh = String(hours).padStart(2, "0");
  const mm = String(minutes).padStart(2, "0");
  const ss = String(seconds).padStart(2, "0");

  return `${hh}:${mm}:${ss}`;
};

module.exports = { toSqlTimeFromMinutes };
