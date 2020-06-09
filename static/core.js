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

function copyToClipboard(text) {
  alert("Text Copied!!");
  if (window.clipboardData && window.clipboardData.setData) {
    return clipboardData.setData("Text", text);
  } else if (
    document.queryCommandSupported &&
    document.queryCommandSupported("copy")
  ) {
    var textarea = document.createElement("textarea");
    textarea.textContent = text;
    textarea.style.position = "fixed";
    document.body.appendChild(textarea);
    textarea.select();
    try {
      return document.execCommand("copy");
    } catch (ex) {
      console.warn("Copy to clipboard failed.", ex);
      return false;
    } finally {
      document.body.removeChild(textarea);
    }
  }
}

function add(data) {
  let block = document.getElementById("messages");

  let fromTo = document.createElement("h2");
  fromTo.innerHTML = window.location.href == data.from ? "Me" : data.from;

  let content = document.createElement("p");
  content.className = "content";
  content.innerHTML = decode(data.message);

  let time = document.createElement("span");
  time.className = "time";
  time.innerHTML = data.date;

  let msgBlock = document.createElement("div");
  msgBlock.className = "block";
  msgBlock.appendChild(fromTo);
  msgBlock.appendChild(content);
  msgBlock.appendChild(time);

  block.appendChild(msgBlock);
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

  socket.on("global", (data) => {
    let link = document.createElement("h3");
    link.className = "link";
    link.innerHTML = data + "/msg";

    let heading = document.createElement("div");
    heading.className = "heading";
    heading.onclick = () => {
      let data = link.innerHTML;
      copyToClipboard(data);
    };
    heading.appendChild(link);

    document
      .getElementsByTagName("body")[0]
      .insertBefore(heading, document.getElementById("actions"));
  });
});
