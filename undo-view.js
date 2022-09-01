/*
this component handles content for a given page, how content is transformed, renders that into itself to view the info and all related components, including loading and registering those respective components from this one; parent handles routing, loading, etc unrelated to rendering the view with those respective components;

docs parent will call the content method with response text for the given page
this view can process as desired, example follows
 */
class UndoView extends HTMLElement{
	constructor(){
		super();
this.list = [];
	}
	connectedCallback(){
		this.render();
	}
	render(html=this.localName){
		cancelAnimationFrame(this._render);
		this._render = requestAnimationFrame(()=>{
			this.innerHTML = html;
		});
	}
	content(response={}){

		const {text='', path, page, markdown} = response;
		let html, error, processed;
		try{
			processed = this.preprocess(text, path)
			html = markdown(processed);
			html = this.postprocess(html, path);
//console.log(text,{html, processed, text}, processed);

const res = {path, page, html, processed, text};
this.path = path;
this.page = page;
this.res = res;
console.log(this.list.push(res), res);
		}catch(err){
				error = err;
				console.error(err);
		};
		
		this.render(html);
	}

/*
special content is wrapped in a template tag, with the intended tag following both the opening and closing tags
this allows post-processing (anytime, here or in the document later) to replace the open and closing tags
remarkable.js I added 'template' to the html_blocks (in the following array mapped onto it)
this allows capturing and substituting again back to the desired content without the content inside it or its attributes being handled

` <template tag=undo-import target="undo-Content" src="uxp-documentation/src/pages/uxp/reference-js/index.md"></template tag=undo-import>;
<template tag=undo-Content query="product=photoshop"></template tag=undo-Content query="product=photoshop">`
 */
	preprocess(text, path){
		const { basepath } = path;
		const unimport = {};

		return text 
			.replace(/^\s*---\s*([\s\S]+?)---/m, `<template tag=undo-meta hidden>
$1
</template tag=undo-meta>`)
			// import statements are like server-side includes and just inject content in places from a source
			.replace(/\bimport\s+([a-z0-9_-]+)\s+from\s+['"]([^'"]+)['"]/ig, function _unimport(all, $1, $2, i, str){
				unimport[ $1 ] = $2;
				return '';
			})
			.replace(/<([A-Za-z0-9-]+)([^>]*?)\/>/g, function _importToSrc(all, $1, $2, str){
				const src = unimport[ $1 ];
				return `<template tag=undo-${ $1 }${ $2 }${ src ? ` src=${ src }`:'' }></template tag=undo-${ $1 }${ $2 }>`;
			})
			// fix image paths relative to this document
			.replace(/(!\[.*?\]\()[\.\/]*/g, `$1${ basepath }/`)
			;
	}

	postprocess(text, path){
		//return text;
		return text
			.replace(/template tag=/mg, '')
			;
	}

	$(selector){
		return Array.from(this.querySelectorAll(selector));
	}
	
	get undefined(){
		return this.$(':not(:defined)');
	}

	get undefinedTags(){
		return new Set(this.undefined.map(node=>node.localName));
	}
}

// optionally export localName and docs will create that tag instead of the script name
const localName = 'undo-view';
customElements.define(localName, UndoView);
// exported class if there's ever interest in extending/using anything from it
export {UndoView, localName}
