// Internationalization (i18n) System
window.I18n = {
  currentLanguage: 'en',
  translations: {
    en: {
      // Navigation
      'nav.resume': 'Resume',
      'nav.cover_letter': 'Cover Letter',
      'nav.ats_checker': 'ATS Checker',
      'nav.guides': 'Guides',
      'nav.templates': 'Templates',
      'nav.about': 'About',
      'nav.privacy': 'Privacy',
      'nav.terms': 'Terms',
      
      // Builder
      'builder.title': 'Resume Builder',
      'builder.subtitle': 'Autosave is on. Export as PDF anytime.',
      'builder.export_pdf': 'Export PDF',
      'builder.reset': 'Reset',
      'builder.ai_assist': 'AI Assist',
      'builder.template': 'Resume Template',
      'builder.full_name': 'Full name',
      'builder.headline': 'Headline',
      'builder.email': 'Email',
      'builder.phone': 'Phone',
      'builder.location': 'Location',
      'builder.summary': 'Summary',
      'builder.experience': 'Experience',
      'builder.education': 'Education',
      'builder.skills': 'Skills',
      'builder.add_experience': 'Add Experience',
      'builder.add_education': 'Add Education',
      'builder.add_skill': 'Add Skill',
      'builder.import_resume': 'Import Resume',
      
      // Templates
      'template.clean': 'Clean (Default)',
      'template.clean_desc': 'Single column, plain headings, consistent spacing. Best for ATS parsing.',
      'template.modern': 'Modern',
      'template.modern_desc': 'Contemporary design with gradient headers and card-based layout.',
      'template.executive': 'Executive',
      'template.executive_desc': 'Professional design with classic typography and formal styling.',
      'template.creative': 'Creative',
      'template.creative_desc': 'Vibrant design with colorful elements and modern typography.',
      
      // AI Assistant
      'ai.title': 'AI Assistant',
      'ai.improve_summary': 'Improve Summary',
      'ai.strengthen_bullets': 'Strengthen Bullet Points',
      'ai.suggest_skills': 'Suggest Skills',
      'ai.tailor_to_job': 'Tailor to Job',
      'ai.market_insights': 'Market Insights',
      'ai.target_job': 'Target Job Description',
      'ai.processing': 'Processing...',
      'ai.apply_this': 'Apply This',
      
      // Import
      'import.title': 'Import Resume',
      'import.pdf': 'PDF Resume',
      'import.pdf_desc': 'Upload a PDF resume to extract text and populate fields',
      'import.choose_pdf': 'Choose PDF File',
      'import.linkedin': 'LinkedIn Profile',
      'import.linkedin_desc': 'Import from LinkedIn URL (requires manual data entry)',
      'import.paste_text': 'Paste Resume Text',
      'import.paste_desc': 'Copy and paste your existing resume text',
      'import.parse_text': 'Parse Text',
      'import.results': 'Import Results',
      'import.apply': 'Apply Import',
      'import.cancel': 'Cancel',
      
      // Common
      'common.save': 'Save',
      'common.saved': 'Saved',
      'common.saving': 'Saving...',
      'common.error': 'Error',
      'common.success': 'Success',
      'common.loading': 'Loading...',
      'common.cancel': 'Cancel',
      'common.ok': 'OK',
      'common.yes': 'Yes',
      'common.no': 'No',
      'common.close': 'Close',
      'common.edit': 'Edit',
      'common.delete': 'Delete',
      'common.add': 'Add',
      'common.remove': 'Remove',
      
      // Messages
      'msg.resume_imported': 'Resume imported successfully! Please review and edit as needed.',
      'msg.template_switched': 'Switched to {template} template',
      'msg.reset_confirm': 'Reset all fields? This clears your local autosave.',
      'msg.pdf_export_initiated': 'PDF export initiated. Use your browser\'s print dialog to save as PDF.',
      'msg.export_failed': 'Failed to export PDF. Please try again.',
    },
    
    es: {
      // Navigation
      'nav.resume': 'Currículum',
      'nav.cover_letter': 'Carta de Presentación',
      'nav.ats_checker': 'Verificador ATS',
      'nav.guides': 'Guías',
      'nav.templates': 'Plantillas',
      'nav.about': 'Acerca de',
      'nav.privacy': 'Privacidad',
      'nav.terms': 'Términos',
      
      // Builder
      'builder.title': 'Constructor de Currículum',
      'builder.subtitle': 'Guardado automático activado. Exportar como PDF en cualquier momento.',
      'builder.export_pdf': 'Exportar PDF',
      'builder.reset': 'Reiniciar',
      'builder.ai_assist': 'Asistencia IA',
      'builder.template': 'Plantilla de Currículum',
      'builder.full_name': 'Nombre completo',
      'builder.headline': 'Título',
      'builder.email': 'Correo electrónico',
      'builder.phone': 'Teléfono',
      'builder.location': 'Ubicación',
      'builder.summary': 'Resumen',
      'builder.experience': 'Experiencia',
      'builder.education': 'Educación',
      'builder.skills': 'Habilidades',
      'builder.add_experience': 'Agregar Experiencia',
      'builder.add_education': 'Agregar Educación',
      'builder.add_skill': 'Agregar Habilidad',
      'builder.import_resume': 'Importar Currículum',
      
      // Templates
      'template.clean': 'Limpio (Predeterminado)',
      'template.clean_desc': 'Una sola columna, encabezados simples, espaciado consistente. Mejor para análisis ATS.',
      'template.modern': 'Moderno',
      'template.modern_desc': 'Diseño contemporáneo con encabezados degradados y diseño basado en tarjetas.',
      'template.executive': 'Ejecutivo',
      'template.executive_desc': 'Diseño profesional con tipografía clásica y estilo formal.',
      'template.creative': 'Creativo',
      'template.creative_desc': 'Diseño vibrante con elementos coloridos y tipografía moderna.',
      
      // AI Assistant
      'ai.title': 'Asistente IA',
      'ai.improve_summary': 'Mejorar Resumen',
      'ai.strengthen_bullets': 'Fortalecer Puntos de Viñeta',
      'ai.suggest_skills': 'Sugerir Habilidades',
      'ai.tailor_to_job': 'Adaptar al Trabajo',
      'ai.market_insights': 'Perspectivas del Mercado',
      'ai.target_job': 'Descripción del Trabajo Objetivo',
      'ai.processing': 'Procesando...',
      'ai.apply_this': 'Aplicar Esto',
      
      // Common
      'common.save': 'Guardar',
      'common.saved': 'Guardado',
      'common.saving': 'Guardando...',
      'common.error': 'Error',
      'common.success': 'Éxito',
      'common.loading': 'Cargando...',
      'common.cancel': 'Cancelar',
      'common.ok': 'OK',
      'common.yes': 'Sí',
      'common.no': 'No',
      'common.close': 'Cerrar',
      'common.edit': 'Editar',
      'common.delete': 'Eliminar',
      'common.add': 'Agregar',
      'common.remove': 'Quitar',
      
      // Messages
      'msg.resume_imported': '¡Currículum importado exitosamente! Por favor revise y edite según sea necesario.',
      'msg.template_switched': 'Cambiado a plantilla {template}',
      'msg.reset_confirm': '¿Reiniciar todos los campos? Esto borrará su guardado automático local.',
      'msg.pdf_export_initiated': 'Exportación de PDF iniciada. Use el diálogo de impresión de su navegador para guardar como PDF.',
      'msg.export_failed': 'Falló la exportación de PDF. Por favor intente nuevamente.',
    },
    
    fr: {
      // Navigation
      'nav.resume': 'CV',
      'nav.cover_letter': 'Lettre de Motivation',
      'nav.ats_checker': 'Vérificateur ATS',
      'nav.guides': 'Guides',
      'nav.templates': 'Modèles',
      'nav.about': 'À propos',
      'nav.privacy': 'Confidentialité',
      'nav.terms': 'Conditions',
      
      // Builder
      'builder.title': 'Constructeur de CV',
      'builder.subtitle': 'Sauvegarde automatique activée. Exporter en PDF à tout moment.',
      'builder.export_pdf': 'Exporter PDF',
      'builder.reset': 'Réinitialiser',
      'builder.ai_assist': 'Assistance IA',
      'builder.template': 'Modèle de CV',
      'builder.full_name': 'Nom complet',
      'builder.headline': 'Titre',
      'builder.email': 'Email',
      'builder.phone': 'Téléphone',
      'builder.location': 'Localisation',
      'builder.summary': 'Résumé',
      'builder.experience': 'Expérience',
      'builder.education': 'Éducation',
      'builder.skills': 'Compétences',
      'builder.add_experience': 'Ajouter Expérience',
      'builder.add_education': 'Ajouter Éducation',
      'builder.add_skill': 'Ajouter Compétence',
      'builder.import_resume': 'Importer CV',
      
      // Templates
      'template.clean': 'Propre (Défaut)',
      'template.clean_desc': 'Colonne unique, en-têtes simples, espacement cohérent. Idéal pour l\'analyse ATS.',
      'template.modern': 'Moderne',
      'template.modern_desc': 'Design contemporain avec en-têtes dégradés et mise en page basée sur des cartes.',
      'template.executive': 'Exécutif',
      'template.executive_desc': 'Design professionnel avec typographie classique et style formel.',
      'template.creative': 'Créatif',
      'template.creative_desc': 'Design vibrant avec éléments colorés et typographie moderne.',
      
      // Common
      'common.save': 'Enregistrer',
      'common.saved': 'Enregistré',
      'common.saving': 'Enregistrement...',
      'common.error': 'Erreur',
      'common.success': 'Succès',
      'common.loading': 'Chargement...',
      'common.cancel': 'Annuler',
      'common.ok': 'OK',
      'common.yes': 'Oui',
      'common.no': 'Non',
      'common.close': 'Fermer',
      'common.edit': 'Modifier',
      'common.delete': 'Supprimer',
      'common.add': 'Ajouter',
      'common.remove': 'Retirer',
      
      // Messages
      'msg.resume_imported': 'CV importé avec succès! Veuillez vérifier et modifier selon les besoins.',
      'msg.template_switched': 'Changé vers le modèle {template}',
      'msg.reset_confirm': 'Réinitialiser tous les champs? Cela effacera votre sauvegarde automatique locale.',
      'msg.pdf_export_initiated': 'Export PDF initié. Utilisez la boîte de dialogue d\'impression de votre navigateur pour enregistrer en PDF.',
      'msg.export_failed': 'Échec de l\'exportation PDF. Veuillez réessayer.',
    },
    
    de: {
      // Navigation
      'nav.resume': 'Lebenslauf',
      'nav.cover_letter': 'Anschreiben',
      'nav.ats_checker': 'ATS-Prüfer',
      'nav.guides': 'Leitfäden',
      'nav.templates': 'Vorlagen',
      'nav.about': 'Über',
      'nav.privacy': 'Datenschutz',
      'nav.terms': 'Bedingungen',
      
      // Builder
      'builder.title': 'Lebenslauf-Generator',
      'builder.subtitle': 'Automatisches Speichern aktiviert. Jederzeit als PDF exportieren.',
      'builder.export_pdf': 'PDF Exportieren',
      'builder.reset': 'Zurücksetzen',
      'builder.ai_assist': 'KI-Assistenz',
      'builder.template': 'Lebenslauf-Vorlage',
      'builder.full_name': 'Vollständiger Name',
      'builder.headline': 'Überschrift',
      'builder.email': 'E-Mail',
      'builder.phone': 'Telefon',
      'builder.location': 'Standort',
      'builder.summary': 'Zusammenfassung',
      'builder.experience': 'Erfahrung',
      'builder.education': 'Ausbildung',
      'builder.skills': 'Fähigkeiten',
      'builder.add_experience': 'Erfahrung Hinzufügen',
      'builder.add_education': 'Ausbildung Hinzufügen',
      'builder.add_skill': 'Fähigkeit Hinzufügen',
      'builder.import_resume': 'Lebenslauf Importieren',
      
      // Common
      'common.save': 'Speichern',
      'common.saved': 'Gespeichert',
      'common.saving': 'Speichern...',
      'common.error': 'Fehler',
      'common.success': 'Erfolg',
      'common.loading': 'Laden...',
      'common.cancel': 'Abbrechen',
      'common.ok': 'OK',
      'common.yes': 'Ja',
      'common.no': 'Nein',
      'common.close': 'Schließen',
      'common.edit': 'Bearbeiten',
      'common.delete': 'Löschen',
      'common.add': 'Hinzufügen',
      'common.remove': 'Entfernen',
      
      // Messages
      'msg.resume_imported': 'Lebenslauf erfolgreich importiert! Bitte überprüfen und bei Bedarf bearbeiten.',
      'msg.template_switched': 'Zu Vorlage {template} gewechselt',
      'msg.reset_confirm': 'Alle Felder zurücksetzen? Dies löscht Ihre lokale automatische Speicherung.',
      'msg.pdf_export_initiated': 'PDF-Export gestartet. Verwenden Sie den Druckdialog Ihres Browsers, um als PDF zu speichern.',
      'msg.export_failed': 'PDF-Export fehlgeschlagen. Bitte versuchen Sie es erneut.',
    }
  },

  // Initialize i18n
  init: function() {
    this.detectLanguage();
    this.applyLanguage();
    this.addLanguageSelector();
  },

  // Detect user's preferred language
  detectLanguage: function() {
    // Check localStorage first
    const savedLanguage = localStorage.getItem('preferredLanguage');
    if (savedLanguage && this.translations[savedLanguage]) {
      this.currentLanguage = savedLanguage;
      return;
    }

    // Check browser language
    const browserLang = navigator.language || navigator.userLanguage;
    const langCode = browserLang.split('-')[0]; // Get primary language code
    
    if (this.translations[langCode]) {
      this.currentLanguage = langCode;
    }
  },

  // Apply current language to the page
  applyLanguage: function() {
    this.translatePage();
    this.updateLanguageSelector();
    document.documentElement.lang = this.currentLanguage;
    
    // Track language change
    if (typeof Analytics !== 'undefined') {
      Analytics.trackEvent('language_change', {
        event_category: 'User Preferences',
        language: this.currentLanguage
      });
    }
  },

  // Translate all elements with data-i18n attribute
  translatePage: function() {
    const elements = document.querySelectorAll('[data-i18n]');
    elements.forEach(element => {
      const key = element.getAttribute('data-i18n');
      const translation = this.t(key);
      
      if (translation) {
        if (element.tagName === 'INPUT' && element.type === 'placeholder') {
          element.placeholder = translation;
        } else if (element.tagName === 'INPUT' && element.type === 'submit') {
          element.value = translation;
        } else {
          element.textContent = translation;
        }
      }
    });
  },

  // Get translation for a key
  t: function(key, params = {}) {
    const translation = this.translations[this.currentLanguage]?.[key] || 
                      this.translations['en'][key] || 
                      key;
    
    // Replace parameters in translation
    return this.replaceParams(translation, params);
  },

  // Replace parameters in translation string
  replaceParams: function(str, params) {
    return str.replace(/\{(\w+)\}/g, (match, key) => {
      return params[key] !== undefined ? params[key] : match;
    });
  },

  // Change language
  changeLanguage: function(langCode) {
    if (!this.translations[langCode]) {
      console.warn(`Language ${langCode} not supported`);
      return;
    }

    this.currentLanguage = langCode;
    localStorage.setItem('preferredLanguage', langCode);
    this.applyLanguage();
  },

  // Add language selector to navigation
  addLanguageSelector: function() {
    const nav = document.querySelector('.nav');
    if (!nav) return;

    const selector = document.createElement('select');
    selector.id = 'languageSelector';
    selector.className = 'language-selector';
    selector.innerHTML = `
      <option value="en">🇺🇸 English</option>
      <option value="es">🇪🇸 Español</option>
      <option value="fr">🇫🇷 Français</option>
      <option value="de">🇩🇪 Deutsch</option>
    `;
    
    selector.addEventListener('change', (e) => {
      this.changeLanguage(e.target.value);
    });

    nav.appendChild(selector);
  },

  // Update language selector to show current language
  updateLanguageSelector: function() {
    const selector = document.getElementById('languageSelector');
    if (selector) {
      selector.value = this.currentLanguage;
    }
  },

  // Get available languages
  getAvailableLanguages: function() {
    return Object.keys(this.translations).map(code => ({
      code: code,
      name: this.getLanguageName(code)
    }));
  },

  // Get language name in its native form
  getLanguageName: function(code) {
    const names = {
      'en': 'English',
      'es': 'Español',
      'fr': 'Français',
      'de': 'Deutsch'
    };
    return names[code] || code;
  }
};

// Initialize i18n when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
  I18n.init();
});
