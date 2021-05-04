// Manipulação do JSON exibido no editor lateral
// Interação com os botões de download/upload

function activeJSON() {
  const txt = editor.getValue();
  var ret
  try {
    ret = JSON.parse(txt);
  } catch (e) {
    triggerToast("JSON Editor Error", e);
  }
  return ret;
}

function loadFile(json, secondEditor = false) {
  setEditorText(json, secondEditor);

  switch (activeJSON().type) {
    case "finite-automata":
      drawFiniteAutomata();
      break;
    case "regular-grammar":
      drawGrammar();
      break;
    case "regular-expression":
      // loadRegularExpression();
      break;
    case "pseudocode":
      syntaxAnalysisInit();
      break;
  }
}

// Função que roda quando o arquivo de upload é alterado
document.querySelector("#formFile").addEventListener('change', function () {
  const file = document.querySelector("#formFile").files[0];
  const reader = new FileReader();
  reader.addEventListener('load', function (e) {
    const text = e.target.result;
    loadFile(JSON.parse(text));

    switch (JSON.parse(text).type) {
      case "finite-automata":
        drawFiniteAutomata(text);
      case "regular-grammar":
        drawGrammar();
      // case "regular-expression":
      // todo
    }

  });
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
  const name = activeJSON().type + ".json";
  download(name, JSON.stringify(activeJSON()));
}
