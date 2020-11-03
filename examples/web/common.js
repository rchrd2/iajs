var codeEl = document.getElementById("code");
var sourceEl = document.getElementById("sourcecode");
if (codeEl && sourceEl) {
  var exampleCode = sourceEl.innerText.trim();
  document.getElementById("code").value = exampleCode;
  codeEl.setAttribute("style", "height:" + codeEl.scrollHeight + "px;");
  document.getElementById("run").onclick = function () {
    eval(document.getElementById("code").value);
  };
}
