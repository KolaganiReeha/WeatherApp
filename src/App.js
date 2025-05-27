import { useState, useEffect } from 'react';
import axios from 'axios';
import 'bootstrap/dist/css/bootstrap.min.css';
import { FiSunrise, FiSunset } from 'react-icons/fi';

function WeatherApp() {
  const [city, setCity] = useState('London');
  const [climate, setClimate] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [background, setBackground] = useState('');

  const API_KEY =  process.env.REACT_APP_OPENWEATHER_API_KEY;
  console.log('Using API key:', process.env.REACT_APP_OPENWEATHER_API_KEY);

  const fetchWeather = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await axios.get(`https://api.openweathermap.org/data/2.5/weather?q=${city}&units=metric&appid=${API_KEY}`);
      setClimate(response.data);
      updateBackground(response.data.weather[0].main);
    } catch (err) {
      if (err.response?.status === 404) {
        setError('City not found.');
      } else {
        setError('Failed to fetch weather data. Please try again later.');
      }
    } finally {
      setLoading(false);
    }
  };

  const updateBackground = (weatherCondition) => {
  const backgrounds = {
  Clouds: 'https://images.pexels.com/photos/167699/pexels-photo-167699.jpeg',
  Rain: 'https://images.pexels.com/photos/459451/pexels-photo-459451.jpeg',
  Clear: 'https://images.pexels.com/photos/912110/pexels-photo-912110.jpeg',
  Snow: 'https://images.unsplash.com/photo-1491002052546-bf38f186af56?ixlib=rb-1.2.1&auto=format&fit=crop&w=1600&q=80',
  Wind: 'https://images.unsplash.com/photo-1506318137071-a8e063b4bec0?ixlib=rb-1.2.1&auto=format&fit=crop&w=1600&q=80',
  Thunderstorm: 'https://images.pexels.com/photos/53459/lightning-storm-weather-sky-53459.jpeg',
  Fog: 'https://images.pexels.com/photos/547119/pexels-photo-547119.jpeg', 
  Haze: 'https://images.pexels.com/photos/807598/pexels-photo-807598.jpeg',
  default: 'https://images.unsplash.com/photo-1534447677768-be436bb09401?ixlib=rb-1.2.1&auto=format&fit=crop&w=1600&q=80'
};
    setBackground(backgrounds[weatherCondition] || backgrounds.default);
  };

  const formatTime = (timestamp, timeOffset) => {
    const utcDate =  new Date(timestamp * 1000);
    const localTime = new Date(utcDate.getTime()+(timeOffset*1000)).toLocaleTimeString('en-US',{
      hour:'2-digit',
      minute:'2-digit',
      hour12:true,
      timeZone:'UTC'
    });
    return localTime;
  };

  useEffect(() => {
  console.log('All environment variables:', process.env);
  fetchWeather();
}, []);

  const handleSubmit = (e) => {
  e.preventDefault();
  if (!city.trim()) {
    setError('Please enter a city name');
    return;
  }
  fetchWeather();
};

  return (
    <div style={{
      backgroundImage: `url(${background})`,
      backgroundSize: 'cover',
      backgroundPosition: 'center',
      backgroundAttachment: 'fixed',
      minHeight: '100vh',
      padding: '20px',
      transition: 'background-image 0.3s ease'
    }}>
      <div className="container">
        <div className="row justify-content-center">
          <div className="col-md-6">
            <div className="card shadow-lg" style={{ 
              backgroundColor: 'rgba(255, 255, 255, 0.85)',
              backdropFilter: 'blur(5px)',
              borderRadius: '15px'
            }}>
              <div className="card-body">
                <form onSubmit={handleSubmit} className="mb-4">
                  <div className="input-group">
                    <input type="text" className="form-control" value={city} onChange={(e) => setCity(e.target.value)} placeholder="Enter city name"/>
                    <button className="btn btn-primary" type="submit" disabled={loading}>{loading ? 'Searching...' : 'Search'}</button>
                  </div>
                </form>

                {error && <div className="alert alert-danger">{error}</div>}

                {loading && <div className="text-center my-3">Loading weather data...</div>}

                {climate && (
                  <div className="text-center">
                    <h2>{climate.name}, {climate.sys.country}</h2>
                    <div className="d-flex justify-content-center align-items-center my-3">
                      <img src={`https://openweathermap.org/img/wn/${climate.weather[0].icon}@2x.png`} alt={climate.weather[0].description} style={{ width: '80px' }}/>
                      <h1 className="display-4 mx-3">{Math.round(climate.main.temp)}°C</h1>
                    </div>
                    <p className="lead text-capitalize">{climate.weather[0].description}</p>
                    <div className="row mt-4">
                      <div className="col-md-6">
                        <p>Feels like: {Math.round(climate.main.feels_like)}°C</p>
                        <p>Humidity: {climate.main.humidity}%</p>
                        <p>Wind: {climate.wind.speed} m/s</p>
                      </div>
                      <div className="col-md-6">
                        <p>High: {Math.round(climate.main.temp_max)}°C</p>
                        <p>Low: {Math.round(climate.main.temp_min)}°C</p>
                        <p>Visibility: {(climate.visibility * 0.000621371).toFixed(1)} miles</p>
                      </div>
                    </div> 
                    <div className="row mt-3">
                      <div className="col-md-6">
                        <p>Sunrise: {formatTime(climate.sys.sunrise,climate.timezone)} <FiSunrise size={15} color="orange" /></p>
                      </div>
                      <div className="col-md-6">
                        <p>Sunset: {formatTime(climate.sys.sunset,climate.timezone)} <FiSunset size={15} color="darkorange" /></p>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default WeatherApp;