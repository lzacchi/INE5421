function intersection(automataA, automataB) {
  complement(automataA);
  complement(automataB);
  const u = union(automataA, automataB);
  complement(u);

  setEditorText(u);
  drawFiniteAutomata();
}

function complement(automata) {
  const newFinal = [];
  for (state of automata.states) {
    if (!automata.final.includes(state)) {
      newFinal.push(state);
    } else {
      continue;
    }
  }
  automata.final = newFinal;
}
