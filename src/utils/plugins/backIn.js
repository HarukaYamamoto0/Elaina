const parse = require("parse-ms");

function backIn(date) {
  if (!date) throw new Error("date not found!");
  
  const milliseconds = parse(date.getTime());
  const { days, hours, minutes, seconds } = milliseconds;

  function format(timer, type) {
    if (timer <= 0) return "";
    return `${timer}${type} `;
  }

  const day = format(days, "d");
  const hour = format(hours, "h");
  const minute = format(minutes, "m");
  const second = format(seconds, "s");

  return `${day}${hour}${minute}${second}`;
}

module.exports = backIn;
