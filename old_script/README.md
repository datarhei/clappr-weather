# LIVE WEATHER WIDGET

Example:

Open "../index.html?station=82"    
Request each second "//livespotting.tv/weather/live/82.json"

#### JSON structure:
```json
lscallback({
	"windspeed-ms": 0.0,
	"windspeed-kts": 0,
	"windspeed-bft": 0,
	"winddirection": 317,
	"winddirection_txt": "NW",
	"temperature": 3.00,
	"humidity": 92,
	"pressure": 727.40,
	"uvindex": -1,
	"solarradiation": -1,
	"rain": 0.0,
	"timestamp": "15.3.2016 21:23:47"
})
```

#### HTML structure:
```sh
    <div id="liveweather-container">
        <ul>
            <li class="live">
                <div class="wrapper">
                    <div class="content">
                        <p>LIVE</p>
                    </div>
                </div>
            </li>
            <li class="temperature" title="Temperatur">
                <div class="wrapper">
                    <div class="content">
                        <p data-icon="-">5,6 °C</p>
                    </div>
                </div>
            </li>
            <li class="rain" title="Regenmenge">
                <div class="wrapper">
                    <div class="content">
                        <p data-icon=".">0,0 mm</p>
                        <div class="wrapper">
                            <div class="content"></div>
                        </div>
                    </div>
                </div>
            </li>
            <li class="wind" title="Windrichtung / Windgeschwindigkeit">
                <div class="wrapper">
                    <div class="content">
                        <p data-icon="/">65° ONO<br>2,20 m/s</p>
                    </div>
                </div>
            </li>
        </ul>
    </div>
```