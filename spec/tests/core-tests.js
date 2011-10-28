// QUnit is an interesting beast
QUnit.config.autostart = false;
if (typeof window.localStorage != 'undefined') window.localStorage.clear();
if (typeof window.sessionStorage != 'undefined') window.sessionStorage.clear();


function CoreTests() { return this; };
CoreTests.prototype.run = function () {
  // ---
  // base.js specs
  // ---
    module("xui base (base.js)", {
        setup:function() {
            x = x$('ul#has_tests li');
        },
        teardown:function() {
            x = null;
        }
    });
        test( '.find()', function(){
            expect(1);
            x = x$('#find_tests_inner').find('.foo');
            equals(x[0].innerHTML, 'second', 'Should set context properly and limit tree searches to base xui object');
        });
        test( '.has()', function(){
            expect(1);
            equals(x.has(".foo").length, 2, 'Should return number of elements after including a specific class as defined in markup');
        });
        test( '.not()', function(){
            expect(2);
            equals(x.not(".foo").length, 3, 'Should return number of elements after omitting a specific class as defined in markup');
            equals(x.not(".not_in_dom").length, 5, 'Should return all elements after omitting a specific class that doesn\'t exist');
        });
    
    module("Selectors", {
        setup:function() {},
        teardown:function() {
            x = null;
        }
    });
        test( 'ID selector', function(){
            expect(3);
            x = x$('#item_1');
            equals(x.length, 1, 'Should return non-zero length array for existing elements with specified ID');
            equals(x[0].innerHTML, 'this is item one', 'Should contain innerHTML as exists in markup');
            x = x$('#idontthinkthisitemexists');
            equals(x.length, 0, 'Should return a zero length array for non-existing elements');
        });
        test('Class selector', function() {
            expect(3);
            x = x$(".item");
            equals(x.length, 3, 'Should return number of elements with class the proper specified class');
            equals(x[0].innerHTML, 'this is item one', 'Should have text as specified in markup');
            equals(x[x.length - 1].innerHTML, 'this is item three', 'Should have text as specified in markup');
        });
        test('Element(s) reference selector', function() {
            expect(3);
            var el = document.getElementById("item_1"),
            x = x$(el);
            equals(x.length, 1, 'Should return array with one element');
            equals(x[0].innerHTML, 'this is item one', 'Should have proper text as defined in page markup');
            var formEls = document.getElementById('form_1').elements;
            x = x$(formEls);
            equals(x.length, 2, 'Should return proper number of elements when passing in a HTMLCollection object')
        });
        test('Tag name selector', function() {
            expect(2);
            x = x$("item_1");
            equals(x.length, 0, 'Non-existent tag name should return xui object with length 0');
            x = x$('li');
            ok(x.length > 0, 'Should return plenty of elements by tag name if elements are present in markup');
        });

    // ---
    /// style.js specs
    // ---

    module("Style (style.js)", {
        setup:function() {
            e = x$('#get-style-element');
        },
        teardown:function() {
            e = null;
        }
    });
        test( '.getStyle()', function(){
            expect(4);
            ok(e.getStyle('background-color') instanceof Array, 'Should always return an Array');
            var style = e.getStyle('background-color')[0].toLowerCase();
            ok(style == 'rgb(0, 0, 255)' || style == '#0000ff', 'Should return proper style via CSS style name');
            var styletwo = e.getStyle('backgroundColor')[0].toLowerCase();
            ok(styletwo == 'rgb(0, 0, 255)' || styletwo == '#0000ff', 'Should return proper style via DOM style name');
            QUnit.stop();
            e.getStyle('background-color', function(v){
                v = v.toLowerCase();
                ok(v == 'rgb(0, 0, 255)' || v == '#0000ff', 'Should return proper style in callback function');
                QUnit.start();
            });
        });
        test( '.setStyle()', function(){
            expect(3);
            equals(e, e.setStyle('background-color', '#008000'), 'Should be chainable');
            ok(e[0].style.backgroundColor == 'rgb(0, 128, 0)' || e[0].style.backgroundColor == '#008000', 'Should be able to change styles via background-color');
            e.setStyle('backgroundColor', '#800000');
            ok(e[0].style.backgroundColor == 'rgb(128, 0, 0)' || e[0].style.backgroundColor == '#800000', 'Should be able to change styles via backgroundColor');
        });
        test( '.addClass()', function(){
            expect(3);
            var x = x$('#add-class-element');
            equals(x, x.addClass('foo'), 'Should be chainable');
            equals(x[0].className, "foo", 'Should properly add class to an element with no existing classes');
            x.addClass('bar');
            equals(x[0].className, "foo bar", 'Should properly add class to an element with an existing class');
        });
        test('.removeClass()', function() {
            expect(4);
            var x = x$('#remove-class-element');
            equals(x, x.removeClass('bar'), 'Should be chainable');
            var classes = x[0].className.split(' ');
            ok(classes.indexOf('bar') == -1, 'Should remove a class from an element');
            ok(classes.indexOf('foo') > -1,  'Should keep surrounding classes intact');
            ok(classes.indexOf('baz') > -1,  'Should keep surrounding classes intact');
            x.removeClass('foo');
        });
        test('.hasClass()', function() {
            var x = x$('#has-class-element');
            ok(x.hasClass('bar'), 'Should return true when element has specified class');
            equals(x.hasClass('zug'), false, 'Should return false when element does not have the specified class');
            
            var y = x$('#this-should-never-exist-in-the-dom');
            equals(y.hasClass('bar'), false, 'Should return false when the selector matches zero elements');
            
            var spans = x$('#style_tests span');
            equals(spans.hasClass('for-has'), false, 'Should return false for multi-object collections where not all elements have the class');
            
            var foo = x$('#style_tests .foo');
            equals(foo.hasClass('bar'), true, 'Should return true for multi-object collections where all elements have the class');
            
            var z = x$('#style_tests').find('p');
            var numFound = 0;
            QUnit.stop();
            z.hasClass('foo', function(el) {
                numFound++;
                ok(el.className.indexOf('foo') > -1, 'Callback function element parameter should always contain specified class');
                if (numFound > 2) QUnit.start();
            });
            equals(numFound, x$('#style_tests').find('.foo').length, 'Should invoke callback function properly for every item with matching class');
        });
        test('.toggleClass()', function() {
            expect(4);
            var x = x$('#toggle-class-element');
            
            equals(x.toggleClass('someClass'), x, 'Should be chainable');
            
            x.toggleClass('foo');
            var classes = x[0].className.split(' ');
            ok(classes.indexOf('foo') == -1, 'Should remove class "foo" if present on element');
            
            x.toggleClass('foo');
            var classes = x[0].className.split(' ');
            ok(classes.indexOf('foo') > -1, 'Should add class "foo" if not present on element');
            
            var y = x$('#style_tests span'); // one span has a 'for-has' class, the other doesn't.
            y.toggleClass('for-has');
            ok(y[0].className == '' && y[1].className == 'for-has', 'In multi-object collections, should add class where class is not present, and remove where it is');
        });

    // --
    /// dom specs
    // --

    module( "DOM (dom.js)", {
        setup:function() {
            inner  = x$('#html-test-inner');
            outer  = x$('#html-test-outer');
            topTest    = x$('#html-test-top');
            bottom = x$('#html-test-bottom');
            h = x$('#html-test-html');
        },
        teardown:function() {
            inner = null, outer = null, topTest = null, bottom = null, h = null;
        }
    });
        test( 'Inserting html "after"', function() {
            expect(5);
            h.html('after', '<div>after</div>');
            equals(h[0].nextSibling.innerHTML, 'after', 'New next sibling element should be created');
            h.after('<div>after again</div>');
            equals(h[0].nextSibling.innerHTML, 'after again', 'Using shortcut .after(), new next sibling element should be created');
            equals(h[0].nextSibling.nextSibling.innerHTML, 'after', 'Doesn\'t destroy sibling nodes.');
            var inputs = x$('input');
            h.after(inputs);
            equals(h[0].nextSibling, inputs[inputs.length-1], 'Using xui collection as parameter, next sibling to element is last element in parameter collection');
            h.after(inputs[0]);
            equals(h[0].nextSibling, inputs[0], 'Using HTMLElement as parameter, next sibling to element is passed in element');
        });

        test( 'Inserting html "before"', function() {
            expect(2);
            h.html('before', '<div>before</div>');
            equals(h[0].previousSibling.innerHTML, 'before', 'Previous sibling element should be created');
            h.before('<div>before again</div>');
            equals(h[0].previousSibling.innerHTML, 'before again', 'Using shortcut .before(), previous sibling element should be created');
        });

        test( 'Inserting html via "inner"', function(){
            expect(2);
            inner.html('inner', '<p>hello world</p>');
            equals(inner[0].childNodes[0].innerHTML, 'hello world', 'Element should have childNode with proper content'); 
            inner.inner('<p>hello inner</p>');
            equals(inner[0].childNodes[0].innerHTML, 'hello inner', 'Using shortcut .inner(), element should have childNode with proper content'); 
        });

        test( 'Inserting html via "outer"', function(){
            expect(2);
            outer.html('outer', '<div id="html-test-new-outer">sneaky</div>');
            equals(document.getElementById('html-test-new-outer').innerHTML, 'sneaky', 'Outer should replace the element and have specified content');
            equals(document.getElementById('html-test-outer'), null, 'Selected element should be gone if replaced with element with different ID');
        });
        test( 'Inserting html via "top"', function(){
            expect(3);
            var numOriginalElements = topTest[0].childNodes.length;
            topTest.html('top', '<div>come out on top</div>');
            equals(topTest[0].childNodes[0].innerHTML, 'come out on top', 'Should create a new element at head of element\'s childNodes'); 
            equals(topTest[0].childNodes.length, numOriginalElements+1, 'Existing element inside selected element should remain after a "top" insertion');

            var content = "<a id='closeCart' onclick='miniCart.hideCart()'>X</a>";
            x$("#miniCartHeader").html('top', content);
            var miniCart = document.getElementById('miniCartHeader');
            equals(miniCart.innerHTML, content.replace(/'/g,'"'), 'inserting HTML via "top" should work with anchor tags containing onclick and id attributes');
        });
        test( 'Inserting html via "bottom"', function(){
            // Base case
            var numOriginalElements = bottom[0].childNodes.length;
            bottom.html('bottom', '<div>undertow</div>');
            equals(bottom[0].childNodes[numOriginalElements].innerHTML, 'undertow', 'Should create a new element at tail of element\'s childNodes'); 
            equals(bottom[0].childNodes.length, numOriginalElements+1, 'Existing element inside selected element should remain after a "bottom" insertion');
            
            // Test with complex attributes.
            numOriginalElements = bottom[0].childNodes.length;
            bottom.html('bottom', '<p id="this-is-a-test" style="font-size:12px;color:red;">hi</p>');
            equals(bottom[0].childNodes[numOriginalElements].innerHTML, 'hi', 'Should create a new element at tail of element\'s childNodes'); 
            equals(bottom[0].childNodes.length, numOriginalElements+1, 'Existing elements inside selected element should remain after a "bottom" insertion');

            // Numerous sibling elements test.
            numOriginalElements = bottom[0].childNodes.length;
            var numerousItems = '' +
              '<a href="#1" class="link_o">one link</a>' +
              '<a href="#2" class="link_o">two link</a>' +
              '<a href="#3" class="link_o">three link</a>';
            bottom.html('bottom', numerousItems);
            equals(bottom[0].childNodes.length, numOriginalElements + 3, 'Should append numerous elements when passed as string');
        });
        test( 'Removing html elements via "remove"', function() {
            expect(2);
            var el = x$('#remove-me');
            el.remove();
            equals(document.getElementById('remove-me'), null, 'Element should not exist after calling remove()');
            var eltwo = x$('#remove-me-2');
            eltwo.html('remove');
            equals(document.getElementById('remove-me-2'), null, 'Element should not exist after calling html("remove")');
            try {
                x$('#doesnt-exist').remove();
                x$('#neither-does-this-one').html('remove');
            } catch(e) {
                ok(false, 'Should not trigger exception on empty xui collections');
            }
        });
        test( '.html()', function(){
            expect(5);
            equals(h.html()[0], h[0].innerHTML, 'Should return innerHTML when called with no arguments');
            
            var newListItem = "<li>\nHello\n</li>";
            x$("#html-list-test").html('bottom', newListItem);
            equals(x$("#html-list-test")[0].innerHTML.toLowerCase(), newListItem.toLowerCase(), 'Should keep newline characters after an insertion');
            
            h.html(1);
            equals(h[0].innerHTML, "1", 'Should properly insert Number-type content');
            
            // putting attributes with empty strings since safari does it anyway
            // i.e. 'controls' becomes 'controls=""'
            var myVideo = '<video src="myAwesomeVideo.mp4" id="my_video" autobuffer="" controls=""></video>';
            x$("#html-complex-test").html('inner', myVideo);
            equals(x$("#html-complex-test")[0].innerHTML, myVideo, 'Should properly insert complex DOM elements (like a video tag)');

            // percent and periods in attributes when injecting HTML
            var oldMarkup = x$('#html-list-test').html()[0];
            var newMarkup = '<li id="help" style="width: 33.3333%;"> help </li>';
            x$('#html-list-test').html('bottom', newMarkup);
            equals(x$('#html-list-test')[0].innerHTML, oldMarkup + newMarkup, 'injecting html with attributes containing periods or percent signs should work');

            
        });
        
        test('.attr()', function() {
            expect(9);
            var checkbox = x$('#first-check');
            checkbox.attr('checked',true);
            equals(checkbox[0].checked, true, 'Should be able to check a checkbox-type input element');
            checkbox.attr('checked',false);
            equals(checkbox[0].checked, false, 'Should be able to un-check a checkbox-type input element');
            try {
                x$(window).attr('height','100px');
                x$(window).attr('onload');
            } catch(e) {
                ok(false, 'Getting or setting attribute on window object should not throw exception');
            }
            var beforeAttr = h.attr('width');
            h.attr('width', '100px');
            equals(h[0].getAttribute('width'), '100px', 'Setting DOM element attribute with attr should work');
            ok(beforeAttr != h.attr('width'), 'Getting DOM element attribute should work also');
            
            var textInput = x$('#text_input');
            var inputValueBefore = textInput.attr('value');
            equals(inputValueBefore[0], "initial value", 'should existing string in input when calling attr() with one parameter.');
            textInput.attr('value','some new value');
            equals(textInput[0].value, 'some new value', 'using attr() to set value on text inputs should work.');
            
            equals(0, x$('#dom_tests').attr('non-existing').length, 'attr() on non-existing attributes should return xui objects of length 0');

            var pwdInput = document.getElementById('p');
            var initValue = pwdInput.value;
            var retrievedValue = x$('#p').attr('value');
            equals(initValue, retrievedValue, 'attr("value") should return initial value set in a password field');

            pwdInput.value = 'newvalue';
            equals(pwdInput.value, x$('#p').attr('value'), 'attr("value") should return changed values set in a password field');
        });

    // --
    /// xhr specs
    // --

    module( "Remoting (xhr.js)", {
        setup:function() {
            var srh = XMLHttpRequest.prototype.setRequestHeader;

            window.headers = {};

            XMLHttpRequest.prototype.setRequestHeader = function (key, val) {
                window.headers[key] = val;
                srh.call(this, key, val);
            }

            x = x$('#xhr-test-function');
        },
        teardown:function() {
            x.html('');
            x = null;
        }
    });
        test( 'Asynchronous XHRs', function() {
            expect(2);
            QUnit.stop();
            x.xhr("helpers/example.html", {
                callback:function() {
                    ok(true, 'Specified callback function should be triggered properly');
                    equals(x$('#xhr-test-function')[0].innerHTML,'','Defined callback should override default behaviour of injecting response into innerHTML');
                    QUnit.start();
                }
            });
        });
        test( 'Synchronous XHRs', function(){
            expect(1);
            x.xhr("helpers/example.html", {async:false});
            equals(x[0].innerHTML.toLowerCase(), '<h1>this is a html partial</h1>', 'Should insert partial into element');
        });

        test( 'Setting headers', function () {
            expect(1);
            x.xhr("helpers/example.html", {
                async: false,
                headers: {
                    'foo': 'bar',
                }
            });
            equals(window.headers['foo'], 'bar', 'Should call setRequestHeader correctly');
        });

        test( 'Should have X-Requested-With header set to XMLHttpRequest', function() {
            expect(1);
            x.xhr("helpers/example.html", {
                headers: {
                    'foo':'bar'
                }
            });
            equals(window.headers['X-Requested-With'], 'XMLHttpRequest', 'Should set X-Requested-With header to "XMLHttpRequest"');
        });

    // --
    /// fx specs
    // --

    module( "Effects (fx.js)", {
        setup:function() {},
        teardown:function() {}
    });
        test( '.tween()', function() {
            QUnit.stop();
            expect(2);
            var el = x$('#square');
            el.tween({left:'100px'}, function() {
                ok(true, 'Callback should be called following tween');
                equals(el[0].style.left,'100px', 'Tweened property should be set to final value as specified in tween call');
                QUnit.start();
            });
        });
        test( '.tween() with negative values', function() {
            QUnit.stop();
            expect(2);
            var el = x$('#square_neg');
            el.tween({left:'-100px'}, function() {
                ok(true, 'Callback should be called following tween');
                equals(el[0].style.left,'-100px', 'Tweened property should be set to final (negative) value as specified in tween call');
                QUnit.start();
            });
        });
        test( '.tween() with dom-style named CSS styles', function() {
            QUnit.stop();
            expect(2);
            var el = x$('#square_dom');
            el.tween({marginTop:'200px'}, function() {
                ok(true, 'Callback should be called following tween');
                equals(el[0].style.marginTop, '200px', 'Tweened property should be set to final value');
                QUnit.start();
            });
        });
        test( '.tween() with css-style named CSS styles', function() {
            QUnit.stop();
            expect(2);
            var el = x$('#square_dom_two');
            el.tween({'margin-left':'200px'}, function() {
                ok(true, 'Callback should be called following tween');
                equals(el[0].style.marginLeft, '200px', 'Tweened property should be set to final value');
                QUnit.start();
            });
        });


    // --
    /// event specs
    // --
    module("Events (event.js)", {
        setup:function() {
            // updated to create new element to reset events associated
            var div = document.createElement('div');
            document.getElementById('test-elements').appendChild(div);
            x = x$(div);
        },
        teardown:function() {
            document.getElementById('test-elements').removeChild(x[0]);
            x = null;
        }
    });
        test('xui object should have a "ready" function', function() {
            expect(2);
            equals(typeof x$.ready, "function", "x$ should have the 'ready' function");
            equals(typeof xui.ready, "function", "xui should have the 'ready' function");
        });
        test('.on(event,function() { ... }) should bind anonymous function to selected element, and should be triggered by .fire(event) call', function () {
            QUnit.stop();
            expect(2);
            x.on('click', function () {
                ok(true, 'Click handler fired using fire("click") call');
                this.innerHTML = 'firedclick';
                equals(x[0].innerHTML, 'firedclick', 'Click handler function should have been able to modify innerHTML of element using "this" reference');
                QUnit.start();
            }).fire('click').un('click');
        });

        test('.un(event) should unbind event handler from selected element', function () {
            QUnit.stop();
            expect(0);
            x.on('click', function () {
                ok(false, 'Click handler should not be fired after calling .un(event)');
                QUnit.start();
            }).un('click').fire('click');
            QUnit.start();
        });
      
       test('.on(event) should be able to bind a custom event', function () {
            QUnit.stop();
            expect(1);
            x.on('brianisadonkey', function () {
                ok(true, '"brianisadonkey" event handler should be called by .fire("brianisadonkey")');
                QUnit.start();
            }).fire('brianisadonkey').un('brianisadonkey');
        });
      
        test('.un(event) doesn\'t interfere with other events registered on the element', function () {
            QUnit.stop();
            expect(1);
            x.on('custom', function () {
                ok(true, '"custom" event handler should be called properly following "click" event unbinding and "custom" event firing');
                QUnit.start();
            });
            x.on('click', function () {
                ok(false, '"click" event handler should not be called following "click" event unbinding and "custom" event firing');
            }).un('click');
            x.fire('custom');
        });
              
        test('.on(event) and .fire(event) should handle multiple events gracefully', function () {
            var fired = 0;
            function incfired() {
                fired++;
            }
            x.on('click', incfired).on('custom1', incfired).on('touchstart', incfired).fire('click').fire('custom1').fire('touchstart');
            equals(fired, 3, 'Counter should be incremented by three different event handlers');
        });
      
        test('Should be able to unbind specific events using .un(event, handler)', function () {
            QUnit.stop();
            expect(1);
            function one() {
                ok(false, '.un(event, handler) should prevent function "handler" from being called');
                QUnit.start();
            }
            function two() {
                ok(true, '.fire("click") should trigger the only registered event on element');
                QUnit.start();
            }
            x.on('click', one).on('click', two).un('click', one).fire('click');
        });

        test('Should not bubble custom events if stopping propagation', function () {
            var parent = x[0].parentNode,
                fired = 0;
            function incfired() {
                fired++;
            }
            x$(parent).on('custom', incfired);
            x.on('custom', incfired).fire('custom');
            equals(fired, 2);
        });
        
        test('Should be able to create bespoke events', function () {
            QUnit.stop();
            // note that teardown methods are needed - this is an early system
            expect(1);
            
            // triple click bespoke event
            x$.events.tripleclick = function (details) {
                var clicked = 0, 
                    $el = x$(this).on('click', function () {
                        clicked++;
                        if (clicked === 3) {
                            clicked = 0;
                            details.handler.call(this);
                        }
                    });
            };
            
            var fired = false;
            x.on('tripleclick', function () {
                ok(true, 'tripleclick bespoke event fired on element');
                QUnit.start();
            }).fire('click').fire('click').fire('click');
        });
        
        test('Bespoke events should not leak to other elements', function () {
            // Don't know if this test will work. Since it's not an async test, QUnit won't wait for the callbacks to be called
            // as soon as it passes the first if conditional below it'll keep going to the next tests (and pass, since we are expecting 0 assertions).
            expect(0);
            if (x$.events.tripleclick) {
                var div = document.createElement('div'),
                    y = x$(div);
                document.body.appendChild(div);

                y.on('tripleclick', function () {
                    ok(false, 'tripleclick leaked to a completely separate element');
                });
                x.on('tripleclick', function () {});
                x.fire('click').fire('click').fire('click');                
            } else {
                ok(false, 'tripleclick bespoke event missing');
            }
        });

        test('Should be able to fire keyboard events', function() {
          QUnit.stop();
          expect(1);
          var i = document.createElement('input');
          i.type = 'text';
          i.onkeyup = function(e) { 
            ok(true, "keyboard event should be fired.");
            QUnit.start();
          }
          x.bottom(i);
          i = x$(i);
          i.fire('keyup');
        });

        test('Should be able to fire and trigger keyboard events via xui', function() {
          QUnit.stop();
          expect(1);
          var i = document.createElement('input');
          i.type = 'text';
          i = x$(i);
          i.on('keyup', function(e) { 
            ok(true, "keyboard event should be fired.");
            QUnit.start();
          });
          x.bottom(i);
          i.fire('keyup');
        });

    QUnit.start();
}
