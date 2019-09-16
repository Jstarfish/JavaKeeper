(function($){
  // Search
  var $searchWrap = $('#search-form-wrap'),
    isSearchAnim = false,
    searchAnimDuration = 200;

  var startSearchAnim = function(){
    isSearchAnim = true;
  };

  var stopSearchAnim = function(callback){
    setTimeout(function(){
      isSearchAnim = false;
      callback && callback();
    }, searchAnimDuration);
  };

  $('#nav-search-btn').on('click', function(){
    if (isSearchAnim) return;

    startSearchAnim();
    $searchWrap.addClass('on');
    stopSearchAnim(function(){
      $('.search-form-input').focus();
    });
  });

  $('.search-form-input').on('blur', function(){
    startSearchAnim();
    $searchWrap.removeClass('on');
    stopSearchAnim();
  });

  // Share
  $('body').on('click', function(){
    $('.article-share-box.on').removeClass('on');
  }).on('click', '.article-share-link', function(e){
    e.stopPropagation();

    var $this = $(this),
      url = $this.attr('data-url'),
      encodedUrl = encodeURIComponent(url),
      id = 'article-share-box-' + $this.attr('data-id'),
      offset = $this.offset();

    if ($('#' + id).length){
      var box = $('#' + id);

      if (box.hasClass('on')){
        box.removeClass('on');
        return;
      }
    } else {
      var html = [
        '<div id="' + id + '" class="article-share-box">',
          '<input class="article-share-input" value="' + url + '">',
          '<div class="article-share-links">',
            '<a href="https://twitter.com/intent/tweet?url=' + encodedUrl + '" class="article-share-twitter" target="_blank" title="Twitter"></a>',
            '<a href="https://www.facebook.com/sharer.php?u=' + encodedUrl + '" class="article-share-facebook" target="_blank" title="Facebook"></a>',
            '<a href="http://pinterest.com/pin/create/button/?url=' + encodedUrl + '" class="article-share-pinterest" target="_blank" title="Pinterest"></a>',
            '<a href="https://plus.google.com/share?url=' + encodedUrl + '" class="article-share-google" target="_blank" title="Google+"></a>',
          '</div>',
        '</div>'
      ].join('');

      var box = $(html);

      $('body').append(box);
    }

    $('.article-share-box.on').hide();

    box.css({
      top: offset.top + 25,
      left: offset.left
    }).addClass('on');
  }).on('click', '.article-share-box', function(e){
    e.stopPropagation();
  }).on('click', '.article-share-box-input', function(){
    $(this).select();
  }).on('click', '.article-share-box-link', function(e){
    e.preventDefault();
    e.stopPropagation();

    window.open(this.href, 'article-share-box-window-' + Date.now(), 'width=500,height=450');
  });

  // Caption
  $('.article-entry').each(function(i){
    $(this).find('img').each(function(){
      if ($(this).parent().hasClass('fancybox')) return;

      var alt = this.alt;

      if (alt) $(this).after('<span class="caption">' + alt + '</span>');

      $(this).wrap('<a href="' + this.src + '" title="' + alt + '" class="fancybox"></a>');
    });

    $(this).find('.fancybox').each(function(){
      $(this).attr('rel', 'article' + i);
    });
  });

  if ($.fancybox){
    $('.fancybox').fancybox();
  }

  // Mobile nav
  var $container = $('#container'),
    isMobileNavAnim = false,
    mobileNavAnimDuration = 200;

  var startMobileNavAnim = function(){
    isMobileNavAnim = true;
  };

  var stopMobileNavAnim = function(){
    setTimeout(function(){
      isMobileNavAnim = false;
    }, mobileNavAnimDuration);
  }

  $('#main-nav-toggle').on('click', function(){
    if (isMobileNavAnim) return;

    startMobileNavAnim();
    $container.toggleClass('mobile-nav-on');
    stopMobileNavAnim();
  });

  $('#wrap').on('click', function(){
    if (isMobileNavAnim || !$container.hasClass('mobile-nav-on')) return;

    $container.removeClass('mobile-nav-on');
  });

  /*
   滚动函数
   接收三个参数,
   1 接收一个DOM对象
   2 给目标对象切换class
   3 触发的高度 (可选项,如果不指定高度,会将DOM的高度作为触发高度)
   */
    function setScrollElementClass(scrollTarget, toggleClass, scrollHeight){
        document.addEventListener('scroll',function(){
            var currentTop = window.pageYOffset;
            currentTop > (scrollHeight||scrollTarget.clientHeight)
                ?scrollTarget.classList.add(toggleClass)
                :scrollTarget.classList.remove(toggleClass)
        })
    }

    // 滾動懸停
    (function(){
      var nav = document.querySelector('#navbar .nav')
      var user_info = document.querySelector('#user_info')
      // setScrollElementClass(nav, 'fixed-navbar')
      // setScrollElementClass(user_info, 'fixed-userinfo-container')
    }());

    // 主页导航模糊效果
    (function() {

        /*
        * post: #main-wrap
        *
        * */
        var navbar = document.querySelector('#navbar')
        var content = document.querySelector('.main-inner-content')
        var transtion = 0

        var copyContent = content.cloneNode(true)
        var blurCopyContent = document.createElement('div')
            blurCopyContent.classList.add('content-blur')
            blurCopyContent.appendChild(copyContent)
            navbar.appendChild(blurCopyContent)

        // 顶部间距
        var spaceNumber = 30;
        document.body.onscroll = function () {
            transtion = 'translate3d(0,' + (-(document.body.scrollTop - spaceNumber) + 'px') + ',0)'
            copyContent.style.transform = transtion
        }

    }());

    // 搜索功能
    (function () {
        var search = document.querySelector('#search');
        var close_search_btn = document.querySelector('#close_search');

        var html_body = document.querySelector('html');
        // content main wrap
        var mainWrap = document.querySelector('#main-wrap');

        // hidden nav menu
        var navbar = document.querySelector('#navbar');
        var nav_menu = document.querySelector('.nav-menu');
        var search_container = document.querySelector('#search_container');
        var nav_blur_content = document.querySelector('#navbar .content-blur');

        // start searching
        var doSearch = searchFunc,
            search_data_path = 'search.xml',
            search_input = document.querySelector('#search_input'),
            search_result = document.querySelector('#search_result');

        function toggleSearchView() {
            search_input.value = '';
            nav_menu.classList.toggle('is-invisible');
            navbar.classList.toggle('overflow-hidden');
            search_container.classList.toggle('is-hidden');
            mainWrap.classList.toggle('blur');
            mainWrap.classList.toggle('add-mask');
            html_body.classList.toggle('overflow-hidden');
            nav_blur_content.classList.toggle('is-hidden')
        }

        search.addEventListener('click', function () {
          toggleSearchView();
          search_input.focus();

          search_input.onkeyup = function () {
              doSearch(search_data_path, search_input.id, search_result.id);
          }
      });

        close_search_btn.addEventListener('click', toggleSearchView)
    }());


    // 导航菜单
    (function () {
        var dropDownBtn = document.querySelector('#navMenuDropdown');
        var navbar = document.querySelector('#navbar');

        dropDownBtn.onclick = function () {
            navbar.classList.toggle('overflow-hidden')
        }
    }())
})(jQuery);