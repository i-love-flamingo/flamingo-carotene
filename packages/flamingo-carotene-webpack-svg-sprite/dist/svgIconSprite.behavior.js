"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _unfetch = _interopRequireDefault(require("unfetch"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

var SvgIconSprite =
/*#__PURE__*/
function () {
  /**
   * constructor
   * @param element
   */
  function SvgIconSprite(element) {
    _classCallCheck(this, SvgIconSprite);

    _defineProperty(this, "refs", {});

    this.refs.element = element;
    var url = element.dataset.spriteUrl;
    (0, _unfetch.default)(url).then(this.success.bind(this));
  }
  /**
   * dispose
   */


  _createClass(SvgIconSprite, [{
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
      this.refs.$element[0].innerHTML = data;
    }
  }]);

  return SvgIconSprite;
}();

exports.default = SvgIconSprite;
