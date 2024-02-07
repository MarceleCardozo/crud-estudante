//console.log('Teste')

import express from "express";
import cors from "cors";
import bcrypt from "bcrypt";

const app = express();
app.use(express.json());
app.use(cors());

app.listen(3003, () => {
  console.log("Server is running in http://localhost:3003");
});

// cliente pede e passa dado (parametros) => Request
// servidor responde e devolve status e resposta => Response

app.get("/", (req, res) => {
  res.status(200).send("Salve turma");
});

/*

    Resposta 
    - Status code => Qual é o status da nossa requisiçã? Deu bom ou não ? Teve erro ao digitar ? Servidor tá funcionando

    - Corpo da Resposta => formato do conteúdo JSON , mensagem , receber um dado, sucesso 

    - Cabeçalho => autenticacao / headers / token / authorization 

    - res.status(n) - envia uma resposta com status code n
    - res.send(x) - responde a requisição com o objeto x
    - res.end() - encerra a requisição sem um body na resposta

*/

// Endpoint para criar aluno  - CREATE

const alunos = [];

app.post("/alunos", async (req, res) => {
  const nome = req.body.nome;
  const email = req.body.email;
  const senha = req.body.senha;

  const criptografaSenha = await bcrypt.hash(senha, 10);

  const novoAluno = {
    nome,
    email,
    criptografaSenha,
  };
  
  alunos.push(novoAluno);

  res.status(201).json({
    sucess: true,
    message: "Pessoa estudante criada com sucesso!",
  });
});

// CRUD => CREATE (POST) | READ (GET) | UPDATE (PUT) | DELETE (DEL)

// Ler estudantes
app.get("/alunos", (req, res) => {
  res.status(200).send(alunos);
});

// ATUALIZAR  estudante
app.put("/alunos/:nomeAluno", (req, res) => {
  const nomeAluno = req.params.nomeAluno;
  const nome = req.body.nome;
  const email = req.body.email;

  //console.log(nomeAluno)

  const novoAluno = {
    nome,
    email,
  };

  //console.log(novoAluno)

  const indice = alunos.findIndex((aluno) => aluno.nome === nomeAluno);

  //console.log(indice)

  if (indice !== -1) {
    alunos[indice] = novoAluno;
    res.status(200).send("Pessoa estudante atualizada com sucesso");
  } else {
    res.status(400).send("Pessoa estudante não encontrado");
  }
});

// DELETA estudante
app.delete("/alunos/:nomeAluno", (req, res) => {
  const nomeAluno = req.params.nomeAluno;

  const indice = alunos.findIndex((aluno) => aluno.nome === nomeAluno);

  if (indice !== -1) {
    alunos.splice(indice, 1);
    res.status(200).send("Pessoa estudante removida com sucesso");
  } else {
    res.status(400).send("Pessoa estudante não encontrada");
  }
});

// Login
app.post("/login", (req, res) => {
  const email = req.body.email;
  const senha = req.body.senha;

  const aluno = alunos.find((aluno) => aluno.email === email);

  if (aluno) {
    bcrypt.compare(senha, aluno.criptografaSenha, (error, result) => {
      if (result) {
        res.status(200).json({ success: true, message: "Login bem-sucedido" });
      } else {
        res.status(400).json({ success: false, message: "Senha incorreta"});
      } 
    });
  } else {
    res.status(404).json({success: false, message: "Usuário não encontrado"})
  }
});
