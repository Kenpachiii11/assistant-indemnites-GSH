const translations = {
  fr: {
    "main-title": "🇩🇿 Assistant des Indemnités",
    "subtitle": "Référence: Code du Travail Algérien (Loi 90-11)",
    "search-placeholder": "Rechercher une indemnité...",
    "search-btn": "Rechercher",
    "no-results": "Aucun résultat trouvé",
    "try-again": "Essayez avec un terme différent",
    "toggle-pdf": "Afficher/Masquer PDF",
    "show-pdf": "Afficher PDF",
    "hide-pdf": "Masquer PDF",
    "pdf-reference": "Décret 96-208 Art. 2",
    "quiz-btn": "Quiz",
    "cotisable": "Cotisable",
    "imposable": "Imposable",
    "no-data": "Les données des indemnités ne sont pas disponibles.",
    "data-error": "Erreur lors du chargement des données"
  },
  ar: {
    "main-title": "🇩🇿 مساعد التعويضات",
    "subtitle": "مرجع: قانون العمل الجزائري (القانون 90-11)",
    "search-placeholder": "ابحث عن تعويض...",
    "search-btn": "بحث",
    "no-results": "لا توجد نتائج",
    "try-again": "حاول بمصطلح آخر",
    "toggle-pdf": "عرض/إخفاء PDF",
    "show-pdf": "عرض PDF",
    "hide-pdf": "إخفاء PDF",
    "pdf-reference": "المرسوم 96-208 المادة 2",
    "quiz-btn": "اختبار",
    "cotisable": "قابل للاشتراك",
    "imposable": "خاضع للضريبة",
    "no-data": "البيانات غير متوفرة حالياً",
    "data-error": "حدث خطأ أثناء تحميل البيانات"
  },
  en: {
    "main-title": "🇩🇿 Algerian Allowances Assistant",
    "subtitle": "Reference: Algerian Labor Code (Law 90-11)",
    "search-placeholder": "Search for an allowance...",
    "search-btn": "Search",
    "no-results": "No results found",
    "try-again": "Try a different term",
    "toggle-pdf": "Show/Hide PDF",
    "show-pdf": "Show PDF",
    "hide-pdf": "Hide PDF",
    "pdf-reference": "Decree 96-208 Art. 2",
    "quiz-btn": "Quiz",
    "cotisable": "Contributory",
    "imposable": "Taxable",
    "no-data": "Allowance data is not available",
    "data-error": "Error loading data"
  }
};

function initLanguage() {
  currentLanguage = localStorage.getItem('language') || 'fr';
  updateLanguage();
  
  document.querySelectorAll('.lang-btn').forEach(btn => {
    btn.addEventListener('click', function() {
      currentLanguage = this.dataset.lang;
      localStorage.setItem('language', currentLanguage);
      updateLanguage();
      updateUIForLanguage();
      fetchIndemnities();
    });
  });
}

function updateLanguage() {
  const langData = translations[currentLanguage];
  
  document.getElementById('main-title').textContent = langData['main-title'];
  document.getElementById('subtitle').textContent = langData['subtitle'];
  document.getElementById('searchInput').placeholder = langData['search-placeholder'];
  document.getElementById('searchBtn').textContent = langData['search-btn'];
  document.getElementById('togglePdfBtn').textContent = langData['toggle-pdf'];
  document.getElementById('pdfRef').textContent = langData['pdf-reference'];
  document.getElementById('quizBtn').textContent = langData['quiz-btn'];
  
  document.querySelectorAll('.lang-btn').forEach(btn => {
    btn.classList.toggle('active', btn.dataset.lang === currentLanguage);
  });
}

function updateUIForLanguage() {
  if (currentLanguage === 'ar') {
    document.body.classList.add('rtl');
    document.body.dir = 'rtl';
    document.querySelector('html').lang = 'ar';
  } else {
    document.body.classList.remove('rtl');
    document.body.dir = 'ltr';
    document.querySelector('html').lang = currentLanguage;
  }
}

document.addEventListener('DOMContentLoaded', initLanguage);