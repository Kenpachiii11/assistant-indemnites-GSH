// DOM Elements
const searchInput = document.getElementById('searchInput');
const searchBtn = document.getElementById('searchBtn');
const resultDiv = document.getElementById('result');
const pdfViewer = document.getElementById('pdfViewer');
const togglePdfBtn = document.getElementById('togglePdfBtn');

// Global variable to store indemnities
let indemnities = [];

// Fetch indemnities from the JSON file
async function fetchIndemnities() {
  try {
    const response = await fetch('data.json');
    if (!response.ok) {
      throw new Error('Failed to load indemnities data');
    }
    indemnities = await response.json();
    displayAllIndemnities();
  } catch (error) {
    console.error(error);
    resultDiv.innerHTML = `
      <div class="no-results">
        <p>Erreur lors du chargement des données des indemnités.</p>
      </div>
    `;
  }
}

// Normalize text for searching (remove accents and make lowercase)
function normalizeText(text) {
  return text
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "");
}

// Search function with improved matching
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
      item.name,
      ...(item.abbreviations || []),
      ...(item.keywords || []),
      item.definition,
      item.reason
    ].join(' '));

    return queryWords.every(word => searchText.includes(word));
  });

  if (results.length > 0) {
    displayResults(results);
  } else {
    showNoResults(query);
  }
}

// Display all indemnities initially
function displayAllIndemnities() {
  if (indemnities && Array.isArray(indemnities)) {
    displayResults(indemnities);
  } else {
    resultDiv.innerHTML = `
      <div class="no-results">
        <p>Les données des indemnités ne sont pas disponibles.</p>
      </div>
    `;
  }
}

// Updated display results with exoneration reason display
function displayResults(results) {
  resultDiv.innerHTML = results.map(item => `
    <div class="indemnity-card">
      <h3>${item.name} ${item.abbreviations ? `(${item.abbreviations.join(', ')})` : ''}</h3>
      <p class="definition">${item.definition}</p>
      
      <div class="property-line">
        <strong>Cotisable:</strong> 
        <span class="cotisable-${item.cotisable.toLowerCase()}">${item.cotisable}</span>
      </div>
      
      <div class="property-line">
        <strong>Imposable:</strong> 
        <span class="imposable-${item.imposable.toLowerCase()}">${item.imposable}</span>
      </div>
      
      <div class="reference">${item.reason}</div>
      
      ${item.exoneration_reason ? `
        <div class="exoneration-reason">${item.exoneration_reason}</div>
      ` : ''}
      
      <div class="keywords">
        ${item.keywords.map(kw => `<span class="keyword-tag">${kw}</span>`).join('')}
      </div>
    </div>
  `).join('');
}

function showNoResults(query) {
  resultDiv.innerHTML = `
    <div class="no-results">
      <p>Aucun résultat trouvé pour "${query}"</p>
      <p>Essayez avec un terme différent ou plus général.</p>
    </div>
  `;
}

function showPdfPage(pageNum) {
  pdfViewer.src = `./assets/code-travail.pdf#page=${pageNum}`;
  if (pdfViewer.style.display === 'none') {
    pdfViewer.style.display = 'block';
  }
}

function togglePdfViewer() {
  pdfViewer.style.display = pdfViewer.style.display === 'none' ? 'block' : 'none';
  togglePdfBtn.textContent = pdfViewer.style.display === 'none' ? 
    'Afficher PDF' : 'Masquer PDF';
}

// Quiz Modal functionality
const quizBtn = document.createElement('button');
quizBtn.className = 'quiz-btn';
quizBtn.innerHTML = 'Quiz';
quizBtn.title = 'Testez vos connaissances sur les indemnités';
document.body.appendChild(quizBtn);

const quizModal = document.getElementById('quizModal');
const closeModal = document.querySelector('.close-modal');

quizBtn.addEventListener('click', () => {
  quizModal.classList.add('show');
  document.body.style.overflow = 'hidden';
});

closeModal.addEventListener('click', () => {
  quizModal.classList.remove('show');
  document.body.style.overflow = '';
});

// Close modal when clicking outside
quizModal.addEventListener('click', (e) => {
  if (e.target === quizModal) {
    quizModal.classList.remove('show');
    document.body.style.overflow = '';
  }
});

// Event listeners
searchBtn.addEventListener('click', searchIndemnity);
searchInput.addEventListener('keypress', (e) => {
  if (e.key === 'Enter') searchIndemnity();
});
togglePdfBtn.addEventListener('click', togglePdfViewer);

// Initialize
document.addEventListener('DOMContentLoaded', fetchIndemnities);