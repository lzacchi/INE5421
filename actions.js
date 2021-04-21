// const DEBUG = true;
const DEBUG = false;

function init() {
    boardInit();
}

function showElement_(id) {
    var element = document.getElementById(id);
    element.style.display = 'block';
}

function hideElement(id) {
    var element = document.getElementById(id);
    element.style.display = 'none';
}

function toggleDiv(id) {
    const divState = document.querySelector("#" + id).style.display;
    if (divState.toLowerCase() === 'none') {
        document.querySelector("#" + id).style.display = "block";
    } else {
        document.querySelector("#" + id).style.display = "none";
    }
    return divState.toLowerCase();
}

function setEditorText(value, secondEditor = false) {
    const selectedEditor = secondEditor ? editor2 : editor;
    if (typeof(value) === "object"){
        selectedEditor.setValue(JSON.stringify(value, null, 4), -1);
    } else {
        selectedEditor.setValue(value, -1);
    }
}

function toggleEditor(editorName="editor") {
    const editorState = toggleDiv(editorName);
    let editorButton = document.querySelector("#editor-button");
    switch (editorState) {
        case "":
        case "block":
            editorButton.text = "Ativar editor";
            editorButton.className = "btn btn-success";
            break;

        case "none":
            editorButton.text = "Desativar editor"
            editorButton.className = "btn btn-danger";

            break;
        default:
            editorButton.text = "Alternar editor"
            break;
    }
}

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
    setEditorText(empty);
    drawFiniteAutomata();
}

function clearGrammar() {
    const empty = `
{
    "type": "regular-grammar",
    "terminal": [],
    "nonTerminal": [],
    "productionRules": []
}`;
    setEditorText(empty);
    drawGrammar();
}
