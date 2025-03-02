/**
  * Mobile
  * headerFixed
  * eventLoad
  * ajaxContactForm
  * alertBox
  * tabs
  * tabs2
  * goTop
  * flatAccordion
  * popupVideo
  * no_link
  * flatCounter
  * ButtonSlide
  * parallax
  * Preloader
*/

; (function ($) {
    "use strict";

     // Mobile Navigation
     var mobileNav = function () {
        var mobile = window.matchMedia("(max-width: 991px)");
        var wrapMenu = $("#site-header-inner");
        var navExtw = $(".nav-extend.active");
        var navExt = $(".nav-extend.active").children();
        var logo = $(".header__logo-mobile")
        responsivemenu(mobile);
    
        mobile.addListener(responsivemenu);
    
        function responsivemenu(mobile) {
          if (mobile.matches) {
            $("#main-nav")
              .append(logo)
              .attr("id", "main-nav-mobi")
              .appendTo("#header_main")
              .hide()
              .children(".menu")
              .append(navExt)
              .find("li:has(ul)")
              .children("ul")
              .removeAttr("style")
              .hide()
              .before('<span class="arrow"></span>');
          } else {
            $("#main-nav-mobi")
              .attr("id", "main-nav")
              .removeAttr("style")
              .prependTo(wrapMenu)
              .find(".ext")
              .appendTo(navExtw)
              .parent()
              .siblings("#main-nav")
              .find(".sub-menu")
              .removeAttr("style")
              .prev()
              .remove();
            $(".mobile-button").removeClass("active");
            $(".sub-menu").css({ display: "flex" }); 
          }
        }
        $(document).on("click", ".mobile-button", function () {
          $(this).toggleClass("active");
          $("#main-nav-mobi").slideToggle();
          $('body').toggleClass('main-nav-mobile');
        });
        $(document).on("click", "#main-nav-mobi .arrow", function () {
          $(this).toggleClass("active").next().slideToggle();
        });
    }; 

    var isMobile = {
        Android: function () {
          return navigator.userAgent.match(/Android/i);
        },
        BlackBerry: function () {
          return navigator.userAgent.match(/BlackBerry/i);
        },
        iOS: function () {
          return navigator.userAgent.match(/iPhone|iPad|iPod/i);
        },
        Opera: function () {
          return navigator.userAgent.match(/Opera Mini/i);
        },
        Windows: function () {
          return navigator.userAgent.match(/IEMobile/i);
        },
        any: function () {
          return (
            isMobile.Android() ||
            isMobile.BlackBerry() ||
            isMobile.iOS() ||
            isMobile.Opera() ||
            isMobile.Windows()
          );
        },
      };

    var themesflatTheme = {

        // Main init function
        init: function () {
            this.config();
            this.events();
        },

        // Define vars for caching
        config: function () {
            this.config = {
                $window: $(window),
                $document: $(document),
            };
        },

        // Events
        events: function () {
            var self = this;

            // Run on document ready
            self.config.$document.on('ready', function () {


                // Retina Logos
                self.retinaLogo();


            });

            // Run on Window Load
            self.config.$window.on('load', function () {

            });
        },


        // Retina Logos
        retinaLogo: function () {
            var retina = window.devicePixelRatio > 1 ? true : false;
            var $logo = $('#site-logo img');
            var $logo2 = $('#logo-footer img');
            var $logo_retina = $logo.data('retina');

            if (retina && $logo_retina) {
                $logo.attr({
                    src: $logo.data('retina'),
                    width: $logo.data('width'),
                    height: $logo.data('height')
                });
            }
            if (retina && $logo_retina) {
                $logo2.attr({
                    src: $logo.data('retina'),
                    width: $logo.data('width'),
                    height: $logo.data('height')
                });
            }
            },
    }; // end themesflatTheme

    // Start things up
    themesflatTheme.init();

    var ajaxContactForm = function () {
        $('#contactform,#commentform').each(function () {
            $(this).validate({
                submitHandler: function (form) {
                    var $form = $(form),
                        str = $form.serialize(),
                        loading = $('<div />', { 'class': 'loading' });

                    $.ajax({
                        type: "POST",
                        url: $form.attr('action'),
                        data: str,
                        beforeSend: function () {
                            $form.find('.form-submit,comment-form').append(loading);
                        },
                        success: function (msg) {
                            var result, cls;
                            if (msg === 'Success') {
                                result = 'Message Sent Successfully To Email Administrator. ( You can change the email management a very easy way to get the message of customers in the user manual )';
                                cls = 'msg-success';
                            } else {
                                result = 'Error sending email.';
                                cls = 'msg-error';
                            }

                            $form.prepend(
                                $('<div />', {
                                    'class': 'flat-alert ' + cls,
                                    'text': result
                                }).append(
                                    $('<a class="close" href="#"><i class="fa fa-close"></i></a>')
                                )
                            );

                            $form.find(':input').not('.submit').val('');
                        },
                        complete: function (xhr, status, error_thrown) {
                            $form.find('.loading').remove();
                        }
                    });
                }
            });
        }); // each contactform
    };


    // Header Fixed
    var headerFixed = function () {
        if ($('body').hasClass('header-fixed')) {
            var nav = $('#header_main');
            if (nav.length) {
                var offsetTop = nav.offset().top,
                injectSpace = $('<div />', {
                }).insertAfter(nav);
                $(window).on('load scroll', function () {
                    if ($(window).scrollTop() > 200) {
                        nav.addClass('is-fixed');
                        injectSpace.show();
                    } else {
                        nav.removeClass('is-fixed');
                        injectSpace.hide();
                    }

                    if ($(window).scrollTop() > 300) {
                        nav.addClass('is-small');
                    } else {
                        nav.removeClass('is-small');
                    }
                })
            }
        }
    }; 
 
    var ajaxSubscribe = {
        obj: {
            subscribeEmail: $('#subscribe-email'),
            subscribeButton: $('#subscribe-button'),
            subscribeMsg: $('#subscribe-msg'),
            subscribeContent: $("#subscribe-content"),
            dataMailchimp: $('#subscribe-form').attr('data-mailchimp'),
            success_message: '<div class="notification_ok">Thank you for joining our mailing list! Please check your email for a confirmation link.</div>',
            failure_message: '<div class="notification_error">Error! <strong>There was a problem processing your submission.</strong></div>',
            noticeError: '<div class="notification_error">{msg}</div>',
            noticeInfo: '<div class="notification_error">{msg}</div>',
            basicAction: 'mail/subscribe.php',
            mailChimpAction: 'mail/subscribe-mailchimp.php'
        },

        eventLoad: function () {
            var objUse = ajaxSubscribe.obj;

            $(objUse.subscribeButton).on('click', function () {
                if (window.ajaxCalling) return;
                var isMailchimp = objUse.dataMailchimp === 'true';

                if (isMailchimp) {
                    ajaxSubscribe.ajaxCall(objUse.mailChimpAction);
                } else {
                    ajaxSubscribe.ajaxCall(objUse.basicAction);
                }
            });
        },

        ajaxCall: function (action) {
            window.ajaxCalling = true;
            var objUse = ajaxSubscribe.obj;
            var messageDiv = objUse.subscribeMsg.html('').hide();
            $.ajax({
                url: action,
                type: 'POST',
                dataType: 'json',
                data: {
                    subscribeEmail: objUse.subscribeEmail.val()
                },
                success: function (responseData, textStatus, jqXHR) {
                    if (responseData.status) {
                        objUse.subscribeContent.fadeOut(500, function () {
                            messageDiv.html(objUse.success_message).fadeIn(500);
                        });
                    } else {
                        switch (responseData.msg) {
                            case "email-required":
                                messageDiv.html(objUse.noticeError.replace('{msg}', 'Error! <strong>Email is required.</strong>'));
                                break;
                            case "email-err":
                                messageDiv.html(objUse.noticeError.replace('{msg}', 'Error! <strong>Email invalid.</strong>'));
                                break;
                            case "duplicate":
                                messageDiv.html(objUse.noticeError.replace('{msg}', 'Error! <strong>Email is duplicate.</strong>'));
                                break;
                            case "filewrite":
                                messageDiv.html(objUse.noticeInfo.replace('{msg}', 'Error! <strong>Mail list file is open.</strong>'));
                                break;
                            case "undefined":
                                messageDiv.html(objUse.noticeInfo.replace('{msg}', 'Error! <strong>undefined error.</strong>'));
                                break;
                            case "api-error":
                                objUse.subscribeContent.fadeOut(500, function () {
                                    messageDiv.html(objUse.failure_message);
                                });
                        }
                        messageDiv.fadeIn(500);
                    }
                },
                error: function (jqXHR, textStatus, errorThrown) {
                    alert('Connection error');
                },
                complete: function (data) {
                    window.ajaxCalling = false;
                }
            });
        }
    };
    
    var alertBox = function () {
        $(document).on('click', '.close', function (e) {
            $(this).closest('.flat-alert').remove();
            e.preventDefault();
        })

    };

    // flatAccordion
    var flatAccordion = function() {
        var args = {duration: 300};
        $('.flat-toggle .toggle-title.active').siblings('.toggle-content').show();
      
        $('.flat-toggle.enable .toggle-title').on('click', function() {
            $(this).closest('.flat-toggle').find('.toggle-content').slideToggle(args);
            $(this).toggleClass('active');
        }); // toggle 
      
        $('.flat-accordion .toggle-title').on('click', function () {
            $('.flat-accordion .flat-toggle').removeClass('active');
            $(this).closest('.flat-toggle').toggleClass('active');

            if( !$(this).is('.active') ) {
                $(this).closest('.flat-accordion').find('.toggle-title.active').toggleClass('active').next().slideToggle(args);
                $(this).toggleClass('active');
                $(this).next().slideToggle(args);
            } else {
                $(this).toggleClass('active');
                $(this).next().slideToggle(args);
                $('.flat-accordion .flat-toggle').removeClass('active');
            }     
        }); // accordion
    }; 

    // tabs
    var tabs = function(){
        $('.flat-tabs').each(function(){
            $(this).find('.content-tab').children().first().show();
            $(this).find('.menu-tab').children('li').on('click',function(){
                var liActive = $(this).index();
                var contentActive=$(this).siblings().removeClass('active').parents('.flat-tabs').find('.content-tab').children().eq(liActive);
                contentActive.addClass('active').fadeIn("slow");
                contentActive.siblings().removeClass('active');
                $(this).addClass('active')
            });
        });
    };

    var tabs2 = function(){
        var tabmenu = document.querySelectorAll(".tab-menu");
        var tabContent =document.querySelectorAll(".tab-content"); 
        tabmenu.forEach(function(el) {
           el.addEventListener("click", openTabs);
        }); 
        
       function openTabs(el) {
           var btn = el.currentTarget;
           var tab = btn.dataset.tab; 
           tabContent.forEach(function(el) {
              el.classList.remove("active");
           });
           tabmenu.forEach(function(el) {
              el.classList.remove("active");
           }); 
           document.querySelector("#" + tab).classList.add("active");
           btn.classList.add("active");
        } 
    }; 
 
    // flatProgressBar
    var flatProgressBar = function() {
        if ($('.couter .chart').length > 0) {
            var $pieChart = $('.couter .chart');
            $pieChart.each(function () {
            var $elem = $(this),
                  pieChartSize = $elem.attr('data-size') || "84",
                  pieChartAnimate = $elem.attr('data-animate') || "2100",
                  pieChartWidth = $elem.attr('data-width') || "8",
                  pieChartColor = $elem.attr('data-color') || "#C8F27C",
                  pieChartTrackColor = $elem.attr('data-trackcolor') || "rgba(13, 73, 0, 1)";
            $elem.find('span, i').css({
                  'width': pieChartSize + 'px',
                  'height': pieChartSize + 'px',
                  'line-height': pieChartSize + 'px'
            });
            $elem.appear(function () {
                $elem.easyPieChart({
                      size: Number(pieChartSize),
                      animate: Number(pieChartAnimate),
                      trackColor: pieChartTrackColor,
                      lineWidth: Number(pieChartWidth),
                      barColor: pieChartColor,
                      scaleColor: false,
                      lineCap: 'round',
                      onStep: function (from, to, percent) {
                          $elem.find('span.percent').text(Math.round(percent));
                      },
                      rotate: 40,
                    });
                });
            });
        };
    };

    // goTop
    var goTop = function() {
        $(window).scroll(function() {
            if ($(this).scrollTop() > 800) {
                $('#scroll-top').addClass('show');
            } else {
                $('#scroll-top').removeClass('show');
            }
        });

        $('#scroll-top').on('click', function () {
            $("html, body").animate({ scrollTop: 0 }, 200, 'easeInOutExpo');
            return false;
        });
    };

    // popupVideo
    var popupVideo = function () {
        if ($().magnificPopup) {
          $(".popup-youtube").magnificPopup({
            type: "iframe",
            mainClass: "mfp-fade",
            removalDelay: 160,
            preloader: false,
            fixedContentPos: false,
          });
        }
      };  

    // flatCounter
    var flatCounter = function () {
        if ($(document.body).hasClass("counter-scroll")) {
          var a = 0;
          $(window).scroll(function () {
            var oTop = $(".counter").offset().top - window.innerHeight;
            if (a == 0 && $(window).scrollTop() > oTop) {
              if ($().countTo) {
                $(".counter")
                  .find(".count-number")
                  .each(function () {
                    var to = $(this).data("to"),
                      speed = $(this).data("speed"),
                      formatter = $(this).data('formatter');
                    $(this).countTo({
                      to: to,
                      speed: speed,
                      formatter: formatter,
                    });
                  });
              }
              a = 1;
            }
          });
        }
    }; 

    // parallax
    var parallax = function () {
        if ($().parallax && isMobile.any() == null) {
            $(".parallax").parallax("30%", 0.2);
        }
    };
     
    // Preloader
    var Preloader = function () {
        setTimeout(function () {
        $(".preload").fadeOut("slow", function () {
            $(this).remove();
        });
        }, 800);
    };


    // themescolor
    var themescolor = function () {
        $(".dark").on('click', function (e) {
            e.preventDefault();
            $(".body").addClass("is_dark")
            $(".body").removeClass("is_light")
            $(".light").removeClass("is_active")
            $(".dark").addClass("is_active")
    
            $(".tf-text").removeClass("style")
            $(".tf-text").addClass("s1") 
        });
        $(".light").on('click', function (e) {
            e.preventDefault();
            $(".body").removeClass("is_dark")
            $(".body").addClass("is_light")
            $(".light").addClass("is_active")
            $(".dark").removeClass("is_active")
    
            $(".tf-text").addClass("style")
            $(".tf-text").removeClass("s1") 
        });
    };

    let close_popup = document.querySelector('.close-popup');
    if(close_popup) {
        close_popup.addEventListener('click', function(){
            document.querySelector('body').classList.toggle('show-modal')
        })
    }

    let js_modal_menu = document.querySelector('.js-modal-menu');
    if(js_modal_menu) {
        js_modal_menu.addEventListener('click', function(){
            document.querySelector('body').classList.toggle('modal-menu')
            document.querySelector('.icon-menu').classList.toggle('active')
        })
        document.querySelector(".menu-inner").addEventListener('click', function(){
            this.parentElement.classList.toggle('active')
        }) 
    }
    const queryString = window.location.search;    
   
    if (queryString === "" || queryString === undefined ) { 
    } 
    else { 
        const urlParams = new URLSearchParams(queryString); 
        const tab = urlParams.get('is'); 
        if ( tab == "light") {
            console.log("light");
            $(".body").removeClass("is_dark")
            $(".body").addClass("is_light")
            
        } else if ( tab == "dark") {
            $(".body").addClass("is_dark")
            $(".body").removeClass("is_light")
        }
    } 

    // Dom Ready
    $(function () {
        mobileNav();
        headerFixed();
        ajaxSubscribe.eventLoad();
        ajaxContactForm();
        alertBox();
        tabs();
        tabs2();
        goTop();
        flatAccordion();
        popupVideo(); 
        flatCounter();
        flatProgressBar();
        $(window).on("load resize", function () {
            parallax();
        });
        Preloader();
        themescolor();  
    });

})(jQuery);


wow = new WOW({
    animateClass: 'animated',
    offset: 100
});
wow.init();