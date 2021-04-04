const $ = go.GraphObject.make;
board = $(go.Diagram, "board", {
  "undoManager.isEnabled": true
});

function boardInit() {
  const keyOptions = {
    margin: 8,
    font: "bold 11px sans-serif",
    stroke: '#333',
  }

  const labelOptions = {
    margin: 8,
    font: "bold 11px sans-serif",
    stroke: '#333',
    margin: 2,
  };

  board.nodeTemplate =
    $(
      go.Node,
      "Auto",
      $(go.Shape, "Circle", { strokeWidth: 1, fill: "white" }, new go.Binding("fill", "color")),
      $(go.TextBlock, keyOptions, new go.Binding("text", "key")),
      $(go.TextBlock, labelOptions, new go.Binding("text", "label")),
    );

  board.linkTemplate =
    $(go.Link,
      { curve: go.Link.Bezier },
      $(go.Shape,
        { stroke: "black" }),
      $(go.Shape,
        { toArrow: "standard", stroke: null }),
      $(go.Panel, "Auto",
        $(go.Shape,
          {
            fill: $(go.Brush, "Radial", { 0: "rgb(240, 240, 240)", 0.3: "rgb(240, 240, 240)", 1: "rgba(240, 240, 240, 240)" }),
            stroke: null
          }),
        $(go.TextBlock,
          {
            textAlign: "center",
            font: "bold 12pt helvetica, arial, sans-serif",
            stroke: "#555555",
            margin: 4
          },
          new go.Binding("text", "symbol"))
      )
    );

  const url = DEBUG === true ? "http://localhost:5500/examples/finite-automata.json" : "https://gist.githubusercontent.com/aBARICHELLO/b84ca2d0f99b54e98d8adbcc0609e8ab/raw/086045a265f5cd52eec6571eb6e16ac3fa1e7c49/finite-automata.json"
  const url2 = DEBUG === true ? "http://localhost:5500/examples/finite-automata2.json" : "https://gist.githubusercontent.com/aBARICHELLO/3098adfbebbf83ba26f1ab021fdce812/raw/6f5976e796115670616c72c56f8b97e08db8c7e2/finite-automata2.json"
  loadSampleAutomata(url);
  loadSampleAutomata(url2, true);
}

async function loadSampleAutomata(url, secondEditor = false) {
  const sample = await fetch(url)
    .then(response => response.json())
  loadFile(sample, secondEditor);
}

function applyBinaryOperation(operation) {
  const json = activeJSON();
  const editorText = editor2.getValue();
  const inputJSON = JSON.parse(editorText);
  if (json.type !== "finite-automata" || inputJSON.type !== "finite-automata") {
    triggerToast("Erro", "Operação não suportada para os tipos de linguagem selecionados")
    return;
  }
  operation(json, inputJSON);
}

function automataToGrammar(automata) {

  var grammar = {
    "type": "regular-grammar",
    "terminal": automata['states'],
    "nonTerminal": [],
    "productionRules": []
  }


  for (const transition in automata['transitions']) {
    grammar['nonTerminal'].push(automata['transitions'][transition]['symbol']);

  }

  for (const terminal in grammar['terminal']) {
    console.log(grammar['terminal'][terminal]);
  }

  grammar['nonTerminal'] = [...new Set(grammar['nonTerminal'])];



  // console.log(grammar);

}
