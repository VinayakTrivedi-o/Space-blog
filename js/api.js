class SpaceAPI {
    constructor() {
        this.config = {
            NASA_API_KEY: CONFIG.NASA_API_KEY,
            SPACEFLIGHT_NEWS_API: 'https://api.spaceflightnewsapi.net/v4/articles',
            MARS_WEATHER_API: CONFIG.MARS_WEATHER_API,
            NASA_APOD_API: CONFIG.NASA_APOD_API
        };
    }

    // Fetch Space News
    async fetchSpaceNews(limit = 5) {
        try {
            const response = await fetch(`${this.config.SPACEFLIGHT_NEWS_API}?limit=${limit}`);
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            const data = await response.json();
            return data.results || [];
        } catch (error) {
            console.error('Error fetching space news:', error);
            return [];
        }
    }

    // Fetch NASA Picture of the Day
    async fetchNASAAPOD() {
        try {
            const response = await fetch(
                `${this.config.NASA_APOD_API}?api_key=${this.config.NASA_API_KEY}`
            );
            const data = await response.json();
            return data;
        } catch (error) {
            console.error('Error fetching NASA APOD:', error);
            return null;
        }
    }

    // Fetch Mars Weather
    async fetchMarsWeather() {
        try {
            const response = await fetch(
                `${this.config.MARS_WEATHER_API}?api_key=${this.config.NASA_API_KEY}&feedtype=json&ver=1.0`
            );
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
            // Fetch more news items for the ticker
            const tickerNews = await this.api.fetchSpaceNews(15);
            const gridNews = await this.api.fetchSpaceNews(6);
            
            if (this.tickerContainer) {
                this.displayTicker(tickerNews);
            }
            
            if (this.newsContainer) {
                this.displayNews(gridNews);
            }
        } catch (error) {
            console.error('Error initializing news:', error);
            this.displayError();
        }
    }

    displayTicker(news) {
        if (!news || news.length === 0) {
            this.tickerContainer.innerHTML = '<span class="ticker-item">Loading space news...</span>';
            return;
        }

        // Create the initial ticker content
        const tickerContent = news.map(item => `
            <a href="${item.url}" class="ticker-item" target="_blank">
                <span class="date">${new Date(item.published_at).toLocaleDateString()}</span>
                <span class="title">${item.title}</span>
            </a>
        `).join('');

        // Double the content to create seamless loop
        this.tickerContainer.innerHTML = tickerContent + tickerContent;
    }

    displayNews(news) {
        if (!this.newsContainer) return;
        
        if (!news || news.length === 0) {
            this.newsContainer.innerHTML = '<div class="news-item">Loading space news...</div>';
            return;
        }

        this.newsContainer.innerHTML = news.map(item => `
            <div class="news-item">
                <img src="${item.image_url}" alt="${item.title}" onerror="this.src='assets/images/placeholder.jpg'">
                <h3>${item.title}</h3>
                <p class="date">${new Date(item.published_at).toLocaleDateString()}</p>
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
        
        const apod = await this.api.fetchNASAAPOD();
        if (apod) {
            this.displayAPOD(apod);
        }
    }

    displayAPOD(apod) {
        this.container.innerHTML = `
            <h2>NASA Picture of the Day</h2>
            <div class="apod-content">
                <img src="${apod.url}" alt="${apod.title}">
                <h3>${apod.title}</h3>
                <p>${apod.explanation}</p>
                <p class="date">Date: ${apod.date}</p>
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
        
        const weather = await this.api.fetchMarsWeather();
        if (weather) {
            this.displayWeather(weather);
        }
    }

    displayWeather(weather) {
        // Note: Mars weather API response format may vary
        const latestSol = Object.keys(weather).sort().pop();
        const latestWeather = weather[latestSol];

        this.container.innerHTML = `
            <h3>Mars Weather at Elysium Planitia</h3>
            <div class="weather-data">
                <div class="weather-item">
                    <div class="label">Sol</div>
                    <div class="value">${latestSol}</div>
                </div>
                <div class="weather-item">
                    <div class="label">Temperature</div>
                    <div class="value">${latestWeather.AT?.av || 'N/A'}°C</div>
                </div>
                <div class="weather-item">
                    <div class="label">Pressure</div>
                    <div class="value">${latestWeather.PRE?.av || 'N/A'} Pa</div>
                </div>
            </div>
        `;
    }
}

// Initialize API components
document.addEventListener('DOMContentLoaded', () => {
    window.spaceNews = new SpaceNewsComponent();
    window.nasaAPOD = new NASAAPODComponent();
    window.marsWeather = new MarsWeatherComponent();
}); 