/**
	DOM
	===

	Set of methods used for manipulating the Document Object Model (DOM).

*/
xui.extend({
/**
	html
	---

	For manipulating HTML in the DOM.

	__syntax__

		x$(window).html( location, html );

	or this method will accept just an html fragment with a default behavior of inner.

		x$(window).html( html );

	or you can use shorthand syntax by using the location name argument (see below) as the function name.

	    x$(window).outer( html );
	    x$(window).before( html );
 
	__arguments__
 
	 - location:string can be one of: inner, outer, top, bottom, remove, before or after.
	 - html:string any string of html markup or an HTMLElement.

	__example__

	  	x$('#foo').html( 'inner', '<strong>rock and roll</strong>' );
	  	x$('#foo').html( 'outer', '<p>lock and load</p>' );
		x$('#foo').html( 'top', '<div>bangers and mash</div>');
	  	x$('#foo').html( 'bottom','<em>mean and clean</em>');
	  	x$('#foo').html( 'remove');	
	  	x$('#foo').html( 'before', '<p>some warmup html</p>');
	  	x$('#foo').html( 'after', '<p>more html!</p>');
 
	or

	    x$('#foo').html( '<p>sweet as honey</p>' );
	    x$('#foo').outer( '<p>free as a bird</p>' );
	    x$('#foo').top( '<b>top of the pops</b>' );
	    x$('#foo').bottom( '<span>bottom of the barrel</span>' );
	    x$('#foo').before( '<pre>first in line</pre>' );
	    x$('#foo').after( '<marquee>better late than never</marquee>' );

*/
    html: function(location, html) {
        clean(this);

        if (arguments.length == 0) {
            return this[0].innerHTML;
        }
        if (arguments.length == 1 && arguments[0] != 'remove') {
            html = location;
            location = 'inner';
        }
        if (html.each !== undefined) {
            var that = this;
            html.each(function(el){
                that.html(location, el);
            });
            return this;
        }
        return this.each(function(el) {
            var parent, 
                list, 
                len, 
                i = 0;
            if (location == "inner") { // .html
                if (typeof html == string || typeof html == "number") {
                    el.innerHTML = html;
                    list = el.getElementsByTagName('SCRIPT');
                    len = list.length;
                    for (; i < len; i++) {
                        eval(list[i].text);
                    }
                } else {
                    el.innerHTML = '';
                    el.appendChild(html);
                }
            } else if (location == "outer") { // .replaceWith
                el.parentNode.replaceChild(wrapHelper(html, el), el);
            } else if (location == "top") { // .prependTo
                el.insertBefore(wrapHelper(html, el), el.firstChild);
            } else if (location == "bottom") { // .appendTo
                el.insertBefore(wrapHelper(html, el), null);
            } else if (location == "remove") {
                el.parentNode.removeChild(el);
            } else if (location == "before") { // .insertBefore
                el.parentNode.insertBefore(wrapHelper(html, el.parentNode), el);
            } else if (location == "after") { // .insertAfter
                el.parentNode.insertBefore(wrapHelper(html, el.parentNode), el.nextSibling);
            }
        });
    },

/**
	attr
	---

	For getting or setting attributes on elements.

	__syntax (and examples)__

	    x$(window).attr( attribute, value );

	To retrieve an attribute value, simply don't provide the optional second parameter:

		x$('.someClass').attr( 'class' );
	
	To set an attribute, use both parameters:

		x$('.someClass').attr( 'disabled', 'disabled' );

	__arguments__

	- attribute:string the name of the element's attribute to set or retrieve.
	- html:string if retrieving an attribute value, don't specify this parameter. Otherwise, this is the value to set the attribute to.

*/
    attr: function(attribute, val) {
        if (arguments.length == 2) {
            return this.each(function(el) {
                (attribute=='checked'&&(val==''||val==false||typeof val=="undefined"))?el.removeAttribute(attribute):el.setAttribute(attribute, val);
            });
        } else {
            var attrs = [];
            this.each(function(el) {
                var val = el.getAttribute(attribute);
                if (val != null)
                attrs.push(val);
            });
            return attrs;
        }
    }
});
"inner outer top bottom remove before after".split(' ').forEach(function (method) {
  xui.fn[method] = function(where) { return function (html) { return this.html(where, html); }; }(method);
});
// private method for finding a dom element
function getTag(el) {
    return (el.firstChild === null) ? {'UL':'LI','DL':'DT','TR':'TD'}[el.tagName] || el.tagName : el.firstChild.tagName;
}

function wrapHelper(html, el) {
  return (typeof html == string) ? wrap(html, getTag(el)) : html;
}

// private method
// Wraps the HTML in a TAG, Tag is optional
// If the html starts with a Tag, it will wrap the context in that tag.
function wrap(xhtml, tag) {

    var attributes = {},
        re = /^<([A-Z][A-Z0-9]*)([^>]*)>([\s\S]*)<\/\1>/i,
        element,
        x,
        a,
        i = 0,
        attr,
        node,
        attrList,
        result;
        
    if (re.test(xhtml)) {
        result = re.exec(xhtml);
        tag = result[1];

        // if the node has any attributes, convert to object
        if (result[2] !== "") {
            attrList = result[2].split(/([A-Z]*\s*=\s*['|"][A-Z0-9:;#\s]*['|"])/i);

            for (; i < attrList.length; i++) {
                attr = attrList[i].replace(/^\s*|\s*$/g, "");
                if (attr !== "" && attr !== " ") {
                    node = attr.split('=');
                    attributes[node[0]] = node[1].replace(/(["']?)/g, '');
                }
            }
        }
        xhtml = result[3];
    }

    element = document.createElement(tag);

    for (x in attributes) {
        a = document.createAttribute(x);
        a.nodeValue = attributes[x];
        element.setAttributeNode(a);
    }

    element.innerHTML = xhtml;
    return element;
}


/*
* Removes all erronious nodes from the DOM.
* 
*/
function clean(collection) {
    var ns = /\S/;
    collection.each(function(el) {
        var d = el,
            n = d.firstChild,
            ni = -1,
            nx;
        while (n) {
            nx = n.nextSibling;
            if (n.nodeType == 3 && !ns.test(n.nodeValue)) {
                d.removeChild(n);
            } else {
                n.nodeIndex = ++ni; // FIXME not sure what this is for, and causes IE to bomb (the setter) - @rem
            }
            n = nx;
        }
    });
}