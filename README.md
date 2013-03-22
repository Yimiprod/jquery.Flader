#jQuery.Flader
### A smooth slider / fader

jQuery Flader is a plugin who can use as dependencies [jQuery Transit](http://ricostacruz.com/jquery.transit) to perform css3 transition.
Slide can fade or slide, it can perform auto sliding / fading and have a custom mousehold event

Usage
-----

``` html
<!doctype html>
<html>
    <head>
		<link rel=stylesheet href='flader.css'><!-- basic css -->
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
