import { AirQuality, CurrentWeather, Forecast } from './types';

const apiKey = '5ad3763db6b546de229b9bc46ad3457f';
const url = `https://api.openweathermap.org/data/2.5`;

type Data = { currentWeather: CurrentWeather, forecast: Forecast, airQuality: AirQuality };

export const getWeatherDataByZipCode = (zipCode: string): Promise<Data> => {
    return Promise.all([
        getCurrentWeatherByZipCode(zipCode),
        getCurrentForecastByZipCode(zipCode),
    ])
        .then(([ currentWeather, forecast ]) => {

            return getAirQuality(forecast.city.coord.lat, forecast.city.coord.lon)
                .then(airQuality => {
                    return { currentWeather, forecast, airQuality };
                });

        });
};

export const getWeatherDataByCity = (city: string): Promise<Data> => {
    return Promise.all([
        getCurrentWeatherByCity(city),
        getCurrentForecastByCity(city),
    ])
        .then(([ currentWeather, forecast ]) => {

            return getAirQuality(forecast.city.coord.lat, forecast.city.coord.lon)
                .then(airQuality => {
                    return { currentWeather, forecast, airQuality };
                });

        });
};

const getCurrentWeatherByZipCode = (zipCode: string): Promise<CurrentWeather> => {
    return fetch(`${ url }/weather?zip=${ zipCode }&units=imperial&APPID=${ apiKey }`)
        .then(response => response.json())
        .then(handleError);
}

const getCurrentWeatherByCity = (city: string): Promise<CurrentWeather> => {
    return fetch(`${ url }/weather?q=${ city }&units=imperial&APPID=${ apiKey }`)
        .then(response => response.json())
        .then(handleError);
}

const getCurrentForecastByZipCode = (zipCode: string): Promise<Forecast> => {
    return fetch(`${ url }/forecast?zip=${ zipCode }&units=imperial&APPID=${ apiKey }`)
        .then(response => response.json())
        .then(handleError);
};

const getCurrentForecastByCity = (city: string): Promise<Forecast> => {
    return fetch(`${ url }/forecast?q=${ city }&units=imperial&APPID=${ apiKey }`)
        .then(response => response.json())
        .then(handleError);
};

const getAirQuality = (lat: number, lon: number): Promise<AirQuality> => {
    return fetch(`${ url }/air_pollution?lat=${ lat }&lon=${lon}&APPID=${ apiKey }`)
        .then(response => response.json())
        .then(handleError);
}

function handleError<T extends { cod: number | string, message?: string }>(responseJson: T): T {
    if (responseJson.cod && `${ responseJson.cod }` !== '200') {
        throw new Error(responseJson.message);
    }
    return responseJson;
}
