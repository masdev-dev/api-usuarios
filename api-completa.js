require("dotenv").config();
const express = require("express");
const { Client } = require("pg");

const app = express();
const port = 3000;

app.use(express.json());

const client = new Client({
  connectionString: process.env.DATABASE_URL,
  ssl: { rejectUnauthorized: false }
});

client.connect()
  .then(() => console.log("Conectado ao Neon"))
  .catch(err => console.error("Erro de conexão:", err.message));

app.get("/usuarios", async (req, res) => {
  const result = await client.query("SELECT * FROM usuarios ORDER BY id");
  res.json(result.rows);
});

app.get("/usuarios/:id", async (req, res) => {
  const { id } = req.params;
  const result = await client.query("SELECT * FROM usuarios WHERE id = $1", [id]);
  if (result.rows.length === 0) return res.status(404).json({ erro: "Usuário não encontrado" });
  res.json(result.rows[0]);
});

app.post("/usuarios", async (req, res) => {
  const { nome, idade } = req.body;
  if (!nome || !idade) return res.status(400).json({ erro: "Nome e idade são obrigatórios" });
  const result = await client.query(
    "INSERT INTO usuarios (nome, idade) VALUES ($1, $2) RETURNING *",
    [nome, idade]
  );
  res.status(201).json(result.rows[0]);
});

app.put("/usuarios/:id", async (req, res) => {
  const { id } = req.params;
  const { nome, idade } = req.body;
  const result = await client.query(
    "UPDATE usuarios SET nome = $1, idade = $2 WHERE id = $3 RETURNING *",
    [nome, idade, id]
  );
  if (result.rows.length === 0) return res.status(404).json({ erro: "Usuário não encontrado" });
  res.json(result.rows[0]);
});

app.delete("/usuarios/:id", async (req, res) => {
  const { id } = req.params;
  const result = await client.query("DELETE FROM usuarios WHERE id = $1 RETURNING *", [id]);
  if (result.rows.length === 0) return res.status(404).json({ erro: "Usuário não encontrado" });
  res.json({ mensagem: "Usuário removido", usuario: result.rows[0] });
});
app.get("/", (req, res) => {
  res.send("API está rodando!");
});
app.listen(port, () => {
  console.log(`API rodando em http://localhost:${port}`);
});
