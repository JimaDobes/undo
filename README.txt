
to run:
* serve this static content over over http
	* a convenient way to do this with Deno 🦕 (see https://deno.land/):
	PORT=8002 && deno run --allow-read=./ --allow-net https://sourdough.github.io/starter/tools/http.js -port=$PORT -www=./
	* symlink subfolders, or checkout to subfolders the intended docs
	* create/adjust tags in the html as shown below to point to the `gatsby-config.js` file and view to the desired view component

undo/
 |-index.html
 |-undo-docs.js ~ this coordinates loading content, routing, etc specific to gatsby in this context
 |-undo-view.js ~ this handles displaying the current page, transforming markdown, loading related components
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
	<undo-docs src="./docs1/gatsby-config.js" view="./undo-view.js"></undo-docs>
	<!--
	<undo-docs src="./docs2/gatsby-config.js" view="./undo-view.js"></undo-docs>
	<undo-docs src="./docs3/gatsby-config.js" view="./undo-view.js"></undo-docs>
	-->

note it's possible to:
* show one version of docs as though it's in production
* have several instances of the same docs with different views (to compare)
* have different version of the docs to compare
* combine different docs for composition in various ways

TODO
* resolve view system
* resolve routing
* develop basic default view to work from
* tests
* add more views if/as-indicated

