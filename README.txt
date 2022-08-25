
undo/
 |-index.html
 |-theme.js
 |
 |-docs1/
 |  |-gatsby-config.js
 |  |...
 |
 |-docs2/...
 |-docs3/...

* dependencies: web browser + http serving and viewing the above static assets
* symlink or git clone doc repos where 'gatsby-config.js' is in the target directory
	as shown above by docs1 (and docs2, docs3)
* show the desired docs in the UI 
	add to the html (static or dynamically) tags with attirbutes for the source and theme:
	for example the above html would have all the docs in the view with a theme like:

	<html><body>
	<undo-docs src="./docs1/gatsby-config.js" theme="./theme.js"></undo-docs>
	<undo-docs src="./docs2/gatsby-config.js" theme="./theme.js"></undo-docs>
	<undo-docs src="./docs3/gatsby-config.js" theme="./theme.js"></undo-docs>

note it's possible to:
* have several instances of the same docs with different themes (to compare)
* have different version of the docs to compare
* combine different docs for composition in various ways

TODO
* resolve theme system
* develop basic default theme to work from
* tests
* add more themes if/as-indicated

