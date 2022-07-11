import React, { useEffect, useState } from 'react';
import './App.scss';
import { getCurrentForecastByZipCode, getCurrentWeatherByCity, getCurrentWeatherByZipCode } from './api';
import { CurrentWeather } from './types';

function App() {
    const getCurrentDateTime = () => {
        const now = new Date();
        const dayOfWeek = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'][now.getDay()];
        const hours = now.getHours();

        let time: string;

        if (hours === 0) {
            time = `12:00 AM`
        } else {
            time = hours > 12 ? `${hours - 12}:00 PM` : `${hours}:00 AM`
        }

        return `${dayOfWeek} ${time}`;
    }

    const [ zipCode, setZipCode ] = useState<string>('');
    const [ invalidZipCode, setInvalidZipCode ] = useState<boolean>(false);
    const [ city, setCity ] = useState<string>('');
    const [ invalidCity, setInvalidCity ] = useState<boolean>(false);
    const [ currentWeather, setCurrentWeather ] = useState<CurrentWeather | null>(null);
    const [ forecast, setForecast ] = useState<any>(null);
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

        Promise.all([
            getCurrentWeatherByZipCode(inputZipCode),
            getCurrentForecastByZipCode(inputZipCode)
        ])
            .then(([ currentWeather, forecast ]) => {
                setCurrentWeather(currentWeather);
                setForecast(forecast);
                console.log({ forecast });
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

            getCurrentWeatherByCity(inputCity)
                .then(setCurrentWeather)
                .catch(() => setInvalidCity(true));

        }, 400));
    }

    return (
        <div className="app">
            <header><h1>Weather Forecast</h1></header>
            <div className="place-form">
                <div className="zip-code-form">
                    <label>Zip Code</label>
                    <input type="text" value={zipCode} onChange={ e => handleChangeZipCode(e.target.value) }/>
                    { invalidZipCode && (<span className="error">Invalid Zip Code</span>) }
                </div>
                <span className="or"> Or </span>
                <div className="place-name-form">
                    <label>Place name</label>
                    <input type="text" value={city} onChange={ e => handleChangePlace(e.target.value) }/>
                    { invalidCity && (<span className="error">Invalid City</span>) }
                </div>
            </div>
            { currentWeather && (
                <div className="weather">
                    { currentWeather && (
                        <header className="current-weather-header">
                            <div className="header-left">
                                <div className="weather-icon">
                                    <img
                                        src={ `http://openweathermap.org/img/w/${ currentWeather.weather?.[0]?.icon }.png` }/>
                                </div>
                                <span className="temperature">{ currentWeather.main.temp.toFixed(0) }</span>
                                <span> °F</span>
                                <div className="header-left-weather-info">
                                    <span>Precipitation: { currentWeather?.rain?.['3h'] ?? currentWeather?.snow?.['3h'] ?? 0 }%</span>
                                    <span>Humidity: { currentWeather.main.humidity }%</span>
                                    <span>Wind: { currentWeather.wind.speed.toFixed(0) }mph</span>
                                </div>
                            </div>
                            <div className="header-right">
                                <span className="location">{ currentWeather.name }</span>
                                <span>{ currentTime }</span>
                                <span>{ currentWeather.weather[0].main }</span>
                            </div>
                        </header>
                    )}
                    { forecast && (
                        <section className="forecast">

                        </section>
                    )}
                </div>
            )}
        </div>
    );
}

export default App;
