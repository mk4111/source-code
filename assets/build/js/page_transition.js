$(function() {
  return $(".animsition").animsition({
    inClass: 'fade-in',
    outClass: 'fade-out',
    inDuration: 500,
    outDuration: 200,
    linkElement: 'a:not([target="_blank"]):not([href^="#"])',
    loading: false,
    loadingParentElement: 'body',
    loadingClass: 'animsition-loading',
    loadingInner: '',
    timeout: false,
    unSupportCss: [],
    timeoutCountdown: 5000,
    onLoadEvent: true,
    browser: ['animation-duration', '-webkit-animation-duration'],
    overlay: false,
    overlayClass: 'animsition-overlay-slide',
    overlayParentElement: 'body',
    transition: function(url) {
      return window.location.href = url;
    }
  });
});
