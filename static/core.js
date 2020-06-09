const socket = io({ transports: ["websocket"], upgrade: false });

symbols = {
  A: ".-",
  B: "-...",
  C: "-.-.",
  D: "-..",
  E: ".",
  F: "..-.",
  G: "--.",
  H: "....",
  I: "..",
  J: ".---",
  K: "-.-",
  L: ".-..",
  M: "--",
  N: "-.",
  O: "---",
  P: ".--.",
  Q: "--.-",
  R: ".-.",
  S: "...",
  T: "-",
  U: "..-",
  V: "...-",
  W: ".--",
  X: "-..-",
  Y: "-.--",
  Z: "--..",
  Á: ".--.-",
  Ä: ".-.-",
  É: "..-..",
  Ñ: "--.--",
  Ö: "---.",
  Ü: "..--",
  "1": ".----",
  "2": "..---",
  "3": "...--",
  "4": "....-",
  "5": ".....",
  "6": "-....",
  "7": "--...",
  "8": "---..",
  "9": "----.",
  "0": "-----",
  ",": "--..--",
  ".": ".-.-.-",
  "?": "..--..",
  ";": "-.-.-",
  ":": "---...",
  "/": "-..-.",
  "-": "-....-",
  "'": ".----.",
  "{": "-.--.-",
  "}": "-.--.------",
  _: "..--.-",
  "@": ".--.-.",
  " ": ".......",
  '"': '"',
};

let encode = (data) => {
  let converted = [];

  data.split("").forEach((value) => {
    converted.push(symbols[value.toUpperCase()] || value);
  });

  return converted.join(" ");
};

let decode = (data) => {
  let converted = [];

  data.split(" ").forEach((value) => {
    let fil = Object.keys(symbols).filter((e) => symbols[e] == value);
    converted.push(fil);
  });

  return converted.join("").toLowerCase();
};

function send() {
  let message = document.getElementById("box").value;
  let user = document.getElementById("user").value;

  let data = {
    url: user,
    message: encode(message),
    date: new Date().toString(),
    from: window.location.href,
  };

  socket.emit("new", data);
}

function add(data) {
  let block = document.getElementById("messages");

  let msg = document.createElement("h2");
  msg.innerHTML = decode(data.message);

  block.append(msg);
}

socket.on("connect", function () {
  socket.on("startup", (data) => {
    data.forEach((element) => {
      add(JSON.parse(element));
    });
  });

  socket.on("message", (data) => {
    add(data);
  });
});
