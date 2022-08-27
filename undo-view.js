/*
this component handles content for a given page, how content is transformed, renders that into itself to view the info and all related components, including loading and registering those respective components

docs parent will 
- pass this element page info from external routing and loading
- handle requests from page changes, relative the original document source
- pass text (TODO TBD objects/functions also needed?) for transforming content and updating itself with it html

 */
class UndoView extends HTMLElement{
	constructor(){
		super();
		this.response = {text:'', path: ''};
		this._docs = null
	}
	connectedCallback(){
		this.render();
	}
	static get observedAttributes() { return ['page']; }
	attributeChangedCallback(name, old, value=''){
		if(value && 'page' === name){
			this.dispatchEvent(new CustomEvent('page',{detail: value, composed:true, bubbles:true}));
		}
	}
	get docs(){
		return this._docs;
	}
	set docs(docs=null){
		this._docs = docs;
		this.page = this.docs?.siteMetadata?.pages[0].path ?? '';
	}
	get page(){
		return this.getAttribute('page') ?? '';
	}
	set page(page=''){
		this.setAttribute('page', page);
	}
	get request(){
		return this.response;
	}
	set request(response){
		this.response = response;
		this.process(response);
	}
	process(response=this.response){

		const {text, path, page, markdown} = response;
		let html, error, processed;
		try{
			processed = markdown( this.absurdPatterns(text, path) );
			html = markdown(processed);
console.log(text,{html, processed, text}, processed);
console.warn(html);
		}catch(err){
				error = err;
				console.error(err);
		};
		console.log({text, html, processed, error});
		
		this.render(html);
	}
	render(html=this.localName){
		cancelAnimationFrame(this._render);
		this._render = requestAnimationFrame(()=>{
			this.innerHTML = html;
		});
	}
/*
special content is wrapped in a template tag, with the intended tag following both the opening and closing tags
this allows post-processing (anytime, here or in the document later) to replace the open and closing tags
remarkable.js I added 'template' to the html_blocks (in the following array mapped onto it)
this allows capturing and substituting again back to the desired content without the content inside it or its attributes being handled
 */
	absurdPatterns(text, path){
		const { basepath } = path;
console.log(path, text);
		return text
			.replace(/^\s*---\s*([\s\S]+?)---/m, function(all,p1,i,str){
				return `<template tag=undo-meta>
${ p1 }
</template tag=undo-meta>`;
			})
			// import statements are like server-side includes and just inject content in places from a source
			.replace(/\bimport\s+([a-z0-9_-]+)\s+from\s+['"]([^'"]+)['"]/ig, '<template tag=undo-import target="undo-$1" src="$2"></template tag=undo-import>')
			.replace(/<([A-Za-z0-9-]+)([^>]*?)\/>/g, '<template tag=undo-$1$2></template tag=undo-$1$2>')
			// fix image paths relative to this document
			.replace(/(\]\()\./g, `$1${ basepath }`)
// p1.trim().split(/\b(?=[a-z]+:[\s\S]+)/).map(str=>{ return str.replace(/^([a-z]+):/, ''); })
// tired Array.from(p1.trim().matchAll(/\b([a-z]+):([\s\S]+)/g))
// /^\s*---\s*([\s\S]+?)---/m, function(all,p1,i,str){ console.log({all, p1, i, str}); return p1; })
//		<meta name="keywords" content="Creative Cloud, API Documentation, UXP, Plugins, JavaScript, ExtendScript, SDK, C++, Scripting" data-react-helmet="true">
	//		.replace(//)
	//		.replace()
			;
	}


}

customElements.define('undo-view', UndoView);
