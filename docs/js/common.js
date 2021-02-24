var slider;
var sl = [0, 1, 2, 3, 4];
var highestBox = 0;

var h_height = 0;
var b_height = 0;
var w_height = 0;

function initFirstSlider() {
    $('.s_1 .swiper-wrapper').each(function () {
        highestBox = $('.s_1 .swiper-slide:first img').height();
        // console.log(highestBox);

        $('.swiper-container-sub .swiper-slide').each(function () {
            $(this).height(highestBox);
        })
    })
    slider = new Swiper('.swiper-container-h', {
        direction: 'horizontal',
        on: {
            slideChangeTransitionStart: function () {
                $('.swiper-container-sub').hide();
                $('.swiper-container-sub.s_'+(this.activeIndex+1)).show();
            },
            slideChangeTransitionEnd: function () {
                // console.log('activeMaster === ', this.activeIndex);
                // console.log('activeNested === ', sl[this.activeIndex].activeIndex);
                $('.slide_nav ul li a').removeClass('on');
                $('#s_'+(this.activeIndex+1)).addClass('on');
                buttonPos($('#s_'+(this.activeIndex+1)));
            }
        },
        allowTouchMove: true,
        slidesPerView: 1,
        breakpoints: {
            750: {
                allowTouchMove: false
            },
        }
    });

    $('.swiper-container-sub').each(function (index) {
        // console.log(index);
        sl[index] = new Swiper('.swiper-container-sub.s_'+(index+1), {
            pagination: {
                el: '.swiper-pagination.s_'+(index+1),
            },
            slidesPerView: 1,
            direction: 'horizontal',
            nested: true,
            allowTouchMove: true,
            breakpoints: {
                750: {
                    allowTouchMove: false,
                }
            }
        });
    })

}

function eventOpen() {
    h_height = $('.header').outerHeight();
    b_height = $('.footer').outerHeight();
    w_height = $(window).outerHeight();
    $('.layer_wrap').height(w_height);
    setTimeout(function() {
        $('.layer_popup.event .layer_body').scrollTop(0);
    }, 0);
    $('.layer_popup.event').show();
    $('.header_wrap').removeClass('on');
    $('.header .header_wrap.m .navigation').slideUp('fast');
}

function buttonPos(el) {
    var width = $(window).width();
    var left = el.position().left;
    // console.log('width === ', width);
    // console.log('left === ', left);
    if (width < 750) {
        if ((left+50) > width) {
            $('.slide_scroll').animate({
                scrollLeft: left
            });
        }
        if (left < 0) {
            $('.slide_scroll').animate({
                scrollLeft: 0
            });
        }
    }
}

$(function () {

    var elem = $('.first_img');
    var isApp = getParameterByName('isApp');
    console.log(isApp);

    if (!elem.prop('complete')) {
        // console.log("Waiting to be loaded!");
        elem.on('load', function() {
            // console.log("Loaded!");
            // console.log(this.complete);
            initFirstSlider();
        });
    } else {
        // console.log("Already loaded!");
        initFirstSlider();
    }

    if (isApp === 'true') {
        $('.banner').hide();
        $('#event_pop').hide();
    } else {
        var cookiedata = document.cookie;

        if (cookiedata.indexOf("ncookie=done") < 0){
            $('#event_pop').show();
        } else {
            $('#event_pop').hide();
        }
    }

    $('.v_d_wrap').each(function(){
        var highestBox = 0;
        $('.v_d_item', this).each(function(){
            if($(this).height() > highestBox) {
                highestBox = $(this).height();
            }
        });
        $('.v_d_item',this).height(highestBox);
    });

    $('.nav_menu').on('click', function () {
        var $wrap = $('.header_wrap');
        if ($wrap.hasClass('on')) {
            $wrap.removeClass('on');
            $wrap.removeClass('m');
            $('.header .header_wrap .navigation').slideUp('fast');
        } else {
            $wrap.addClass('on');
            $wrap.addClass('m');
            $('.header .header_wrap .navigation').slideDown('fast');
        }
    })

    $('.slide_nav a').on('click', function () {
        // console.log('activeMaster == ', slider.activeIndex);
        var rel = $(this).attr('rel');
        $('.slide_nav ul li a').removeClass('on');
        $(this).addClass('on');
        buttonPos($(this));
        setTimeout(function () {
            slider.slideTo(parseInt(rel)-1);
            sl[parseInt(rel)-1].slideTo(0);
        }, 175);
    })

    $('.v_f_title').on('click', function () {
        var $el =  $(this).siblings('div.v_f_content');
        if ($(this).hasClass('on')) {
            $(this).removeClass('on');
            $el.slideUp('fast');
        } else {
            $('.v_f_title').removeClass('on');
            $('.v_f_content').slideUp('fast');
            $(this).addClass('on');
            $el.slideDown('fast');
        }
    });

    $('.layer_close, .pop_close').on('click', function () {
        $('.layer_popup').hide();
        $('#ch-plugin').show();
    })

    $('.event_banner').on('click', function () {
        eventOpen();
    })
    $('.event_close').on('click', function () {
        $('.banner').hide();
    })

    $('.event_pop_img').on('click', function () {
        $('.layer_popup').hide();
        eventOpen();
    })

    $('.swiper-button-prev').on('click', function(event){
        event.preventDefault();
        var i = slider.activeIndex;
        // console.log('activeMaster ===', i)
        // console.log('activeSub ===', sl[i].activeIndex)
        if (sl[i].activeIndex === 0) {
            if (i > 0) {
                // console.log('activeMaster is last');
                sl[i-1].slideTo(sl[i-1].slides.length);
                slider.slidePrev();
            }
        } else {
            sl[i].slidePrev();
        }
        // sl[i].slidePrev();
    })

    $('.swiper-button-next').on('click', function(event){
        event.preventDefault();
        var i = slider.activeIndex;
        // console.log('activeMaster ===', i)
        // console.log('activeSub ===', sl[i].activeIndex)
        if (sl[i].isEnd) {
            // console.log('activeSub is last');
            if (!slider.isEnd) {
                sl[i+1].slideTo(0);
                slider.slideNext();
            }
        } else {
            sl[i].slideNext();
        }
        // sl[i].slideNext();
    })

    $('.layer_body').on('scroll', function(){
        var pos = $(this).scrollTop();
        if (pos > 150) {
            $('.download_link').fadeIn('fast');
        } else {
            $('.download_link').fadeOut('fast');
        }
    })

    $('.pop_today').on('click', function () {
        setCookie( "ncookie", "done" , 24 );
        $('#event_pop').hide();
    })

    $('.nav_d').on('click', function () {
        var w = window;
        if (!w.ChannelIO) {
            var ch = function() {
                ch.c(arguments);
            };
            ch.q = [];
            ch.c = function(args) {
                ch.q.push(args);
            };
            w.ChannelIO = ch;
            function l() {
                if (w.ChannelIOInitialized) {
                    return;
                }
                w.ChannelIOInitialized = true;
                var s = document.createElement('script');
                s.type = 'text/javascript';
                s.async = true;
                s.src = 'https://cdn.channel.io/plugin/ch-plugin-web.js';
                s.charset = 'UTF-8';
                var x = document.getElementsByTagName('script')[0];
                x.parentNode.insertBefore(s, x);
            }
            if (document.readyState === 'complete') {
                l();
            } else if (window.attachEvent) {
                window.attachEvent('onload', l);
            } else {
                window.addEventListener('DOMContentLoaded', l, false);
                window.addEventListener('load', l, false);
            }
            ChannelIO('boot', {
                "pluginKey": "ed1f1951-0c4a-48a5-9999-e4b1262d3be8",
                "hideChannelButtonOnBoot": true
            });
            console.log('loaded!!!');
        }
        ChannelIO('showMessenger', {
            "hideChannelButtonOnBoot": true
        });
    })

})

function setCookie( name, value, expirehours ) {
    var todayDate = new Date();
    todayDate.setHours( todayDate.getHours() + expirehours );
    document.cookie = name + "=" + escape( value ) + "; path=/; expires=" + todayDate.toGMTString() + ";"
}

function getParameterByName(name) {
    name = name.replace(/[\[]/, "\\[").replace(/[\]]/, "\\]");
    var regex = new RegExp("[\\?&]" + name + "=([^&#]*)"),
        results = regex.exec(location.search);
    return results === null ? "" : decodeURIComponent(results[1].replace(/\+/g, " "));
}
