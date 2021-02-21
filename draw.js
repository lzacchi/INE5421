function draw() {
    const { type } = activeJSON();
    switch (type) {
        case "finite-automata":
            drawFiniteAutomata();
        case "regular-grammar":
            drawGrammar();
        case "regular-expression":
            drawExpression();
    }
}

function drawFiniteAutomata() {
    const json = jsonEditor.value;
    const { states, transitions, start, final } = activeJSON();
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

async function drawGrammar() {
    var div = document.getElementById('grammar');
    while (div.firstChild) {
        div.removeChild(div.firstChild);
    }

    document.getElementById('grammar').innerHTML += "<table class='grammar_table'></table>";
    const json = jsonEditor.value;
    const { terminal, nonTerminal, productionRules } = activeJSON();
    let table = document.querySelector("table");
    for (const rule in productionRules) {
        let row = table.insertRow();

        for (var key in rule["non_term"]) {

            let cell = row.insertCell();
            let content = rule["non_term"][key] + " 🠒 " + rule['productions'].join(" | ");

            let text = document.createTextNode(content);
            cell.appendChild(text);
        }
    }
}

function drawExpression() {
    // todo
}
