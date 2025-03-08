import CONFIG from './config.js';

class SpaceAPI {
    constructor() {
        this.config = CONFIG;
        console.log('SpaceAPI initialized'); // Debug log
    }

    // Fetch Space News
    async fetchSpaceNews(limit = 5) {
        try {
            console.log('Fetching space news...'); // Debug log
            const response = await fetch(`${this.config.SPACEFLIGHT_NEWS_API}?limit=${limit}`);
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            const data = await response.json();
            console.log('Space news data:', data); // Debug log
            // The API returns an object with 'results' array
            return data.results || [];
        } catch (error) {
            console.error('Error fetching space news:', error);
            return [];
        }
    }

    // Fetch NASA Picture of the Day
    async fetchNASAAPOD() {
        try {
            if (!this.config.NASA_API_KEY) {
                throw new Error('NASA API key not configured');
            }
            
            console.log('Fetching APOD...'); // Debug log
            const response = await fetch(
                `${this.config.NASA_APOD_API}?api_key=${this.config.NASA_API_KEY}`
            );
            
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            
            const data = await response.json();
            console.log('APOD Response received'); // Debug log
            
            // Validate the response data
            if (!data || !data.url) {
                throw new Error('Invalid APOD data received');
            }
            
            return data;
        } catch (error) {
            console.error('Error fetching NASA APOD:', error);
            return null;
        }
    }

    // Fetch Mars Weather
    async fetchMarsWeather() {
        try {
            if (!this.config.NASA_API_KEY) {
                throw new Error('NASA API key not configured');
            }

            const response = await fetch(
                `${this.config.MARS_WEATHER_API}?api_key=${this.config.NASA_API_KEY}&feedtype=json&ver=1.0`
            );
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            const data = await response.json();
            return data;
        } catch (error) {
            console.error('Error fetching Mars weather:', error);
            return null;
        }
    }
}

// Space News Component
class SpaceNewsComponent {
    constructor() {
        this.api = new SpaceAPI();
        this.tickerContainer = document.querySelector('.news-ticker');
        this.newsContainer = document.querySelector('.news-container');
        this.init();
    }

    async init() {
        try {
            console.log('Initializing news component...'); // Debug log
            // Fetch more news items for the ticker
            const tickerNews = await this.api.fetchSpaceNews(15);
            const gridNews = await this.api.fetchSpaceNews(6);
            
            console.log('Ticker news:', tickerNews); // Debug log
            console.log('Grid news:', gridNews); // Debug log
            
            if (this.tickerContainer && Array.isArray(tickerNews)) {
                this.displayTicker(tickerNews);
            }
            
            if (this.newsContainer && Array.isArray(gridNews)) {
                this.displayNews(gridNews);
            }
        } catch (error) {
            console.error('Error initializing news:', error);
            this.displayError();
        }
    }

    displayTicker(news) {
        if (!Array.isArray(news) || news.length === 0) {
            this.tickerContainer.innerHTML = '<span class="ticker-item">Loading space news...</span>';
            return;
        }

        // Create the initial ticker content
        const tickerContent = news.map(item => `
            <a href="${item.url}" class="ticker-item" target="_blank">
                <span class="date">${new Date(item.publishedAt || item.published_at).toLocaleDateString()}</span>
                <span class="title">${item.title}</span>
            </a>
        `).join('');

        // Double the content to create seamless loop
        this.tickerContainer.innerHTML = tickerContent + tickerContent;
    }

    displayNews(news) {
        if (!this.newsContainer) return;
        
        if (!Array.isArray(news) || news.length === 0) {
            this.newsContainer.innerHTML = '<div class="news-item">Loading space news...</div>';
            return;
        }

        this.newsContainer.innerHTML = news.map(item => `
            <div class="news-item">
                <img src="${item.imageUrl || item.image_url || 'assets/images/placeholder.jpg'}" alt="${item.title}" onerror="this.src='assets/images/placeholder.jpg'">
                <h3>${item.title}</h3>
                <p class="date">${new Date(item.publishedAt || item.published_at).toLocaleDateString()}</p>
                <p>${item.summary}</p>
                <a href="${item.url}" class="read-more" target="_blank">Read More</a>
            </div>
        `).join('');
    }

    displayError() {
        const errorMessage = `
            <div class="news-error">
                <p>Unable to load space news at the moment. Please try again later.</p>
            </div>
        `;

        if (this.tickerContainer) {
            this.tickerContainer.innerHTML = errorMessage;
        }
        if (this.newsContainer) {
            this.newsContainer.innerHTML = errorMessage;
        }
    }
}

// NASA APOD Component
class NASAAPODComponent {
    constructor() {
        this.api = new SpaceAPI();
        this.container = document.querySelector('.nasa-apod');
        this.init();
    }

    async init() {
        if (!this.container) return;
        
        try {
            this.displayLoading();
            const apod = await this.api.fetchNASAAPOD();
            if (apod && apod.url) {
                this.displayAPOD(apod);
            } else {
                this.displayError();
            }
        } catch (error) {
            console.error('APOD Component Error:', error);
            this.displayError();
        }
    }

    displayLoading() {
        this.container.innerHTML = `
            <div class="apod-loading">
                <h2>NASA Picture of the Day</h2>
                <p>Loading today's picture...</p>
            </div>
        `;
    }

    displayAPOD(apod) {
        // Handle different media types
        const mediaContent = apod.media_type === 'video' 
            ? `<iframe src="${apod.url}" frameborder="0" allowfullscreen></iframe>`
            : `<img src="${apod.url}" alt="${apod.title || 'NASA APOD'}" 
                   onerror="this.src='assets/images/placeholder.jpg'">`;

        this.container.innerHTML = `
            <div class="apod-content">
                <h2>NASA Picture of the Day</h2>
                ${mediaContent}
                <h3>${apod.title || 'No Title Available'}</h3>
                <p class="explanation">${apod.explanation || 'No description available.'}</p>
                <p class="date">Date: ${apod.date || 'Not available'}</p>
                ${apod.copyright ? `<p class="copyright">© ${apod.copyright}</p>` : ''}
            </div>
        `;
    }

    displayError() {
        this.container.innerHTML = `
            <div class="apod-error">
                <h2>NASA Picture of the Day</h2>
                <p>Unable to load today's picture. Please try again later.</p>
                <p class="error-details">This could be due to:</p>
                <ul>
                    <li>API key configuration issues</li>
                    <li>Network connectivity problems</li>
                    <li>NASA API service maintenance</li>
                </ul>
            </div>
        `;
    }
}

// Mars Weather Component
class MarsWeatherComponent {
    constructor() {
        this.api = new SpaceAPI();
        this.container = document.querySelector('.mars-weather');
        this.init();
    }

    async init() {
        if (!this.container) return;
        
        try {
            const weather = await this.api.fetchMarsWeather();
            if (weather && weather.sol_keys && weather.sol_keys.length > 0) {
                this.displayWeather(weather);
            } else {
                this.displayError();
            }
        } catch (error) {
            this.displayError();
        }
    }

    displayWeather(weather) {
        const latestSol = weather.sol_keys[0];
        const data = weather[latestSol];

        if (!data) {
            this.displayError();
            return;
        }

        this.container.innerHTML = `
            <h3>Mars Weather at Elysium Planitia</h3>
            <div class="weather-data">
                <div class="weather-item">
                    <div class="label">Sol</div>
                    <div class="value">${latestSol}</div>
                </div>
                <div class="weather-item">
                    <div class="label">Temperature</div>
                    <div class="value">${data.AT?.av ? data.AT.av.toFixed(1) + '°C' : 'N/A'}</div>
                </div>
                <div class="weather-item">
                    <div class="label">Pressure</div>
                    <div class="value">${data.PRE?.av ? data.PRE.av.toFixed(0) + ' Pa' : 'N/A'}</div>
                </div>
            </div>
        `;
    }

    displayError() {
        this.container.innerHTML = `
            <div class="weather-error">
                <h3>Mars Weather at Elysium Planitia</h3>
                <p>Weather data is currently unavailable. This could be due to:</p>
                <ul>
                    <li>Temporary API issues</li>
                    <li>Weather station maintenance</li>
                    <li>Data transmission delays from Mars</li>
                </ul>
            </div>
        `;
    }
}

// Initialize API components
document.addEventListener('DOMContentLoaded', () => {
    console.log('DOM Content Loaded'); // Debug log
    
    // Initialize components
    window.spaceNews = new SpaceNewsComponent();
    window.nasaAPOD = new NASAAPODComponent();
    window.marsWeather = new MarsWeatherComponent();
}); 