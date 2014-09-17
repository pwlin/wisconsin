/*jshint nonew: false */
var wisconsin = {};

wisconsin.init = function() {
  if (!navigator.userAgent.match(/Android/i)) {
    new FingerBlast('body');
  }
  //$('p.init').attr('style', 'display:inline-block;margin:10px;padding:10px;background-color:green;border-radius:5px;');
};
