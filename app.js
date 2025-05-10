let indemnities = [];
let currentLanguage = 'fr';

const searchInput = document.getElementById('searchInput');
const searchBtn = document.getElementById('searchBtn');
const resultDiv = document.getElementById('result');
const pdfViewer = document.getElementById('pdfViewer');
const togglePdfBtn = document.getElementById('togglePdfBtn');
const quizBtn = document.getElementById('quizBtn');
const quizModal = document.getElementById('quizModal');
const closeModal = document.querySelector('.close-modal');
const quizIframe = document.getElementById('quizIframe');

function getTranslatedField(obj, field) {
  if (!obj) return '';
  if (typeof obj[field] === 'object' && obj[field] !== null) {
    return obj[field][currentLanguage] || obj[field]['fr'] || '';
  }
  return obj[field];
}

async function fetchIndemnities() {
  try {
    const response = await fetch(`data/${currentLanguage}.json`);
    if (!response.ok) throw new Error('Failed to load data');
    indemnities = await response.json();
    displayAllIndemnities();
  } catch (error) {
    console.error('Error loading data:', error);
    resultDiv.innerHTML = `<div class="no-results"><p>${translations[currentLanguage]['data-error']}</p></div>`;
  }
}

function normalizeText(text) {
  return text.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "");
}

function searchIndemnity() {
  const query = searchInput.value.trim();
  resultDiv.innerHTML = '';

  if (!query) {
    displayAllIndemnities();
    return;
  }

  const normalizedQuery = normalizeText(query);
  const queryWords = normalizedQuery.split(/\s+/).filter(word => word.length > 0);

  const results = indemnities.filter(item => {
    const searchText = normalizeText([
      getTranslatedField(item, 'name'),
      ...(item.abbreviations || []),
      ...(getTranslatedField(item, 'keywords') || []),
      getTranslatedField(item, 'definition'),
      getTranslatedField(item, 'reason')
    ].join(' '));

    return queryWords.every(word => searchText.includes(word));
  });

  if (results.length > 0) {
    displayResults(results);
  } else {
    showNoResults(query);
  }
}

function displayResults(results) {
  resultDiv.innerHTML = results.map(item => `
    <div class="indemnity-card">
      <h3>${getTranslatedField(item, 'name')} ${item.abbreviations ? `(${item.abbreviations.join(', ')})` : ''}</h3>
      <p class="definition">${getTranslatedField(item, 'definition')}</p>
      <div class="property-line">
        <strong>${translations[currentLanguage]['cotisable']}:</strong> 
        <span class="cotisable-${item.cotisable.toLowerCase()}">${item.cotisable}</span>
      </div>
      <div class="property-line">
        <strong>${translations[currentLanguage]['imposable']}:</strong> 
        <span class="imposable-${item.imposable.toLowerCase()}">${item.imposable}</span>
      </div>
      <div class="reference">${getTranslatedField(item, 'reason')}</div>
      ${item.exoneration_reason ? `
        <div class="exoneration-reason">${getTranslatedField(item, 'exoneration_reason')}</div>
      ` : ''}
      <div class="keywords">
        ${(getTranslatedField(item, 'keywords') || []).map(kw => 
          `<span class="keyword-tag">${kw}</span>`
        ).join('')}
      </div>
    </div>
  `).join('');
}

function displayAllIndemnities() {
  if (indemnities && Array.isArray(indemnities)) {
    displayResults(indemnities);
  } else {
    resultDiv.innerHTML = `<div class="no-results"><p>${translations[currentLanguage]['no-data']}</p></div>`;
  }
}

function showNoResults(query) {
  resultDiv.innerHTML = `
    <div class="no-results">
      <p>${translations[currentLanguage]['no-results']} "${query}"</p>
      <p>${translations[currentLanguage]['try-again']}</p>
    </div>
  `;
}

function togglePdfViewer() {
  pdfViewer.style.display = pdfViewer.style.display === 'none' ? 'block' : 'none';
  togglePdfBtn.textContent = pdfViewer.style.display === 'none' ? 
    translations[currentLanguage]['show-pdf'] : translations[currentLanguage]['hide-pdf'];
}

function openQuizModal() {
  quizModal.classList.add('show');
  document.body.style.overflow = 'hidden';
  quizIframe.src = `quiz.html?lang=${currentLanguage}`;
}

function closeQuizModal() {
  quizModal.classList.remove('show');
  document.body.style.overflow = '';
}

searchBtn.addEventListener('click', searchIndemnity);
searchInput.addEventListener('keypress', (e) => {
  if (e.key === 'Enter') searchIndemnity();
});
togglePdfBtn.addEventListener('click', togglePdfViewer);
quizBtn.addEventListener('click', openQuizModal);
closeModal.addEventListener('click', closeQuizModal);
quizModal.addEventListener('click', (e) => {
  if (e.target === quizModal) closeQuizModal();
});

document.addEventListener('DOMContentLoaded', () => {
  fetchIndemnities();
});