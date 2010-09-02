var undefined,
    xui,
    window     = this,
    string     = new String('string'), // prevents Goog compiler from removing primative and subsidising out allowing us to compress further
    document   = window.document,      // obvious really
    simpleExpr = /^#?([\w-]+)$/,   // for situations of dire need. Symbian and the such        
    idExpr     = /^#/,
    tagExpr    = /<([\w:]+)/, // so you can create elements on the fly a la x$('<img href="/foo" /><strong>yay</strong>')
    slice      = function (e) { return [].slice.call(e, 0); };
    try { var a = slice(document.documentElement.childNodes)[0].nodeType; }
    catch(e){ slice = function (e) { var ret=[]; for (var i=0; e[i]; i++) ret.push(e[i]); return ret; }; }

window.x$ = window.xui = xui = function(q, context) {
    return new xui.fn.find(q, context);
};

// patch in forEach to help get the size down a little and avoid over the top currying on event.js and dom.js (shortcuts)
if (! [].forEach) {
    Array.prototype.forEach = function(fn) {
        var len = this.length || 0,
            i = 0,
            that = arguments[1]; // wait, what's that!? awwww rem. here I thought I knew ya!
                                 // @rem - that that is a hat tip to your thats :)

        if (typeof fn == 'function') {
            for (; i < len; i++) {
                fn.call(that, this[i], i, this);
            }
        }
    };
}
/**
 * Array Remove - By John Resig (MIT Licensed) 
 */
function removex(array, from, to) {
    var rest = array.slice((to || from) + 1 || array.length);
    array.length = from < 0 ? array.length + from: from;
    return array.push.apply(array, rest);
}

xui.fn = xui.prototype = {

    extend: function(o) {
        for (var i in o) {
            xui.fn[i] = o[i];
        }
    },

    find: function(q, context) {
        var ele = [], tempNode;
            
        if (!q) {
            return this;
        } else if (context == undefined && this.length) {
            ele = this.each(function(el) {
                ele = ele.concat(slice(xui(q, el)));
            }).reduce(ele);
        } else {
            context = context || document;
            // fast matching for pure ID selectors and simple element based selectors
            if (typeof q == string) {
              if (simpleExpr.test(q) && context.getElementById && context.getElementsByTagName) {
                  ele = idExpr.test(q) ? [context.getElementById(q.substr(1))] : context.getElementsByTagName(q);
                  // nuke failed selectors
                  if (ele[0] == null) { 
                    ele = [];
                  }
              // match for full html tags to create elements on the go
              } else if (tagExpr.test(q)) {
                  tempNode = document.createElement('i');
                  tempNode.innerHTML = q;
                  slice(tempNode.childNodes).forEach(function (el) {
                    ele.push(el);
                  });
              } else {
                  // one selector, check if Sizzle is available and use it instead of querySelectorAll.
                  if (window.Sizzle !== undefined) {
                    ele = Sizzle(q, context);
                  } else {
                    ele = context.querySelectorAll(q);
                  }
              }
              // blanket slice
              ele = slice(ele);
            } else if (q instanceof Array) {
                ele = q;
            } else if (q.toString() == '[object NodeList]') {
                ele = slice(q);
            } else if (q.nodeName || q === window) { // only allows nodes in
                // an element was passed in
                ele = [q];
            }
        }
        // disabling the append style, could be a plugin (found in more/base):
        // xui.fn.add = function (q) { this.elements = this.elements.concat(this.reduce(xui(q).elements)); return this; }
        return this.set(ele);
    },

    /** 
     * Resets the body of elements contained in XUI
     * Note that due to the way this.length = 0 works
     * if you do console.dir() you can still see the 
     * old elements, but you can't access them. Confused?
     */
    set: function(elements) {
        var ret = xui();
        ret.cache = slice(this.length ? this : []);
        ret.length = 0;
        [].push.apply(ret, elements);
        return ret;
    },

    /**
    * Array Unique
    */
    reduce: function(elements, b) {
        var a = [],
        elements = elements || slice(this);
        elements.forEach(function(el) {
            // question the support of [].indexOf in older mobiles (RS will bring up 5800 to test)
            if (a.indexOf(el, 0, b) < 0)
            a.push(el);
        });

        return a;
    },

    /**
     * Has modifies the elements array and reurns all the elements that match (has) a CSS Query
     */
     has: function(q) {
         var list = xui(q);
         return this.filter(function () {
             var that = this;
             var found = null;
             list.each(function (el) {
                 found = (found || el == that);
             });
             return found;
         });
     },

    /**
     * Both an internal utility function, but also allows developers to extend xui using custom filters
     */
    filter: function(fn) {
        var elements = [];
        return this.each(function(el, i) {
            if (fn.call(el, i)) elements.push(el);
        }).set(elements);
    },

    /**
     * Not modifies the elements array and reurns all the elements that DO NOT match a CSS Query
     */
    not: function(q) {
        var list = slice(this);
        return this.filter(function(i) {
            var found;
            xui(q).each(function(el) {
                return found = list[i] != el;
            });
            return found;
        });
    },


    /**
     * Element iterator.
     * 
     * @return {XUI} Returns the XUI object. 
     */
    each: function(fn) {
        // we could compress this by using [].forEach.call - but we wouldn't be able to support
        // fn return false breaking the loop, a feature I quite like.
        for (var i = 0, len = this.length; i < len; ++i) {
            if (fn.call(this[i], this[i], i, this) === false)
            break;
        }
        return this;
    }
};

xui.fn.find.prototype = xui.fn;
xui.extend = xui.fn.extend;

// --- 
/// imports(); 
// ---