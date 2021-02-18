function loadFile(text) {
  const json = JSON.parse(text);
  boardJSON = json;
  loadModel();
}


async function loadSample() {
  const sample = await fetch('http://localhost:5500/examples/regular-grammars.json')
    .then(response => response.json())

  loadFile(JSON.stringify(sample));
}


let grammarJSON;

funtion loadGrammar() {
  const { terminal, non_terminal, production_rules } = grammarJSON;

  return grammarJSON;

  console.log(grammarJSON);

}

function loadModel() {
  const { states, transitions, start, final } = boardJSON;
  board.model = new go.GraphLinksModel(
    states.map(state => {
      let label = "\n\n ";
      let color = "lightsteelblue"
      if (state === start) {
        label = "\n\n->     ";
        color = "powderblue";
      } else if (final.includes(state)) {
        label = "\n\nF:     ";
        color = "skyblue";
      }

      return { key: state, color, label };
    }),
    transitions.map(t => {
      return { from: t.from, to: t.to, symbol: t.symbol }
    }),
  );
}



let grammar = [
  { non_terminal: "S", product: " ε | A" },
  { non_temrinal: "A", product: "aAa | bBb | ac | bc" },
  { non_terminal: "B", product: "bc | bBc" }
];

function generateTableHead(table, data) {
  let thead = table.createTHead();
  let row = thead.insertRow();
  for (let key of data) {
    let th = document.createElement("th");
    let text = document.createTextNode(key);
    th.appendChild(text);
    row.appendChild(th);
  }
}

function generateTable(table, data) {
  for (let element of data) {
    let row = table.insertRow();
    for (key in element) {
      let cell = row.insertCell();
      let text = document.createTextNode(element[key]);
      cell.appendChild(text);
    }
  }
}

let table = document.querySelector("table");
let data = Object.keys(grammar[0]);
// generateTableHead(table, data);
generateTable(table, grammar);
