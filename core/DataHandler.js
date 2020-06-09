const fs = require("fs");
const morse = require("./morse");
const dataFile = __dirname + "/data";

exports.Handler = function () {
  const seperator = "\n";

  this.encode = (data) => {
    let converted = [];

    data.split("").forEach((value) => {
      converted.push(morse.symbols[value.toUpperCase()] || value);
    });

    return converted.join(" ");
  };

  this.decode = (data) => {
    let converted = [];

    data.split(" ").forEach((value) => {
      let fil = Object.keys(morse.symbols).filter(
        (e) => morse.symbols[e] == value
      );
      converted.push(fil);
    });

    return converted.join("").toLowerCase();
  };

  this.add = (data) => {
    data = this.encode(JSON.stringify(data));
    fs.appendFileSync(dataFile, data + seperator, "utf8");
  };

  this.read = () => {
    let data = fs.readFileSync(dataFile, "utf-8");
    data = data.split(seperator);
    data.pop();

    let converted = [];

    data.forEach((value) => {
      converted.push(this.decode(value));
    });
    return converted;
  };
};
