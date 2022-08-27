
undo/
 |-index.html
 |-docs-view.js
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
	add to the html (static or dynamically) tags with attributes for the source and view:
	for example the above html would have all the docs in the view with a view component like:

	<html><body>
	<undo-docs src="./docs1/gatsby-config.js" view="./docs-view.js"></undo-docs>
	<undo-docs src="./docs2/gatsby-config.js" view="./docs-view.js"></undo-docs>
	<undo-docs src="./docs3/gatsby-config.js" view="./docs-view.js"></undo-docs>

note it's possible to:
* have several instances of the same docs with different views (to compare)
* have different version of the docs to compare
* combine different docs for composition in various ways

TODO
* resolve view system
* resolve routing
* develop basic default view to work from
* tests
* add more views if/as-indicated

