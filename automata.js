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

  loadSampleAutomata();
}

async function loadSampleAutomata() {
  const sample = await fetch('http://localhost:5500/examples/finite-automata.json')
    .then(response => response.json())

  loadFile(sample);
}