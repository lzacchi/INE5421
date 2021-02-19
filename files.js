// bota aqui vdd
document.querySelector("#formFile").addEventListener('change', function () {
  let file = document.querySelector("#formFile").files[0];
  let reader = new FileReader();
  reader.addEventListener('load', function (e) {
    let text = e.target.result;
    console.log(text); // a partir daqui text é um stringzão do arquivo, só parcear
    // carregar modelo para exibir no gŕafico de belas e pequenas esferas
    loadModel(text);
  });
  reader.readAsText(file);
});

document.querySelector('#formFile-btn').addEventListener('click', function(e) {
  e.preventDefault();
  document.querySelector('#formFile').click();
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
