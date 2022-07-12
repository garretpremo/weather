import { CurrentWeather, Forecast } from './types';

const apiKey = '5ad3763db6b546de229b9bc46ad3457f';
const url = `https://api.openweathermap.org/data/2.5`;

export const getCurrentWeatherByZipCode = (zipCode: string): Promise<CurrentWeather> => {
    return fetch(`${url}/weather?zip=${ zipCode }&units=imperial&APPID=${ apiKey }`)
        .then(response => response.json())
        .then(handleError);
}

export const getCurrentWeatherByCity = (city: string): Promise<CurrentWeather> => {
    return fetch(`${url}/weather?q=${ city }&units=imperial&APPID=${ apiKey }`)
        .then(response => response.json())
        .then(handleError);
}

export const getCurrentForecastByZipCode = (zipCode: string): Promise<Forecast> => {
    return fetch(`${url}/forecast?zip=${ zipCode }&units=imperial&APPID=${ apiKey }`)
        .then(response => response.json())
        .then(handleError);
};

export const getCurrentForecastByCity = (city: string): Promise<Forecast> => {
    return fetch(`${url}/forecast?q=${ city }&units=imperial&APPID=${ apiKey }`)
        .then(response => response.json())
        .then(handleError);
};

function handleError<T extends { cod: number | string, message?: string }>(responseJson: T): T {
    if (`${responseJson.cod}` !== '200') {
        throw new Error(responseJson.message);
    }
    return responseJson;
}
