import { Events, Styler, UICorePlugin, template } from 'clappr';
import pluginHtml from './public/weather.html';
import pluginStyle from './public/style.scss';

const VERSION = '0.1.0';
const DEFAULT_URL = null;
const DEFAULT_REFRESH = 5;
const DEFAULT_REWRITE = null;
const DEFAULT_UNITS = 'metric';

export default class Weather extends UICorePlugin {
	bindEvents() {
		this.listenTo(this.core, Events.CORE_ACTIVE_CONTAINER_CHANGED, () => {
			this.core.activeContainer.$el.append(this.el);

			this.playback = this.core.getCurrentPlayback();
			this.listenTo(this.playback, Events.PLAYBACK_PLAY, () => {
				this.isPlaying = true;
				this.show();
			});
			this.listenTo(this.playback, Events.PLAYBACK_STOP, () => {
				this.isPlaying = false;
				this.show();
			});
		});
		this.listenToOnce(this.core, Events.CORE_READY, this.onCoreReady);
	}

	onCoreReady() {
		this.hasData = false;
		this.isPlaying = false;

		this.url = DEFAULT_URL;
		this.rewrite = DEFAULT_REWRITE;
		this.refresh = DEFAULT_REFRESH;
		this.units = DEFAULT_UNITS;

		const cfg = this.core.options.weatherConfig || {};

		if ('rewrite' in cfg) {
			if (typeof cfg.rewrite === 'function') {
				this.rewrite = cfg.rewrite;
			}
		}

		if ('url' in cfg) {
			this.url = cfg.url;
		}

		if ('refresh' in cfg) {
			this.refresh = parseInt(cfg.refresh);
		}

		if ('units' in cfg) {
			if (cfg.units === 'imperial') {
				this.units = 'imperial';
			}
		}

		this.loadData();
	}

	static get version() {
		return VERSION;
	}

	get name() {
		return 'weather';
	}

	get template() {
		return template(pluginHtml);
	}

	get attributes() {
		return {
			'class': this.name,
			'data-weather': ''
		};
	}

	get events() {
		return {};
	}

	setData(data) {
		if (data === null) {
			return;
		}

		this.data = data;
		this.hasData = true;

		let temperature = undefined;
		let precipitation = undefined;
		let winddirection = undefined;
		let windspeed = undefined;
		let pressure = undefined;
		let humidity = undefined;
		let timestamp = undefined;

		if(this.units === 'imperial') {
			temperature = this._convertToFahrenheit(data.temperature_c).toFixed(1) + ' °F';
			winddirection = data.winddirection.toFixed(0) + '° ' + this._getHeading(data.winddirection);
			windspeed = this._convertToMPH(data.windspeed_ms).toFixed(1) + ' mph';
		}
		else {
			temperature = data.temperature_c.toFixed(1) + ' °C';
			winddirection = data.winddirection.toFixed(0) + '° ' + this._getHeading(data.winddirection);
			windspeed = data.windspeed_ms.toFixed(1) + ' m/s';
		}

		precipitation = {
			value: ((data.precipitation.mode === 'none') ? '0' : data.precipitation.value_mm.toFixed(1)) + ' mm',
			mode: data.precipitation.mode
		};

		pressure = data.pressure_hpa.toFixed(2) + ' hpa';
		humidity = data.humidity.toFixed(0) + '%';

		this.$el.html(this.template({
			temperature: temperature,
			precipitation: precipitation,
			winddirection: winddirection,
			windspeed: windspeed,
			pressure: pressure,
			humidity: humidity,
			timestamp: timestamp,
		}));
		this.$el.append(Styler.getStyleFor(pluginStyle));

		this.show();
	}

	_convertToFahrenheit(_value) {
		return (_value * 1.8) + 32;
	}

	_convertToMPH(_value) {
		return (_value / 1.609344 * 1000 / 3600);
	}

	_getHeading(_direction) {
		if(_direction < 0 || _direction > 360) {
			return '--';
		}

		const directions = 'N NNE NE ENE E ESE SE SSE S SSW SW WSW W WNW NW NNW'.split(' ');

		let direction = 0;
		const step = Math.floor(360 / directions.length);
		let i = Math.floor(step / 2);

		if(_direction <= i || _direction >= 360 - i) {
			return 'N';
		}

		while (i <= _direction) {
			direction++;
			i += step;
		}

		return directions[direction];
	}

	show() {
		if (this.hasData == true && this.isPlaying == true) {
			this.$el.show();
		}
		else {
			this.$el.hide();
		}

		return;
	}

	loadData() {
		if (!this.url) {
			return;
		}

		let self = this;

		let r = new XMLHttpRequest();
		let url = this.url + (this.url.indexOf('?') !== -1 ? '&' : '?') + Date.now();

		r.open('GET', url);
		r.onload = function() {
			if (r.readyState === r.DONE) {
				if (r.status === 200) {
					let text = r.responseText;

					let data = null;
					try {
						data = JSON.parse(text);
					} catch (error) {
						data = text;
					}

					if (self.rewrite !== null) {
						data = self.rewrite(data);
					}

					self.setData(data);
				}

				if (self.refresh > 0) {
					setTimeout(function() {
						self.loadData();
					}, self.refresh * 1000);
				}
			}
		};
		r.send();
	}
}
