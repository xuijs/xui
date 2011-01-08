/*
	Base
	===

	Includes functionality used to manipulate the xui object collection; things like iteration and set operations are included here.

*/
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
/*
 * Array Remove - By John Resig (MIT Licensed) 
 */
function removex(array, from, to) {
    var rest = array.slice((to || from) + 1 || array.length);
    array.length = from < 0 ? array.length + from: from;
    return array.push.apply(array, rest);
}

xui.fn = xui.prototype = {
/**
	extend
	---

	Allows extension of xui's prototype with the members/methods of the provided object.

	__syntax__

	    xui.extend( object );

	Call extend on the xui object to extend all xui instances with functionality and/or members of the passed-in object.

	__arguments__

	 - object:object a JavaScript object whose members will be incorporated into xui's prototype
 
	__example__

	Given:

	    var thing = {
	        first : function() { return this[ 0 ]; },
	        last : function() { return this[ this.length - 1 ]; }
	    }

	We can extend xui's prototype with these methods by using `extend`:

	    xui.extend( thing );

	Now we can use `first` and `last` in all instances of xui:

	    var f = x$( '.someClass' ).first();
	    var l = x$( '.differentClass' ).last();

*/
    extend: function(o) {
        for (var i in o) {
            xui.fn[i] = o[i];
        }
    },
/**
	find
	---

	Finds matching elements based on a query string. The global xui entry `x$` function is a reference to the `find` function.

	__syntax__

	    x$(window).find( selector [, context] );

	__arguments__

	 - selector:string a CSS selector string to match elements to.
	 - context:HTMLElement an html element to use as the "root" element to search from.
 
	__example__

	Given the following markup:

	    <ul id="first">
	        <li id="one">1</li>
	        <li id="two">2</li>
	    </ul>
	    <ul id="second">
	        <li id="three">3</li>
	        <li id="four">4</li>
	    </ul>

	We can select only specific list items by using `find`, as opposed to selecting off the document root:

	    x$('li'); // returns all four list item elements.
	    x$('#second').find('li'); // returns list items "three" and "four"

*/
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
	set
	---

	Sets the objects in the xui collection.

	__syntax__

	    x$(window).set( array );

*/
    set: function(elements) {
        var ret = xui();
        ret.cache = slice(this.length ? this : []);
        ret.length = 0;
        [].push.apply(ret, elements);
        return ret;
    },
/**
	reduce
	---

	Reduces the set of elements in the xui object to a unique set.

	__syntax__

	    x$(someSelector).reduce( [ elements [, toIndex ]] );

	The elements parameter is optional - if not specified, will reduce the elements in the current xui object.

	__arguments__

	 - elements:Array an array of elements to reduce (optional)
	 - toIndex:Number last index of elements to include in the reducing operation.

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
	has
	---

	Has modifies the elements array and returns all the elements that match (has) a CSS selector.

	__syntax__

	    x$(someSelector).has( query );
    
	Behind the scenes, actually calls the filter method.

	__arguments__

	 - query:string a CSS selector that will match all children of originally-selected xui collection
 
	__example__

	Given
	
	    <div>
	        <div class="gotit">these ones</div>
	        <div class="gotit">have an extra class</div>
	    </div>
	
	We can use xui like so
	
	    var divs = x$('div'); // we've got all four divs from above.
	    var someDivs = divs.has('.gotit'); // we've now got only the two divs with the class

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
	filter
	---
	
	Both an internal utility function, but also allows developers to extend xui using custom filters
	
	__syntax__
	
	    x$(someSelector).filter( functionHandle );
	    
	The `functionHandle` function will get invoked with `this` being the element being iterated on,
	and the index passed in as a parameter.
	    
	__arguments__
	
	 - functionHandle:Function a function reference that evaluates to true/false, determining which elements get included in the xui collection.
	 
	__example__
	
	Perhaps we'd want to filter input elements that are disabled:
	
	    x$('input').filter(function(i) {
	        return this.checked;
	    });
	
*/
    filter: function(fn) {
        var elements = [];
        return this.each(function(el, i) {
            if (fn.call(el, i)) elements.push(el);
        }).set(elements);
    },
/**
	not
	---
	
	Not modifies the elements array and returns all the elements that DO NOT match a CSS Query - the opposite of has
	
	__syntax__
	
	    x$(someSelector).not( someOtherSelector );
	
	__arguments__
	
	 - someOtherSelector:string a CSS selector that elements should NOT match to.
	
	__example__
	
	Given
	
	    <div>
	        <div class="gotit">these ones</div>
	        <div class="gotit">have an extra class</div>
	    </div>
	
	We can use xui like so
	
	    var divs = x$('div'); // we've got all four divs from above.
	    var someDivs = divs.not('.gotit'); // we've now got only the two divs _without_ the class "gotit"
	
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
	each
	---
	
	Element iterator (over the xui collection).
	
	__syntax__
	
	    x$(window).each( functionHandle )
	
	__arguments__
	
	 - functionHandle:Function callback function that will execute with each element being passed in as the `this` object and first parameter to callback
	
	__example__
	
	    x$(someSelector).each(function(element, index, xui) {
	        alert("Here's the " + index + " element: "+ element);
	    });
	
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