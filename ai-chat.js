class AIChat {
  constructor() {
    this.isOpen = false;
    this.messages = [];
    this.hasShownIntro = false;
    this.conversationHistory = JSON.parse(localStorage.getItem('aiChatHistory') || '[]');
    this.currentFileText = null;
    this.initialize();
  }

  initialize() {
    // Create chat container
    this.createChatUI();
    // Add event listeners
    this.setupEventListeners();
  }

  createChatUI() {
    // Create main container
    this.chatContainer = document.createElement('div');
    this.chatContainer.id = 'ai-chat-container';
    this.chatContainer.innerHTML = `
      <div class="ai-chat-header">
        <div class="ai-chat-title">
          <span class="ai-icon">
            <svg viewBox="0 0 24 24" width="24" height="24">
              <path fill="currentColor" d="M12,2A10,10 0 0,0 2,12A10,10 0 0,0 12,22A10,10 0 0,0 22,12A10,10 0 0,0 12,2M12,20A8,8 0 0,1 4,12A8,8 0 0,1 12,4A8,8 0 0,1 20,12A8,8 0 0,1 12,20M12,6A6,6 0 0,0 6,12C6,13.62 6.53,15.11 7.39,16.31L8.81,14.89C8.4,14.03 8.13,13.05 8.07,12H12V10H8.07C8.15,9.29 8.35,8.62 8.65,8H12V6M12,18C10.29,18 8.76,17.34 7.67,16.31L9.1,14.89C9.89,15.5 10.89,15.83 12,15.83C12.26,15.83 12.5,15.81 12.75,15.76L14.13,17.14C13.38,17.7 12.48,18 12,18M16.58,15.58L15.16,14.16C15.59,13.42 15.83,12.58 15.87,11.71H12V13.71H15.87C15.8,14.5 15.6,15.24 15.3,15.92L16.58,15.58M10.5,12C10.5,12.83 10.67,13.61 10.97,14.31L9.55,15.73C8.89,14.66 8.5,13.38 8.5,12H10.5M15.89,8.1L17.3,9.5C17.64,8.35 17.64,7.15 17.3,6L15.89,7.41C16.14,8.05 16.24,8.72 16.2,9.4C16.17,9.06 16.06,8.72 15.89,8.1Z"/>
            </svg>
          </span>
          <span>AI Assistant</span>
        </div>
        <button class="ai-chat-close">&times;</button>
      </div>
      <div class="ai-chat-messages"></div>
      <div class="ai-chat-input-container">
        <textarea 
          id="aiChatInput" 
          placeholder="Type your message here..."
          rows="1"
        ></textarea>
        <button id="aiChatFile" class="ai-chat-file" title="Attach file or URL">
          <svg viewBox="0 0 24 24" width="20" height="20">
            <path fill="currentColor" d="M14,2H6A2,2 0 0,0 4,4V20A2,2 0 0,0 6,22H18A2,2 0 0,0 20,20V8L14,2M18,20H6V4H13V9H18V20Z" />
          </svg>
        </button>
        <button id="aiChatSend" class="ai-chat-send">
          <svg viewBox="0 0 24 24" width="20" height="20">
            <path fill="currentColor" d="M2,21L23,12L2,3V10L17,12L2,14V21Z" />
          </svg>
        </button>
        <input type="file" id="aiChatFileInput" accept=".pdf,.jpg,.jpeg,.png" style="display:none">
        <input type="url" id="aiChatUrlInput" placeholder="Paste job URL" style="display:none; width:100%; margin-top:8px; padding:8px; border:1px solid rgba(31,47,87,.85); border-radius:8px; background:rgba(16,31,59,.5); color:var(--text)">
      </div>
    `;

    // Create FAB
    this.fab = document.createElement('button');
    this.fab.id = 'ai-chat-fab';
    this.fab.innerHTML = `
      <svg viewBox="0 0 24 24" width="24" height="24">
        <path fill="currentColor" d="M12,2C6.48,2 2,6.48 2,12C2,17.52 6.48,22 12,22C17.52,22 22,17.52 22,12C22,6.48 17.52,2 12,2M12,20C7.59,20 4,16.41 4,12C4,7.59 7.59,4 12,4C16.41,4 20,7.59 20,12C20,16.41 16.41,20 12,20M12.89,11.1C11.4,10.45 10.64,10.16 10.4,9.45C10.17,8.76 10.51,8.13 11.17,8.13C11.8,8.13 12.24,8.51 12.4,9.06L13.87,8.5C13.55,7.57 12.73,7 11.77,7C10.12,7 9.33,8.15 9.73,9.54C10.1,10.82 11.04,11.19 12.4,11.8C13.6,12.33 14.27,12.84 14.27,13.8C14.27,14.5 13.7,15.15 12.76,15.15C11.96,15.15 11.35,14.77 11,14.26L9.5,15.1C9.82,15.85 10.56,16.5 11.77,16.5C13.26,16.5 14.54,15.4 14.16,13.7C13.8,12.25 12.89,11.8 12.89,11.1Z" />
      </svg>
    `;

    document.body.appendChild(this.chatContainer);
    document.body.appendChild(this.fab);
  }

  setupEventListeners() {
    // Toggle chat
    this.fab.addEventListener('click', () => this.toggleChat());
    
    // Close button
    this.chatContainer.querySelector('.ai-chat-close')
      .addEventListener('click', () => this.toggleChat(false));
    
    // Send message on button click
    this.chatContainer.querySelector('#aiChatSend')
      .addEventListener('click', () => this.sendMessage());
    
    // Send message on Enter key (but allow Shift+Enter for new line)
    this.chatContainer.querySelector('#aiChatInput')
      .addEventListener('keydown', (e) => {
        if (e.key === 'Enter' && !e.shiftKey) {
          e.preventDefault();
          this.sendMessage();
        }
      });
    
    // File upload
    this.chatContainer.querySelector('#aiChatFile')
      .addEventListener('click', () => {
        const urlInput = this.chatContainer.querySelector('#aiChatUrlInput');
        if (urlInput.style.display === 'block') {
          urlInput.style.display = 'none';
          this.chatContainer.querySelector('#aiChatFileInput').click();
        } else {
          this.chatContainer.querySelector('#aiChatFileInput').click();
        }
      });
    
    this.chatContainer.querySelector('#aiChatFileInput')
      .addEventListener('change', (e) => {
        this.handleFileUpload(e.target.files[0]);
      });
    
    // Long press or right-click on file button to toggle URL input
    this.chatContainer.querySelector('#aiChatFile')
      .addEventListener('contextmenu', (e) => {
        e.preventDefault();
        const urlInput = this.chatContainer.querySelector('#aiChatUrlInput');
        urlInput.style.display = urlInput.style.display === 'block' ? 'none' : 'block';
      });
    
    this.chatContainer.querySelector('#aiChatUrlInput')
      .addEventListener('keydown', (e) => {
        if (e.key === 'Enter') {
          this.handleUrlUpload(e.target.value);
        }
      });
  }

  toggleChat(show = !this.isOpen) {
    this.isOpen = show;
    this.chatContainer.classList.toggle('open', this.isOpen);
    this.fab.classList.toggle('active', this.isOpen);
    
    if (this.isOpen) {
      this.chatContainer.querySelector('#aiChatInput').focus();
      // Load history if first open
      if (this.messages.length === 0 && this.conversationHistory.length > 0) {
        this.conversationHistory.forEach(m => {
          this.addMessage(m.sender, m.text);
        });
      }
    }
  }

  async sendMessage() {
    const input = this.chatContainer.querySelector('#aiChatInput');
    const message = input.value.trim();
    
    if (!message) return;
    
    // Add user message to chat
    this.addMessage('user', message);
    input.value = '';
    this.adjustTextareaHeight(input);
    
    // Show typing indicator
    const typingId = this.showTypingIndicator();
    
    try {
      // Process the message with AI (you'll need to implement this part)
      const response = await this.processAIMessage(message);
      
      // Remove typing indicator
      this.removeTypingIndicator(typingId);
      
      // Add AI response to chat
      this.addMessage('ai', response);
    } catch (error) {
      this.removeTypingIndicator(typingId);
      this.addMessage('ai', 'Sorry, I encountered an error. Please try again later.');
      console.error('AI Chat Error:', error);
    }
  }

  async processAIMessage(message) {
    // Use the existing AI assistant functionality
    if (window.aiAssistant) {
      try {
        const resumeData = window.aiAssistant.getResumeData();
        const lowerMessage = message.toLowerCase();

        const isVeryShort = lowerMessage.replace(/\s+/g, '').length <= 2;

        // Determine the type of request
        if (lowerMessage.includes('summary') || lowerMessage.includes('improve') || lowerMessage.includes('rewrite')) {
          const prompt = window.aiAssistant.buildPrompt('improve-summary', resumeData, '');
          const suggestions = await window.aiAssistant.generateSuggestions(prompt);
          return this.formatAISuggestions(suggestions, 'summary');
        }

        if (lowerMessage.includes('bullet') || lowerMessage.includes('experience') || lowerMessage.includes('strengthen')) {
          const prompt = window.aiAssistant.buildPrompt('strengthen-bullets', resumeData, '');
          const suggestions = await window.aiAssistant.generateSuggestions(prompt);
          return this.formatAISuggestions(suggestions, 'bullets');
        }

        if (lowerMessage.includes('skill') || lowerMessage.includes('skills')) {
          const prompt = window.aiAssistant.buildPrompt('suggest-skills', resumeData, '');
          const suggestions = await window.aiAssistant.generateSuggestions(prompt);
          return this.formatAISuggestions(suggestions, 'skills');
        }

        if (lowerMessage.includes('job') || lowerMessage.includes('tailor') || lowerMessage.includes('customize')) {
          return "To tailor your resume for a specific job, please paste the job description in the AI Assist modal (click the AI Assist button in the toolbar). I can then provide specific recommendations for each section of your resume.";
        }

        if (lowerMessage.includes('market') || lowerMessage.includes('salary') || lowerMessage.includes('trend')) {
          return "For market insights and salary information, please use the 'Market Intelligence' option in the AI Assist modal. You'll need to provide a job description or role you're interested in.";
        }

        // Handle very short / non-informational inputs without repeating the generic intro
        if (isVeryShort) {
          return "Got it. Tell me what you want to work on: summary, bullet points, skills, or tailoring to a job description?";
        }

        // Default response for general questions
        if (!this.hasShownIntro) {
          this.hasShownIntro = true;
          return `I'm your AI resume assistant! I can help you with:

• **Improve your summary** - Make it more impactful and ATS-friendly
• **Strengthen bullet points** - Add metrics and action verbs using STAR method
• **Suggest relevant skills** - Add skills that match your experience and industry
• **Tailor to job descriptions** - Customize your resume for specific roles
• **Market intelligence** - Get salary insights and trending skills
• **Analyze uploaded files** - PDFs, images, or web pages for context

What would you like help with? You can also attach a file or paste a job URL. Right-click the attach button for URL input.`;
        }

        return `Thanks — can you share a bit more detail?

What would you like to improve (summary, bullet points, skills), and what role are you targeting? If you paste a job description, I can tailor suggestions to it. You can also attach a file or URL for additional context.`;

      } catch (error) {
        console.error('AI processing error:', error);
        return "I encountered an error processing your request. Please try again or use the AI Assist button in the toolbar for more specific help.";
      }
    }

    // Fallback if AI assistant is not available
    const lower = (message || '').toLowerCase();
    const isVeryShort = lower.replace(/\s+/g, '').length <= 2;
    if (isVeryShort) {
      return "Tell me what you want help with: summary, bullet points, skills, or tailoring to a job description.";
    }
    if (!this.hasShownIntro) {
      this.hasShownIntro = true;
      return "I'm your AI assistant. I can help you improve your resume (summary, bullet points, skills) or tailor it to a job description. What are you working on?";
    }
    return "What role are you targeting, and which section should we improve (summary, experience bullets, skills)?";
  }

  formatAISuggestions(suggestions, type) {
    if (!suggestions || !suggestions.items) return "I couldn't generate suggestions at this time. Please try again.";

    let response = `${suggestions.title}:\n\n`;

    suggestions.items.forEach((item, index) => {
      response += `${index + 1}. ${item.text}\n`;
      if (item.explanation) {
        response += `   (${item.explanation})\n`;
      }
      response += '\n';
    });

    if (type === 'summary') {
      response += "💡 Tip: Click the 'AI Assist' button in the toolbar to apply these suggestions directly to your resume.";
    } else if (type === 'skills') {
      response += "💡 Tip: Use the 'AI Assist' button to add these skills directly to your resume.";
    }

    return response;
  }

  addMessage(sender, text) {
    const messagesContainer = this.chatContainer.querySelector('.ai-chat-messages');
    const messageElement = document.createElement('div');
    messageElement.className = `ai-message ${sender}`;
    
    messageElement.innerHTML = `
      <div class="ai-message-content">
        <div class="ai-message-text">${this.formatMessage(text)}</div>
        <div class="ai-message-time">${this.getCurrentTime()}</div>
      </div>
    `;
    
    messagesContainer.appendChild(messageElement);
    messagesContainer.scrollTop = messagesContainer.scrollHeight;
    
    // Save to history
    this.conversationHistory.push({ sender, text, time: new Date().toISOString() });
    localStorage.setItem('aiChatHistory', JSON.stringify(this.conversationHistory));
  }

  showTypingIndicator() {
    const typingId = 'typing-' + Date.now();
    const messagesContainer = this.chatContainer.querySelector('.ai-chat-messages');
    
    const typingElement = document.createElement('div');
    typingElement.id = typingId;
    typingElement.className = 'ai-message ai typing';
    typingElement.innerHTML = `
      <div class="ai-message-content">
        <div class="typing-indicator">
          <span></span>
          <span></span>
          <span></span>
        </div>
      </div>
    `;
    
    messagesContainer.appendChild(typingElement);
    messagesContainer.scrollTop = messagesContainer.scrollHeight;
    
    return typingId;
  }

  removeTypingIndicator(id) {
    const typingElement = document.getElementById(id);
    if (typingElement) {
      typingElement.remove();
    }
  }

  formatMessage(text) {
    // Convert URLs to clickable links
    return text.replace(
      /(https?:\/\/[^\s]+)/g, 
      '<a href="$1" target="_blank" rel="noopener noreferrer">$1</a>'
    );
  }

  getCurrentTime() {
    const now = new Date();
    return now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  }

  adjustTextareaHeight(textarea) {
    textarea.style.height = 'auto';
    textarea.style.height = (textarea.scrollHeight) + 'px';
  }

  async handleFileUpload(file) {
    if (!file) return;
    const typingId = this.showTypingIndicator();
    try {
      const text = await this.extractTextFromFile(file);
      this.currentFileText = text;
      this.addMessage('user', `Uploaded ${file.name}: ${text.substring(0, 100)}...`);
    } catch (error) {
      this.addMessage('ai', 'Failed to extract text from file. Supported formats: PDF, JPG, PNG.');
    }
    this.removeTypingIndicator(typingId);
  }

  async handleUrlUpload(url) {
    if (!url) return;
    const typingId = this.showTypingIndicator();
    try {
      const text = await this.extractTextFromUrl(url);
      this.currentFileText = text;
      this.addMessage('user', `Fetched ${url}: ${text.substring(0, 100)}...`);
      this.chatContainer.querySelector('#aiChatUrlInput').style.display = 'none';
      this.chatContainer.querySelector('#aiChatUrlInput').value = '';
    } catch (error) {
      this.addMessage('ai', 'Failed to fetch or extract text from URL.');
    }
    this.removeTypingIndicator(typingId);
  }

  async extractTextFromFile(file) {
    const fileType = file.type;
    if (fileType === 'application/pdf') {
      const arrayBuffer = await file.arrayBuffer();
      const pdf = await pdfjsLib.getDocument({ data: arrayBuffer }).promise;
      let text = '';
      for (let i = 1; i <= pdf.numPages; i++) {
        const page = await pdf.getPage(i);
        const textContent = await page.getTextContent();
        text += textContent.items.map(item => item.str).join(' ') + '\n';
      }
      return text;
    } else if (fileType.startsWith('image/')) {
      const { data: { text } } = await Tesseract.recognize(file);
      return text;
    } else {
      throw new Error('Unsupported file type');
    }
  }

  async extractTextFromUrl(url) {
    const response = await fetch(url);
    const html = await response.text();
    const parser = new DOMParser();
    const doc = parser.parseFromString(html, 'text/html');
    return doc.body.textContent || doc.body.innerText || 'No text found';
  }
}

// Initialize chat when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
  window.aiChat = new AIChat();
});
