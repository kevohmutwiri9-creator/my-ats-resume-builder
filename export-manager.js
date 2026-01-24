// Enhanced Export Manager - Multiple Formats
window.EXPORT_MANAGER = {
  formats: {
    pdf: {
      name: 'PDF',
      extension: '.pdf',
      mimeType: 'application/pdf',
      icon: '📄'
    },
    docx: {
      name: 'Word Document',
      extension: '.docx',
      mimeType: 'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
      icon: '📝'
    },
    txt: {
      name: 'Plain Text',
      extension: '.txt',
      mimeType: 'text/plain',
      icon: '📃'
    },
    html: {
      name: 'HTML',
      extension: '.html',
      mimeType: 'text/html',
      icon: '🌐'
    }
  },

  // Export to PDF
  exportToPDF: function(content, filename = 'resume') {
    if (window.jspdf && window.html2canvas) {
      this.exportToPDFAdvanced(content, filename);
    } else {
      this.exportToPDFSimple(content, filename);
    }
  },

  // Advanced PDF export with jsPDF
  exportToPDFAdvanced: async function(content, filename) {
    try {
      PERF.track('pdf_export');
      
      // Create temporary container
      const container = document.createElement('div');
      container.innerHTML = content;
      container.style.width = '210mm';
      container.style.padding = '20mm';
      container.style.fontFamily = 'Arial, sans-serif';
      container.style.fontSize = '12pt';
      container.style.lineHeight = '1.4';
      document.body.appendChild(container);

      // Convert to canvas
      const canvas = await html2canvas(container, {
        scale: 2,
        useCORS: true,
        allowTaint: true
      });

      // Create PDF
      const pdf = new jsPDF('p', 'mm', 'a4');
      const imgData = canvas.toDataURL('image/png');
      const pdfWidth = pdf.internal.pageSize.getWidth();
      const pdfHeight = (canvas.height * pdfWidth) / canvas.width;

      pdf.addImage(imgData, 'PNG', 0, 0, pdfWidth, pdfHeight);
      pdf.save(`${filename}${this.formats.pdf.extension}`);

      // Cleanup
      document.body.removeChild(container);
      PERF.end('pdf_export');
      
      this.showSuccess('PDF exported successfully!');
    } catch (error) {
      console.error('PDF export failed:', error);
      this.showError('PDF export failed. Please try again.');
    }
  },

  // Simple PDF export using browser print
  exportToPDFSimple: function(content, filename) {
    const printWindow = window.open('', '_blank');
    printWindow.document.write(`
      <!DOCTYPE html>
      <html>
        <head>
          <title>${filename}</title>
          <style>
            body { font-family: Arial, sans-serif; font-size: 12pt; line-height: 1.4; margin: 20mm; }
            @media print { body { margin: 20mm; } }
            h1 { font-size: 16pt; margin-bottom: 10pt; }
            h2 { font-size: 14pt; margin-bottom: 8pt; }
            p { margin-bottom: 6pt; }
          </style>
        </head>
        <body>
          ${content}
        </body>
      </html>
    `);
    printWindow.document.close();
    printWindow.print();
  },

  // Export to DOCX
  exportToDocx: function(content, filename = 'resume') {
    try {
      PERF.track('docx_export');
      
      // Convert HTML to DOCX format
      const docxContent = this.convertToDocx(content);
      const blob = new Blob([docxContent], { 
        type: this.formats.docx.mimeType 
      });
      
      this.downloadFile(blob, `${filename}${this.formats.docx.extension}`);
      PERF.end('docx_export');
      
      this.showSuccess('Word document exported successfully!');
    } catch (error) {
      console.error('DOCX export failed:', error);
      this.showError('Word document export failed. Please try again.');
    }
  },

  // Convert HTML to DOCX format
  convertToDocx: function(html) {
    // Simple HTML to DOCX conversion
    let docx = html
      .replace(/<h1[^>]*>/gi, '<w:p><w:r><w:rPr><w:b/><w:sz w:val="32"/></w:rPr><w:t>')
      .replace(/<\/h1>/gi, '</w:t></w:r></w:p>')
      .replace(/<h2[^>]*>/gi, '<w:p><w:r><w:rPr><w:b/><w:sz w:val="28"/></w:rPr><w:t>')
      .replace(/<\/h2>/gi, '</w:t></w:r></w:p>')
      .replace(/<p[^>]*>/gi, '<w:p><w:r><w:t>')
      .replace(/<\/p>/gi, '</w:t></w:r></w:p>')
      .replace(/<br[^>]*>/gi, '</w:t></w:r><w:r><w:t>')
      .replace(/<[^>]+>/g, '')
      .replace(/&nbsp;/g, ' ')
      .replace(/&amp;/g, '&')
      .replace(/&lt;/g, '<')
      .replace(/&gt;/g, '>');

    return docx;
  },

  // Export to TXT
  exportToTxt: function(content, filename = 'resume') {
    try {
      PERF.track('txt_export');
      
      // Convert HTML to plain text
      const textContent = content
        .replace(/<[^>]+>/g, '')
        .replace(/&nbsp;/g, ' ')
        .replace(/&amp;/g, '&')
        .replace(/&lt;/g, '<')
        .replace(/&gt;/g, '>')
        .replace(/\n\s*\n/g, '\n\n')
        .trim();

      const blob = new Blob([textContent], { 
        type: this.formats.txt.mimeType 
      });
      
      this.downloadFile(blob, `${filename}${this.formats.txt.extension}`);
      PERF.end('txt_export');
      
      this.showSuccess('Text file exported successfully!');
    } catch (error) {
      console.error('TXT export failed:', error);
      this.showError('Text file export failed. Please try again.');
    }
  },

  // Export to HTML
  exportToHtml: function(content, filename = 'resume') {
    try {
      PERF.track('html_export');
      
      // Create complete HTML document
      const htmlContent = `
        <!DOCTYPE html>
        <html lang="en">
        <head>
          <meta charset="UTF-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <title>${filename}</title>
          <style>
            body { font-family: Arial, sans-serif; font-size: 12pt; line-height: 1.4; margin: 20mm; }
            h1 { font-size: 16pt; margin-bottom: 10pt; color: #333; }
            h2 { font-size: 14pt; margin-bottom: 8pt; color: #333; }
            p { margin-bottom: 6pt; }
            .contact-info { margin-bottom: 15pt; }
            .section { margin-bottom: 15pt; }
          </style>
        </head>
        <body>
          ${content}
        </body>
        </html>
      `;

      const blob = new Blob([htmlContent], { 
        type: this.formats.html.mimeType 
      });
      
      this.downloadFile(blob, `${filename}${this.formats.html.extension}`);
      PERF.end('html_export');
      
      this.showSuccess('HTML file exported successfully!');
    } catch (error) {
      console.error('HTML export failed:', error);
      this.showError('HTML file export failed. Please try again.');
    }
  },

  // Download file helper
  downloadFile: function(blob, filename) {
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = filename;
    link.style.display = 'none';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  },

  // Show export modal
  showExportModal: function(content, filename = 'resume') {
    const modal = document.createElement('div');
    modal.className = 'export-modal';
    modal.innerHTML = `
      <div class="export-modal-content">
        <div class="export-modal-header">
          <h3>Export Resume</h3>
          <button class="close-btn" onclick="this.closest('.export-modal').remove()">&times;</button>
        </div>
        <div class="export-modal-body">
          <div class="export-options">
            ${Object.keys(this.formats).map(format => `
              <button class="export-option" data-format="${format}">
                <span class="format-icon">${this.formats[format].icon}</span>
                <span class="format-name">${this.formats[format].name}</span>
                <span class="format-extension">${this.formats[format].extension}</span>
              </button>
            `).join('')}
          </div>
          <div class="export-filename">
            <label for="filename-input">Filename:</label>
            <input type="text" id="filename-input" value="${filename}" />
          </div>
        </div>
      </div>
    `;

    // Add styles
    const style = document.createElement('style');
    style.textContent = `
      .export-modal {
        position: fixed;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        background: rgba(0, 0, 0, 0.5);
        display: flex;
        align-items: center;
        justify-content: center;
        z-index: 10000;
      }
      .export-modal-content {
        background: var(--card-bg);
        border-radius: 12px;
        padding: 24px;
        max-width: 500px;
        width: 90%;
        box-shadow: 0 10px 30px var(--shadow);
      }
      .export-modal-header {
        display: flex;
        justify-content: space-between;
        align-items: center;
        margin-bottom: 20px;
      }
      .export-options {
        display: grid;
        grid-template-columns: repeat(auto-fit, minmax(120px, 1fr));
        gap: 12px;
        margin-bottom: 20px;
      }
      .export-option {
        display: flex;
        flex-direction: column;
        align-items: center;
        padding: 16px;
        border: 2px solid var(--border);
        border-radius: 8px;
        background: var(--bg-primary);
        cursor: pointer;
        transition: all 0.3s ease;
      }
      .export-option:hover {
        border-color: var(--accent);
        transform: translateY(-2px);
      }
      .format-icon {
        font-size: 24px;
        margin-bottom: 8px;
      }
      .format-name {
        font-weight: 600;
        margin-bottom: 4px;
      }
      .format-extension {
        font-size: 12px;
        color: var(--text-secondary);
      }
      .export-filename {
        display: flex;
        align-items: center;
        gap: 12px;
      }
      .export-filename label {
        font-weight: 600;
      }
      .export-filename input {
        flex: 1;
        padding: 8px 12px;
        border: 1px solid var(--border);
        border-radius: 6px;
        background: var(--input-bg);
        color: var(--text-primary);
      }
      .close-btn {
        background: none;
        border: none;
        font-size: 24px;
        cursor: pointer;
        color: var(--text-secondary);
      }
    `;
    document.head.appendChild(style);

    // Add event listeners
    modal.querySelectorAll('.export-option').forEach(btn => {
      btn.addEventListener('click', () => {
        const format = btn.dataset.format;
        const filename = document.getElementById('filename-input').value;
        this.export(content, format, filename);
        modal.remove();
      });
    });

    document.body.appendChild(modal);
  },

  // Main export function
  export: function(content, format, filename) {
    switch (format) {
      case 'pdf':
        this.exportToPDF(content, filename);
        break;
      case 'docx':
        this.exportToDocx(content, filename);
        break;
      case 'txt':
        this.exportToTxt(content, filename);
        break;
      case 'html':
        this.exportToHtml(content, filename);
        break;
      default:
        console.error('Unsupported format:', format);
    }
  },

  // Show success message
  showSuccess: function(message) {
    if (window.PWA) {
      PWA.showToast(message, 'success');
    } else {
      alert(message);
    }
  },

  // Show error message
  showError: function(message) {
    if (window.PWA) {
      PWA.showToast(message, 'error');
    } else {
      alert(message);
    }
  }
};
