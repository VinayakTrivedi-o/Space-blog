// Configuration object with API endpoints and keys
const CONFIG = {
    NASA_API_KEY: '9JFdSfhR9VZx06Km8fdGfTFWTiIvBe9AOIoV1lCh', // Your NASA API key
    SPACEFLIGHT_NEWS_API: 'https://api.spaceflightnewsapi.net/v4/articles',
    MARS_WEATHER_API: 'https://api.nasa.gov/insight_weather/',
    NASA_APOD_API: 'https://api.nasa.gov/planetary/apod'
};

// Add debug logging
console.log('Config initialized');
console.log('Space News API endpoint:', CONFIG.SPACEFLIGHT_NEWS_API);

export default CONFIG; 