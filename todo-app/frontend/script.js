const API = "http://localhost:3000";
const list = document.getElementById("todo-list");
const form = document.getElementById("todo-form");
const input = document.getElementById("todo-input");

const render = async () => {
  const res = await fetch(`${API}/todos`);
  const todos = await res.json();

  list.innerHTML = "";
  todos.forEach((todo) => {
    const li = document.createElement("li");
    li.textContent = todo.text;
    if (todo.done) {
      li.classList.add("done");
    }
    li.addEventListener("click", async () => {
      if (!todo.done) {
        await fetch(`${API}/todos/${todo.id}`, {
          method: "PATCH",
        });
        render();
      }
    });

    const deleteBtn = document.createElement("button");
    deleteBtn.textContent = "Eliminar";
    deleteBtn.onclick = async (e) => {
      e.stopPropagation();
      await fetch(`${API}/todos/${todo.id}`, {
        method: "DELETE",
      });
      render();
    };
    li.appendChild(deleteBtn);

    list.appendChild(li);
  });
};

form.addEventListener("submit", async (e) => {
  e.preventDefault();
  if (input.value.trim() === "") return;
  await fetch(`${API}/todos`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ text: input.value.trim() }),
  });
  input.value = "";
  render();
});

render();
