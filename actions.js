function clearAll() {
    switch (activeJSON().type) {
        case "finite-automata":
            clearAutomata();
        case "regular-grammar":
            clearGrammar();
        case "regular-expression":
        // todo
    }
}

function clearAutomata() {
    const empty = `
{
    "type": "finite-automata",
    "start": "",
    "final": [],
    "states": [],
    "transitions": []
}`;
    jsonEditor.value = empty
    drawFiniteAutomata();
}

function clearGrammar() {
    const empty = `
{
    "type": "regular-grammar",
    "start": "",
    "productionRules": []
}`;
    jsonEditor.value = empty;
    drawGrammar();
}
