# GULP starting package
### Gulp with browsersync and twigs configuration.

## List of tasks:

Removing and rebuilding the output files - /web:
```
$ gulp build
```
Watching rebuild files with browser synchronization:
```
$ gulp serve
```
Verification of changes in the project and compiling them to the /web:
```
$ gulp watch
```
Runing local server:
```
$ gulp connect
```


Compiling SCSS in to the CSS:
```
$ gulp sass
```
Compiling javaScript files in to the /web:
```
$ gulp js
```
Minification javascripts:
```
$ gulp js:minify
``` 
Compiling TWIG in to the HTML:
```
$ gulp twig
``` 
Compression of images in the /app and transfer them to the /web:
```
$ gulp image
``` 
Processing images from /images/sprites to the one compressed image:
```
$ gulp sprite
``` 
Font transfer:
```
$ gulp fonts
``` 
Removeing /web:
```
$ gulp clean
``` 