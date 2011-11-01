/**
 *
 * @namespace {Event}
 * @example
 *
 * Event
 * ---
 *	
 * A good old fashioned event handling system.
 * 
 */
xui.events = {}; var cache = {};
var stockEvents = "click load submit touchstart touchmove touchend touchcancel gesturestart gesturechange gestureend orientationchange".split(' ');
xui.extend({
	
	
	/**	
	 *
	 * Register callbacks to DOM events.
	 * 
	 * @param {Event} type The event identifier as a string.
	 * @param {Function} fn The callback function to invoke when the event is raised.
	 * @return self
	 * @example
	 * 
	 * ### on
	 * 
	 * Registers a callback function to a DOM event on the element collection.
	 * 
	 * For more information see:
	 * 
	 * - http://developer.apple.com/webapps/docs/documentation/AppleApplications/Reference/SafariWebContent/HandlingEvents/chapter_7_section_1.html#//apple_ref/doc/uid/TP40006511-SW1
	 *
	 * syntax:
	 *
	 * 		x$('button').on( 'click', function(e){ alert('hey that tickles!') });
	 * 
	 * or...
	 * 
	 * 		x$('a.save').click(function(e){ alert('tee hee!') });
	 *
	 * arguments:
	 *
	 * - type:string the event to subscribe to click|load|etc
	 * - fn:function a callback function to execute when the event is fired
	 *
	 * example:
	 * 	
	 * 		x$(window).load(function(e){
	 * 			x$('.save').touchstart( function(evt){ alert('tee hee!') }).css(background:'grey');	
	 *  	});
	 * 	
	 */
	on: function(type, fn, details) {
      return this.each(function (el) {
        el.attachEvent('on' + type, _createResponder(el, type, fn));
      });
    },

    un: function(type, fn) {
      return this.each(function (el) {
          var id = _getEventID(el), responders = _getRespondersForEvent(id, type), i = responders.length;

          while (i--) {
            if (fn === undefined || fn.guid === responders[i].guid) {
              el.detachEvent('on'+type, responders[i]);
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

  	fire: function (type, data) {
      return this.each(function (el) {
        if (el == document && !el.fireEvent)
            el = document.documentElement;

        var event = document.createEventObject();
        event.data = data || {};
        event.eventName = type;
        if (stockEvents.indexOf(type) > -1)
          el.fireEvent("on" + type, event);
        else {
          var responders = _getRespondersForEvent(_getEventID(el), type);
          responder.call(el);
        }
      });
  	}
  
// --
});

stockEvents.forEach(function (event) {
  xui.fn[event] = function(action) { return function (fn) { return fn ? this.on(action, fn) : this.fire(action); }; }(event);
});

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
