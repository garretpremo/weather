export interface Weather {
    id: number;
    main: string;
    description: string;
    icon: string;
}

interface WeatherMain {
    feels_like: number;
    humidity: number;
    pressure: number;
    temp: number;
    temp_max: number;
    temp_min: number;
}

export interface CurrentWeather {
    cod: number;
    message?: string;
    weather: Weather[];
    name: string;
    main: WeatherMain;
    rain: {
        "3h": number;
    };
    snow: {
        "3h": number;
    };
    wind: {
        speed: number;
    }
}

export interface Forecast {
    city: {
        coord: {
            lat: number;
            lon: number;
        }
        country: string;
        id: number;
        name: string;
        population: number;
        sunrise: number;
        sunset: number;
        timezone: number;
    };
    list: {
        dt: number;
        dt_txt: string;
        main: WeatherMain;
        weather: Weather[];
    }[];
}

export enum AirQualityIndex {
    GOOD = 1,
    FAIR = 2,
    MODERATE = 3,
    POOR = 4,
    VERY_POOR = 5,
}

export interface AirQuality {
    list: {
        dt: number,
        main: {
            aqi: AirQualityIndex;
        }
    }[]
}
