# INE5421 Linguagens Formais e Compiladores

# Instruções

- `sudo python -m http.server 80`
- `Entre em http://0.0.0.0:80`

Se a variável DEBUG estiver como true no arquivo `actions.js` o sistema usará os jsons de exemplo na pasta `examples`. Caso contrário os exemplos serão buscados de um Gist fixo.

Alternativamente pode-se acessar https://lzacchi.github.io/INE5421/ para obter a última versão.

# Módulos

Na pasta base encontram-se os arquivos de alto nível da interface. A pasta `algorithms` concentra os algoritmos pedidos nos PDFs enquanto em `examples` estão alguns arquivos de definição de autômatos já testados.

# Como usar

O programa possui dois editores onde pode-se inserir os dois autômatos a serem executados nas operações binárias. No caso da verificação de sentença o segundo editor deve ser utilizado para inserir a string a ser verificada ao invés de um JSON enquanto o 1o editor mantém o autômato a ser testado.
