# clappr-weather

Still work in progress.

## What is there already?

- An element is created that can be used to fill in the data (`src/public/weather.html` and `src/public/style.scss`)
- Reading out the station ID from the config
- XHR request to load the data

## TODO

- The station data should not be a JSONP response
- Add some proper CORS header to the station server, otherwise is will not load from localhost
- Displaying the weather data
- The data should only displayed when the stream is playing

## Config

```
var player = new Clappr.Player({
	...

	plugins: [Weather],

	weatherConfig: {
		station: 82
	},

	...
});
```
