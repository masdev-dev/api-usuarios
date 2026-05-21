const express = require("express");
const app = express();
const port = 3000;

app.get("/", (req, res) => {
  res.send("<h1>Servidor Node.js rodando!</h1><p>Acesse <a href=\"/sobre\">/sobre</a></p>");
});

app.get("/sobre", (req, res) => {
  res.json({ nome: "Meu Servidor", versao: "1.0" });
});

app.listen(port, () => {
  console.log(`Servidor rodando em http://localhost:${port}`);
});
