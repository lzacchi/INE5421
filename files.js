// bota aqui vdd
document.querySelector("#file-input").addEventListener('change', function () {
  let file = document.querySelector("#file-input").files[0];
  let reader = new FileReader();
  reader.addEventListener('load', function (e) {
    let text = e.target.result;
    console.log(text); // a partir daqui text é um stringzão do arquivo, só parcear
    // carregar modelo para exibir no gŕafico de belas e pequenas esferas
    loadModel(text);
  });
  reader.readAsText(file);
});

function download(filename, text) {
  const element = document.createElement('a');
  element.setAttribute('href', 'data:text/plain;charset=utf-8,' + encodeURIComponent(text));
  element.setAttribute('download', filename);
  element.style.display = 'none';
  document.body.appendChild(element);
  element.click();
  document.body.removeChild(element);
}

function cage() {
  // namoral
  document.body.style.backgroundImage = "url(data:image/jpeg;base64,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)"
}
