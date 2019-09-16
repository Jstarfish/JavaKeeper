// ** ToTop Start **
(function($) {
  // When to show the scroll link
  // higher number = scroll link appears further down the page
  var upperLimit = 1000;
  // Our scroll link element
  var scrollElem = $('#totop');
  // Scroll to top speed
  var scrollSpeed = 500;
  // Show and hide the scroll to top link based on scroll position
  $(window).scroll(function() {
    var scrollTop = $(document).scrollTop();
    if (scrollTop > upperLimit) {
      $(scrollElem).stop().fadeTo(300, 1); // fade back in
    } else {
      $(scrollElem).stop().fadeTo(300, 0); // fade out
    }
  });

  // Scroll to top animation on click
  $(scrollElem).click(function() {
    $('html, body').animate({
      scrollTop: 0
    }, scrollSpeed);
    return false;
  });

})(jQuery);
// ** TotopEnd**


// **SearchFrom**
var $searchWrap = $('#search-form-wrap'),
  isSearchAnim = false,
  searchAnimDuration = 200;

var startSearchAnim = function() {
  isSearchAnim = true;
};

var stopSearchAnim = function(callback) {
  setTimeout(function() {
    isSearchAnim = false;
    callback && callback();
  }, searchAnimDuration);
};

$('#nav-search-btn').on('click', function() {
  if (isSearchAnim) return;

  startSearchAnim();
  $searchWrap.addClass('on');
  stopSearchAnim(function() {
    $('.search-form-input').focus();
  });
});

$('.search-form-input').on('blur', function() {
  startSearchAnim();
  $searchWrap.removeClass('on');
  stopSearchAnim();
});
// SearchFrom End
