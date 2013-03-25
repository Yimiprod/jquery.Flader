/**
* jQuery Flader
* Dependancies:
*   Jquery
*   Jquery.transit : http://ricostacruz.com/jquery.transit/ || https://github.com/rstacruz/jquery.transit
*       If Jquer.transit forgotten, plugin will use Jquery.animate()
*
* Author: Vidril César
*
*============================================*
*              DOCUMENTATION                 *
*============================================*
*
*****************OPTIONS**********************
***
* @btns_classe {String}
*   Custom class for nav buttons
*   Default: ''
***
* @wrap_classe {String}
*   Custom class for btn wrap
*   Default: ''
***
* @slide_type {String}
*   Slide type of the slider ( 'slider' or 'fade' )
*   Default: 'slide'
***
* @speed {Int} ms
*   Animation Speed in millisecond
*   Default: 500
***
* @easing {String}
*   Easing of the animation, can support all the easing supported by Jquery.transit
*   Default: ''
***
* @mouse_event {String}
*   Mouse event who performe the slide
*   support a custom event 'mousehold' who let the slide continue when mouseclick maintained
*   In mousehold, easing will be 'linear'
*   Default: 'click'
***
* @auto_slide {Boolean}
*   When set at true, the slider will perform an autoslide every each @auto_slide_delay
*   Default: false
***
* @auto_slide_delay {Int} ms
*   Delay between each auto slidein millisecond
*   Default: 5000
***
* @onSlide {Function}
*   callback launch when slide performed, can be used to animate inside the next slide
*   @params: items_sliding {Object} ['current': $(elm), 'follow': $(elm)]
*       The current slide item and the next item displayed, jquery objects
***
****************HOW TO USE IT*******************
***
*   var options = {};
*   $(element).Flader(options);
*
***
**************FONCTIONNEMENT******************
*
* A Slider who use (if possible) css3 transition (see dependencies) to perform a slide or a fade animation
* The content of the item slide can be animated too with the callback onSlide()
* Examples:
*  I =>
*   var options = {
*       onSlide: function(elms) {
*           var childInFollow = $('.child', elms.follow);
*           return childInFollow.transition({ opacity: 1, duration: 300, delay: 500 });
*   }
*  II =>
*   var options = {
*       onSlide: function(elms) {
*           var childInCurrent = $('.child', elms.current).css({ opacity: 1 }),
*               childInFollow = $('.child', elms.follow).css({ opacity: 0 })
*           return $.when(
*               (function(){
*                   return childInCurrent.transition({ opacity: 0, duration: 300 });
*               })(),
*               (function(){
*                   return childInFollow.transition({ opacity: 1, duration: 300 });
*               })()
*           )
*       }
*   }
*
*/
(function($) {
    if ( !$.support.transition || undefined === $.fn.transition ) $.fn.transition = $.fn.animate;
    $.Flader = function(element, options) {

        var defaults = {
            btns_classe: '',
            wrap_classe: '',
            slide_type: 'slide',
            speed: 500,
            easing: '',
            mouse_event: 'click',
            auto_slide: false,
            auto_slide_delay: 5000,
            onSlide: function(items_sliding) {}
        }

        var plugin = this;

        plugin.settings = {}

        var $element = $(element),
            element = element;

        var list_wrap, btn_wrap, btn_left, btn_right, container, items, current_item, follow_current, auto_slide_timeout;

        var is_sliding = false,
            valid_slide_type = ['slide','fade'],
            mouse_hold = false;

        plugin.init = function() {
            if ( !$.support.transition || undefined === $.fn.transition ) $.fn.transition = $.fn.animate;
            plugin.settings = $.extend({}, defaults, options);
            if ( !~$.inArray( plugin.settings.slide_type, valid_slide_type) ) plugin.settings.slide_type = 'slide';

            container   = $('[data-function="slider_content"]', $element).addClass('slider_content');
            items       = $('[data-function="slider_item"]', $element).addClass('slider_item');
            list_wrap   = $('<div/>', { 'class': 'list_wrap' });
            btn_wrap    = $('<div/>', { 'class': 'nav_wrap' }).addClass( plugin.settings.wrap_classe );
            btn_left    = $('<button/>', { 'class': 'slider_nav left' })
                            .addClass( plugin.settings.btns_classe )
                            .on(plugin.settings.mouse_event, function() {
                                slide('prev')
                            });
            btn_right   = $('<button/>', { 'class': 'slider_nav right' })
                            .addClass( plugin.settings.btns_classe )
                            .on(plugin.settings.mouse_event, function() {
                                slide('next');
                            });
            $element.append( list_wrap.append(container) ).addClass( plugin.settings.slide_type + ' slider_container' );
            if ( items.length > 1 ) $element.append( btn_wrap.append( btn_left, btn_right ) );

            current_item = items.filter('.active');
            if ( !current_item.length || current_item.length > 1 ) current_item = items.removeClass('active').first().addClass('active');

            var maxHeight = maxWidth = 0;
            $.each( items, function() {
                maxWidth = Math.max( maxWidth, $(this).outerWidth() );
                maxHeight = Math.max( maxHeight, $(this).outerHeight() );
            });
            if ( plugin.settings.slide_type == 'slide' ) {
                var current_index = items.filter('.active').index();
                items.width(maxWidth).each(function(i) {
                    $(this).css({ left: 100*(i - current_index) + '%' });
                });

                container.width( maxWidth );
                container.height( maxHeight );
            }
            $element.height( maxHeight );

            if ( plugin.settings.mouse_event === 'mousehold' ){
                plugin.settings.easing = 'linear';
                function unset_mouse_hold() {
                    mouse_hold = false;
                }
                btn_left.on({
                    'mousedown': function() {
                        mouse_hold = true;
                        $(this).trigger('mousehold');
                    },
                    'mouseout mouseup': unset_mouse_hold
                });
                btn_right.on({
                    'mousedown': function() {
                        mouse_hold = true;
                        $(this).trigger('mousehold');
                    },
                    'mouseout mouseup': unset_mouse_hold
                });
            }

            if ( plugin.settings.auto_slide ) auto_slide();
        }
        var auto_slide = function() {
            auto_slide_timeout = setTimeout( function() {
                slide();
            }, plugin.settings.auto_slide_delay);
        }
        var slide = function(dir) {
            if ( !is_sliding ) {
                if ( dir === undefined ) dir = 'next';
                if ( auto_slide_timeout !== undefined ) clearTimeout( auto_slide_timeout );
                current_item = items.filter('.active');
                follow_current =  current_item[dir]().length ? current_item[dir]() : items[ dir === 'next' ?'first':'last' ]();

                var items_sliding = {'current': current_item, 'follow': follow_current};
                is_sliding = true;
                $.when( (plugin.settings.slide_type === 'fade')? fading() : sliding(dir), plugin.settings.onSlide(items_sliding) )
                .done(function() {
                    current_item.removeClass('active');
                    is_sliding = false;
                    if ( mouse_hold ) slide(dir);
                    if ( plugin.settings.auto_slide && !mouse_hold ) auto_slide();
                });
            }
        }
        var fading = function() {
            return follow_current.addClass('active')
                                 .css({ opacity:0, 'z-index': 20 })
                                 .transition({ 'opacity': 1, 'duration': plugin.settings.speed, 'easing': plugin.settings.easing },function() {
                                    current_item.css({opacity: '0'});
                                    follow_current.css({'z-index': ''});
                                 });
        }
        var sliding = function(dir) {
            follow_current[ dir === 'next' ? 'insertAfter' : 'insertBefore' ](current_item).addClass('active');
            items = $('[data-function="slider_item"]', $element);

            var current_index = items.filter(current_item).index(),
                follow_index = items.filter(follow_current).index();

            return items.each(function(i) {
                $(this).css({ left: 104*(i - current_index) + '%' })
                       .transition({ left: 104*(i - follow_index) + '%', 'duration': plugin.settings.speed, 'easing': plugin.settings.easing });
            });
        }
        plugin.init();
    }

    $.fn.Flader = function(options) {
        return this.each(function() {
            if (undefined == $(this).data('Flader')) {
                var plugin = new $.Flader(this, options);
                $(this).data('Flader', plugin);
            }
        });
    }
})(jQuery);
