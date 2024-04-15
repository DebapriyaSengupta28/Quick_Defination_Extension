const wordInput = document.getElementById('wordInput');
const searchBtn = document.getElementById('searchBtn');
const wordOutput = document.getElementById('wordOutput');
const savedWords = document.getElementById('savedWords');
const toggleSavedWords = document.getElementById('toggleSavedWords');

let savedWordsData = JSON.parse(localStorage.getItem('savedWords')) || [];

function fetchWordDefinition(word) {
  fetch(`https://api.dictionaryapi.dev/api/v2/entries/en/${word}`)
    .then(response => response.json())
    .then(data => {
      if (data.title === 'No Definitions Found') {
        wordOutput.innerHTML = `<p>No definition found for "${word}"</p>`;
      } else {
        const definition = data[0].meanings[0].definitions[0].definition;
        wordOutput.innerHTML = `<p><strong>${word}</strong>: ${definition}</p>`;
        const saveBtn = document.createElement('button');
        saveBtn.textContent = 'Save Word';
        saveBtn.addEventListener('click', () => saveWord(word, definition));
        wordOutput.appendChild(saveBtn);
      }
    })
    .catch(error => {
      wordOutput.innerHTML = `<p>Error: ${error.message}</p>`;
    });
}

function saveWord(word, definition) {
  const savedWord = { word, definition };
  const isDuplicate = savedWordsData.some(item => item.word === word);

  if (isDuplicate) {
    wordOutput.innerHTML += `<p>The word "${word}" has already been saved.</p>`;
  } else {
    savedWordsData.push(savedWord);
    localStorage.setItem('savedWords', JSON.stringify(savedWordsData));
    displaySavedWords();
  }
}

function removeSavedWord(index) {
  savedWordsData.splice(index, 1);
  localStorage.setItem('savedWords', JSON.stringify(savedWordsData));
  displaySavedWords();
}

function displaySavedWords() {
  savedWords.innerHTML = '<h2>Saved Words</h2>';
  if (savedWordsData.length === 0) {
    savedWords.innerHTML += '<p>No saved words</p>';
  } else {
    savedWordsData.forEach((savedWord, index) => {
      const wordDiv = document.createElement('div');
      wordDiv.innerHTML = `
        <p><strong>${savedWord.word}</strong>: ${savedWord.definition}</p>
        <button class="remove-btn">Remove</button>
      `;
      const removeBtn = wordDiv.querySelector('.remove-btn');
      removeBtn.addEventListener('click', () => removeSavedWord(index));
      savedWords.appendChild(wordDiv);
    });
  }
}

searchBtn.addEventListener('click', () => {
  const word = wordInput.value.trim();
  if (word) {
    fetchWordDefinition(word);
    wordInput.value = '';
  }
});

toggleSavedWords.addEventListener('click', () => {
  savedWords.classList.toggle('show');
  toggleSavedWords.textContent = savedWords.classList.contains('show') ? 'Hide Saved Words' : 'Show Saved Words';
  displaySavedWords();
});

displaySavedWords();