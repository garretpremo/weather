# Yubico Weather
A simple react weather app which leverages the free [openweathermap api](https://openweathermap.org/api) to display the 
current weather, air quality & a 5 day forecast for a given input (zip code/city).

This project was bootstrapped with [Create React App](https://github.com/facebook/create-react-app).

# Running the app
after cloning/forking the repository:

### `npm install`
Install dependencies

### `npm start`

Runs the app in the development mode.\
Open [http://localhost:3000](http://localhost:3000) to view it in the browser.

## Development notes:
Before realizing that the api accepted a city/zip (I was under the impression that it only accepted lat/lon),
I figured I had to convert the input into a lat/lng.

For the zip code, that was easy, just get a `Map<zipcode, { lat, lon }>`, or equivalent json object. I found the 
[zip code data](https://gist.github.com/erichurst/7882666) in the form of a csv, and wrote a quick rust program to
output the csv file into a formatted jsx file.

For the city search, that part would be a bit trickier. My idea for that was to get a Google Maps/Places API key and
run a places search from the input text. 

After about an hour of sifting through the Google Maps/Places documentation, I realized that there was no way this 
project could possibly be this hard. It was at that point I realized that the openweathermap api accepted a 
queryParam for the city and the zip.

Regrettably, I removed the data generated for the zip codes & left the rust program in the source for reference.

The rest of the implementation took around the amount of time that was suggested, around 4-5 hours.

Since I wasted so much time on the API interactions mentioned above, I've decided to leave out stylistic embellishments
and mobile support for the sake of time.  

### Running the Rust Program

### `cd parse-zip-code-csv`
### `cargo run`
