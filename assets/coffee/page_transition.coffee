$ ->
  $(".animsition").animsition({
    inClass: 'fade-in',
    outClass: 'fade-out',
    inDuration: 400,
    outDuration: 200,
    #linkElement: '.animsition-link',
    linkElement: 'a:not([target="_blank"]):not([href^="#"])',
    loading: true,
    loadingParentElement: 'body', # animsition wrapper element
    loadingClass: 'animsition-loading',
    loadingInner: '', # e.g '<img src="loading.svg" />'
    timeout: false,
    unSupportCss: [     ],
    timeoutCountdown: 5000,
    onLoadEvent: true,
    browser: [ 'animation-duration', '-webkit-animation-duration'],
    # "browser" option allows you to disable the "animsition" in case the css property in the array is not supported by your browser.
    # The default setting is to disable the "animsition" in a browser that does not support "animation-duration".
    overlay : false,
    overlayClass : 'animsition-overlay-slide',
    overlayParentElement : 'body',
    transition: (url) -> 
      window.location.href = url;

  });
