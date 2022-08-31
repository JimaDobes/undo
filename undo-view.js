/*
this component handles content for a given page, how content is transformed, renders that into itself to view the info and all related components, including loading and registering those respective components from this one; parent handles routing, loading, etc unrelated to rendering the view with those respective components;

docs parent will call the content method with response text for the given page
this view can process as desired, example follows
 */
class UndoView extends HTMLElement{
	constructor(){
		super();
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
console.log(text,{html, processed, text}, processed);
console.warn(html);
		}catch(err){
				error = err;
				console.error(err);
		};
		console.log(`view-process>`,{text, html, processed, error});
		
		this.render(html);
	}

/*
special content is wrapped in a template tag, with the intended tag following both the opening and closing tags
this allows post-processing (anytime, here or in the document later) to replace the open and closing tags
remarkable.js I added 'template' to the html_blocks (in the following array mapped onto it)
this allows capturing and substituting again back to the desired content without the content inside it or its attributes being handled
 */
	preprocess(text, path){
		const { basepath } = path;
console.log(path, text);
		// (all,p1,i,str)
		return text 
			.replace(/^\s*---\s*([\s\S]+?)---/m, `<template tag=undo-meta hidden>
$1
</template tag=undo-meta>`)
			// import statements are like server-side includes and just inject content in places from a source
			.replace(/\bimport\s+([a-z0-9_-]+)\s+from\s+['"]([^'"]+)['"]/ig, '<template tag=undo-import target="undo-$1" src="$2"></template tag=undo-import>')
			.replace(/<([A-Za-z0-9-]+)([^>]*?)\/>/g, '<template tag=undo-$1$2></template tag=undo-$1$2>')
			// fix image paths relative to this document
			.replace(/(!\[.*\]\()\./g, `$1${ basepath }`)
			;
	}

	postprocess(text, path){
		//return text;
		return text
			.replace(/template tag=/mg, '')
			;
	}
	
	get undefined(){
		return this.querySelectorAll(':not(:defined)');
	}

	get undefinedTags(){
		return new Set(Array.from(this.undefined).map(node=>node.localName));
	}
}

// optionally export localName and docs will create that tag instead of the script name
const localName = 'undo-view';
customElements.define(localName, UndoView);
// exported class if there's ever interest in extending/using anything from it
export {UndoView, localName}
