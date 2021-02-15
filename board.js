const $ = go.GraphObject.make;
board = $(go.Diagram, "board", {
  "undoManager.isEnabled": true
});

let boardJSON;

function boardInit() {
  board.nodeTemplate =
    $(
      go.Node,
      "Auto",
      $(go.Shape, "Circle", { strokeWidth: 0, fill: "white" }, new go.Binding("fill", "color")),
      $(go.TextBlock, { margin: 8, font: "bold 14px sans-serif", stroke: '#333' }, new go.Binding("text", "key"))
    );

  loadSample() // test
}

function loadFile(text) {
  const json = JSON.parse(text);
  boardJSON = json;
  loadModel();
}

function loadModel() {
  const { states, transitions } = boardJSON;
  board.model = new go.GraphLinksModel(
    states.map(s => { return { key: s, color: "lightblue" } }),
    transitions.map(t => { return { from: t.from, to: t.to } }),
  );
}

function saveModel() {
  download("finite-automata.json", JSON.stringify(boardJSON));
}

async function loadSample() {
  const sample = await fetch('http://localhost:5500/examples/finite-automata.json')
    .then(response => response.json())

  loadFile(JSON.stringify(sample));
}
