export interface CurrentWeather {
    weather: {
        id: number;
        main: string;
        description: string;
        icon: string;
    }[];
    name: string;
    main: {
        feels_like: number;
        humidity: number;
        pressure: number;
        temp: number;
        temp_max: number;
        temp_min: number;
    };
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
