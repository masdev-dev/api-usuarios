const express = require("express");
const { Client } = require("pg");

const app = express();
const port = 3000;

// Configuração para conectar via socket Unix (sem senha)
const client = new Client({
  user: "postgres",
  host: "/var/run/postgresql",   // caminho do socket do PostgreSQL
  database: "meu_banco",
  password: "",                   // vazio é aceito quando usa socket
  port: 5432,
});

client.connect()
  .then(() => console.log("Conectado ao PostgreSQL"))
  .catch(err => console.error("Erro de conexão:", err.stack));

app.get("/usuarios", async (req, res) => {
  try {
    const result = await client.query("SELECT * FROM usuarios");
    res.json(result.rows);
  } catch (err) {
    res.status(500).json({ erro: err.message });
  }
});

app.listen(port, () => {
  console.log(`Servidor rodando em http://localhost:${port}`);
  console.log(`Acesse /usuarios para ver os dados do banco`);
});
