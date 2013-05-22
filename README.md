jQuery.Flader
=============
### A smooth slider / fader

jQuery Flader is a plugin who can use as dependencies [jQuery Transit](http://ricostacruz.com/jquery.transit) to perform css3 transition.
Slide can fade or slide, it can perform auto sliding / fading and have a custom mousehold event

Dependencies
------------

[jQuery](http://jquery.com/) (last version as possible)
[jQuery Transit](http://ricostacruz.com/jquery.transit) (optional but smoother animation!)

Usage
-----

``` html
<!doctype html>
<html>
    <head>
		<link rel=stylesheet href='flader.css'><!-- base css -->
		<script src='jquery.js'></script>
		<script src='jquery.transit.js'></script><!-- if you want css3 animation -->
		<script src='jquery.flader.js'></script>
	</head>
	<body>
		<div id="fader">
			<ul data-function="slider_content">
				<li data-function="slider_item"><p>content</p></li>
				<li data-function="slider_item"><p>content</p></li>
			</ul>
		</div>
		<div id="slider">
			<ul data-function="slider_content">
				<li data-function="slider_item"><p>content</p></li>
				<li data-function="slider_item"><p>content</p></li>
				<li data-function="slider_item"><p>content</p></li>
			</ul>
		</div>
		<script>
		$(function(){
			$('#fader').Flader({
				slide_type: 'fade'
			});
			$('#slider').flader();
		});
		</script>
	</body>
</html>
```

Options
-------

##### btns_classe {String}
> Custom class for nav buttons
> Default: ''

##### wrap_classe {String}
> Custom class for btn wrap
> Default: ''

##### slide_type {String}
> Slide type of the slider ( 'slider' or 'fade' )
> Default: 'slide'

##### speed {Integer} ms
> Animation Speed in millisecond
> Default: 500

##### easing {String}
> Easing of the animation, can support all the easing supported by Jquery.transit
> Default: ''

##### mouse_event {String}
> Mouse event who performe the slide
> support a custom event 'mousehold' who let the slide continue when mouseclick maintained
> In mousehold, easing will be 'linear'
> Default: 'click'

##### cycling_slide {Boolean}
> Define if sliding infinitely
> Only in slide mod
> Autoslide disabled when set to false due to the ugly effect if return to first/last slide item.
> Default: 5000

##### auto_slide {Boolean}
> When set at true, the slider will perform an autoslide every each @auto_slide_delay
> Default: false

##### auto_slide_delay {Integer} ms
> Delay between each auto slidein millisecond
> Default: 5000

##### onSlide {Function} (items_sliding)
> callback launch when slide performed, can be used to animate inside the next slide

###### items_sliding {Object} \['current': $(elm), 'follow': $(elm)\]
>     The current slide item and the next item displayed, jquery objects
