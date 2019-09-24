import { Events, Styler, UICorePlugin, UIContainerPlugin, template } from 'clappr';
import pluginHtml from './public/weather.html';
import pluginStyle from './public/style.scss';

const VERSION = '1.0.0';

export default class Weather extends UICorePlugin {
	constructor(container) {
	    super(container);

	    this.hasData = false;
	    this.station = 0;

	    this.$el.html(this.template());
	    this.$el.append(Styler.getStyleFor(pluginStyle));

	    const cfg = this.core.options.weatherConfig || {};

	    console.log(cfg);

		if('station' in cfg) {
			this.station = cfg.station;
		}

	    this.loadData();
	}

	bindEvents() {
    	this.listenTo(this.core, Events.CORE_ACTIVE_CONTAINER_CHANGED, () => { this.core.activeContainer.$el.append(this.el); });
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
		this.data = data;
		this.hasData = true;

		this.$el.show();
	}

	loadData() {
		if(!this.station) {
			return;
		}

		let self = this;

		let r = new XMLHttpRequest();
		r.open("GET", "https://livespotting.com/weather/live/" + this.station + ".json");
		r.onload = function() {
			if(r.readyState === r.DONE) {
		        if(r.status === 200) {
		            console.log(r.response);
		            console.log(r.responseText);

		            self.setData(r.responseText);
		        }

		        setTimeout(function() {
			    	self.loadData();
			    }, 1000);
		    }
		};
		r.send();
	}
}
