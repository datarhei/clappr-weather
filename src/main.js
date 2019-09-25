import { Events, Styler, UICorePlugin, UIContainerPlugin, template } from 'clappr';
import pluginHtml from './public/weather.html';
import pluginStyle from './public/style.scss';

const VERSION = '0.1.0';
const DEFAULT_URL = 'https://livespotting.com/weather/live/[station].json';
const DEFAULT_REFRESH = 5;

export default class Weather extends UICorePlugin {
	bindEvents() {
    	this.listenTo(this.core, Events.CORE_ACTIVE_CONTAINER_CHANGED, () => { this.core.activeContainer.$el.append(this.el); });
    	this.listenToOnce(this.core, Events.CORE_READY, this.onCoreReady);
	}

	onCoreReady() {
		this.hasData = false;
		this.isPlaying = true;

	    this.station = 0;
	    this.url = DEFAULT_URL;
	    this.refresh = DEFAULT_REFRESH;

	    const cfg = this.core.options.weatherConfig || {};

		if('station' in cfg) {
			this.station = cfg.station;
		}

		if('url' in cfg) {
			this.url = cfg.url;
		}

		if('refresh' in cfg) {
			this.refresh = parseInt(cfg.refresh);
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
		if(data === null) {
			return;
		}

		this.data = data;
		this.hasData = true;

		this.$el.html(this.template({
			temperature: data.temperature.toFixed(1),
			rain: data.rain.toFixed(1),
			winddirection: data.winddirection + '° ' + data.winddirection_txt,
			windspeed: data['windspeed-ms']
		}));
	    this.$el.append(Styler.getStyleFor(pluginStyle));

		this.show();
	}

	show() {
		if(this.hasData == true && this.isPlaying == true) {
			this.$el.show();
		}

		return;
	}

	loadData() {
		if(!this.station) {
			return;
		}

		let self = this;

		let r = new XMLHttpRequest();

		let url = this.url.replace('[station]', this.station);
		r.open("GET", url);
		r.onload = function() {
			if(r.readyState === r.DONE) {
		        if(r.status === 200) {
		        	let text = r.responseText;

		        	if(text.startsWith('lscallback({')) {
		        		text = text.replace('lscallback({', '{');
		        		text = text.replace('})', '}');
		        	}

		        	let data = null;
		        	try {
		            	data = JSON.parse(text);
		            } catch(error) {
		            	console.log(error);
		            	console.log(r.responseText);
		            	data = null;
		            }

		            self.setData(data);
		        }

		        if(self.refresh > 0) {
			        setTimeout(function() {
				    	self.loadData();
				    }, self.refresh * 1000);
			    }
		    }
		};
		r.send();
	}
}
