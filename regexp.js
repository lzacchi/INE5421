function saveRegExp() {
  let regexpTemplate = {
          "type": "regular-expression",
          "tokens": {}
      }
  let regexpText = document.querySelector('#regexp-input').value;
  let regexps = regexpText.split("\n").map(s => s.split("=>"));
  regexps.map(r => r[0] = r[0].replace(" ","").trim()); // removing spaces from token name
  regexps.map(r => regexpTemplate.tokens[r[0]] = r[1].replace(" ","").trim());
  setEditorText(regexpTemplate, false);
}

async function regexpInit() {
  loadSampleRegexp();
}

async function loadSampleRegexp() {
  const url =
    DEBUG === true
      ? "http://localhost:5501/examples/regexp.json"
      : "https://gist.githubusercontent.com/lzacchi/d770ee86bd436a9db9cb61981eefc0e5/raw/fe08651e729393ba4957fea1e81b81ea007f967b/regexp.json";
  const sample = await fetch(url).then((response) => response.json());
  loadFile(sample);
}
