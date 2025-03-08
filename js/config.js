// Load API keys from meta tags (to be set by server or build process)
const CONFIG = {
    NASA_API_KEY: document.querySelector('meta[name="nasa-api-key"]')?.content || '',
    SPACEFLIGHT_NEWS_API: 'https://api.spaceflightnewsapi.net/v4/articles',
    MARS_WEATHER_API: 'https://api.nasa.gov/insight_weather/',
    NASA_APOD_API: 'https://api.nasa.gov/planetary/apod'
};

export default CONFIG; 