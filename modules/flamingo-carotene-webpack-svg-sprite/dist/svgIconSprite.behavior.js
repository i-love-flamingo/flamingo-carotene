"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;
var _unfetch = _interopRequireDefault(require("unfetch"));
function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }
function _typeof(obj) { "@babel/helpers - typeof"; return _typeof = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function (obj) { return typeof obj; } : function (obj) { return obj && "function" == typeof Symbol && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }, _typeof(obj); }
function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }
function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, _toPropertyKey(descriptor.key), descriptor); } }
function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); Object.defineProperty(Constructor, "prototype", { writable: false }); return Constructor; }
function _defineProperty(obj, key, value) { key = _toPropertyKey(key); if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }
function _toPropertyKey(arg) { var key = _toPrimitive(arg, "string"); return _typeof(key) === "symbol" ? key : String(key); }
function _toPrimitive(input, hint) { if (_typeof(input) !== "object" || input === null) return input; var prim = input[Symbol.toPrimitive]; if (prim !== undefined) { var res = prim.call(input, hint || "default"); if (_typeof(res) !== "object") return res; throw new TypeError("@@toPrimitive must return a primitive value."); } return (hint === "string" ? String : Number)(input); }
var SvgIconSprite = /*#__PURE__*/function () {
  /**
   * constructor
   * @param element
   */
  function SvgIconSprite(element) {
    _classCallCheck(this, SvgIconSprite);
    _defineProperty(this, "refs", {});
    this.refs.element = element;
    var url = element.dataset.spriteUrl;
    this.fetch(url);
  }

  /**
   * Fetch sprite url
   * @param url
   */
  _createClass(SvgIconSprite, [{
    key: "fetch",
    value: function fetch(url) {
      (0, _unfetch["default"])(url).then(function (r) {
        return r.text();
      }).then(this.success.bind(this));
    }

    /**
     * dispose
     */
  }, {
    key: "dispose",
    value: function dispose() {
      this.refs = null;
    }

    /**
     * success callback
     * @param data
     */
  }, {
    key: "success",
    value: function success(data) {
      this.refs.element.innerHTML = data;
    }
  }]);
  return SvgIconSprite;
}();
exports["default"] = SvgIconSprite;
