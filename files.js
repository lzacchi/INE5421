const jsonEditor = document.querySelector("#json-editor");


function activeJSON() {
  // return JSON.parse(jsonEditor.value);
  const txt = editor.getValue();
  return JSON.parse(txt);
}


function loadFile(json) {
  // jsonEditor.value = JSON.stringify(json, null, 4);
  editor.setValue(JSON.stringify(json, null, 4), -1);

  switch (activeJSON().type) {
    case "finite-automata":
      drawFiniteAutomata();
    case "regular-grammar":
      drawGrammar();
    case "regular-expression":
    // loadRegularExpression() // TODO
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

function toggleMenu(id) {
  const mainState = document.querySelector("#main-menu").style.display;
  if (mainState.toLowerCase() === 'none') {
    document.querySelector("#main-menu").style.display = "block";
    document.querySelector("#" + id).style.display = "none";
  } else {
    document.querySelector("#main-menu").style.display = "none";
    document.querySelector("#" + id).style.display = "block";
  }
}
