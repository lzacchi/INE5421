let activeJSON;

function loadFile(text) {
  const json = JSON.parse(text);
  activeJSON = json;

  switch (activeJSON.type) {
    case "finite-automata":
      drawFiniteAutomata();
    case "regular-grammar":
      loadRegularGrammar();
    case "regular-expression":
    // loadRegularExpression() // TODO
  }
}

// Função que roda quando o arquivo de upload é alterado
document.querySelector("#formFile").addEventListener('change', function () {
  let file = document.querySelector("#formFile").files[0];
  let reader = new FileReader();
  reader.addEventListener('load', function (e) {
    let text = e.target.result;
    console.log(text); // a partir daqui text é um stringzão do arquivo, só parsear
    // carregar modelo para exibir no gŕafico de belas e pequenas esferas
    loadFile(text);
    drawFiniteAutomata(text);
  });
  document.querySelector("#main-menu").style.display = 'none';
  document.querySelector("#automata-menu").style.display = 'block';
  reader.readAsText(file);
});

document.querySelector('#formFile-btn').addEventListener('click', function (e) {
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

function saveActiveJSON() {
  const name = activeJSON.type + ".json";
  download(name, JSON.stringify(activeJSON));
}

function toggleMenu(id) {
  main_state = document.querySelector("#main-menu").style.display;
  if (main_state.toLowerCase() === 'none') {
    document.querySelector("#main-menu").style.display = "block";
    document.querySelector("#" + id).style.display = "none";
  } else {
    document.querySelector("#main-menu").style.display = "none";
    document.querySelector("#" + id).style.display = "block";
  }
}
