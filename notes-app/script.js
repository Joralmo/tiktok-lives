const notesContainer = document.getElementById('notesContainer');
const addNoteBtn = document.getElementById('addNote');
const noteText = document.getElementById('noteText');
const noteColor = document.getElementById('noteColor');

let notes = JSON.parse(localStorage.getItem('notes') || '[]');

function renderNotes() {
  notesContainer.innerHTML = '';
  notes.forEach((note, index) => {
    const div = document.createElement('div');
    div.className = 'note';
    div.style.backgroundColor = note.color;

    div.innerHTML = `
      <p contentEditable="false">${note.text}</p>
      <button onclick="deleteNote(${index})">🗑️</button>
      <button style="right:35px" onclick="editNote(${index})">✏️</button>
    `;

    notesContainer.appendChild(div);
  });
};

function saveNotes () {
  localStorage.setItem('notes', JSON.stringify(notes));
}

addNoteBtn.addEventListener('click', () => {
  const text = noteText.value.trim();
  if (text === '') return;
  const color = noteColor.value;

  notes.push({ text, color });
  noteText.value = '';
  saveNotes();
  renderNotes();
});

function deleteNote(index) {
  notes.splice(index, 1);
  saveNotes();
  renderNotes();
};

function editNote(index) {
  const newText = prompt("Edita tu note:", notes[index].text);
  if (newText !== null) {
    notes[index].text = newText;
    saveNotes();
    renderNotes();
  }
};

renderNotes();