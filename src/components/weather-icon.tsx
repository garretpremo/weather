import React from 'react';
import { Weather } from '../types';

type Props = {
    weather: Weather;
}

export const WeatherIcon = ({ weather }: Props) => {
    return (
        <div className="weather-icon" title={ weather.main }>
            <img src={ `http://openweathermap.org/img/w/${ weather?.icon }.png` }/>
        </div>
    );
}
