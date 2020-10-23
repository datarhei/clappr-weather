import { Events, UIContainerPlugin, template, $ } from 'clappr';
import weatherHTML from './public/weather.html';
import './public/style.scss';
import icon from './public/icon.svg';
import icon_disabled from './public/icon_disabled.svg';

const DEFAULT_URL = null;
const DEFAULT_REFRESH = 5;
const DEFAULT_REWRITE = null;
const DEFAULT_UNITS = 'metric';

export default class Weather extends UIContainerPlugin {
	get name() {
		return 'weather';
	}

	get template() {
		return template(weatherHTML);
	}

	get attributes() {
		return {
			'class': this.name,
			'data-weather': ''
		};
	}

	constructor(container) {
		super(container);
		this.configure();
	}

	bindEvents() {
		this.listenTo(this.container, Events.CONTAINER_PLAY, () => {
			this.show();
		});
		this.listenTo(this.container, Events.CONTAINER_STOP, () => {
			this.hide();
		});
		this.listenTo(this.container, Events.CONTAINER_OPTIONS_CHANGE, this.configure);
	}

	configure() {
		this.hasData = false;

		this.url = DEFAULT_URL;
		this.rewrite = DEFAULT_REWRITE;
		this.refresh = DEFAULT_REFRESH;
		this.units = DEFAULT_UNITS;
		this.data = null;

		const cfg = this.options.weatherConfig || {};

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

		this.load();
		this.render();
	}

	destroy() {
		this.$el.remove();
	}

	render() {
		this.$el.hide();

		this.container.$el.append(this.$el);

		return this;
	}

	disable() {
		this.enabled = false;

		this.hide();
	}

	enable() {
		//this.bindEvents();
		this.enabled = true;

		this.show();
		this.load();
	}

	update(data) {
		if (data === null) {
			return;
		}

		this.hasData = true;

		let temperature = undefined;
		let precipitation = undefined;
		let winddirection = undefined;
		let windspeed = undefined;
		let pressure = undefined;
		let humidity = undefined;
		let timestamp = undefined;

		if (this.units === 'imperial') {
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
	}

	_convertToFahrenheit(_value) {
		return (_value * 1.8) + 32;
	}

	_convertToMPH(_value) {
		return (_value / 1.609344 * 1000 / 3600);
	}

	_getHeading(_direction) {
		if (_direction < 0 || _direction > 360) {
			return '--';
		}

		const directions = 'N NNE NE ENE E ESE SE SSE S SSW SW WSW W WNW NW NNW'.split(' ');

		let direction = 0;
		const step = Math.floor(360 / directions.length);
		let i = Math.floor(step / 2);

		if (_direction <= i || _direction >= 360 - i) {
			return 'N';
		}

		while (i <= _direction) {
			direction++;
			i += step;
		}

		return directions[direction];
	}

	show() {
		if (this.enabled == true && this.hasData == true) {
			$('.clappr-watermark[data-watermark]').css('transition', 'top .4s ease-out');
			$('.clappr-watermark[data-watermark-top-left]').css('top', '50px');
			$('.clappr-watermark[data-watermark-top-right]').css('top', '50px');
			this.$el.show();
			this.$el.css('opacity', 1);
		}

		return;
	}

	hide() {
		this.$el.css('opacity', 0);
		this.$el.hide();
		$('.clappr-watermark[data-watermark]').css('transition', 'top .4s ease-out');
		$('.clappr-watermark[data-watermark-top-left]').css('top', '10px');
		$('.clappr-watermark[data-watermark-top-right]').css('top', '10px');
	}

	load() {
		if (!this.url || this.enabled === false) {
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
					}
					catch (error) {
						data = text;
					}

					if (self.rewrite !== null) {
						data = self.rewrite(data);
					}

					self.update(data);
				}

				if (self.refresh > 0) {
					setTimeout(function() {
						self.load();
					}, self.refresh * 1000);
				}
			}
		};
		r.send();
	}

	// PluginControl interface
	pluginControl() {
		let self = this;

		if (this.hasData === false) {
			return null;
		}

		return {
			icon: function() {
				if (self.enabled === true) {
					return icon;
				}
				else {
					return icon_disabled;
				}
			},
			name: function(lang = 'en') {
				let name = 'Weather';

				switch (lang) {
				case 'de': name = 'Wetter'; break;
				}

				return name;
			},
			toggle: function() {
				if (self.enabled === true) {
					self.disable();
				}
				else {
					self.enable();
				}

				return self.enabled;
			},
			toggled: function() {
				return self.enabled;
			}
		};
	}
}
