import React, { useEffect, useState } from 'react';
import { getWeatherDataByCity, getWeatherDataByZipCode } from './api';
import './App.scss';
import { ForecastList } from './components/forecast-list';
import { WeatherIcon } from './components/weather-icon';
import { AirQuality, CurrentWeather, Forecast } from './types';
import { getAirQuality, getCurrentDateTime } from './util';

function App() {

    const [ zipCode, setZipCode ] = useState<string>('');
    const [ invalidZipCode, setInvalidZipCode ] = useState<boolean>(false);
    const [ city, setCity ] = useState<string>('');
    const [ invalidCity, setInvalidCity ] = useState<boolean>(false);
    const [ currentWeather, setCurrentWeather ] = useState<CurrentWeather | null>(null);
    const [ forecast, setForecast ] = useState<Forecast | null>(null);
    const [ airQuality, setAirQuality ] = useState<AirQuality | null>(null);
    const [ currentTime, setCurrentTime ] = useState(getCurrentDateTime());
    const [ placeDebounce, setPlaceDebounce ] = useState<NodeJS.Timeout | null>(null);

    useEffect(() => {
        setCurrentTime(getCurrentDateTime());
    }, [ currentWeather ]);

    useEffect(() => setInvalidZipCode(false), [ zipCode ]);
    useEffect(() => setInvalidCity(false), [ city ]);

    const handleChangeZipCode = (inputZipCode: string) => {
        setCity('');
        setZipCode(inputZipCode);

        if (!/^\d{5}$/.test(inputZipCode)) {
            return;
        }

        // before I realized the API accepted a zip param :facepalm:
        // const { latitude, longitude } = zipCodeData[value];

        getWeatherDataByZipCode(inputZipCode)
            .then(({ currentWeather, forecast, airQuality }) => {
                setCurrentWeather(currentWeather);
                setForecast(forecast);
                setAirQuality(airQuality);
            })
            .catch(() => setInvalidZipCode(true));
    }

    const handleChangePlace = (inputCity: string) => {
        setCity(inputCity);
        setZipCode('');

        if (placeDebounce !== null) {
            clearTimeout(placeDebounce);
        }

        if (inputCity === '') {
            return;
        }

        setPlaceDebounce(setTimeout(() => {

            getWeatherDataByCity(inputCity)
                .then(({ currentWeather, forecast, airQuality }) => {
                    setCurrentWeather(currentWeather);
                    setForecast(forecast);
                    setAirQuality(airQuality);
                })
                .catch(() => setInvalidCity(true));

        }, 400));
    }

    return (
        <div className="app">
            <header><h1>Weather Forecast</h1></header>

            {/* Input Form */ }
            <div className="place-form">

                {/* Zip code Input */}
                <div className="zip-code-form">
                    <label>Zip Code</label>
                    <input type="text" value={ zipCode } onChange={ e => handleChangeZipCode(e.target.value) }/>
                    { invalidZipCode && (<span className="error">Invalid Zip Code</span>) }
                </div>
                <span className="or"> Or </span>

                {/* City Input */}
                <div className="city-form">
                    <label>Place name</label>
                    <input type="text" value={ city } onChange={ e => handleChangePlace(e.target.value) }/>
                    { invalidCity && (<span className="error">Invalid City</span>) }
                    { !invalidCity && (<span className="hint">City/City, Country/City, State, Country</span>) }
                </div>
            </div>

            { currentWeather && airQuality && forecast && (
                <div className="weather">

                    {/* Current Weather & Air Quality */ }
                    <header className="current-weather-header">
                        <div className="header-left">
                            <WeatherIcon weather={ currentWeather.weather?.[0] }/>
                            <span className="temperature">{ currentWeather.main.temp.toFixed(0) }</span>
                            <span> °F</span>
                            <div className="header-left-weather-info">
                                <span>Precipitation: { currentWeather?.rain?.['3h'] ?? currentWeather?.snow?.['3h'] ?? 0 }%</span>
                                <span>Humidity: { currentWeather.main.humidity }%</span>
                                <span>Wind: { currentWeather.wind.speed.toFixed(0) }mph</span>
                                <span>Air Quality: { getAirQuality(airQuality?.list?.[0]?.main?.aqi) }</span>
                            </div>
                        </div>
                        <div className="header-right">
                            <span className="location">{ currentWeather.name }</span>
                            <span>{ currentTime }</span>
                            <span>{ currentWeather.weather[0].main }</span>
                        </div>
                    </header>

                    {/* Forecast */ }
                    { forecast && (
                        <section className="forecast">
                            <header className="forecast-header">Forecast</header>
                            <div className="forecast-list">
                                <ForecastList forecast={ forecast }/>
                            </div>
                        </section>
                    ) }
                </div>
            )}
        </div>
    );
}

export default App;
