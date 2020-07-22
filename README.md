Repo: https://github.com/graham73may/livereload-debugging

1. `ddev start`, do the wp install etc. 
1. `cd wp-content/themes/twentytwenty/assets/src`
1. `npm install`
1. Open PhpStorm
1. Right click `gulpfile.js`
1. Click `Show tasks`
1. In the Gulp tasks tool window, click `watch`, wait for it to finish starting up
1. `ddev launch`
1. Click the livereload chrome extension icon to connect the browser
1. Open a .scss file - `wp-content/themes/twentytwenty/assets/src/scss/components/header.scss`
1. Edit the background colour, it should update inside the browser without the need for a refresh