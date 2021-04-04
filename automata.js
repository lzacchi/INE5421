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

function determinizeNFA() {
  const { states, transitions, start, final } = activeJSON();

  const hasEpsilon = checkEpsilonTransition(transitions);
  // transition_map it's like:
  // transition_map[source][symbol] = [list of sinks]

  // initaliazing transition table
  let transition_map;
  let symbol_list;
  let repeat = true;
  transition_map = {};
  symbol_list = [];
  while (repeat) {
    for (const ts of transitions) {
      // defining new transition
      if (typeof transition_map[ts.from] === "undefined") {
        transition_map[ts.from] = {};
      }
      if (typeof transition_map[ts.from][ts.symbol] === "undefined") {
        transition_map[ts.from][ts.symbol] = [];
      }
      // appending a new symbol fro
      transition_map[ts.from][ts.symbol].push(ts.to);
      symbol_list.push(ts.symbol);
    }
    const alfabet_set = [...new Set(symbol_list)];

    // creating new states 
    for (let tm in transition_map) {
      for (let s in transition_map[tm]) {
        // new state found
        if (transition_map[tm][s].length > 1) {
          // checking if the new state already exists else define it
          if (typeof transition_map[transition_map[tm][s]] === "undefined") {
            transition_map[transition_map[tm][s]] = null;
          }
        }

        // calculate new states transitions that still are null
        console.log(tm);
        transition_map[tm] = 1;
        if (tm.includes(',') && transition_map[tm] === null) {
          let states_ = tm.split(',');
          console.log('ENTROU no estado composto');
          transition_map[tm] = 1;
          // console.log(transition_map);
          // console.log(transition_map[tm]);
          // for (let sym of symbol_list) {
          //   let new_transition = [];
          //   for (let st of states_) {
          //     if (transition_map[st][sym].length > 1) {
          //       new_transition.push(...transition_map[st][sym]); // appending each state, not the array
          //       console.log("push no estado");
          //     } else {
          //       new_transition.push(transition_map[st][sym]);
          //     }
          //   }
          //   console.log('adicionando novo array de estados');
          //   transition_map[tm][sym] = [...new_transition]
          // }
        }
      }
    }
    repeat = !Object.values(transition_map).every(o => o !== null);
  }

  if (hasEpsilon) {
    // nfa to dfa algorithm
    //check new states

  } else {

  }

}

function checkEpsilonTransition(transitions) {
  for (t of transitions) {
    if (t.symbol === "&") {
      return true;
    }
  }
  return false;
}

