/**
	Fx
	==

	Animations, transforms, and transitions for getting the most out of hardware accelerated CSS.

*/

xui.extend({

/**
	Tween
	-----

	Transforms a CSS property's value.

	### syntax ###

		x$( selector ).tween( properties, callback );

	### arguments ###

	- properties `Object` or `Array` of CSS properties to tween.
	    - `Object` is a JSON object that defines the CSS properties.
	    - `Array` is a `Object` set that is tweened sequentially.
	- callback `Function` to be called when the animation is complete. _(optional)_.

	### properties ###

	A property can be any CSS style, referenced by the JavaScript notation.

	A property can also be an option from [emile.js](https://github.com/madrobby/emile):

	- duration `Number` of the animation in milliseconds.
	- after `Function` is called after the animation is finished.
	- easing `Function` allows for the overriding of the built-in animation function.

			// Receives one argument `pos` that indicates position
			// in time between animation's start and end.
			function(pos) {
			    // return the new position
			    return (-Math.cos(pos * Math.PI) / 2) + 0.5;
			}

	### example ###

		// one JSON object
		x$('#box').tween({ left:'100px', backgroundColor:'blue' });
		x$('#box').tween({ left:'100px', backgroundColor:'blue' }, function() {
		    alert('done!');
		});
		
		// array of two JSON objects
		x$('#box').tween([{left:'100px', backgroundColor:'green', duration:.2 }, { right:'100px' }]); 
*/
	tween: function( props, callback ) {

    // creates an options obj for emile
    var emileOpts = function(o) {
      var options = {};
      "duration after easing".split(' ').forEach( function(p) {
        if (props[p]) {
            options[p] = props[p];
            delete props[p];
        }
      });
      return options;
    }

    // serialize the properties into a string for emile
    var serialize = function(props) {
      var serialisedProps = [], key;
      if (typeof props != string) {
        for (key in props) {
          serialisedProps.push(cssstyle(key) + ':' + props[key]);
        }
        serialisedProps = serialisedProps.join(';');
      } else {
        serialisedProps = props;
      }
      return serialisedProps;
    };

    // queued animations
    /* wtf is this?
		if (props instanceof Array) {
		    // animate each passing the next to the last callback to enqueue
		    props.forEach(function(a){
		      
		    });
		}
    */
    // this branch means we're dealing with a single tween
    var opts = emileOpts(props);
    var prop = serialize(props);
		
		return this.each(function(e){
			emile(e, prop, opts, callback);
		});
	}
});
