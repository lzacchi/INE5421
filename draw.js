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
            let color = "lightsteelblue"
            if (state === start && final.includes(state)) {
                label = "\n\n-> F:    ";
                color = "skyblue";
            } else if (state === start) {
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
            content+= rule.productions[key] + " | ";

        }
        const text = document.createTextNode(content);
        cell.appendChild(text);
    }
}

function drawExpression() {
    // todo
}

function triggerToast(title, message) {
    var myAlert = document.getElementById('liveToast');//select id of toast
    var bsAlert = new bootstrap.Toast(myAlert);//inizialize it
    document.querySelector('#toast-title').textContent = title;
    document.querySelector('#toast-text').textContent = message;
    bsAlert.show();//show it
}



function showAutomata() {
  showElement_('board'); hideElement('grammar');hideElement('regexp');
}

function showGrammar() {
  showElement_('grammar'); hideElement('board');hideElement('regexp');
}

function showRegex() {
  showElement_('regexp'); hideElement('board');hideElement('grammar');
}
