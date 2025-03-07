// Configuration
const CONFIG = {
    NASA_API_KEY: '9JFdSfhR9VZx06Km8fdGfTFWTiIvBe9AOIoV1lCh',
    SPACEFLIGHT_NEWS_API: 'https://api.spaceflightnewsapi.net/v3/articles',
    MARS_WEATHER_API: 'https://api.nasa.gov/insight_weather/',
    NASA_APOD_API: 'https://api.nasa.gov/planetary/apod'
};

// Check for NASA API key
if (!CONFIG.NASA_API_KEY) {
    console.warn('NASA API key is not set. Please add your API key in js/main.js');
    document.body.insertAdjacentHTML('beforeend', `
        <div style="position: fixed; bottom: 20px; right: 20px; background: #ff4444; color: white; padding: 15px; border-radius: 5px; z-index: 1000;">
            ⚠️ NASA API key not configured. Some features may not work.
        </div>
    `);
}

// Theme Toggle
class ThemeManager {
    constructor() {
        this.themeToggle = document.querySelector('.theme-toggle');
        this.init();
    }

    init() {
        const savedTheme = localStorage.getItem('theme') || 'dark';
        document.body.classList.toggle('light-theme', savedTheme === 'light');
        
        this.themeToggle?.addEventListener('click', () => this.toggleTheme());
    }

    toggleTheme() {
        document.body.classList.toggle('light-theme');
        const theme = document.body.classList.contains('light-theme') ? 'light' : 'dark';
        localStorage.setItem('theme', theme);
    }
}

// Newsletter
class Newsletter {
    constructor() {
        this.form = document.querySelector('.subscribe-form');
        this.init();
    }

    init() {
        this.form?.addEventListener('submit', (e) => this.handleSubmit(e));
    }

    async handleSubmit(e) {
        e.preventDefault();
        const email = e.target.querySelector('input').value;
        
        try {
            // In a real application, you would send this to your backend
            console.log(`Subscribing email: ${email}`);
            this.showMessage('Thank you for subscribing!', 'success');
            e.target.reset();
        } catch (error) {
            this.showMessage('Subscription failed. Please try again.', 'error');
        }
    }

    showMessage(message, type) {
        const messageDiv = document.createElement('div');
        messageDiv.className = `message ${type}`;
        messageDiv.textContent = message;
        
        this.form.appendChild(messageDiv);
        setTimeout(() => messageDiv.remove(), 3000);
    }
}

// Search Functionality
class Search {
    constructor() {
        this.searchInput = document.querySelector('.search-input');
        this.searchResults = document.querySelector('.search-results');
        this.init();
    }

    init() {
        if (!this.searchInput) return;
        
        this.searchInput.addEventListener('input', this.debounce(() => {
            this.handleSearch();
        }, 300));
    }

    async handleSearch() {
        const query = this.searchInput.value.trim();
        if (query.length < 2) {
            this.searchResults.classList.remove('active');
            return;
        }

        try {
            // In a real application, you would search your backend
            const results = await this.mockSearch(query);
            this.displayResults(results);
        } catch (error) {
            console.error('Search failed:', error);
        }
    }

    mockSearch(query) {
        // Simulated search results
        return new Promise(resolve => {
            setTimeout(() => {
                resolve([
                    { title: 'Chandrayaan-3 Mission', url: 'chandrayaan.html' },
                    { title: 'SpaceX Mars Mission', url: 'spacex.html' }
                ].filter(item => 
                    item.title.toLowerCase().includes(query.toLowerCase())
                ));
            }, 300);
        });
    }

    displayResults(results) {
        this.searchResults.innerHTML = '';
        
        if (results.length === 0) {
            this.searchResults.innerHTML = '<div class="search-result-item">No results found</div>';
        } else {
            results.forEach(result => {
                const div = document.createElement('div');
                div.className = 'search-result-item';
                div.innerHTML = `<a href="${result.url}">${result.title}</a>`;
                this.searchResults.appendChild(div);
            });
        }
        
        this.searchResults.classList.add('active');
    }

    debounce(func, wait) {
        let timeout;
        return function executedFunction(...args) {
            const later = () => {
                clearTimeout(timeout);
                func(...args);
            };
            clearTimeout(timeout);
            timeout = setTimeout(later, wait);
        };
    }
}

// Comments System
class CommentSystem {
    constructor() {
        this.commentsContainer = document.querySelector('.comments-list');
        this.commentForm = document.querySelector('.comment-form');
        this.comments = JSON.parse(localStorage.getItem('comments') || '[]');
        this.init();
    }

    init() {
        if (!this.commentForm) return;
        
        this.displayComments();
        this.commentForm.addEventListener('submit', (e) => this.handleSubmit(e));
    }

    handleSubmit(e) {
        e.preventDefault();
        const textarea = e.target.querySelector('textarea');
        const comment = {
            id: Date.now(),
            text: textarea.value,
            date: new Date().toISOString(),
            likes: 0
        };

        this.comments.push(comment);
        this.saveComments();
        this.displayComments();
        textarea.value = '';
    }

    displayComments() {
        if (!this.commentsContainer) return;

        this.commentsContainer.innerHTML = this.comments
            .map(comment => this.createCommentHTML(comment))
            .join('');
    }

    createCommentHTML(comment) {
        const date = new Date(comment.date).toLocaleDateString();
        return `
            <div class="comment-item" data-id="${comment.id}">
                <div class="comment-header">
                    <span class="date">${date}</span>
                    <span class="likes">
                        ${comment.likes} ❤️
                        <button onclick="commentSystem.likeComment(${comment.id})">Like</button>
                    </span>
                </div>
                <div class="comment-text">${comment.text}</div>
            </div>
        `;
    }

    likeComment(id) {
        const comment = this.comments.find(c => c.id === id);
        if (comment) {
            comment.likes++;
            this.saveComments();
            this.displayComments();
        }
    }

    saveComments() {
        localStorage.setItem('comments', JSON.stringify(this.comments));
    }
}

// Initialize all components
document.addEventListener('DOMContentLoaded', () => {
    window.themeManager = new ThemeManager();
    window.newsletter = new Newsletter();
    window.search = new Search();
    window.commentSystem = new CommentSystem();
}); 