// Centralized Language Management System
// This file handles all language switching functionality across the website
class LanguageManager {
    constructor() {
        // Check URL parameters first, then localStorage, then default to 'en'
        const urlParams = new URLSearchParams(window.location.search);
        const urlLang = urlParams.get('lang');
        
        if (urlLang && (urlLang === 'en' || urlLang === 'hi')) {
            this.currentLang = urlLang;
            localStorage.setItem('preferredLang', urlLang);
        } else {
            this.currentLang = localStorage.getItem('preferredLang') || 'en';
        }
        
        this.translations = {
            en: {
                // Common elements
                heading: 'Love Grover',
                btnText: 'हिन्दी',
                
                // Index page specific
                researcherTitle: 'Researcher',
                researcherText: 'View My Research',
                researcherLinkScholar: 'Google Scholar',
                researcherLinkInsta: 'Instagram',
                writerTitle: 'Writer',
                writerText: 'Get in touch',
                bloggerTitle: 'Blogger',
                bloggerText: 'Read my thoughts',
                
                // Contact page specific
                nameLabel: 'Name: Love Grover',
                emailLabel: 'Email: ',
                researchLabel: 'Research: ',
                scholarLink: 'Google Scholar Profile',
                backLink: '← Back to Home',
                
                // Blog page specific
                blogHeading: 'Blog',
                blogIntro: 'Thoughts and writings'
            },
            hi: {
                // Common elements
                heading: 'लव ग्रोवर',
                btnText: 'English',
                
                // Index page specific
                researcherTitle: 'शोधकर्ता',
                researcherText: 'मेरा शोध देखें',
                researcherLinkScholar: 'गूगल विद्वान',
                researcherLinkInsta: 'चित्रसन्देश',
                writerTitle: 'लेखक',
                writerText: 'सम्पर्क करें',
                bloggerTitle: 'चिट्ठाकार',
                bloggerText: 'मेरे विचार पढ़ें',
                
                // Contact page specific
                nameLabel: 'नाम: लव ग्रोवर',
                emailLabel: 'विपत्र: ',
                researchLabel: 'शोध: ',
                scholarLink: 'गूगल विद्वान प्रोफ़ाइल',
                backLink: '← गृहपृष्ठ पर वापस जाएँ'
                
                // Blog page specific
                blogHeading: 'चिट्ठा',
                blogIntro: 'विचार एवं लेखन'
            }
        };
        
        this.init();
    }
    
    init() {
        // Apply language preference on page load
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
        this.updateElement('researcherLinkScholar', t.researcherLinkScholar);
        this.updateElement('researcherLinkInsta', t.researcherLinkInsta);
        this.updateElement('writerTitle', t.writerTitle);
        this.updateElement('writerText', t.writerText);
        this.updateElement('bloggerTitle', t.bloggerTitle);
        this.updateElement('bloggerText', t.bloggerText);
        
        // Update contact page specific elements
        this.updateElement('nameLabel', t.nameLabel);
        this.updateElement('backLink', t.backLink);
        
        // Update blog page specific elements
        this.updateElement('blogHeading', t.blogHeading);
        this.updateElement('blogIntro', t.blogIntro);
        
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
            researchP.innerHTML = researchText + '<a href="https://scholar.google.com/citations?user=user=CdQaSogAAAAJ&amp;hl=en" target="_blank">' + linkText + '</a>';
        }
    }
    
    toggleLanguage() {
        // Toggle between English and Hindi
        const newLang = this.currentLang === 'en' ? 'hi' : 'en';
        
        // Save preference to localStorage
        localStorage.setItem('preferredLang', newLang);
        
        // Update URL with new language parameter and reload
        const url = new URL(window.location);
        url.searchParams.set('lang', newLang);
        window.location.href = url.toString();
    }
    
    updateLinks() {
        // Update all internal links to include current language parameter
        const links = document.querySelectorAll('a[href]');
        links.forEach(link => {
            const href = link.getAttribute('href');
            
            // Only update internal links (not external, mailto, or anchor links)
            if (href && !href.startsWith('http') && !href.startsWith('mailto:') && !href.startsWith('#')) {
                try {
                    // Parse the href to check if it's a relative URL
                    let url;
                    if (href.startsWith('/')) {
                        // Absolute path
                        url = new URL(href, window.location.origin);
                    } else {
                        // Relative path
                        url = new URL(href, window.location.href);
                    }
                    
                    // Add or update the lang parameter
                    url.searchParams.set('lang', this.currentLang);
                    
                    // Update the link href
                    // For relative links, extract just the pathname and search
                    if (!href.startsWith('/')) {
                        link.setAttribute('href', url.pathname.split('/').pop() + url.search);
                    } else {
                        link.setAttribute('href', url.pathname + url.search);
                    }
                } catch (e) {
                    // If URL parsing fails, fallback to simple string manipulation
                    let cleanHref = href.split('?')[0];
                    link.setAttribute('href', cleanHref + '?lang=' + this.currentLang);
                }
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
            
            // Update URL and reload
            const url = new URL(window.location);
            url.searchParams.set('lang', lang);
            window.location.href = url.toString();
        }
    }
}
// Initialize language manager when DOM is loaded
function initLanguageManager() {
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
