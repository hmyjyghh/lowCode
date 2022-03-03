
//修复低版本浏览器本身的jsapi功能缺失的缺陷
//增加string的trim函数
if (typeof String.prototype.trim != "function") {
  String.prototype.trim=function(){
    let emptyBlockReg = /^[\s\uFEFF\xA0]+|[\s\uFEFF\xA0]+$/g;
    return this.replace(emptyBlockReg,'');
  }
}
//增加string的startsWith
if (typeof String.prototype.startsWith != "function") {
  String.prototype.startsWith = function (prefix) {
    return this.slice(0, prefix.length) === prefix;
  };
}

//增加string的endsWith
if (typeof String.prototype.endsWith != "function") {
  String.prototype.endsWith = function (suffix) {
    return this.indexOf(suffix, this.length - suffix.length) !== -1;
  };
}
//增加string的startsWith
if (typeof String.prototype.startsWiths != "function") {
  String.prototype.startsWiths = function (prefix) {
    return this.slice(0, prefix.length) === prefix;
  };
}

//增加string的endsWith
if (typeof String.prototype.endsWiths != "function") {
  String.prototype.endsWiths = function (suffix) {
    return this.indexOf(suffix, this.length - suffix.length) !== -1;
  };
}
//兼容低版本浏览器没有forEach
if (typeof Array.prototype.forEach != "function") {
  Array.prototype.forEach = function (callback) {
    for (var i = 0; i < this.length; i++) {
      callback(this[i], i);
    }
  };
}
//兼容低版本浏览器没有filter函数
if (typeof Array.prototype.filter != "function") {
  Array.prototype.filter = function (callback) {
    var result = [];
    for (var i = 0; i < this.length; i++) {
      var r = callback(this[i]);
      if (r === true) {
        result.push(this[i]);
      }
    }
    return result;
  };
}
//兼容低版本浏览器没有classList
if (!("classList" in document.documentElement)) {
  Object.defineProperty(HTMLElement.prototype, "classList", {
    get: function () {
      var self = this;

      function update(fn) {
        return function (value) {
          var classes = self.className.split(/\s+/g),
            index = classes.indexOf(value);

          fn(classes, index, value);
          self.className = classes.join(" ");
        };
      }

      return {
        add: update(function (classes, index, value) {
          if (!~index) classes.push(value);
        }),

        remove: update(function (classes, index) {
          if (~index) classes.splice(index, 1);
        }),

        toggle: update(function (classes, index, value) {
          if (~index) classes.splice(index, 1);
          else classes.push(value);
        }),

        contains: function (value) {
          return !!~self.className.split(/\s+/g).indexOf(value);
        },

        item: function (i) {
          return self.className.split(/\s+/g)[i] || null;
        }
      };
    }
  });
}

//兼容元素没有matches函数
if (!Element.prototype.matches) {
  Element.prototype.matches =
    Element.prototype.matchesSelector ||
    Element.prototype.mozMatchesSelector ||
    Element.prototype.msMatchesSelector ||
    Element.prototype.oMatchesSelector ||
    Element.prototype.webkitMatchesSelector ||
    function (s) {
      var matches = (this.document || this.ownerDocument).querySelectorAll(s),
        i = matches.length;
      // eslint-disable-next-line no-empty
      while (--i >= 0 && matches.item(i) !== this) {}
      return i > -1;
    };
}

//兼容IE无toBlob
if (!HTMLCanvasElement.prototype.toBlob) {
  Object.defineProperty(HTMLCanvasElement.prototype, 'toBlob', {
    value: function (callback, type, quality) {
      var canvas = this;
      setTimeout(function() {
        var binStr = atob( canvas.toDataURL(type, quality).split(',')[1] );
        var len = binStr.length;
        var arr = new Uint8Array(len);
        for (var i = 0; i < len; i++) {
          arr[i] = binStr.charCodeAt(i);
        }
 
        callback(new Blob([arr], { type: type || 'image/png' }));
      });
    }
  });
}