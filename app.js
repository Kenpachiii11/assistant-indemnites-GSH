// DOM Elements
const searchInput = document.getElementById('searchInput');
const searchBtn = document.getElementById('searchBtn');
const resultDiv = document.getElementById('result');
const pdfViewer = document.getElementById('pdfViewer');
const togglePdfBtn = document.getElementById('togglePdfBtn');

// Global variable for indemnities data
let indemnities = [];

// Normalize text for searching (remove accents and make lowercase)
function normalizeText(text) {
  return text.toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "");
}

// Load data from JSON file
async function loadIndemnitiesData() {
  try {
    const response = await fetch('./data.json');
    if (!response.ok) {
      throw new Error('Failed to load data');
    }
    indemnities = await response.json();
    console.log('Data loaded successfully:', indemnities.length, 'items');
  } catch (error) {
    console.error('Error loading data:', error);
    resultDiv.innerHTML = `
      <div class="error">
        <p>Erreur de chargement des données. Veuillez réessayer plus tard.</p>
        <p>${error.message}</p>
      </div>
    `;
  }
}

// Search function with improved matching
function searchIndemnity() {
  const query = searchInput.value.trim();
  resultDiv.innerHTML = '';

  if (!query) {
    resultDiv.innerHTML = '<p class="error">Veuillez entrer un terme de recherche</p>';
    return;
  }

  // Normalize the query
  const normalizedQuery = normalizeText(query);
  const queryWords = normalizedQuery.split(/\s+/).filter(word => word.length > 0);

  const results = indemnities.filter(item => {
    // Combine all searchable text fields
    const searchText = normalizeText([
      item.name,
      ...(item.abbreviations || []),
      ...(item.keywords || []),
      item.definition,
      item.reason
    ].join(' '));

    // Check if all query words appear somewhere in the search text
    return queryWords.every(word => searchText.includes(word));
  });

  if (results.length > 0) {
    displayResults(results);
  } else {
    resultDiv.innerHTML = `
      <div class="no-results">
        <p>Aucun résultat trouvé pour "${query}"</p>
        <p>Essayez avec un terme différent ou plus général.</p>
      </div>
    `;
  }
}

// Enhanced display results with PDF linking
function displayResults(results) {
  resultDiv.innerHTML = results.map(item => `
    <div class="indemnity-card">
      <h3>${item.name} ${item.abbreviations ? `(${item.abbreviations.join(', ')})` : ''}</h3>
      <p class="definition"><strong>Définition:</strong> ${item.definition}</p>
      <span class="property-line"><strong>Cotisable:</strong> ${item.cotisable}</span>
      <span class="property-line"><strong>Imposable:</strong> ${item.imposable}</span>
      <p class="reference"><strong>Référence légale:</strong> ${item.reason}</p>
      ${item.pdfPage ? `<button class="show-pdf-btn" data-page="${item.pdfPage}">Voir dans le Code du Travail</button>` : ''}
    </div>
  `).join('');

  // Add event listeners to PDF buttons if they exist
  document.querySelectorAll('.show-pdf-btn').forEach(btn => {
    btn.addEventListener('click', (e) => {
      const pageNum = e.target.getAttribute('data-page');
      showPdfPage(pageNum);
    });
  });
}

// Show specific page in PDF viewer
function showPdfPage(pageNum) {
  pdfViewer.src = `./assets/code-travail.pdf#page=${pageNum}`;
  if (pdfViewer.style.display === 'none') {
    pdfViewer.style.display = 'block';
  }
}

// Toggle PDF viewer
function togglePdfViewer() {
  pdfViewer.style.display = pdfViewer.style.display === 'none' ? 'block' : 'none';
}

// Event listeners
searchBtn.addEventListener('click', searchIndemnity);
searchInput.addEventListener('keypress', (e) => {
  if (e.key === 'Enter') searchIndemnity();
});
togglePdfBtn.addEventListener('click', togglePdfViewer);

// Initialize
document.addEventListener('DOMContentLoaded', () => {
  loadIndemnitiesData();
  
  // Set PDF viewer to be hidden by default on mobile
  if (window.innerWidth <= 768) {
    pdfViewer.style.display = 'none';
  }
});