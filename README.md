XUI
===

A lightweight, dead simple, microtiny, super modular JavaScript framework for building mobile web applications. Its true: the minified code is _super tiny_. You can find more information, downloads and documentation at http://xuijs.com (be warned: out of date!) ---if you want to build your own custom XUI or help contribute: please read on! The best documentation is in the source and the tests.

### Building XUI

To get the full source you need to use Git. _git clone_ the repo (as per usual) and then pull in the dependencies via _git submodule init_ and _git submodule update_. To build xui, run _build_. There are other tasks for code minification or building particular versions of XUI, for specific platforms:
    _build profile=bb_ - Builds a version of XUI for BlackBerries (uses Sizzle as the selector engine).
    _build profile=ie_ - Builds a version of XUI for Internet Explorer

### Source Tree

	xui
	 |-README.md ................ you are reading it!
	 | 
	 |-src
	 | |-base.js ................ bare essentials for dom node retrieval
	 | |
	 | |-js ................... essentials:
	 | | |-dom.js ............... - dom node manipulation
	 | | |-event.js ............. - event subscribe/publish
	 | | |-fx.js ................ - animation
	 | | |-style.js ............. - css hackery
	 | | '-xhr.js ............... - remoting
	 | |
	 | '-IE
	 |   |-dom.js
	 |   |-event.js
	 |   |-style.js
	 |
	 |-spec ..................... the spec
	 | |-index.html
	 | 
	 |-packages ................. 3rd party libs utilized by XUI (gitsubmodules)
	 | |-qunit .................. - awesome async friendly test lib by John Resig
	 | |-emile .................. - amazing tiny effects lib by Thomas Fuchs
	 | |-sizzle ................. - kickass selector engine that powers jQuery, also by John Resig. Used optionally for builds geared for BlackBerries.
	 | '-split.js ............... - override IE bad implementation of String.split
	 |
	 |-lib ...................... build directory (not in version control, use the build script in repository root to build these versions of xui)
	 | |-xui.js ................ "stock" XUI - optimized for standards-friendly browsers, i.e. webkit
	 | |-xui-bb.js ............. BlackBerry-compatible version of XUI
	 | '-xui-ie.js ............... Internet Explorer-compatible version of XUI
	 | 
	 '-util .................... utils for minification, obfuscation, verification


CREATORS
---

- http://github.com/brianleroux
- http://github.com/silentrob
- http://github.com/sintaxi


CONTRIBUTORS 
---

- http://github.com/rmurphey 
- http://github.com/remy
- http://github.com/filmaj
- http://github.com/alunny
- http://github.com/gdagley
- http://github.com/slexaxton
- http://github.com/cluster
- http://github.com/joemccann

(If I missed you pls let us know!)

LICENSE
---

_Copyright (c) 2008, 2009, 2010 Brian LeRoux, Brock Whitten, Rob Ellis_

Permission is hereby granted, free of charge, to any person obtaining
a copy of this software and associated documentation files (the
"Software"), to deal in the Software without restriction, including
without limitation the rights to use, copy, modify, merge, publish,
distribute, sublicense, and/or sell copies of the Software, and to
permit persons to whom the Software is furnished to do so, subject to
the following conditions:

The above copyright notice and this permission notice shall be included
in all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND,
EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF
MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT.
IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY
CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT,
TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE
SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
