const express = require('express');
const cors = require('cors');
const PORT = process.env.PORT || 3000;

const app = express();
app.use(cors());
app.use(express.json());

let todos = [
  { id: 1, text: 'Aprender JS', done: false },
  { id: 2, text: 'Construir una aplicación de tareas', done: false }
];

app.get('/', (req, res) => {
  res.send('Welcome to the Todo App API');
});

// obtener todas las tareas
app.get('/todos', (req, res) => {
  res.json(todos);
});

// agregar una nueva tarea
app.post('/todos', (req, res) => {
  const newTodo = {
    id: todos.length + 1,
    text: req.body.text,
    done: false
  };
  todos.push(newTodo);
  res.status(201).json(newTodo);
});

// marcar una tarea como terminada
app.patch('/todos/:id', (req, res) => {
  const todoId = parseInt(req.params.id);
  const todo = todos.find(t => t.id === todoId);
  if (!todo) {
    return res.status(404).json({ error: 'Todo not found' });
  }
  todo.done = true;
  res.json(todo);
});

// eliminar una tarea
app.delete('/todos/:id', (req, res) => {
  const todoId = parseInt(req.params.id);
  todos = todos.filter(t => t.id !== todoId);
  res.json({ ok: true });
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});