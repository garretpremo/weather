import React, { useEffect, useState } from 'react';
import './App.scss';
import { CurrentWeather } from './types';

import { zipCodeData } from './zip-code-data';

function App() {
    const getCurrentTime = () => {
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

    const [ loading, setLoading ] = useState(false);
    const [ currentWeather, setCurrentWeather ] = useState<CurrentWeather | null>(null);
    const [ currentTime, setCurrentTime ] = useState(getCurrentTime());

    const handleChangeZipCode = (value: string) => {
        if (!/^\d{5}$/.test(value)) {
            return;
        }

        setLoading(true);

        const apiKey = '5ad3763db6b546de229b9bc46ad3457f';
        const { latitude, longitude } = zipCodeData[value];

        Promise.all([
            fetch(`https://api.openweathermap.org/data/2.5/weather?units=imperial&lat=${ latitude }&lon=${ longitude }&APPID=${ apiKey }`).then(response => response.json()),
            fetch(`https://api.openweathermap.org/data/2.5/forecast?units=imperial&lat=${ latitude }&lon=${ longitude }&APPID=${ apiKey }`).then(response => response.json())
        ])
            .then(([ currentWeather, forecast ]) => {
                setCurrentWeather(currentWeather);
                console.log({ currentWeather });
                console.log({ forecast });

                setLoading(false);
                setCurrentTime(getCurrentTime());
            });
    }

    return (
        <div className="app">
            <header><h1>Weather Forecast</h1></header>
            <div className="zip-code-form">
                <label>Zip Code</label>
                <input type="text" onChange={ e => handleChangeZipCode(e.target.value) } disabled={ loading }/>
            </div>
            <div className="weather">
                { currentWeather && (
                    <>
                        <header className="current-weather-header">
                            <div className="header-left">
                                <div className="weather-icon">
                                    <img
                                        src={ `http://openweathermap.org/img/w/${ currentWeather.weather[0].icon }.png` }/>
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
                    </>
                ) }
            </div>
        </div>
    );
}

export default App;
