function createState() {
    switch (activeJSON.type) {
        case "finite-automata":
            createAutomataState();
        case "regular-grammar":
        // todo
        case "regular-expression":
        // todo
    }
}

function createTransition() {
    switch (activeJSON.type) {
        case "finite-automata":
            createAutomataTransitions();
        case "regular-grammar":
        // todo
        case "regular-expression":
        // todo
    }
}

function clearAll() {
    switch (activeJSON.type) {
        case "finite-automata":
            clearAutomata();
        case "regular-grammar":
        // todo
        case "regular-expression":
        // todo
    }
}

function createAutomataState() {
    const { states } = activeJSON;
    const key = document.querySelector("#state-name").value;
    states.push(key);
    activeJSON.states = states;
    drawFiniteAutomata();
}

function createAutomataTransitions() {
    const from = document.querySelector("#state-transition-from").value;
    const to = document.querySelector("#state-transition-to").value;
    const symbol = document.querySelector("#state-transition-symbol").value;
    const { transitions } = activeJSON;

    transitions.push({ from, to, symbol })
    activeJSON.transitions = transitions;
    drawFiniteAutomata();
}

function clearAutomata() {
    activeJSON.states = [];
    activeJSON.transitions = [];
    activeJSON.start = "";
    activeJSON.end = [];
    drawFiniteAutomata();
}
