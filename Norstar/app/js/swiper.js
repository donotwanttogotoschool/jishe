
var swiper =  new Swiper(".sl-testimonial", {
    slidesPerView: 1,
    loop: true,  
    spaceBetween: 30,
    autoplay: {
        delay: 100, 
    },  
    speed: 3000,  
    direction: 'horizontal',
    navigation: {
        nextEl: ".btn-next-testimonials",
        prevEl: ".btn-prev-testimonials",
    },
    pagination: {
        el: ".swiper-pagination",
        clickable: true,
    }
});  

var swiper =  new Swiper(".sl-inner-page", {
    slidesPerView: 1,
    loop: true,  
    spaceBetween: 30,
    breakpoints: {
        0: {
            slidesPerView: 1,
        },
        400: {
            slidesPerView: 1,
        },
        600: {
            slidesPerView: 2,
        },
        750: {
            slidesPerView: 2,
        },
        991: {
            slidesPerView: 3,
            spaceBetween: 30,
        },
        1280: {
            slidesPerView: 3,
            spaceBetween: 60,
        },
    },
    autoplay: {
        delay: 100, 
    },  
    speed: 3000,  
});  

var swiper =  new Swiper(".banner_26", {
    direction: "vertical",
    mousewheel: {
      releaseOnEdges: true,
    },
    mousewheelControl: true,
    loop: false, 
    grabCursor: true,
    slidesPerView: 1,
    speed: 1500, 
    spaceBetween: 0, 
    navigation: {
        nextEl: ".btn-next-testimonials",
        prevEl: ".btn-prev-testimonials",
    },
    pagination: {
        el: ".swiper-pagination",
        clickable: true,
    },
}); 

var swiper =  new Swiper(".sl-testimonial-5", {
    slidesPerView: 1,
    loop: false,  
    spaceBetween: 32,
    navigation: {
        nextEl: ".btn-next-testimonials",
        prevEl: ".btn-prev-testimonials",
    },
    speed: 3000,
    autoplay: {
      delay: 1,
      disableOnInteraction: true,
    },
    breakpoints: {
        0: {
            slidesPerView: 1,
            spaceBetween: 32,
        },
        750: {
            slidesPerView: 1,
            spaceBetween: 32,
        },
        991: {
            slidesPerView: 2,
            spaceBetween: 32,
        },
        1280: {
            slidesPerView: 2,
            spaceBetween: 64,
        },
    },
    pagination: {
        el: ".swiper-pagination",
        clickable: true,
    },
}); 

var swiper =  new Swiper(".sl-brand", {
    loop: true,
    freemode: true,
    slidesPerView: 1,
    centeredSlides: true,
    allowTouchMove: false,
    speed: 3000,
    autoplay: {
      delay: 1,
      disableOnInteraction: true,
    },
    
    spaceBetween: 12,
    breakpoints: {
        0: {
            slidesPerView: 1,
            spaceBetween: 12,
        },
        400: {
            slidesPerView: 2,
            spaceBetween: 12,
        },
        600: {
            slidesPerView: 3,
            spaceBetween: 12,
        },
        750: {
            slidesPerView: 3,
            spaceBetween: 12,
        },
        991: {
            slidesPerView: 4,
            spaceBetween: 12,
        },
        1280: {
            slidesPerView: 6,
            spaceBetween: 12,
        },
    }
}); 
$(".sl-brand").hover(function() {
    (this).swiper.autoplay.stop();
}, function() {
    (this).swiper.autoplay.start();
});

var swiper =  new Swiper(".sl-brand-2", {
    loop: true,
    freemode: true,
    centeredSlides: true,
    allowTouchMove: false,
    speed: 3000,
    autoplay: {
      delay: 1,
      disableOnInteraction: true,
    },


    slidesPerView: 1,
    spaceBetween: 60,
    breakpoints: {
        0: {
            slidesPerView: 1,
            spaceBetween: 60,
        },
        400: {
            slidesPerView: 2,
            spaceBetween: 60,
        },
        600: {
            slidesPerView: 3,
            spaceBetween: 60,
        },
        750: {
            slidesPerView: 3,
            spaceBetween: 60,
        },
        991: {
            slidesPerView: 4,
            spaceBetween: 60,
        },
        1280: {
            slidesPerView: 5,
            spaceBetween: 60,
        },
    }
}); 
$(".sl-brand-2").hover(function() {
    (this).swiper.autoplay.stop();
}, function() {
    (this).swiper.autoplay.start();
});

var swiper =  new Swiper(".sl-brand-3", {
    loop: true,
    freemode: true,
    centeredSlides: true,
    allowTouchMove: false,
    speed: 3000,
    autoplay: {
      delay: 1,
      disableOnInteraction: true,
    },

    slidesPerView: 1,
    spaceBetween: 10,
    breakpoints: {
        0: {
            slidesPerView: 1,
            spaceBetween: 10,
        },
        400: {
            slidesPerView: 2,
            spaceBetween: 10,
        },
        600: {
            slidesPerView: 3,
            spaceBetween: 10,
        },
        750: {
            slidesPerView: 3,
            spaceBetween: 10,
        },
        991: {
            slidesPerView: 4,
            spaceBetween: 10,
        },
        1280: {
            slidesPerView: 4,
            spaceBetween: 10,
        },
    }
}); 
$(".sl-brand-3").hover(function() {
    (this).swiper.autoplay.stop();
}, function() {
    (this).swiper.autoplay.start();
});

var swiper =  new Swiper(".sl-brand-4", {
    loop: true,
    freemode: true,
    centeredSlides: true,
    allowTouchMove: false,
    speed: 3000,
    autoplay: {
      delay: 1,
      disableOnInteraction: true,
    },

    slidesPerView: 1, 
    spaceBetween: 5,
    breakpoints: {
        0: {
            slidesPerView: 1,
            spaceBetween: 5,
        },
        400: {
            slidesPerView: 2,
            spaceBetween: 5,
        },
        600: {
            slidesPerView: 3,
            spaceBetween: 5,
        },
        750: {
            slidesPerView: 3,
            spaceBetween: 5,
        },
        991: {
            slidesPerView: 4,
            spaceBetween: 5,
        },
        1280: {
            slidesPerView: 6,
            spaceBetween: 5,
        },
    }
}); 
$(".sl-brand-4").hover(function() {
    (this).swiper.autoplay.stop();
}, function() {
    (this).swiper.autoplay.start();
});

var swiper =  new Swiper(".sl-brand-5", {
    loop: true,
    freemode: true,
    centeredSlides: true,
    allowTouchMove: false,
    speed: 3000,
    autoplay: {
      delay: 1,
      disableOnInteraction: true,
    },

    slidesPerView: 1,
    spaceBetween: 5,
    grabCursor: false, 
    speed: 3000,
    breakpoints: {
        0: {
            slidesPerView: 1,
            spaceBetween: 32,
        },
        400: {
            slidesPerView: 2,
            spaceBetween: 32,
        },
        600: {
            slidesPerView: 3,
            spaceBetween: 32,
        },
        750: {
            slidesPerView: 4,
            spaceBetween: 32,
        },
        991: {
            slidesPerView: 5,
            spaceBetween: 32,
        },
        1280: {
            slidesPerView: 7,
            spaceBetween: 32,
        },
    }
}); 
$(".sl-brand-5").hover(function() {
    (this).swiper.autoplay.stop();
}, function() {
    (this).swiper.autoplay.start();
});

var swiper =  new Swiper(".sl-brand-6", {
    loop: true,
    freemode: true,
    centeredSlides: true,
    allowTouchMove: false,
    speed: 3000,
    autoplay: {
      delay: 1,
      disableOnInteraction: true,
    },

    slidesPerView: 1,
    breakpoints: {
        0: {
            slidesPerView: 1,
            spaceBetween: 32,
        },
        400: {
            slidesPerView: 2,
            spaceBetween: 32,
        },
        600: {
            slidesPerView: 3,
            spaceBetween: 32,
        },
        750: {
            slidesPerView: 4,
            spaceBetween: 32,
        },
        991: {
            slidesPerView: 5,
            spaceBetween: 32,
        },
        1280: {
            slidesPerView: 8,
            spaceBetween: 32,
        },
    }
}); 
$(".sl-brand-6").hover(function() {
    (this).swiper.autoplay.stop();
}, function() {
    (this).swiper.autoplay.start();
});

var swiper =  new Swiper(".sl-brand-7", {
    loop: true,
    freemode: true,
    centeredSlides: true,
    allowTouchMove: false,
    speed: 3000,
    autoplay: {
      delay: 1,
      disableOnInteraction: true,
    },

    slidesPerView: 1,
    spaceBetween: 10,
    breakpoints: {
        0: {
            slidesPerView: 1,
            spaceBetween: 10,
        },
        400: {
            slidesPerView: 1,
            spaceBetween: 10,
        },
        600: {
            slidesPerView: 2,
            spaceBetween: 10,
        },
        750: {
            slidesPerView: 2,
            spaceBetween: 10,
        },
        991: {
            slidesPerView: 3,
            spaceBetween: 10,
        },
        1280: {
            slidesPerView: 3,
            spaceBetween: 10,
        },
    }
}); 
$(".sl-brand-7").hover(function() {
    (this).swiper.autoplay.stop();
}, function() {
    (this).swiper.autoplay.start();
});


var swiper =  new Swiper(".sl-brand-8", {
    loop: true,
    freemode: true,
    centeredSlides: true,
    allowTouchMove: false,
    speed: 3000,
    autoplay: {
      delay: 1,
      disableOnInteraction: true,
    },

    slidesPerView: 1,
    spaceBetween: 2,
    breakpoints: {
        0: {
            slidesPerView: 1,
            spaceBetween: 2,
        },
        400: {
            slidesPerView: 2,
            spaceBetween: 2,
        },
        600: {
            slidesPerView: 3,
            spaceBetween: 2,
        },
        750: {
            slidesPerView: 3,
            spaceBetween: 2,
        },
        991: {
            slidesPerView: 4,
            spaceBetween: 2,
        },
        1280: {
            slidesPerView: 6,
            spaceBetween: 2,
        },
    }
}); 
$(".sl-brand-8").hover(function() {
    (this).swiper.autoplay.stop();
}, function() {
    (this).swiper.autoplay.start();
});

var swiper =  new Swiper(".sl-brand-9", {
    loop: true,
    freemode: true,
    centeredSlides: true,
    allowTouchMove: false,
    speed: 3000,
    autoplay: {
      delay: 1,
      disableOnInteraction: true,
    },
    slidesPerView: 1,
    spaceBetween: 2,
    breakpoints: {
        0: {
            slidesPerView: 1,
            spaceBetween: 2,
        },
        400: {
            slidesPerView: 2,
            spaceBetween: 2,
        },
        600: {
            slidesPerView: 3,
            spaceBetween: 2,
        },
        750: {
            slidesPerView: 3,
            spaceBetween: 2,
        },
        991: {
            slidesPerView: 4,
            spaceBetween: 2,
        },
        1280: {
            slidesPerView: 4,
            spaceBetween: 2,
        },
    }
}); 
$(".sl-brand-9").hover(function() {
    (this).swiper.autoplay.stop();
}, function() {
    (this).swiper.autoplay.start();
});

var swiper =  new Swiper(".sl-brand-10", {
    loop: true,
    freemode: true,
    centeredSlides: true,
    allowTouchMove: false,
    speed: 3000,
    autoplay: {
      delay: 1,
      disableOnInteraction: true,
    },

    slidesPerView: 1,
    spaceBetween: 0,
    breakpoints: {
        0: {
            slidesPerView: 1,
            spaceBetween: 0,
        },
        400: {
            slidesPerView: 2,
            spaceBetween: 0,
        },
        600: {
            slidesPerView: 3,
            spaceBetween: 0,
        },
        750: {
            slidesPerView: 4,
            spaceBetween: 0,
        },
        991: {
            slidesPerView: 5,
            spaceBetween: 0,
        },
        1280: {
            slidesPerView: 5,
            spaceBetween: 0,
        },
    }
}); 
$(".sl-brand-10").hover(function() {
    (this).swiper.autoplay.stop();
}, function() {
    (this).swiper.autoplay.start();
}); 
var swiper =  new Swiper(".sl-brand-12", {
    loop: true, 
    spaceBetween: 0,
    speed: 3000,
    autoplay: {
        delay: 0,
        disableOnInteraction: true,
    },
    slidesPerView: 1,
    breakpoints: {
        0: {
            slidesPerView: 1,
            spaceBetween: 40,
        },
        600: {
            slidesPerView: 1,
            spaceBetween: 40,
        },
        750: {
            slidesPerView: 2,
            spaceBetween: 40,
        },
        991: {
            slidesPerView: 3,
            spaceBetween: 40,
        },
        1440: {
            slidesPerView: 3,
            spaceBetween: 80,
        },
        1600: {
            slidesPerView: 4,
            spaceBetween: 80,
        },
    }
}); 

$(".sl-brand-12").hover(function() { 
    (this).swiper.autoplay.stop(); 
}, function() {
    (this).swiper.autoplay.start();
});
 

var swiper =  new Swiper(".sl-brand-13", {
    loop: true, 
    spaceBetween: 0,
    speed: 3000,
    autoplay: {
        delay: 1,
        disableOnInteraction: true,
    },
    slidesPerView: 1,
    breakpoints: {
        0: {
            slidesPerView: 1,
            spaceBetween: 40,
        },
        600: {
            slidesPerView: 1,
            spaceBetween: 40,
        },
        750: {
            slidesPerView: 2,
            spaceBetween: 40,
        },
        991: {
            slidesPerView: 3,
            spaceBetween: 40,
        },
        1440: {
            slidesPerView: 3,
            spaceBetween: 50,
        },
        1600: {
            slidesPerView: 4,
            spaceBetween: 50,
        },
    }
}); 

$(".sl-brand-13").hover(function() {
    (this).swiper.autoplay.stop(); 
}, function() {
    (this).swiper.autoplay.start(); 
});

var swiper =  new Swiper(".sl-project", {
    slidesPerView: 1,
    loop: true, 
    spaceBetween: 12,
    autoplay: {
        delay: 1,
    }, 
    speed: 3000,
    breakpoints: {
        0: {
            slidesPerView: 1,
            spaceBetween: 12,
        },
        360: {
            slidesPerView: 2,
            spaceBetween: 12,
        },
        600: {
            slidesPerView: 2,
            spaceBetween: 12,
        },
        750: {
            slidesPerView: 2,
            spaceBetween: 12,
        },
        1000: {
            slidesPerView: 2,
            spaceBetween: 12,
        },
        1200: {
            slidesPerView: 3,
            spaceBetween: 24,
        },
    }
}); 

var swiper =  new Swiper(".sl-project-2", {
    slidesPerView: 1,
    direction: 'horizontal',
    speed: 1000,  
    mousewheel: {
        releaseOnEdges: true,
      },
    mousewheelControl: true,
    loop: true, 
    spaceBetween: 0,
    autoplay: true,
    breakpoints: {
        0: {
            slidesPerView: 1,
            spaceBetween: 0,
        },
        360: {
            slidesPerView: 1,
            spaceBetween: 0,
        },
        600: {
            slidesPerView: 2,
            spaceBetween: 0,
        },
        750: {
            slidesPerView: 2,
            spaceBetween: 0,
        }, 
        991: {
            slidesPerView: 1,
            spaceBetween: 0,
        }, 
        1200: {
            slidesPerView: 2,
            spaceBetween: 0,
        }, 
    }
}); 
 
var swiper =  new Swiper(".sl-testimonial-2", {
    slidesPerView: 1,
    loop: true,  
    autoplay: {
        delay: 1,
    }, 
    speed: 3000,
    spaceBetween: 30,
    breakpoints: {
        0: {
            slidesPerView: 1,
            spaceBetween: 30,
        },
        767: {
            slidesPerView: 2,
            spaceBetween: 30,
        }, 
        1280: {
            slidesPerView: 2,
            spaceBetween: 30,
        }
    },
    pagination: {
        el: ".swiper-pagination",
        clickable: true,
    },
}); 

var swiper =  new Swiper(".sl-testimonial-22", {
    slidesPerView: 1,
    loop: true,  
    // autoplay: {
    //     delay: 1, 
    // }, 
    speed: 3000,
    spaceBetween: 0,
    breakpoints: {
        0: {
            slidesPerView: 1,
            spaceBetween: 30,
        },
        767: {
            slidesPerView: 1,
            spaceBetween: 30,
        }, 
        1600: {
            slidesPerView: 2,
            spaceBetween: 30,
        }
    },
    pagination: {
        el: ".swiper-pagination",
        clickable: true,
    },
}); 

var swiper =  new Swiper(".sl-testimonial-3", {
    slidesPerView: 1,
    loop: true,  
    autoplay: {
        delay: 1, 
    }, 
    speed: 3000,
    spaceBetween: 30,
    breakpoints: {
        0: {
            slidesPerView: 1,
            spaceBetween: 30,
        },
        500: {
            slidesPerView: 1,
            spaceBetween: 30,
        },
        767: {
            slidesPerView: 2,
            spaceBetween: 30,
        },
        991: {
            slidesPerView: 3,
            spaceBetween: 30,
        }, 
        1280: {
            slidesPerView: 3,
            spaceBetween: 30,
        }
    },
    pagination: {
        el: ".swiper-pagination",
        clickable: true,
    },
}); 
$(".sl-testimonial-3").hover(function() {
    (this).swiper.autoplay.stop(); 
}, function() {
    (this).swiper.autoplay.start(); 
});

var swiper =  new Swiper(".sl-testimonial-4", {
    slidesPerView: 1,
    loop: true,  
    spaceBetween: 30,
    autoplay: {
        delay: 1, 
    }, 
    speed: 3000,
    breakpoints: {
        0: {
            slidesPerView: 1,
            spaceBetween: 30,
        },
        767: {
            slidesPerView: 2,
            spaceBetween: 30,
        }, 
        1280: {
            slidesPerView: 2,
            spaceBetween: 30,
        }
    },
    pagination: {
        el: ".swiper-pagination",
        clickable: true,
    },
}); 
$(".sl-testimonial-4").hover(function() {
    (this).swiper.autoplay.stop();
}, 
function() {
    (this).swiper.autoplay.start();
});

var swiper =  new Swiper(".sl-testimonial-6", {
    slidesPerView: 1,
    loop: true,  
    // autoplay: {
    //     delay: 1, 
    // }, 
    speed: 3000,
    spaceBetween: 32,
    navigation: {
        nextEl: ".next-testimonials",
        prevEl: ".prev-testimonials",
    },
    breakpoints: {
        0: {
            slidesPerView: 1,
            spaceBetween: 32,
        },
        500: {
            slidesPerView: 1,
            spaceBetween: 32,
        },
        767: {
            slidesPerView: 2,
            spaceBetween: 32,
        },
        991: {
            slidesPerView: 3,
            spaceBetween: 32,
        }, 
        1280: {
            slidesPerView: 3,
            spaceBetween: 32,
        }
    },
    pagination: {
        el: ".swiper-pagination",
        clickable: true,
    },
}); 
// $(".sl-testimonial-6").hover(function() {
//     (this).swiper.autoplay.stop(); 
// }, function() {
//     (this).swiper.autoplay.start(); 
// });

var swiper = new Swiper(".mySwiper1", {
    direction: "vertical",
    spaceBetween: 24,
    grabCursor: true,
    loop: true,
    slidesPerView: 2,
    autoplay: {
        delay: 1, 
    }, 
    speed: 4000,
    });
    $(".mySwiper1").hover(function() {
        (this).swiper.autoplay.stop();
    }, 
    function() {
        (this).swiper.autoplay.start();
});

var swiper = new Swiper(".mySwiper2", {
    direction: "vertical",
    spaceBetween: 24,
    grabCursor: true,
    loop: true,
    slidesPerView: 2, 
    autoplay: {
        delay: 1,
        reverseDirection: true,
    }, 
    speed: 4000,
    });
    $(".mySwiper2").hover(function() {
        (this).swiper.autoplay.stop();
    }, function() {
        (this).swiper.autoplay.start();
});



var swiper = new Swiper(".mySwiper3", {
    direction: "vertical",
    spaceBetween: 24,
    grabCursor: true,
    loop: true,
    slidesPerView: 2, 
    autoplay: {
        delay: 1,
    }, 
    speed: 4000,
    });
    $(".mySwiper3").hover(function() {
        (this).swiper.autoplay.stop();
    }, function() {
        (this).swiper.autoplay.start();
});

var swiper = new Swiper(".mySwiper8", {
    direction: "vertical",
    spaceBetween: 16,
    loop: true,
    slidesPerView: 2,
    autoplay: false,
    speed: 1500,
    allowSlide: false
    }); 

var swiper = new Swiper(".mySwiper9", {
    direction: "vertical",
    spaceBetween: 16,
    loop: true,
    slidesPerView: 2,
    autoplay: false,
    speed: 1500,
    }); 



var swiper = new Swiper(".mySwiper10", {
    direction: "vertical",
    spaceBetween: 16,
    loop: true,
    slidesPerView: 2,
    autoplay: false,
    speed: 1500,
    }); 

var swiper = new Swiper(".mySwiper6", {
    spaceBetween: 75,
    grabCursor: true,
    loop: true,
    breakpoints: {
        0: {
            slidesPerView: 1
        },
        500: {
            slidesPerView: 2
        },
        600: {
            slidesPerView: 2,
            spaceBetween: 32
        },
        900: {
            slidesPerView: 3
        },
        1200: {
            slidesPerView: 3
        },
    },
    observer: true,
    observeParents: true,
    shortSwipes: false,
    longSwipes: false,
    allowTouchMove: true,
    reverseDirection: true, 
    freeMode: true, 
    autoplay: {
        delay: 1,
    }, 
    speed: 3000,
    disableOnInteraction: true
});
$(".mySwiper6").hover(function() {
    (this).swiper.autoplay.stop();
}, function() {
    (this).swiper.autoplay.start();
});

var swiper = new Swiper(".mySwiper7", {
    spaceBetween: 30,
    grabCursor: true,
    loop: true,
    direction: 'horizontal',
    speed: 1500,  
    mousewheel: {
        releaseOnEdges: true,
    },
    mousewheelControl: true,
    breakpoints: {
        0: {
            slidesPerView: 1
        },
        500: {
            slidesPerView: 2
        },
        600: {
            slidesPerView: 2,
        },
        900: {
            slidesPerView: 3
        },
        1200: {
            slidesPerView: 4
        },
    },
    autoplay: {
        delay: 0.3, 
    },  
    observer: true,
    observeParents: true,
    shortSwipes: false,
    longSwipes: false,
    allowTouchMove: true,
    reverseDirection: true,  
    disableOnInteraction: true
});
$(".mySwiper7").hover(function() {
    (this).swiper.autoplay.stop();
}, function() {
    (this).swiper.autoplay.start();
});


var swiper = new Swiper(".mySwiper4", {
    spaceBetween: 24,
    grabCursor: true,
    loop: true,
    breakpoints: {
        0: {
            slidesPerView: 1
        },
        400: {
            slidesPerView: 2
        },
        600: {
            slidesPerView: 3
        },
        991: {
            slidesPerView: 4
        },
        1200: {
            slidesPerView: 4
        },
    },
    observer: true,
    observeParents: true,
    shortSwipes: false,
    longSwipes: false,
    allowTouchMove: true,
    reverseDirection: true,
    autoplay: {
    delay: 0.3, 
    },  
    freeMode: true, 
    speed: 3000,
    disableOnInteraction: true
    });
    $(".mySwiper4").hover(function() {
        (this).swiper.autoplay.stop();
    }, 
    function() {
        (this).swiper.autoplay.start();
    });

var swiper = new Swiper(".mySwiper5", {
    spaceBetween: 24,
    grabCursor: true,
    loop: true,
    breakpoints: {
        0: {
            slidesPerView: 1
        },
        400: {
            slidesPerView: 2
        },
        600: {
            slidesPerView: 3
        },
        991: {
            slidesPerView: 4
        },
        1200: {
            slidesPerView: 5
        },
    },
    observer: true,
    observeParents: true,
    shortSwipes: false,
    longSwipes: false,
    allowTouchMove: true,
    autoplay: {
    delay: 0.3, 
    reverseDirection: true,
    }, 
    freeMode: true, 
    speed: 2200,
    disableOnInteraction: true
    });

    $(".mySwiper5").hover(function() {
        (this).swiper.autoplay.stop();
    }, function() {
        (this).swiper.autoplay.start();
    });

    var roll_slider = new Swiper(".roll__slider", {
        loop: true,
        freemode: true,
        slidesPerView: 1,
        spaceBetween: 0,
        centeredSlides: true,
        allowTouchMove: false,
        speed: 3000,
        autoplay: {
          delay: 1,
          disableOnInteraction: true,
        },
        breakpoints: {
          640: {
            slidesPerView: 3,
          },
          800: {
            slidesPerView: 3,
          },
          1024: {
            slidesPerView: 4,
          },
          1300: {
            slidesPerView: 5,
          },
          1900: {
            slidesPerView: 8,
          },
        },
      });

      var swiper = new Swiper(".mySwiper11", {
        spaceBetween: 40,
        grabCursor: true,
        loop: true,
        breakpoints: {
            0: {
                slidesPerView: 1
            },
            400: {
                slidesPerView: 1
            },
            767: {
                slidesPerView: 2
            },
            991: {
                slidesPerView: 2
            },
            1200: {
                slidesPerView: 3
            },
        },
        observer: true,
        observeParents: true,
        shortSwipes: false,
        longSwipes: false,
        allowTouchMove: true,
        reverseDirection: true,
        autoplay: {
        delay: 0.3, 
        },  
        freeMode: true, 
        speed: 3000,
        disableOnInteraction: true
        });
        $(".mySwiper11").hover(function() {
            (this).swiper.autoplay.stop();
        }, 
        function() {
            (this).swiper.autoplay.start();
        });
    
    var swiper = new Swiper(".mySwiper12", {
        spaceBetween: 40,
        grabCursor: true,
        loop: true,
        breakpoints: {
            0: {
                slidesPerView: 1
            },
            400: {
                slidesPerView: 1
            },
            767: {
                slidesPerView: 2
            },
            991: {
                slidesPerView: 2
            },
            1200: {
                slidesPerView: 2
            },
        },
        observer: true,
        observeParents: true,
        shortSwipes: false,
        longSwipes: false,
        allowTouchMove: true,
        autoplay: {
        delay: 0.3, 
        reverseDirection: true,
        },  
        freeMode: true, 
        speed: 2200,
        disableOnInteraction: true
        });
    
        $(".mySwiper12").hover(function() {
            (this).swiper.autoplay.stop();
        }, function() {
            (this).swiper.autoplay.start();
        });