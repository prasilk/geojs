var inherit = require('../inherit');
var registerFeature = require('../registry').registerFeature;
var pointFeature = require('../pointFeature');

/**
 *
 * Create a new instance of d3.pointFeature.
 *
 * @class
 * @alias geo.d3.pointFeature
 * @extends geo.pointFeature
 * @extends geo.d3.object
 * @param {geo.pointFeature.spec} arg
 * @returns {geo.d3.pointFeature}
 */
var d3_pointFeature = function (arg) {
  'use strict';
  if (!(this instanceof d3_pointFeature)) {
    return new d3_pointFeature(arg);
  }

  var d3_object = require('./object');
  var timestamp = require('../timestamp');

  arg = arg || {};
  pointFeature.call(this, arg);
  d3_object.call(this);

  /**
   * @private
   */
  var m_this = this,
      s_init = this._init,
      s_update = this._update,
      m_buildTime = timestamp(),
      m_style = {};

  /**
   * Initialize.
   *
   * @param {geo.pointFeature.spec} arg The feature specification.
   * @returns {this}
   */
  this._init = function (arg) {
    s_init.call(m_this, arg);
    return m_this;
  };

  /**
   * Build.  Create the necessary elements to render points.
   *
   * @returns {this}
   */
  this._build = function () {
    var data = m_this.data(),
        s_style = m_this.style.get(),
        m_renderer = m_this.renderer(),
        pos_func = m_this.position();

    // call super-method
    s_update.call(m_this);

    // default to empty data array
    if (!data) { data = []; }

    // fill in d3 renderer style object defaults
    m_style.id = m_this._d3id();
    m_style.data = data;
    m_style.append = 'circle';
    m_style.attributes = {
      r: m_renderer._convertScale(s_style.radius),
      cx: function (d) {
        return m_this.featureGcsToDisplay(pos_func(d)).x;
      },
      cy: function (d) {
        return m_this.featureGcsToDisplay(pos_func(d)).y;
      }
    };
    m_style.style = s_style;
    m_style.classes = ['d3PointFeature'];
    m_style.visible = m_this.visible;

    // pass to renderer to draw
    m_this.renderer()._drawFeatures(m_style);

    // update time stamps
    m_buildTime.modified();
    m_this.updateTime().modified();
    return m_this;
  };
  /**
   * Update.  Rebuild if necessary.
   *
   * @returns {this}
   */
  this._update = function () {
    s_update.call(m_this);

    if (m_this.timestamp() >= m_buildTime.timestamp()) {
      m_this._build();
    }

    return m_this;
  };

  this._init(arg);
  return this;
};

inherit(d3_pointFeature, pointFeature);

var capabilities = {};
capabilities[pointFeature.capabilities.stroke] = true;

// Now register it
registerFeature('d3', 'point', d3_pointFeature, capabilities);

module.exports = d3_pointFeature;
