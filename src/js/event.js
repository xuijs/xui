/**
	Event
	=====

	A good old fashioned events with new skool handling. Shortcuts exist for:

	- click
	- load
	- touchstart
	- touchmove
	- touchend
	- touchcancel
	- gesturestart
	- gesturechange
	- gestureend
	- orientationchange
	
*/
xui.events = {}; var cache = {};
xui.extend({

/**
	on
	--

	Registers a callback function to a DOM event on the element collection.

	### syntax ###

		x$( 'button' ).on( type, fn );

	or

		x$( 'button' ).click( fn );

	### arguments ###

	- type `String` is the event to subscribe (e.g. _load_, _click_, _touchstart_, etc).
	- fn `Function` is a callback function to execute when the event is fired.

	### example ###

		x$( 'button' ).on( 'click', function(e) {
		    alert('hey that tickles!');
		});

	or

		x$(window).load(function(e) {
		  x$('.save').touchstart( function(evt) { alert('tee hee!'); }).css(background:'grey');
		});
*/
    on: function(type, fn, details) {
        return this.each(function (el) {
            if (xui.events[type]) {
                var id = _getEventID(el), 
                    responders = _getRespondersForEvent(id, type);
                
                details = details || {};
                details.handler = function (event, data) {
                    xui.fn.fire.call(xui(this), type, data);
                };
                
                // trigger the initialiser - only happens the first time around
                if (!responders.length) {
                    xui.events[type].call(el, details);
                }
            } 
            el.addEventListener(type, _createResponder(el, type, fn), false);
        });
    },

/**
	un
	--

	Unregisters a specific callback, or if no specific callback is passed in, 
	unregisters all event callbacks of a specific type.

	### syntax ###

	Unregister the given function, for the given type, on all button elements:

		x$( 'button' ).un( type, fn );

	Unregisters all callbacks of the given type, on all button elements:

		x$( 'button' ).un( type );

	### arguments ###

	- type `String` is the event to unsubscribe (e.g. _load_, _click_, _touchstart_, etc).
	- fn `Function` is the callback function to unsubscribe _(optional)_.

	### example ###

		// First, create a click event that display an alert message
		x$('button').on('click', function() {
		    alert('hi!');
		});
		
		// Now unsubscribe all functions that response to click on all button elements
		x$('button').un('click');

	or

		var greeting = function() { alert('yo!'); };
		
		x$('button').on('click', greeting);
		x$('button').on('click', function() {
		    alert('hi!');
		});
		
		// When any button is clicked, the 'hi!' message will fire, but not the 'yo!' message.
		x$('button').un('click', greeting);
*/
    un: function(type, fn) {
        return this.each(function (el) {
            var id = _getEventID(el), responders = _getRespondersForEvent(id, type), i = responders.length;

            while (i--) {
                if (fn === undefined || fn.guid === responders[i].guid) {
                    el.removeEventListener(type, responders[i], false);
                    removex(cache[id][type], i, 1);
                }
            }

            if (cache[id][type].length === 0) delete cache[id][type];
            for (var t in cache[id]) {
                return;
            }
            delete cache[id];
        });
    },

/**
	fire
	----

	Triggers a specific event on the xui collection.

	### syntax ###

		x$( selector ).fire( type, data );

	### arguments ###

	- type `String` is the event to fire (e.g. _load_, _click_, _touchstart_, etc).
	- data `Object` is a JSON object to use as the event's `data` property.

	### example ###

		x$('button#reset').fire('click', { died:true });
		
		x$('.target').fire('touchstart');
*/
    fire: function (type, data) {
        return this.each(function (el) {
            if (el == document && !el.dispatchEvent)
                el = document.documentElement;

            var event = document.createEvent('HTMLEvents');
            event.initEvent(type, true, true);
            event.data = data || {};
            event.eventName = type;
          
            el.dispatchEvent(event);
  	    });
  	}
});

"click load submit touchstart touchmove touchend touchcancel gesturestart gesturechange gestureend orientationchange".split(' ').forEach(function (event) {
  xui.fn[event] = function(action) { return function (fn) { return fn ? this.on(action, fn) : this.fire(action); }; }(event);
});

// patched orientation support - Andriod 1 doesn't have native onorientationchange events
xui(window).on('load', function() {
    if (!('onorientationchange' in document.body)) {
      (function (w, h) {
        xui(window).on('resize', function () {
          var portraitSwitch = (window.innerWidth < w && window.innerHeight > h) && (window.innerWidth < window.innerHeight),
              landscapeSwitch = (window.innerWidth > w && window.innerHeight < h) && (window.innerWidth > window.innerHeight);
          if (portraitSwitch || landscapeSwitch) {
            window.orientation = portraitSwitch ? 0 : 90; // what about -90? Some support is better than none
            xui('body').fire('orientationchange'); // will this bubble up?
            w = window.innerWidth;
            h = window.innerHeight;
          }
        });
      })(window.innerWidth, window.innerHeight);
    }
});

// this doesn't belong on the prototype, it belongs as a property on the xui object
xui.touch = (function () {
  try{
    return !!(document.createEvent("TouchEvent").initTouchEvent)
  } catch(e) {
    return false;
  };
})();

/**
	ready
	----

  Event handler for when the DOM is ready. Thank you [domready](http://www.github.com/ded/domready)!

	### syntax ###

		x$.ready(handler);

	### arguments ###

	- handler `Function` event handler to be attached to the "dom is ready" event.

	### example ###

    x$.ready(function() {
      alert('mah doms are ready');
    });

    xui.ready(function() {
      console.log('ready, set, go!');
    });
*/
xui.ready = function(handler) {
  domReady(handler);
}

// lifted from Prototype's (big P) event model
function _getEventID(element) {
    if (element._xuiEventID) return element._xuiEventID;
    return element._xuiEventID = ++_getEventID.id;
}

_getEventID.id = 1;

function _getRespondersForEvent(id, eventName) {
    var c = cache[id] = cache[id] || {};
    return c[eventName] = c[eventName] || [];
}

function _createResponder(element, eventName, handler) {
    var id = _getEventID(element), r = _getRespondersForEvent(id, eventName);

    var responder = function(event) {
        if (handler.call(element, event) === false) {
            event.preventDefault();
            event.stopPropagation();
        }
    };
    
    responder.guid = handler.guid = handler.guid || ++_getEventID.id;
    responder.handler = handler;
    r.push(responder);
    return responder;
}
