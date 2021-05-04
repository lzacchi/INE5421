// Interseção de autômatos

function intersection(automataA, automataB) {
  const a = complement(automataA);
  const b = complement(automataB);
  const result = union(a, b);

  const result = complement(unionAutomata);
  setEditorText(result);
  drawFiniteAutomata();
  return result;
}
