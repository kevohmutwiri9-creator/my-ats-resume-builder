/**
 * Advanced Export Formats
 * Export resume to DOCX, RTF, HTML, Markdown, and JSON formats
 */

const ExportFormats = (() => {
  /**
   * Export to HTML format
   */
  function exportHTML(resumeData, templateName = 'default') {
    const html = `
      <!DOCTYPE html>
      <html lang="en">
      <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>${resumeData.fullName || 'Resume'}</title>
        <style>
          body {
            font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
            max-width: 900px;
            margin: 0 auto;
            padding: 20px;
            line-height: 1.6;
            color: #333;
          }
          .header { text-align: center; margin-bottom: 30px; }
          .name { font-size: 28px; font-weight: bold; margin: 0; }
          .contact { font-size: 12px; color: #666; margin: 5px 0; }
          .section { margin-bottom: 25px; }
          .section-title {
            font-size: 14px;
            font-weight: bold;
            text-transform: uppercase;
            border-bottom: 2px solid #333;
            padding-bottom: 5px;
            margin-bottom: 10px;
          }
          .entry { margin-bottom: 15px; }
          .entry-title { font-weight: bold; }
          .entry-subtitle { font-style: italic; color: #666; }
          .entry-description { margin-top: 5px; }
          .skills { display: flex; flex-wrap: wrap; gap: 10px; }
          .skill-tag {
            background: #f0f0f0;
            padding: 5px 10px;
            border-radius: 15px;
            font-size: 12px;
          }
        </style>
      </head>
      <body>
        <div class="header">
          <h1 class="name">${escapeHtml(resumeData.fullName || '')}</h1>
          <div class="contact">
            ${resumeData.email ? `${escapeHtml(resumeData.email)} | ` : ''}
            ${resumeData.phone ? `${escapeHtml(resumeData.phone)} | ` : ''}
            ${resumeData.location ? escapeHtml(resumeData.location) : ''}
          </div>
        </div>

        ${resumeData.summary ? `
          <div class="section">
            <div class="section-title">Summary</div>
            <p>${escapeHtml(resumeData.summary)}</p>
          </div>
        ` : ''}

        ${resumeData.experience && resumeData.experience.length ? `
          <div class="section">
            <div class="section-title">Experience</div>
            ${resumeData.experience.map(exp => `
              <div class="entry">
                <div class="entry-title">${escapeHtml(exp.position || '')}</div>
                <div class="entry-subtitle">${escapeHtml(exp.company || '')} | ${escapeHtml(exp.startDate || '')} - ${escapeHtml(exp.endDate || '')}</div>
                <div class="entry-description">${escapeHtml(exp.description || '')}</div>
              </div>
            `).join('')}
          </div>
        ` : ''}

        ${resumeData.education && resumeData.education.length ? `
          <div class="section">
            <div class="section-title">Education</div>
            ${resumeData.education.map(edu => `
              <div class="entry">
                <div class="entry-title">${escapeHtml(edu.field || '')}</div>
                <div class="entry-subtitle">${escapeHtml(edu.school || '')}</div>
                <div class="entry-description">${escapeHtml(edu.details || '')}</div>
              </div>
            `).join('')}
          </div>
        ` : ''}

        ${resumeData.skills && resumeData.skills.length ? `
          <div class="section">
            <div class="section-title">Skills</div>
            <div class="skills">
              ${resumeData.skills.map(skill => `
                <span class="skill-tag">${escapeHtml(skill.name || '')}</span>
              `).join('')}
            </div>
          </div>
        ` : ''}
      </body>
      </html>
    `;

    return html;
  }

  /**
   * Export to Markdown format
   */
  function exportMarkdown(resumeData) {
    let md = `# ${resumeData.fullName || 'Resume'}\n\n`;

    md += `${resumeData.email || ''} | ${resumeData.phone || ''} | ${resumeData.location || ''}\n\n`;

    if (resumeData.summary) {
      md += `## Summary\n${resumeData.summary}\n\n`;
    }

    if (resumeData.experience && resumeData.experience.length) {
      md += `## Experience\n`;
      resumeData.experience.forEach(exp => {
        md += `### ${exp.position || ''}\n`;
        md += `**${exp.company || ''}** | ${exp.startDate || ''} - ${exp.endDate || ''}\n\n`;
        md += `${exp.description || ''}\n\n`;
      });
    }

    if (resumeData.education && resumeData.education.length) {
      md += `## Education\n`;
      resumeData.education.forEach(edu => {
        md += `### ${edu.field || ''}\n`;
        md += `**${edu.school || ''}**\n`;
        md += `${edu.details || ''}\n\n`;
      });
    }

    if (resumeData.skills && resumeData.skills.length) {
      md += `## Skills\n`;
      md += resumeData.skills.map(s => `- ${s.name}`).join('\n') + '\n';
    }

    return md;
  }

  /**
   * Export to JSON format (for backup/import)
   */
  function exportJSON(resumeData) {
    return JSON.stringify(resumeData, null, 2);
  }

  /**
   * Export to RTF format (basic)
   */
  function exportRTF(resumeData) {
    let rtf = `{\\rtf1\\ansi\\ansicpg1252
{\\fonttbl{\\f0\\fswiss Helvetica;}}
{\\colortbl;\\red255\\green0\\blue0;}
\\margl1440\\margr1440\\vieww10800\\viewh8400\\viewkind0
\\pard\\tx720\\tx1440\\tx2160\\tx2880\\tx3600\\tx4320\\tx5040\\tx5760\\tx6480\\tx7200\\tx7920\\tx8640\\pardirnatural\\partightenfactor100

\\f0\\fs24 \\cf0 `;

    rtf += `${resumeData.fullName || 'Resume'}\\par\n`;
    rtf += `${resumeData.email || ''} | ${resumeData.phone || ''} | ${resumeData.location || ''}\\par\\par\n`;

    if (resumeData.summary) {
      rtf += `\\b Summary\\b0\\par\n${resumeData.summary}\\par\\par\n`;
    }

    if (resumeData.experience && resumeData.experience.length) {
      rtf += `\\b Experience\\b0\\par\n`;
      resumeData.experience.forEach(exp => {
        rtf += `${exp.position || ''} at ${exp.company || ''} (${exp.startDate || ''} - ${exp.endDate || ''})\\par\n`;
        rtf += `${exp.description || ''}\\par\\par\n`;
      });
    }

    rtf += `}`;
    return rtf;
  }

  /**
   * Download file
   */
  function downloadFile(content, filename, mimeType = 'text/plain') {
    const blob = new Blob([content], { type: mimeType });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    window.URL.revokeObjectURL(url);
  }

  /**
   * Create export menu
   */
  function createExportMenu() {
    const exportBtn = document.getElementById('exportPdfBtn');
    if (!exportBtn) return;

    const menu = document.createElement('div');
    menu.id = 'export-menu';
    menu.className = 'export-menu dropdown';
    menu.innerHTML = `
      <button class="btn btn-ghost dropdown-toggle" id="export-menu-toggle" title="More export options">
        ⬇ More
      </button>
      <div class="dropdown-content">
        <button class="export-option" data-format="html">
          📄 Export as HTML
        </button>
        <button class="export-option" data-format="markdown">
          📝 Export as Markdown
        </button>
        <button class="export-option" data-format="rtf">
          📋 Export as RTF
        </button>
        <button class="export-option" data-format="json">
          🗄️ Export as JSON
        </button>
      </div>
    `;

    exportBtn.parentElement.appendChild(menu);

    // Toggle dropdown
    document.getElementById('export-menu-toggle').addEventListener('click', (e) => {
      e.stopPropagation();
      menu.classList.toggle('active');
    });

    // Handle export options
    menu.querySelectorAll('.export-option').forEach(btn => {
      btn.addEventListener('click', (e) => {
        e.stopPropagation();
        const format = btn.dataset.format;
        handleExport(format);
        menu.classList.remove('active');
      });
    });

    // Close menu on click outside
    document.addEventListener('click', () => {
      menu.classList.remove('active');
    });
  }

  /**
   * Handle export action
   */
  function handleExport(format) {
    const resumeData = window.getResumeData ? window.getResumeData() : {};
    const fileName = (resumeData.fullName || 'resume').replace(/\s+/g, '-');

    Utils.showLoading(`Exporting to ${format.toUpperCase()}...`);

    setTimeout(() => {
      try {
        let content, filename, mimeType;

        switch (format) {
          case 'html':
            content = exportHTML(resumeData);
            filename = `${fileName}.html`;
            mimeType = 'text/html';
            break;
          case 'markdown':
            content = exportMarkdown(resumeData);
            filename = `${fileName}.md`;
            mimeType = 'text/markdown';
            break;
          case 'rtf':
            content = exportRTF(resumeData);
            filename = `${fileName}.rtf`;
            mimeType = 'application/rtf';
            break;
          case 'json':
            content = exportJSON(resumeData);
            filename = `${fileName}.json`;
            mimeType = 'application/json';
            break;
          default:
            throw new Error('Unknown format');
        }

        downloadFile(content, filename, mimeType);
        Utils.hideLoading();
        Utils.showSuccess(`✓ Exported as ${format.toUpperCase()}`);
      } catch (error) {
        Utils.hideLoading();
        Utils.showError(`Failed to export: ${error.message}`);
      }
    }, 500);
  }

  /**
   * Initialize export formats
   */
  function init() {
    if (document.readyState === 'loading') {
      document.addEventListener('DOMContentLoaded', createExportMenu);
    } else {
      createExportMenu();
    }

    console.log('✓ Export Formats initialized');
  }

  return {
    init,
    exportHTML,
    exportMarkdown,
    exportJSON,
    exportRTF,
    downloadFile
  };
})();

function escapeHtml(text) {
  const map = {
    '&': '&amp;',
    '<': '&lt;',
    '>': '&gt;',
    '"': '&quot;',
    "'": '&#039;'
  };
  return text.replace(/[&<>"']/g, m => map[m]);
}

// Auto-initialize
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', ExportFormats.init);
} else {
  ExportFormats.init();
}
