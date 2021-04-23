function draw() {
  const { type } = activeJSON();
  switch (type) {
    case "finite-automata":
      drawFiniteAutomata();
      break;
    case "regular-grammar":
      drawGrammar();
      break;
    case "regular-expression":
      drawExpression();
      break;
  }
}

function drawFiniteAutomata() {
  const json = editor.getValue();
  const { states, transitions, start, final } = activeJSON();
  board.model = new go.GraphLinksModel(
    states.map(state => {
      let label = "\n\n ";
      let color = "lightsteelblue";
      if (state === start && final.includes(state)) {
        label = "\n\n-> F:    ";
        color = "lightcoral";
      } else if (state === start) {
        label = "\n\n->     ";
        color = "lightcyan";
      } else if (final.includes(state)) {
        label = "\n\nF:     ";
        color = "lightcoral";
      }

      return { key: state, color, label };
    }),
    transitions.map(t => {
      return { from: t.from, to: t.to, symbol: t.symbol }
    }),
  );
}

async function drawGrammar() {
  const div = document.getElementById('grammar');
  while (div.firstChild) {
    div.removeChild(div.firstChild);
  }
  document.getElementById('grammar').innerHTML += "<table class='grammar_table'></table>";
  const { terminal, nonTerminal, productionRules } = activeJSON();
  const table = document.querySelector("table");

  for (const rule of productionRules) {
    const row = table.insertRow();
    console.log(rule);

    const cell = row.insertCell();
    var content = rule.non_term + " 🠒 ";
    for (var key in rule.productions) {
      content += rule.productions[key] + " | ";

    }
    const text = document.createTextNode(content);
    cell.appendChild(text);
  }
}

function drawExpression() {
  json = activeJSON();
  let regexInput = "";
  Object.keys(json.tokens).map(k => {
    regexInput += k + " => " + json.tokens[k] + "\n";
  });
  document.querySelector('#regexp-input').value = regexInput;
  loadSampleRegexp();
}

function triggerToast(title, message) {
  var myAlert = document.getElementById('liveToast');//select id of toast
  var bsAlert = new bootstrap.Toast(myAlert);//inizialize it
  document.querySelector('#toast-title').textContent = title;
  document.querySelector('#toast-text').textContent = message;
  bsAlert.show();
}

function showAutomata() {
  boardInit();
  showElement_('board'); hideElement("syntax-analysis"); hideElement('grammar'); hideElement('regexp');
}

function showGrammar() {
  grammarTableInit();
  loadSampleGrammar();
  showElement_('grammar'); hideElement("syntax-analysis"); hideElement('board'); hideElement('regexp');
}

function showRegex() {
  // todo load regex no editor da direita
  showElement_('regexp'); hideElement("syntax-analysis"); hideElement('board'); hideElement('grammar');
}

function showSyntaxAnalysis() {
  syntaxAnalysisInit();
  loadSyntaxAnalysisExamples();

  showElement_("syntax-analysis"); hideElement('regexp'); hideElement('board'); hideElement('grammar');
}

function showTokens() {

}
