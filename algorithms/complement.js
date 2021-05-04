// Complemento de automatos

function complement(automata) {
  const newFinal = [];
  for (const state of automata.states) {
    if (!automata.final.includes(state)) {
      newFinal.push(state);
    } else {
      continue;
    }
  }

  const newAutomata = {
    "type": "finite-automata",
    "start": automata.start,
    "final": newFinal,
    "states": automata.states,
    "transitions": automata.transitions
  }


  setEditorText(newAutomata);
  drawFiniteAutomata();
  return newAutomata;
}
