// Centralized Language Management System
// This file handles all language switching functionality across the website

class LanguageManager {
    constructor() {
        this.currentLang = localStorage.getItem('preferredLang') || 'en';
        this.translations = {
            en: {
                // Common elements
                heading: 'Love Grover',
                btnText: 'हिन्दी',
                
                // Index page specific
                researcherTitle: 'Researcher',
                researcherText: 'View publications on Google Scholar',
                writerTitle: 'Writer',
                writerText: 'Get in touch',
                
                // Contact page specific
                nameLabel: 'Name: Love Grover',
                emailLabel: 'Email: ',
                researchLabel: 'Research: ',
                scholarLink: 'Google Scholar Profile',
                backLink: '← Back to Home'
            },
            hi: {
                // Common elements
                heading: 'लव ग्रोवर',
                btnText: 'English',
                
                // Index page specific
                researcherTitle: 'शोधकर्ता',
                researcherText: 'गूगल स्कॉलर पर प्रकाशन देखें',
                writerTitle: 'लेखक',
                writerText: 'संपर्क करें',
                
                // Contact page specific
                nameLabel: 'नाम: लव ग्रोवर',
                emailLabel: 'ईमेल: ',
                researchLabel: 'शोध: ',
                scholarLink: 'गूगल स्कॉलर प्रोफ़ाइल',
                backLink: '← होम पर वापस जाएं'
            }
        };
        
        this.init();
    }
    
    init() {
        // Apply saved language preference on page load
        this.applyLanguage(this.currentLang);
        
        // Set up event listeners
        this.setupEventListeners();
        
        // Update all links to maintain language preference
        this.updateLinks();
    }
    
    setupEventListeners() {
        const langBtn = document.getElementById('langBtn');
        if (langBtn) {
            langBtn.addEventListener('click', () => this.toggleLanguage());
        }
        
        // Listen for page load events to maintain language across navigation
        window.addEventListener('beforeunload', () => {
            localStorage.setItem('preferredLang', this.currentLang);
        });
    }
    
    applyLanguage(lang) {
        const t = this.translations[lang];
        if (!t) return;
        
        // Update common elements present on all pages
        this.updateElement('mainHeading', t.heading);
        this.updateElement('langBtn', t.btnText);
        
        // Update index page specific elements
        this.updateElement('researcherTitle', t.researcherTitle);
        this.updateElement('researcherText', t.researcherText);
        this.updateElement('writerTitle', t.writerTitle);
        this.updateElement('writerText', t.writerText);
        
        // Update contact page specific elements
        this.updateElement('nameLabel', t.nameLabel);
        this.updateElement('backLink', t.backLink);
        
        // Handle complex elements with links (contact page)
        this.updateEmailLabel(t.emailLabel);
        this.updateResearchLabel(t.researchLabel, t.scholarLink);
    }
    
    updateElement(id, text) {
        const element = document.getElementById(id);
        if (element && text) {
            element.textContent = text;
        }
    }
    
    updateEmailLabel(emailText) {
        const emailP = document.getElementById('emailLabel');
        if (emailP && emailText) {
            emailP.innerHTML = emailText + '<a href="mailto:contact@lovegrover.com">contact@lovegrover.com</a>';
        }
    }
    
    updateResearchLabel(researchText, linkText) {
        const researchP = document.getElementById('researchLabel');
        if (researchP && researchText && linkText) {
            researchP.innerHTML = researchText + '<a href="https://scholar.google.com/citations?user=your-id" target="_blank">' + linkText + '</a>';
        }
    }
    
    toggleLanguage() {
        this.currentLang = this.currentLang === 'en' ? 'hi' : 'en';
        localStorage.setItem('preferredLang', this.currentLang);
        this.applyLanguage(this.currentLang);
        
        // Update URL parameters to maintain language preference across navigation
        this.updateUrlWithLanguage();
    }
    
    updateUrlWithLanguage() {
        // Add language parameter to current URL if not already present
        const url = new URL(window.location);
        url.searchParams.set('lang', this.currentLang);
        
        // Update URL without page reload
        if (window.history.pushState) {
            window.history.pushState({}, '', url);
        }
    }
    
    updateLinks() {
        // Update all internal links to include language preference
        const links = document.querySelectorAll('a[href]');
        links.forEach(link => {
            const href = link.getAttribute('href');
            
            // Only update internal links (not external or mailto links)
            if (href && !href.startsWith('http') && !href.startsWith('mailto:') && !href.startsWith('#')) {
                const url = new URL(href, window.location.origin);
                url.searchParams.set('lang', this.currentLang);
                link.href = url.pathname + url.search;
            }
        });
    }
    
    // Method to get current language
    getCurrentLanguage() {
        return this.currentLang;
    }
    
    // Method to set language programmatically
    setLanguage(lang) {
        if (this.translations[lang]) {
            this.currentLang = lang;
            localStorage.setItem('preferredLang', this.currentLang);
            this.applyLanguage(this.currentLang);
            this.updateLinks();
        }
    }
}

// Initialize language manager when DOM is loaded
function initLanguageManager() {
    // Check URL parameters for language preference
    const urlParams = new URLSearchParams(window.location.search);
    const urlLang = urlParams.get('lang');
    
    if (urlLang && (urlLang === 'en' || urlLang === 'hi')) {
        localStorage.setItem('preferredLang', urlLang);
    }
    
    // Create global language manager instance
    window.languageManager = new LanguageManager();
}

// Legacy function for backward compatibility
function toggleLanguage() {
    if (window.languageManager) {
        window.languageManager.toggleLanguage();
    }
}

// Auto-initialize when DOM is ready
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initLanguageManager);
} else {
    initLanguageManager();
}
