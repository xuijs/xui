/**
	Effects
	=======

	Animations, transforms and transitions for getting the most out of hardware accelerated CSS.
 */
xui.extend({

/**
	Tween
	-----

	Tween is a method for transforming a css property to a new value.

	### syntax ###

		x$(selector).tween(obj, callback);

	### arguments ###

	- properties: object an object literal of element css properties to tween or an array containing object literals of css properties to tween sequentially.
	- callback (optional): function to run when the animation is complete

	### example ###

		x$('#box').tween({ left:'100px', backgroundColor:'blue' });
		x$('#box').tween({ left:'100px', backgroundColor:'blue' }, function() { alert('done!'); });
		x$('#box').tween([{ left:'100px', backgroundColor:'green', duration:.2 }, { right:'100px' }]); 
*/
	// options: duration, after, easing
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
                    serialisedProps.push(key + ':' + props[key]);
    		    }
      		    serialisedProps = serialisedProps.join(';');
    		} else {
    		    serialisedProps = props;
    		}
    		return serialisedProps;
		};
	    
	    
		// queued animations
		if (props instanceof Array) {
		    // animate each passing the next to the last callback to enqueue
		    props.forEach(function(a){
		        
		    });
		}
	
	    
	    
	
	
	    // this branch means we're dealing with a single tween
	    var opts = emileOpts(props);
	    var prop = serialize(props);
		
		return this.each(function(e){
			emile(e, prop, opts, callback);
		});
	}
//---
});