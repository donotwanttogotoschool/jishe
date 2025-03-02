/**  
 * 
*/

; (function ($) {
    "use strict";
 

    var mobileDashboard = function() {
        var mobile_icon = document.querySelector('.menu-mobile-icon');
        mobile_icon.addEventListener('click', function(){
            this.parentElement.classList.toggle("active");  
        })
    } 

    var menu_dashboard = function(){
        $('.menu-dashboard').each(function(){ 
            $(this).find('.menu-tab').children('li').on('click',function(){
                var liActive = $(this).index();
                var contentActive=$(this).siblings().removeClass('active').parents('.menu-dashboard').find('.content-tab').children().eq(liActive);
                contentActive.addClass('active').fadeIn("slow");
                contentActive.siblings().removeClass('active');
                $(this).addClass('active').parents('.menu-dashboard').find('.content-tab').children().eq(liActive).siblings().hide();
            });
        });
    };

    var body_dashboard = function(value){
        var dashboardToTop = document.getElementById('dashboard');
        var body_dashboard = document.querySelector('.body-dashboard');
        var offsetTop = dashboardToTop.offsetTop + 70;
        var w = window,
        d = document,
        e = d.documentElement,
        g = d.getElementsByTagName('body')[0],
        y = w.innerHeight|| e.clientHeight|| g.clientHeight;
        value = 100;
        var result = (y*value)/100; 
        body_dashboard.style.height = (result - offsetTop) + "px";
        body_dashboard.style.overflowY = "auto"; 
    };
  
  
    // Dom Ready
    $(function () {
         
        menu_dashboard();
        mobileDashboard();
        let width = screen.width;
        if(width > 991) {
            body_dashboard();
        } else {
        }
    });

})(jQuery);