function analysePseudoCode() {
    let regexpList = ["a","b","c"]; // placeholder
    let bigAutomata = regexpList.map(r => convertRegexToDFA(r)).reduce( (previous, current) => union(previous, current));
    determinizeNFA(bigAutomata);
    minimizeDFA(bigAutomata);
    // big automata done
    // to-do:
    // run big automata with user's pseudocode input
    let pseudoCodeInput = document.getElementById("#pseudocode-input").value;
    setEditorText(pseudoCodeInput, true); // set the editor2 text to pseudo-code
    setEditorText(bigAutomata, false); //
    verify(); //
}
