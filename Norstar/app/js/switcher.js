window.console =
  window.console ||
  (function () {
    var e = {};
    e.log =
      e.warn =
      e.debug =
      e.info =
      e.error =
      e.time =
      e.dir =
      e.profile =
      e.clear =
      e.exception =
      e.trace =
      e.assert =
        function () {};
    return e;
  })();

  $(document).ready(function () {
    var e =
      '<div class="switcher-container">' + 
      '<h2>Setting<a href="#" class="sw-click"><img src="assets/images/icon/icon_setting.svg" class="setting setting_dark"></img><img src="assets/images/icon/icon_setting_white.svg" class="setting setting_light"></img></a></h2>' +
      '<div class="switcher__item">' +
      '<div class="switch__title-wrap">' +
        '<h3 class="switcher__title">Cursor</h3>' +
      '</div>' +
      '<div class="switcher__btn">' +
        '<select name="cursor-style" id="cursor_style">' +
          '<option value="1">default</option>' +
          '<option selected=""  value="2">animated</option>' +
        '</select>' +
      '</div>' +
    '</div>'+
      '<div class="selector-box">' +
      '<div class="clearfix"></div>' +
      '<div class="sw-odd"><h3>Mode: <span class="light_mode">Light Mode</span><span class="dark_mode">Dark Mode</span></h3>' +
      '<div class="ws-colors">' +
      '<a href="#" class="dark sw-click">Dark Mode</a> '+ 
      '<a href="#" class="light sw-click is_active">Light Mode</a> ' 
      "</div></div>" + 
      '<div class="clearfix"></div>' +
      "</div>" +
      "</div>";
    $("body").append(e);
    switchAnimate.loadEvent();
    switchColor.loadEvent();
    $( "#cursor_style" ).on( "change", function() {
      if(this.value == 1) {
        $(".cursor1").remove();
        $(".cursor2").remove();
      } else if(this.value == 2){
        var script = document.createElement('script');
        var script2 = document.createElement('script');
        script.src = 'app/js/gsap.min.js';
        script2.src = 'app/js/cursor-mouse.js'; 
        $("body").append('<div class="cursor1"></div>');
        $("body").append('<div class="cursor2"></div>');
        document.body.appendChild(script);
        document.body.appendChild(script2);
      }
  
    });
  });




var switchColor = {
  colorObj: {
    colorCookie: "colorCookie",
    switchClass: ".styleswitch",
    currentClass: "current",
    headLink: "head link[id=colors]",
    colorItem: ".ws-colors a.styleswitch",
    reset: "#reset",
    defaultColor: "color1",
  },
  loadEvent: function () {
    var e = switchColor.colorObj;
    if ($.cookie(e.colorCookie)) {
      switchColor.setColor($.cookie(e.colorCookie));
    } else {
      switchColor.setColor(e.defaultColor);
    }
    $(e.colorItem).on("click", function () {
      var e = $(this).attr("id");
      switchColor.setColor(e);
    });
    $(e.reset).on("click", function () {
      switchColor.setColor(e.defaultColor);
    });
  },
  setColor: function (e) {
    var t = switchColor.colorObj;
    $.cookie(t.colorCookie, e);
    $(t.headLink).attr("href", "stylesheets/colors/" + e + ".css");

    $(t.switchClass).removeClass(t.currentClass);
    $("#" + e).addClass(t.currentClass);

    //set color for text in content
    if ($(".infomation.text-center h3").length === 1) {
      var hiText = $(".infomation.text-center h3")
        .closest(".section")
        .css("background-color")
        .toString();
      if (hiText === "rgb(91, 91, 91)")
        $(".infomation.text-center h3").css("color", "#fff");
    }
  },
};

var switchAnimate = {
  loadEvent: function () {
    $(".switcher-container h2 a.sw-click").on("click", function (e) {
      var t = $(".switcher-container");

      if (t.css("right") === "-290px") {
        $(".switcher-container").animate({ right: "0" }, 300, "easeInOutExpo");
      } else {
        $(".switcher-container").animate(
          { right: "-290px" },
          300,
          "easeInOutExpo"
        );
      }

      e.preventDefault();
    });
  },
};


