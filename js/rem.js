var d = document.getElementsByTagName("html")[0].getBoundingClientRect().width;
var b = document.getElementsByTagName("html")[0];
d > 640 ? b.style.fontSize = 640 / 16 + "px" : b.style.fontSize = d / 16 + "px";
