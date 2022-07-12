import { AirQualityIndex } from './types';

export const getDayOfWeek = (date: Date) => {
    return [ 'Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday' ][date.getDay()];
}

export const getCurrentDateTime = () => {
    const now = new Date();
    const dayOfWeek = getDayOfWeek(now);
    const hours = now.getHours();

    let time: string;

    if (hours === 0) {
        time = `12:00 AM`
    } else {
        time = hours > 12 ? `${ hours - 12 }:00 PM` : `${ hours }:00 AM`
    }

    return `${ dayOfWeek } ${ time }`;
}

export const getDayOfWeekByDt = (dt_txt: string): string => {
    return getDayOfWeek(new Date(dt_txt));
}

export const getAirQuality = (airQualityIndex: AirQualityIndex | undefined): string => {
    switch (airQualityIndex) {
        case AirQualityIndex.GOOD:
            return 'Good';
        case AirQualityIndex.FAIR:
            return 'Fair';
        case AirQualityIndex.MODERATE:
            return 'Moderate';
        case AirQualityIndex.POOR:
            return 'Poor';
        case AirQualityIndex.VERY_POOR:
            return 'Very Poor';
    }
    return '';
};
