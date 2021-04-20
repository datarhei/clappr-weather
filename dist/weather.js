(function (global, factory) {
  typeof exports === 'object' && typeof module !== 'undefined' ? module.exports = factory(require('@clappr/core')) :
  typeof define === 'function' && define.amd ? define(['@clappr/core'], factory) :
  (global = typeof globalThis !== 'undefined' ? globalThis : global || self, global.Weather = factory(global.Clappr));
}(this, (function (core) { 'use strict';

  function _classCallCheck(instance, Constructor) {
    if (!(instance instanceof Constructor)) {
      throw new TypeError("Cannot call a class as a function");
    }
  }

  function _defineProperties(target, props) {
    for (var i = 0; i < props.length; i++) {
      var descriptor = props[i];
      descriptor.enumerable = descriptor.enumerable || false;
      descriptor.configurable = true;
      if ("value" in descriptor) descriptor.writable = true;
      Object.defineProperty(target, descriptor.key, descriptor);
    }
  }

  function _createClass(Constructor, protoProps, staticProps) {
    if (protoProps) _defineProperties(Constructor.prototype, protoProps);
    if (staticProps) _defineProperties(Constructor, staticProps);
    return Constructor;
  }

  function _inherits(subClass, superClass) {
    if (typeof superClass !== "function" && superClass !== null) {
      throw new TypeError("Super expression must either be null or a function");
    }

    subClass.prototype = Object.create(superClass && superClass.prototype, {
      constructor: {
        value: subClass,
        writable: true,
        configurable: true
      }
    });
    if (superClass) _setPrototypeOf(subClass, superClass);
  }

  function _getPrototypeOf(o) {
    _getPrototypeOf = Object.setPrototypeOf ? Object.getPrototypeOf : function _getPrototypeOf(o) {
      return o.__proto__ || Object.getPrototypeOf(o);
    };
    return _getPrototypeOf(o);
  }

  function _setPrototypeOf(o, p) {
    _setPrototypeOf = Object.setPrototypeOf || function _setPrototypeOf(o, p) {
      o.__proto__ = p;
      return o;
    };

    return _setPrototypeOf(o, p);
  }

  function _isNativeReflectConstruct() {
    if (typeof Reflect === "undefined" || !Reflect.construct) return false;
    if (Reflect.construct.sham) return false;
    if (typeof Proxy === "function") return true;

    try {
      Boolean.prototype.valueOf.call(Reflect.construct(Boolean, [], function () {}));
      return true;
    } catch (e) {
      return false;
    }
  }

  function _assertThisInitialized(self) {
    if (self === void 0) {
      throw new ReferenceError("this hasn't been initialised - super() hasn't been called");
    }

    return self;
  }

  function _possibleConstructorReturn(self, call) {
    if (call && (typeof call === "object" || typeof call === "function")) {
      return call;
    }

    return _assertThisInitialized(self);
  }

  function _createSuper(Derived) {
    var hasNativeReflectConstruct = _isNativeReflectConstruct();

    return function _createSuperInternal() {
      var Super = _getPrototypeOf(Derived),
          result;

      if (hasNativeReflectConstruct) {
        var NewTarget = _getPrototypeOf(this).constructor;

        result = Reflect.construct(Super, arguments, NewTarget);
      } else {
        result = Super.apply(this, arguments);
      }

      return _possibleConstructorReturn(this, result);
    };
  }

  var weatherHTML = "<ul>\n\t<% if (temperature !== undefined) { %>\n\t<li class=\"temperature\">\n\t\t🌡️ <%= temperature %><p></p>\n\t</li>\n\t<% }; %>\n\t<% if (precipitation !== undefined) { %>\n\t\t<% if (precipitation.mode === 'rain' || precipitation.mode === 'none') { %>\n\t\t<li class=\"rain\">\n\t\t\t🌧️ <%= precipitation.value %><p></p>\n\t\t</li>\n\t\t<% }; %>\n\t\t<% if (precipitation.mode === 'snow') { %>\n\t\t<li class=\"snow\">\n\t\t\t🌨️ <%= precipitation.value %><p></p>\n\t\t</li>\n\t\t<% }; %>\n\t<% }; %>\n\t<% if (winddirection !== undefined) { %>\n\t<li class=\"wind-direction\">\n\t\t🌬️ <%= winddirection %><p></p>\n\t</li>\n\t<% }; %>\n\t<% if (windspeed !== undefined) { %>\n\t<li class=\"wind\">\n\t\t🌬️ <%= windspeed %><p></p>\n\t</li>\n\t<% }; %>\n</ul>\n";

  function styleInject(css, ref) {
    if ( ref === void 0 ) ref = {};
    var insertAt = ref.insertAt;

    if (!css || typeof document === 'undefined') { return; }

    var head = document.head || document.getElementsByTagName('head')[0];
    var style = document.createElement('style');
    style.type = 'text/css';

    if (insertAt === 'top') {
      if (head.firstChild) {
        head.insertBefore(style, head.firstChild);
      } else {
        head.appendChild(style);
      }
    } else {
      head.appendChild(style);
    }

    if (style.styleSheet) {
      style.styleSheet.cssText = css;
    } else {
      style.appendChild(document.createTextNode(css));
    }
  }

  var css_248z = ".weather[data-weather] {\n  position: absolute;\n  height: 20px;\n  width: 100%;\n  z-index: 11;\n  top: 0;\n  left: 0;\n  transition: opacity 0.75s ease; }\n  .weather[data-weather] ul {\n    margin: 0;\n    padding: 10px;\n    display: table;\n    width: 100%; }\n    .weather[data-weather] ul li {\n      display: inline-table;\n      text-align: center;\n      white-space: nowrap;\n      background-color: rgba(0, 0, 0, 0.8);\n      color: #fff;\n      padding: 4px 10px;\n      border-radius: 5px;\n      margin: 2px;\n      font-size: 16px; }\n";
  styleInject(css_248z);

  var _icon = "<svg xmlns=\"http://www.w3.org/2000/svg\" height=\"24\" viewBox=\"0 0 24 24\" width=\"24\" fill=\"white\"><path d=\"M0 0h24v24H0z\" fill=\"none\"/><path d=\"M6.76 4.84l-1.8-1.79-1.41 1.41 1.79 1.79 1.42-1.41zM4 10.5H1v2h3v-2zm9-9.95h-2V3.5h2V.55zm7.45 3.91l-1.41-1.41-1.79 1.79 1.41 1.41 1.79-1.79zm-3.21 13.7l1.79 1.8 1.41-1.41-1.8-1.79-1.4 1.4zM20 10.5v2h3v-2h-3zm-8-5c-3.31 0-6 2.69-6 6s2.69 6 6 6 6-2.69 6-6-2.69-6-6-6zm-1 16.95h2V19.5h-2v2.95zm-7.45-3.91l1.41 1.41 1.79-1.8-1.41-1.41-1.79 1.8z\"/></svg>";

  var icon_disabled = "<svg xmlns=\"http://www.w3.org/2000/svg\" height=\"24\" viewBox=\"0 0 24 24\" width=\"24\" fill=\"#FF0000\"><path d=\"M0 0h24v24H0z\" fill=\"none\"/><path d=\"M6.76 4.84l-1.8-1.79-1.41 1.41 1.79 1.79 1.42-1.41zM4 10.5H1v2h3v-2zm9-9.95h-2V3.5h2V.55zm7.45 3.91l-1.41-1.41-1.79 1.79 1.41 1.41 1.79-1.79zm-3.21 13.7l1.79 1.8 1.41-1.41-1.8-1.79-1.4 1.4zM20 10.5v2h3v-2h-3zm-8-5c-3.31 0-6 2.69-6 6s2.69 6 6 6 6-2.69 6-6-2.69-6-6-6zm-1 16.95h2V19.5h-2v2.95zm-7.45-3.91l1.41 1.41 1.79-1.8-1.41-1.41-1.79 1.8z\"/></svg>";

  var DEFAULT_URL = null;
  var DEFAULT_REFRESH = 5;
  var DEFAULT_REWRITE = null;
  var DEFAULT_UNITS = 'metric';

  var Weather = /*#__PURE__*/function (_UIContainerPlugin) {
    _inherits(Weather, _UIContainerPlugin);

    var _super = _createSuper(Weather);

    function Weather(container) {
      var _this;

      _classCallCheck(this, Weather);

      _this = _super.call(this, container);

      _this.configure();

      return _this;
    }

    _createClass(Weather, [{
      key: "name",
      get: function get() {
        return 'weather';
      }
    }, {
      key: "template",
      get: function get() {
        return core.template(weatherHTML);
      }
    }, {
      key: "attributes",
      get: function get() {
        return {
          'class': this.name,
          'data-weather': ''
        };
      }
    }, {
      key: "bindEvents",
      value: function bindEvents() {
        var _this2 = this;

        this.listenTo(this.container, core.Events.CONTAINER_PLAY, function () {
          _this2.show();
        });
        this.listenTo(this.container, core.Events.CONTAINER_STOP, function () {
          _this2.hide();
        });
        this.listenTo(this.container, core.Events.CONTAINER_OPTIONS_CHANGE, this.configure);
      }
    }, {
      key: "configure",
      value: function configure() {
        this.hasData = false;
        this.url = DEFAULT_URL;
        this.rewrite = DEFAULT_REWRITE;
        this.refresh = DEFAULT_REFRESH;
        this.units = DEFAULT_UNITS;
        this.data = null;
        var cfg = this.options.weatherConfig || {};

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
    }, {
      key: "destroy",
      value: function destroy() {
        this.$el.remove();
      }
    }, {
      key: "render",
      value: function render() {
        this.$el.hide();
        this.container.$el.append(this.$el);
        return this;
      }
    }, {
      key: "disable",
      value: function disable() {
        this.enabled = false;
        this.hide();
      }
    }, {
      key: "enable",
      value: function enable() {
        //this.bindEvents();
        this.enabled = true;
        this.show();
        this.load();
      }
    }, {
      key: "update",
      value: function update(data) {
        if (data === null) {
          return;
        }

        this.hasData = true;
        var temperature = undefined;
        var precipitation = undefined;
        var winddirection = undefined;
        var windspeed = undefined;
        var pressure = undefined;
        var humidity = undefined;
        var timestamp = undefined;

        if (this.units === 'imperial') {
          temperature = this._convertToFahrenheit(data.temperature_c).toFixed(1) + ' °F';
          winddirection = data.winddirection.toFixed(0) + '° ' + this._getHeading(data.winddirection);
          windspeed = this._convertToMPH(data.windspeed_ms).toFixed(1) + ' mph';
        } else {
          temperature = data.temperature_c.toFixed(1) + ' °C';
          winddirection = data.winddirection.toFixed(0) + '° ' + this._getHeading(data.winddirection);
          windspeed = data.windspeed_ms.toFixed(1) + ' m/s';
        }

        precipitation = {
          value: (data.precipitation.mode === 'none' ? '0' : data.precipitation.value_mm.toFixed(1)) + ' mm',
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
          timestamp: timestamp
        }));
      }
    }, {
      key: "_convertToFahrenheit",
      value: function _convertToFahrenheit(_value) {
        return _value * 1.8 + 32;
      }
    }, {
      key: "_convertToMPH",
      value: function _convertToMPH(_value) {
        return _value / 1.609344 * 1000 / 3600;
      }
    }, {
      key: "_getHeading",
      value: function _getHeading(_direction) {
        if (_direction < 0 || _direction > 360) {
          return '--';
        }

        var directions = 'N NNE NE ENE E ESE SE SSE S SSW SW WSW W WNW NW NNW'.split(' ');
        var direction = 0;
        var step = Math.floor(360 / directions.length);
        var i = Math.floor(step / 2);

        if (_direction <= i || _direction >= 360 - i) {
          return 'N';
        }

        while (i <= _direction) {
          direction++;
          i += step;
        }

        return directions[direction];
      }
    }, {
      key: "show",
      value: function show() {
        if (this.enabled == true && this.hasData == true) {
          core.$('.clappr-watermark[data-watermark]').css('transition', 'top .4s ease-out');
          core.$('.clappr-watermark[data-watermark-top-left]').css('top', '50px');
          core.$('.clappr-watermark[data-watermark-top-right]').css('top', '50px');
          this.$el.show();
          this.$el.css('opacity', 1);
        }

        return;
      }
    }, {
      key: "hide",
      value: function hide() {
        this.$el.css('opacity', 0);
        this.$el.hide();
        core.$('.clappr-watermark[data-watermark]').css('transition', 'top .4s ease-out');
        core.$('.clappr-watermark[data-watermark-top-left]').css('top', '10px');
        core.$('.clappr-watermark[data-watermark-top-right]').css('top', '10px');
      }
    }, {
      key: "load",
      value: function load() {
        if (!this.url || this.enabled === false) {
          return;
        }

        var self = this;
        var r = new XMLHttpRequest();
        var url = this.url + (this.url.indexOf('?') !== -1 ? '&' : '?') + Date.now();
        r.open('GET', url);

        r.onload = function () {
          if (r.readyState === r.DONE) {
            if (r.status === 200) {
              var text = r.responseText;
              var data = null;

              try {
                data = JSON.parse(text);
              } catch (error) {
                data = text;
              }

              if (self.rewrite !== null) {
                data = self.rewrite(data);
              }

              self.update(data);
            }

            if (self.refresh > 0) {
              setTimeout(function () {
                self.load();
              }, self.refresh * 1000);
            }
          }
        };

        r.send();
      } // PluginControl interface

    }, {
      key: "pluginControl",
      value: function pluginControl() {
        var self = this;

        if (this.hasData === false) {
          return null;
        }

        return {
          icon: function icon() {
            if (self.enabled === true) {
              return _icon;
            } else {
              return icon_disabled;
            }
          },
          name: function name() {
            var lang = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : 'en';
            var name = 'Weather';

            switch (lang) {
              case 'de':
                name = 'Wetter';
                break;
            }

            return name;
          },
          toggle: function toggle() {
            if (self.enabled === true) {
              self.disable();
            } else {
              self.enable();
            }

            return self.enabled;
          },
          toggled: function toggled() {
            return self.enabled;
          }
        };
      }
    }]);

    return Weather;
  }(core.UIContainerPlugin);

  return Weather;

})));
//# sourceMappingURL=weather.js.map
