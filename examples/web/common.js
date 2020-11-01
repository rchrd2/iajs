var codeEl = document.getElementById("code");
var exampleCode = document.getElementById("sourcecode").innerText.trim();
document.getElementById("code").value = exampleCode;
codeEl.setAttribute("style", "height:" + codeEl.scrollHeight + "px;");
document.getElementById("run").onclick = function () {
  eval(document.getElementById("code").value);
};
