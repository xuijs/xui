/**
	Event
	=====

	A good old fashioned yet new skool event handling system.

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

	For more information see:

	- http://developer.apple.com/webapps/docs/documentation/AppleApplications/Reference/SafariWebContent/HandlingEvents/chapter_7_section_1.html#//apple_ref/doc/uid/TP40006511-SW1

	### syntax ###

		x$('button').on( 'click', function(e){ alert('hey that tickles!') });

	or...

		x$('a.save').click(function(e){ alert('tee hee!') });

	### arguments ###

	- type:string the event to subscribe to click|load|etc
	- fn:function a callback function to execute when the event is fired

	### example ###

		x$(window).load(function(e){
		  x$('.save').touchstart( function(evt){ alert('tee hee!') }).css(background:'grey');
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
	
	    x$('button').un('click', specificCallback);
	    
	The above unregisters only the `specificCallback` function on all button elements.
	
	    x$('button').un('click');
	    
	The above unregisters all callbacks assigned to all button elements.
	
	### arguments ###
	
	- type:string the event to unsubscribe from click|load|etc
	- fn:function callback function to unsubscribe (optional)
	
	### example ###
	
	    x$('button').on('click',function(){alert('hi!');}); // callback subscribed to click.
	    x$('button').un('click'); // No more callbacks fired on click of button elements!
	    
	or ...
	
	    var funk = function() { alert('yo!'); }
    	x$('button').on('click', funk); // callback subscribed to click.
    	x$('button').on('click', function(){ alert('hi!'); });
        x$('button').un('click', funk); // When buttons are clicked, the 'hi!' alert will pop up but not the 'yo!' alert.
	
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

    Fires a specific event on the xui collection.

	### syntax ###

	    x$('button').fire('click', {some:'data'});

    Fires an event with some specific data attached to the event's `data` property.

	### arguments ###

	- type:string the event to fire, click|load|etc
	- data:object JavaScript object to attach to the event's `data` property.

	### example ###

    x$('button#reset').fire('click', {died:true});
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
  
// --
});

"click load submit touchstart touchmove touchend touchcancel gesturestart gesturechange gestureend orientationchange".split(' ').forEach(function (event) {
  xui.fn[event] = function(action) { return function (fn) { return fn ? this.on(action, fn) : this.fire(action); }; }(event);
});

// patched orientation support - Andriod 1 doesn't have native onorientationchange events
xui(window).on('load', function() {
    if (!('onorientationchange' in document.body)) {
      (function () {
        var w = window.innerWidth, h = window.innerHeight;
        
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
      })();
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
