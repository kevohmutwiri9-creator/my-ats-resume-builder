/**
 * Simple Spell Checker
 * Basic spell checking and grammar suggestions for resume content
 */

const SpellChecker = (() => {
  // Common misspellings in resumes
  const MISSPELLINGS = {
    'recieve': 'receive',
    'occured': 'occurred',
    'necesary': 'necessary',
    'definate': 'definite',
    'concensus': 'consensus',
    'enviroment': 'environment',
    'imediately': 'immediately',
    'suceeded': 'succeeded',
    'untill': 'until',
    'begining': 'beginning',
    'wich': 'which',
    'accomodate': 'accommodate',
    'seperete': 'separate',
    'occassion': 'occasion',
    'principal': 'principle'
  };

  const GRAMMAR_ISSUES = [
    { pattern: /\bis\s+very\s+/gi, suggestion: 'Use more specific adjectives instead of "is very"' },
    { pattern: /\bactually\s/gi, suggestion: 'Remove "actually" - it weakens your point' },
    { pattern: /\bI\s+think\s+/gi, suggestion: 'Replace "I think" with confident statements' },
    { pattern: /\bkind\s+of\s+|sort\s+of\s+/gi, suggestion: 'Remove vague qualifiers' },
    { pattern: /\bMaybe\s+|Possibly\s+/gi, suggestion: 'Use confident language' },
    { pattern: /\.\.\./gi, suggestion: 'Replace ellipsis with proper punctuation' }
  ];

  /**
   * Check text for spelling
   */
  function checkSpelling(text) {
    const issues = [];
    const words = text.toLowerCase().split(/\s+/);

    words.forEach((word, index) => {
      // Remove punctuation for checking
      const cleanWord = word.replace(/[.,!?;:]/g, '');

      if (MISSPELLINGS[cleanWord]) {
        issues.push({
          type: 'spelling',
          word: cleanWord,
          suggestion: MISSPELLINGS[cleanWord],
          position: index
        });
      }
    });

    return issues;
  }

  /**
   * Check text for grammar
   */
  function checkGrammar(text) {
    const issues = [];

    GRAMMAR_ISSUES.forEach(rule => {
      if (rule.pattern.test(text)) {
        issues.push({
          type: 'grammar',
          suggestion: rule.suggestion,
          pattern: rule.pattern.source
        });
      }
    });

    return issues;
  }

  /**
   * Highlight errors in text
   */
  function highlightErrors(elementSelector) {
    const inputs = document.querySelectorAll(elementSelector || 'input, textarea');

    inputs.forEach(input => {
      input.addEventListener('blur', () => {
        const text = input.value;
        const spelling = checkSpelling(text);
        const grammar = checkGrammar(text);

        if (spelling.length | grammar.length) {
          showIssuesSidebar(text, spelling, grammar);
        }
      });
    });
  }

  /**
   * Show issues sidebar
   */
  function showIssuesSidebar(text, spelling, grammar) {
    let sidebar = document.getElementById('spell-check-sidebar');
    if (!sidebar) {
      sidebar = document.createElement('div');
      sidebar.id = 'spell-check-sidebar';
      sidebar.className = 'spell-check-sidebar';
      document.body.appendChild(sidebar);
    }

    let html = '<div class="spellcheck-issues"><h4>✎ Writing Suggestions</h4>';

    if (spelling.length > 0) {
      html += '<div class="issue-category"><h5>Spelling</h5>';
      spelling.forEach(issue => {
        html += `
          <div class="issue-item">
            <strong>${issue.word}</strong> → <em>${issue.suggestion}</em>
          </div>
        `;
      });
      html += '</div>';
    }

    if (grammar.length > 0) {
      html += '<div class="issue-category"><h5>Grammar</h5>';
      grammar.forEach(issue => {
        html += `
          <div class="issue-item">
            ${issue.suggestion}
          </div>
        `;
      });
      html += '</div>';
    }

    html += '</div>';
    sidebar.innerHTML = html;
    sidebar.style.display = 'block';

    // Hide after 5 seconds
    setTimeout(() => {
      sidebar.style.display = 'none';
    }, 5000);
  }

  /**
   * Spell-check on input
   */
  function setupRealTimeChecking() {
    const inputs = document.querySelectorAll('.panel input, .panel textarea');

    inputs.forEach(input => {
      input.addEventListener('input', (e) => {
        clearTimeout(input._checkTimeout);
        input._checkTimeout = setTimeout(() => {
          const text = input.value;
          const issues = checkSpelling(text);

          if (issues.length > 0 && !input.classList.contains('has-errors')) {
            input.classList.add('has-errors');
            showErrorIndicator(input, issues.length);
          } else if (issues.length === 0) {
            input.classList.remove('has-errors');
            clearErrorIndicator(input);
          }
        }, 500);
      });
    });
  }

  /**
   * Show error indicator
   */
  function showErrorIndicator(input, count) {
    let indicator = input._errorIndicator;
    if (!indicator) {
      indicator = document.createElement('span');
      indicator.className = 'error-indicator';
      indicator._errorIndicator = true;
      input.parentElement.appendChild(indicator);
      input._errorIndicator = indicator;
    }

    indicator.textContent = `⚠ ${count} issue${count !== 1 ? 's' : ''}`;
    indicator.title = 'Click to view suggestions';
    indicator.style.cursor = 'pointer';

    indicator.addEventListener('click', () => {
      const text = input.value;
      const spelling = checkSpelling(text);
      const grammar = checkGrammar(text);
      showIssuesSidebar(text, spelling, grammar);
    });
  }

  /**
   * Clear error indicator
   */
  function clearErrorIndicator(input) {
    if (input._errorIndicator) {
      input._errorIndicator.remove();
      input._errorIndicator = null;
    }
  }

  /**
   * Initialize spell checker
   */
  function init() {
    if (document.readyState === 'loading') {
      document.addEventListener('DOMContentLoaded', setupRealTimeChecking);
    } else {
      setupRealTimeChecking();
    }

    console.log('✓ Spell Checker initialized');
  }

  return {
    init,
    checkSpelling,
    checkGrammar
  };
})();

// Auto-initialize
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', SpellChecker.init);
} else {
  SpellChecker.init();
}
