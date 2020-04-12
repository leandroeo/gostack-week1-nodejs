const express = require("express");
const cors = require("cors");

const { uuid } = require("uuidv4");

const app = express();

app.use(express.json());
app.use(cors());

const repositories = [];

app.get("/repositories", (request, response) => {
  return response.json(repositories);
});

app.post("/repositories", (request, response) => {
  const { title, url, techs } = request.body;

  const repository = {
    id: uuid(),
    likes: 0,
    title,
    url,
    techs
  }

  // Store repository in memory (array)
  repositories.push(repository);

  return response.json(repository);
});

app.put("/repositories/:id", (request, response) => {
  const { id } = request.params;

  const repositoryIndex = repositories.findIndex(repo => repo.id === id);

  if(repositoryIndex < 0)
  {
    return response.status(400).send('Repository does not exists.');
  }

  // Update logic
  const { title, url, techs } = request.body;
  const repo = repositories[repositoryIndex];

  let repository = {...repo, ...{
    title,
    url,
    techs
    } 
  }

  repositories[repositoryIndex] = repository;

  return response.json(repository);

});

app.delete("/repositories/:id", (request, response) => {
  const { id } = request.params;

  const repositoryIndex = repositories.findIndex(repo => repo.id === id);

  if(repositoryIndex < 0)
  {
    return response.status(400).send('Repository does not exists.');
  }

  // Remove logic
  repositories.splice(repositoryIndex, 1);

  return response.status(204).send();
});

app.post("/repositories/:id/like", (request, response) => {
  const { id } = request.params;

  const repository = repositories.find(repo => repo.id === id);

  if(!repository)
  {
    return response.status(400).send('Repository does not exists.');
  }

  repository.likes++;

  response.json(repository);
});

module.exports = app;
