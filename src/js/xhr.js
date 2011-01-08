/**
	XHR
	===

	Remoting methods and utils.
 */
xui.extend({	
 
/**
	XHR
	---

	The classic Xml Http Request sometimes also known as the Greek God: Ajax. Not to be confused with AJAX the cleaning agent.
	This method has a few new tricks. It is always invoked on an element collection and follows the identical behaviour as the
	`html` method. If there no callback is defined the response text will be inserted into the elements in the collection.

	### syntax ###

		xhr(location, url, options)

	or this method will accept just a url with a default behavior of inner...

		xhr(url, options);

	### options ###

	- method {String} [get|put|delete|post] Defaults to 'get'.
	- async {Boolen} Asynchronous request. Defaults to false.
	- data {String} A url encoded string of parameters to send.
	- callback {Function} Called on 200 status (success)

	### response ###

	- The response available to the callback function as 'this', it is not passed in.
	- `this.reponseText` will have the resulting data from the file.

	### example ###

		x$('#status').xhr('inner', '/status.html');
		x$('#status').xhr('outer', '/status.html');
		x$('#status').xhr('top',   '/status.html');
		x$('#status').xhr('bottom','/status.html');
		x$('#status').xhr('before','/status.html');
		x$('#status').xhr('after', '/status.html');

	or

		x$('#status').xhr('/status.html');

		x$('#left-panel').xhr('/panel', {callback:function(){ alert("All Done!") }});

		x$('#left-panel').xhr('/panel', function(){ alert(this.responseText) }); 
*/
    xhr:function(location, url, options) {

      // this is to keep support for the old syntax (easy as that)
		if (!/^(inner|outer|top|bottom|before|after)$/.test(location)) {
            options = url;
            url = location;
            location = 'inner';
        }

        var o = options ? options : {};
        
        if (typeof options == "function") {
            // FIXME kill the console logging
            // console.log('we been passed a func ' + options);
            // console.log(this);
            o = {};
            o.callback = options;
        };
        
        var that   = this,
            req    = new XMLHttpRequest(),
            method = o.method || 'get',
            async  = o.async || false,           
            params = o.data || null,
            i = 0;

        req.queryString = params;
        req.open(method, url, async);

        if (o.headers) {
            for (; i<o.headers.length; i++) {
              req.setRequestHeader(o.headers[i].name, o.headers[i].value);
            }
        }

        req.handleResp = (o.callback != null) ? o.callback : function() { that.html(location, this.responseText); };
        req.handleError = (o.error && typeof o.error == 'function') ? o.error : function () {};
        function hdl(){ 
            if(req.readyState==4) {
                delete(that.xmlHttpRequest);
                if(req.status===0 || req.status==200) req.handleResp(); 
                if((/^[45]/).test(req.status)) req.handleError();
            }
        }
        if(async) {
            req.onreadystatechange = hdl;
            this.xmlHttpRequest = req;
        }
        req.send(params);
        if(!async) hdl();

        return this;
    }
// --
});