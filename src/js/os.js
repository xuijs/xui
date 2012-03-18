/**
  Device/OS Detection
  ================

  Simple device detection for OS and Device type

  Example: x$.os.iphone (would return a boolean)

  Devices:

  x$.os.iphone
  x$.os.ipod
  x$.os.ipad
  x$.os.android
  x$.os.blackberry -- Will return true for webkit based Blackberry phones
  x$.os.blackberryplaybook
  x$.os.windowsphone
  x$.os.kindlefire
  x$.os.phone
  x$.os.tablet
  x$.os.desktop
  x$.os.othermobile
 
  Doesn't really belong on the prototype, as opposed to be a property on the xui object

*/
var xui = xui || {};

xui.os = (function() {

  var os = {};

  os.phone = false,
  os.tablet = false;
  //iPhone
  os.iphone = (testNavigator(/iPhone/i, 'platform')) ? true : false;
  if(os.iphone) os.phone = true;
  //iPad
  os.ipad = (testNavigator(/iPad/i, 'platform')) ? true : false;
  if(os.ipad) os.tablet = true;
  //iPod
  os.ipod = (testNavigator(/iPod/i, 'platform')) ? true : false;
  //Android device
  os.android = testNavigator(/Android/i, 'userAgent');
  if(os.android) {
    //Android v3 built as tablet-only version of the OS
    //Can definitively say it's a tablet at this point
    if(testVersion(/Android\s(\d+\.\d+)/i, 3, 'match') ) {
      os.tablet = true;
    }
    //Checking for "mobile" in userAgent string for Mobile Safari.
    //Also checking resolution here (max portrait of 800), simply because so 
    //many Android tablets that are popular use Android v2.x or now v4.x  
    else if(testResolution(800) && testNavigator(/Mobile/i, 'userAgent')) {
      os.phone = true;
    }
    //Default phone vs. tablet value? Defaulting to phone for now until I can think
    //of a better alternative approach to narrow down better.
    else {
      os.phone = true;
    }
  }
  //Blackberry Phone with WebKit
  os.blackberry = (testNavigator(/Blackberry/i, 'userAgent') && testNavigator(/Mobile/i, 'userAgent')) ? true : false;
  if(os.blackberry) os.phone = true;
  //Blackberry Playbook
  os.blackberryplaybook = testNavigator(/RIM\sTablet/i, 'userAgent');
  if(os.blackberryplaybook) os.tablet = true;
  //Windows Phone
  os.windowsphone = testNavigator(/Windows\sPhone/i, 'userAgent');
  if(os.windowsphone) os.phone = true;
  //Kindle Fire
  os.kindlefire = testNavigator(/Silk/i, 'userAgent');
  if(os.kindlefire) os.tablet = true;
  //other mobile
  os.othermobile = (os.phone || os.tablet || os.ipod) ? false : testResolution(320);
  //desktop user?
  os.desktop = (os.phone || os.tablet || os.ipod) ? false : true;


  //Test window.navigator object for a match
  //return - Boolean
  function testNavigator(pattern, property) {
    return pattern.test(window.navigator[property]);
  };

  //Test if maximum portrait width set in platform is less than the current screen width
  //return - Boolean
  function testResolution(maxPortraitWidth) {
    var portraitWidth = Math.min(screen.width, screen.height) / ("devicePixelRatio" in window ? window.devicePixelRatio : 1);
    if(portraitWidth <= maxPortraitWidth) {
      return true;
    }
    else {
      return false;
    }
  };

  //Test OS Version
  //param - pattern - Regex pattern
  //param - version - Integer - Major version to compare against
  //param - versionComparison - String - How version matching is done "match", "greaterThan", "lessThan"
  //return - Boolean
  function testVersion(pattern, version, versionComparison) {
    var fullVersion = pattern.exec(window.navigator.userAgent),
        majorVersion = parseInt(fullVersion[1], 10);
        
    if(versionComparison === "match" && majorVersion === version ) {
      return true;
    }
    else if(versionComparison === "greaterThan" && majorVersion > version) {
      return true;
    }
    else if(versionComparison === "lessThan" && majorVersion < version) {
      return true;
    }
    else {
      return false;
    }
  };

  return os;

})();