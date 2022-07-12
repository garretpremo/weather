import React from 'react';
import { Forecast } from '../types';
import { getDayOfWeekByDt } from '../util';
import { WeatherIcon } from './weather-icon';

type Props = {
    forecast: Forecast;
}

export const ForecastList = ({ forecast }: Props) => {
    return (<>
        { forecast.list
            .filter(forecast => forecast.dt_txt.endsWith('12:00:00'))
            .map((forecast) => {
                console.log(forecast);
                return (
                    <div className="weather-block" key={ forecast.dt }>
                        <span>{ getDayOfWeekByDt(forecast.dt_txt) }</span>
                        <WeatherIcon weather={forecast.weather[0]}/>
                        <span>{ forecast.main.temp.toFixed(0) } °F</span>
                    </div>
                );
            })
        }
    </>);
}
