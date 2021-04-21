function analysePseudoCode() {
    let regexpList = ["a","b","c"];
    let bigAutomata = regexpList.map(r => convertRegexToDFA(r)).reduce( (previous, current) => union(previous, current));
    determinizeNFA(bigAutomata);
    minimizeDFA(bigAutomata);
    // big automata done
    // to-do:
    // run big automata with user's pseudocode input
}