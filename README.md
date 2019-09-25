# clappr-weather

Displays the current weather information in an overlay at the top of the player.

## What is there already?

- An element is created that can be used to fill in the data (`src/public/weather.html` and `src/public/style.scss`)
- Reading out the station ID from the config
- XHR request to load the data
- Displaying the weather data

## TODO

- ICONS!!!!
- The station data should not be a JSONP response. There is a workaround.
- Add some proper CORS header to the station server, otherwise is will not load from localhost

## Config

```
var player = new Clappr.Player({
	...

	plugins: [Weather],

	weatherConfig: {
		station: 38
	},

	...
});
```

By default it tries to fetch the data from `https://livespotting.com/weather/live/[station].json`. You can override this
by providing an alternative URL in the `weatherConfig`:

```
weatherConfig: {
	station: 38,
	url: 'https://example.com/weather/[station].json'
},
```

The placeholder `[station]` will be replaced by the value of `station`.

By default the weather data will be updated ever 5 seconds. You can override this by providing an alternative interval
in the `weatherConfig`:

```
weatherConfig: {
	station: 38,
	refresh: 15
},
```

This will refresh the weather data every 15 seconds.
