# Space Blog

A modern, responsive space exploration blog built with vanilla JavaScript, HTML, and CSS. Features live space news updates, NASA's Picture of the Day, and Mars weather information.

## Features

- 🚀 Live Space News Feed with auto-scrolling ticker
- 🌠 NASA Astronomy Picture of the Day
- 🌡️ Mars Weather Updates
- 🌙 Dark/Light Theme Toggle
- 📱 Fully Responsive Design
- 🔍 Article Search Functionality
- 📧 Newsletter Subscription
- 📅 Space Timeline
- 📝 Blog Posts about Space Missions

## Project Structure

```
space-blog/
├── index.html              # Main page
├── blog.html              # Blog listing page
├── chandrayaan.html       # Chandrayaan mission article
├── spacex.html           # SpaceX mission article
├── css/
│   ├── styles.css        # Main styles
│   └── components.css    # Component-specific styles
├── js/
│   ├── api.js           # API integration and components
│   └── config.js        # Configuration settings
├── assets/
│   └── images/          # Image assets
├── .gitignore           # Git ignore rules
└── README.md           # Project documentation
```

## Setup

1. Clone the repository:
   ```bash
   git clone https://github.com/your-username/space-blog.git
   cd space-blog
   ```

2. Create a `.env` file in the root directory with your NASA API key:
   ```
   NASA_API_KEY=your_api_key_here
   ```

3. Serve the project using a local server. You can use any of these methods:
   - VS Code's Live Server extension
   - Python's built-in server: `python -m http.server`
   - Any other local development server

## APIs Used

- [NASA API](https://api.nasa.gov/) - For APOD and Mars Weather
- [Spaceflight News API](https://api.spaceflightnewsapi.net/v4/articles) - For space news

## Features in Detail

### Space News Feed
- Live updates from the Spaceflight News API
- Auto-scrolling news ticker
- Grid layout for detailed news items
- Images and summaries for each article

### NASA Picture of the Day
- Daily updated astronomical images
- Detailed descriptions from NASA scientists
- Support for both images and videos
- Copyright information display

### Mars Weather
- Latest weather data from Mars
- Temperature and pressure readings
- Sol (Mars day) tracking
- Error handling for data transmission delays

### Theme Toggle
- Dark/Light theme support
- Persistent theme preference
- Smooth transition effects

### Responsive Design
- Mobile-first approach
- Flexible grid layouts
- Responsive images and iframes
- Optimized for all screen sizes

## Browser Support

- Chrome (latest)
- Firefox (latest)
- Safari (latest)
- Edge (latest)

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the LICENSE file for details.
