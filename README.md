# clappr-weather

Displays the current weather information in an overlay at the top of the player. The weather data is only displayed when
playing and hides when stopped.

![Snapshot](../master/screenshot.jpg)

## TODO

- ICONS!!!!
- Nicer styling

## Config

```
var player = new Clappr.Player({
	...

	plugins: [Weather],

	weatherConfig: {
		url: 'https://example.com/weather/data.json'
	},

	...
});
```

By default the weather data will be updated ever 5 seconds. You can override this by providing an alternative interval
in the `weatherConfig`:

```
weatherConfig: {
	url: 'https://example.com/weather/data.json',
	refresh: 60
},
```

This will refresh the weather data every 60 seconds.

By default the weather data is displayed in metric units. You can override this by setting the value for `units` to `imperial`:

```
weatherConfig: {
	url: 'https://example.com/weather/data.json',
	units: 'imperial'
},
```

## Data format

The expected data format for the weather data has to be JSON and has the form

```json
{
	"windspeed_ms": 1.5,
	"winddirection": 253,
	"temperature_c": 10.5,
	"humidity": 81,
	"pressure_hpa": 1021.77,
	"precipitation": {
		"value_mm": 0.0,
		"mode": "rain",
	},
	"timestamp": 1602503869,
}
```

The values are expected to be in the metric system.

> Vincent: "No man, they got the metric system. They wouldn't know what the f**k a quarter pounder is."
> Jules: "Then what do they call it?"
> Vincent: "They call it a Royale with cheese."

Field | Unit | Description
------|------|------------
`windspeed_ms` | `m/s` | The wind speed in meters per second.
`winddirection` | `°` | The direction the wind is coming from. Values from `0` to `359`.
`temperature_c` | `°C` | The temperature in degress Celsius.
`humidity` | `%` | The relative air humidity.
`pressure_hpa` | `hpa` | The atmospheric pressure in hpa.
`precipitation.value_mm` | `mm` | The precipitation in millimeter.
`precipitation.mode` | | One value of `none`, `rain`, `snow`.
`timestamp` | | Unix timestamp of the measurement.

If the server where you load the data from delivers the data in a different format, you can define a rewrite function in the config
that will transform the output into the expected form. The function expects one parameter which is a JavaScript object and will return
an object in the above mentioned form. The default for the rewrite function is `null` which means that no rewrite will happen.

Here is an example that rewrites the data from [openweathermap.org](https://openweathermap.org/api):

```js
var player = new Clappr.Player({
	...

	plugins: [Weather],

	weatherConfig: {
		url: 'https://example.com/weather/data.json',
		rewrite: function(data) {
			var d = {
				"windspeed_ms": data.wind.speed,
				"winddirection": data.wind.deg,
				"temperature_c": data.main.temp,
				"humidity": data.main.humidity,
				"pressure_hpa": data.main.pressure,
				"precipitation": {
					"value_mm": 0.0,
					"mode": "none",
				},
				"timestamp": data.dt
			};

			if ('rain' in data) {
				d.precipitation.value_mm = data.rain.rain_1h;
				d.precipitation.mode = "rain";
			}
			else if ('snow' in data) {
				d.precipitation.value_mm = data.snow.snow_1h;
				d.precipitation.mode = "snow";
			}

			return d;
		}
	},

	...
});
```
