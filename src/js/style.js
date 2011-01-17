/**
	Style
	=====

	Everything related to appearance. Usually, this is CSS.

*/
function hasClass(el, className) {
    return getClassRegEx(className).test(el.className);
}

// Via jQuery - used to avoid el.className = ' foo';
// Used for trimming whitespace
var rtrim = /^(\s|\u00A0)+|(\s|\u00A0)+$/g;

function trim(text) {
  return (text || "").replace( rtrim, "" );
}

xui.extend({
/**
	setStyle
	--------

	Sets the value of a single CSS property.

	### syntax ###

		x$( selector ).setStyle( property, value );

	### arguments ###

	- property `String` is the name of the property to modify.
	- value `String` is the new value of the property.

	### example ###

		x$('.flash').setStyle('color', '#000');
		x$('.button').setStyle('backgroundColor', '#EFEFEF');
*/
    setStyle: function(prop, val) {
        prop = prop.replace(/\-[a-z]/g,function(m) { return m[1].toUpperCase(); });
        return this.each(function(el) {
            el.style[prop] = val;
        });
    },

/**
	getStyle
	--------

	Returns the value of a single CSS property. Can also invoke a callback to perform more specific processing tasks related to the property value.
	Please note that the return type is always an Array of strings. Each string corresponds to the CSS property value for the element with the same index in the xui collection.

	### syntax ###

		x$( selector ).getStyle( property, callback );

	### arguments ###

	- property `String` is the name of the CSS property to get.
	- callback `Function` is called on each element in the collection and passed the property _(optional)_.

	### example ###
        <ul id="nav">
            <li class="trunk" style="font-size:12px;background-color:blue;">hi</li>
            <li style="font-size:14px;">there</li>
        </ul>
        
		x$('ul#nav li.trunk').getStyle('font-size'); // returns ['12px']
		x$('ul#nav li.trunk').getStyle('fontSize'); // returns ['12px']
		x$('ul#nav li').getStyle('font-size'); // returns ['12px', '14px']
		
		x$('ul#nav li.trunk').getStyle('backgroundColor', function(prop) {
		    alert(prop); // alerts 'blue' 
		});
*/
    getStyle: function(prop, callback) {
        // shortcut getComputedStyle function
        var s = function(el, p) {
            // this *can* be written to be smaller - see below, but in fact it doesn't compress in gzip as well, the commented
            // out version actually *adds* 2 bytes.
            // return document.defaultView.getComputedStyle(el, "").getPropertyValue(p.replace(/([A-Z])/g, "-$1").toLowerCase());
            return document.defaultView.getComputedStyle(el, "").getPropertyValue(p.replace(/[A-Z]/g, function(m) { return '-'+m.toLowerCase(); }));
        }
        if (callback === undefined) {
        	var styles = [];
            this.each(function(el) {styles.push(s(el, prop))});
 			return styles;
        } else this.each(function(el) { callback(s(el, prop)); });
    },

/**
	addClass
	--------

	Adds a class to all of the elements in the collection.

	### syntax ###

		$( selector ).addClass( className );

	### arguments ###

	- className `String` is the name of the CSS class to add.

	### example ###

		$('.foo').addClass('awesome');
*/
    addClass: function(className) {
        return this.each(function(el) {
            if (hasClass(el, className) === false) {
              el.className = trim(el.className + ' ' + className);
            }
        });
    },

/**
	hasClass
	--------

	Checks if the class is on the element.

	### syntax ###

		$( selector ).hasClass( className, fn );

	### arguments ###

	- className `String` is the name of the CSS class to find.
	- fn `Function` is a called for each element found and passed the element _(optional)_.

			// `element` is the HTMLElement that has the class
			function(element) {
			    console.log(element);
			}

	### example ###

		// returns true or false
		$('#foo').hasClass('awesome');
		
		// returns true or false,
		// and calls the function with each element
		$('.foo').hasClass('awesome', function(element) {
		    console.log('Hey, I found: ' + element);
		});
*/
    hasClass: function(className, callback) {
        var self = this;
        return this.length && (function() {
                var hasIt = false;
                self.each(function(el) {
                    if (hasClass(el, className)) {
                        hasIt = true;
                        if (callback) callback(el);
                    }
                });
                return hasIt;
            })();
    },

/**
	removeClass
	-----------

	Removes the class from all elements in the collection.

	### syntax ###

		x$( selector ).removeClass( className );

	### arguments ###

	- className `String` is the name of the CSS class to remove.

	### example ###

		x$('.foo').removeClass('awesome');
*/
    removeClass: function(className) {
        if (className === undefined) {
            this.each(function(el) {
                el.className = '';
            });
        } else {
            var re = getClassRegEx(className);
            this.each(function(el) {
                el.className = trim(el.className.replace(re, '$1'));
            });
        }
        return this;
    },


/**
	css
	---

	Set multiple CSS properties at once.

	### syntax ###

		x$( selector ).css( properties );

	### arguments ###

	- properties `Object` is a JSON object that defines the property name/value pairs to set.

	### example ###

		x$('.foo').css({ backgroundColor:'blue', color:'white', border:'2px solid red' });
*/
    css: function(o) {
        for (var prop in o) {
            this.setStyle(prop, o[prop]);
        }
        return this;
    }
});

// RS: now that I've moved these out, they'll compress better, however, do these variables
// need to be instance based - if it's regarding the DOM, I'm guessing it's better they're
// global within the scope of xui

// -- private methods -- //
var reClassNameCache = {},
    getClassRegEx = function(className) {
        var re = reClassNameCache[className];
        if (!re) {
            // Preserve any leading whitespace in the match, to be used when removing a class
            re = new RegExp('(^|\\s+)' + className + '(?:\\s+|$)');
            reClassNameCache[className] = re;
        }
        return re;
    };