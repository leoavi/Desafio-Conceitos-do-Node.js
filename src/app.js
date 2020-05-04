const express = require("express");
const cors = require("cors");

const { uuid } = require("uuidv4");

const app = express();

app.use(express.json());
app.use(cors());

const repositories = [];

function findIndex(id) {
  return repositories.findIndex((repositorie) => repositorie.id === id);
}

app.get("/repositories", (request, response) => {
  return response.json(repositories);
});

app.post("/repositories", (request, response) => {
  const { title, url, techs, likes } = request.body;

  if (!title || !url || !techs) {
    return response.status(400).json({
      error:
        "Para cadastrar um novo repositório é necessário informar os dados {title, url, techs}",
    });
  }

  const repositorie = { id: uuid(), url, title, techs, likes: 0 };

  repositories.push(repositorie);

  return response.status(200).json(repositorie);
});

app.put("/repositories/:id", (request, response) => {
  const { id } = request.params;
  const { title, url, techs } = request.body;

  const repositorieIndex = findIndex(id);

  if (repositorieIndex < 0) {
    return response.status(400).json({ error: "Repositório desconhecido" });
  }

  const repositorie = {
    id,
    url,
    title,
    techs,
    likes: repositories[repositorieIndex].likes,
  };

  repositories[repositorieIndex] = repositorie;

  return response.status(200).json(repositorie);
});

app.delete("/repositories/:id", (request, response) => {
  const { id } = request.params;

  const repositorieIndex = findIndex(id);

  if (repositorieIndex < 0) {
    return response.status(400).json({ error: "Repositório desconhecido" });
  }

  repositories.splice(repositorieIndex, 1);

  return response.status(204).json();
});

app.post("/repositories/:id/like", (request, response) => {
  const { id } = request.params;

  const repositorieIndex = findIndex(id);

  if (repositorieIndex < 0) {
    return response.status(400).json({ error: "Repositório desconhecido" });
  }

  repositories[repositorieIndex].likes =
    repositories[repositorieIndex].likes + 1;

  return response.status(200).json(repositories[repositorieIndex]);
});

module.exports = app;
