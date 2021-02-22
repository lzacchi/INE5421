function runRegExp() {
    regexp = document.querySelector('#regexp-custom').value;
    regexpInput = document.querySelector('#regexp-input').value;
    document.querySelector('#regexp-result').textContent = "RegExp de entrada: " + regexp + "\n String de entrada: " + regexpInput + "\n Saída:";
}
