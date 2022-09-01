// legacy support, hacking
let exports = null;
const cache = {};
globalThis.basepath = '';
const queue = new Set([]);
globalThis.process = {env:{}};
globalThis.require = function require(path){
	const url = new URL(`${ basepath }/${ path }`, location);
	const { pathname } = url;
	cache[pathname] = null;
	const req = import(url)
	.then(res=>{
		const payload = exports;
		cache[pathname] = payload;
		// reset for next
		exports = null;
		queue.delete(req);
		return Promise.all(queue);
	})
	.catch(res=>{
		console.warn({basepath, path, url, pathname, res});
		console.error(res);
		queue.delete(req);
	})
	;
	queue.add(req);
	function required(){
		return cache[pathname];
	};
	required.request = req;
	required[Symbol.iterator] = iterator;
	return required;
}
function unrequire(hash){
	const type = typeof hash;
	if(type !== 'object') return;
	Object.entries(hash)
	.forEach(([key,item], i, all)=>{
		const type = typeof item;
		if('function' === type){
			const value = item();
			if(item.spread){
				// spread what came in from here
				hash.splice(i, 1, ...value);
			}else{
				hash[key] = value;
			}
		}else{
			unrequire(item);
		}
	})
	;
	return hash;
}
function iterator(){
		let index = 0;
		// update later in place
		this.spread = true;
		const value = this;
	return {
		next() {
			if(index > 0) return { done: true };
			index++;
			return { value, done: false }
		}
	}
}
globalThis.module = new Proxy({exports}, {
	set(target, key, val, pxy){
		exports = val;
		return true;
	}
});

import { Lit, markdown } from './deps.js';
const { LitElement, html, css, svg } = Lit;
const md = new markdown.Remarkable({html:true});
// NOTE in remarkable.js export { Remarkable, utils, html_blocks };
// <template> used for generally exempting content from markdown escaping+mangling
markdown.html_blocks.template = true;
console.log(md.render(`# markdown *here*?`), {Lit,markdown});

class UndoDocs extends HTMLElement{
	static cache = cache;
	static queue = queue;
	static __md = md;
	static markdown = md.render.bind(md);
	static pending = [];
	static busy = false;
	constructor(){
		super();
		this._docs = null;
		this.basepath = '';
		this._viewSelector = '';

		this.attachShadow({mode:'open'}).innerHTML = `
			<style>
			:host(:hover){background-color:var(--golden, #ddd);position:relative;}
			:slotted{font-weight:normal;}
			slot[name="source"]{color:var(--blue, #555);}
			slot[name="source"]::slotted(*){position:absolute;bottom:0;right:1em;}
			</style>
			<textarea hidden></textarea>
			<slot>view</slot>
		`;
		this._loaded = this._loaded.bind(this);
		this._popstate = this._popstate.bind(this);

		this.addEventListener('page', this._page);
		this.addEventListener('click', this._clickIntercept);
	}

	_page({type, detail, target}){
		console.warn(type, {detail, target});
		this.location(detail, '');
		this.setAttribute('loading-page', '');
		this.fetchm(detail)
		.then(response=>{
			this.querySelector(this._viewSelector).content( response );
		})
		.finally(()=>{
			this.removeAttribute('loading-page');
		})
		;
	}

	get pathPrefix(){
		return this.docs?.pathPrefix ?? '';
	}

	get src(){
		return this.getAttribute('src') ?? '';
	}

	set src(url=''){
		this.setAttribute('src', url);
	}
	get view(){
		return this.getAttribute('view') ?? '';
	}

	set view(url=''){
		url ? this.setAttribute('view', url) : this.removeAttribute('view');
	}

	get markdown(){
		return UndoDocs.markdown;
	}


	resolve(path){
		return new URL(`${ this.basepath }${ path }`, location);
	}

	get page(){
		return this.getAttribute('page') ?? '';
	}
	set page(page=''){
		if(page && !page.startsWith('/')){
			page = '/' + page;
		}
		this.setAttribute('page', page);
	}

	get docs(){
		return this._docs ?? null;
	}

	set docs(docs=null){
		this._docs = docs;
		cancelAnimationFrame(this._update_docs);
		this._update_docs = requestAnimationFrame(()=>{
			const view = this.querySelector(this._viewSelector || 'un-known');
			this.page = this.docs?.siteMetadata?.pages[0].path ?? '';
			this.setAttribute('path-prefix', this.pathPrefix.replace(/\/$/,''));
			this.shadowRoot.querySelector('textarea').value = JSON.stringify(docs, false, '\t');
		});
	}

	_loaded({type, detail}){
		const { src, docs, url, path} = detail;
		if(src !== this.src) return;
		this.url = url;
		this.path = path;
		this.basepath = path.basepath;
		// NOTE docs setter requires the above already be available TODO improve this
		this.docs = docs;
		console.warn(type, {src, docs, url, path});
	}

	_popstate(event){
		const {state, type } = event;
		const { page = this.page, basepath = this.basePath, pathPrefix = this.pathPrefix } = state ?? {};
		if(basepath !== this.basepath){
			console.log(`basepath mismatch, history traversal for different element`, {basepath, 'this.basepath':this.basepath, pathPrefix, state});
			return;
		}
		console.warn(`TODO when !page`,type, state, {event});
		this.page = state.page ?? '';
	}

	connectedCallback(){
		if(!this.title) this.title = this.ownerDocument.title;
		self.addEventListener('undo-loaded-docs', this._loaded);
		self.addEventListener('popstate', this._popstate);
	}

	disconnectedCallback(){
		self.removeEventListener('undo-loaded-docs', this._loaded);
		self.removeEventListener('popstate', this._popstate);
	}

	// assumed: path/to/tag-name.js or module exports localName as tag-name
	// otherwise export localName and that can be used instead
	_viewing(src=this.view, oldview=''){
		if(!src) return Promise.resolve(this._view);
		const path = UndoDocs.path(src);
		const tag = path.file.replace(`.${path.ext}`, '')
		this.setAttribute('loading-view', '');
		return import(src)
		.then(res=>{
			const { localName = tag } = res;
			this._viewSelector = localName;
			const view = this.ownerDocument.createElement(localName);
			this.querySelectorAll(oldview || localName).forEach(node=>node.remove());
			view.docs = this.docs;
			this.appendChild( view );
		})
		.catch(res=>{
			console.warn(res);
			return null;
		})
		.finally(()=>{
			this.removeAttribute('loading-view');
		});
		;
	}

	_clickIntercept(event){
		const { defaultPrevented, button, metaKey, ctrlKey, shiftKey, target } = event;
		if (defaultPrevented || button !== 0 ||
			metaKey || ctrlKey || shiftKey) return;

		const anchor = target.closest('a');
		if(!anchor || anchor.target || anchor.hasAttribute('download') || anchor.getAttribute('rel') === 'external' || anchor.origin !== location.origin) return;

		let { protocol, href, pathname } = anchor;

		if (!href || !protocol.startsWith('http')){
			return;
		}

		event.preventDefault();
		pathname = pathname.replace(/(?:^\/src\/pages|index.md$)/g, '');
		if(pathname !== location.pathname){// && pathname !== location.hash.substring(1)){
			console.log(`TODO page, history.pushState(history.state || {}, ${ document.title }, ${ href })`);

			this.page = pathname.replace(this.pathPrefix, '');
		}
	}

	location(path='', title){
		if(!title){
			title = `${path} ${this.title}`;
		}
		const { basepath, pathPrefix } = this;
		const { state } = history;
		const url = new URL(`${ pathPrefix }${ path }`, location);
		const pathname = url.pathname.replace(/\/{2,}/g, '/');
		const page = !path.startsWith('/') ?  pathname.replace(pathPrefix,'/') : path;
		history[ state?.page === path ? 'replaceState':'pushState']({page, basepath, pathPrefix }, title, `${ pathname }`);
	}

	static get observedAttributes() { return ['src', 'view', 'page']; }

	attributeChangedCallback(name, old, value=''){
		switch(name){
		case 'src':
			if(value) this.load();
		break;
		case 'view':
			this._viewing(value, old);
		break;
		case 'page':
			if(value){
				this.dispatchEvent(new CustomEvent('page',{detail: value, composed:true, bubbles:true}));
			}
		}
	}

	load(){
		this.setAttribute('loading','');
		return UndoDocs.load(this.src)
		.finally(()=>{
			this.removeAttribute('loading');
		})
		;
	}

	fetchm(page='/'){
		let pathname = `${this.basepath}/src/pages${ page }`;
		let alternate;
		if(pathname.endsWith('/')){
			alternate = pathname.replace(/\/$/, '.md');
			pathname += 'index.md';
		console.warn(`TODO when trailing slash, ... try BOTH index.md and replace '/' with .md`);
		}
		const path = UndoDocs.path(pathname);
		return fetch(pathname)
		.then(res=>{
			if(!res.ok){
				if(alternate){
					return fetch(alternate).then(res=>res.text());
				}else{
					console.warn(res.status, res.url, res);
				}
			}
			return res.text();
		})
		.then(text=>{
			return {text,path,page,markdown:this.markdown}
		})
	}

	static path(pathname=''){
		if(pathname.pathname){
			// for URL, Location instances
			pathname = pathname.pathname;
		}
		const trailingSlash = pathname.endsWith('/');
		const pre = pathname.split('/');
		const file = pre.pop();
		const fparts = file.split('.');
		const ext = fparts.length > 1 ? fparts.pop() : '';
		const filename = fparts.join('.')
		const [empty, ...dirs] = pre;
		const basepath = pre.join('/');
		return {pathname, basepath, pre, dirs, file, ext, filename};
	}

	static load(src=`./gatsby-config.js`){
		let config = src;
		if(this.busy){
			let resume;
			const later = ()=>{ return this.load(src); };
			const promise = new Promise(function(resolve, reject){
				resume = function(){
					return resolve(later());
				}
			});
			this.pending.push(resume);
			return promise;
		}
		this.busy = true;
		const url = new URL(config, location);
		const path = this.path(url);
		// generally gatsby-config is assumed to be in the root of each
		// set the basepath for respective things loading
		// remote the file part
		config = path.file;
		globalThis.basepath = path.basepath;
		const req = require(config);
		return req.request
			.finally(()=>{
				this.busy = false;
				const { cache } = this;
				const result = unrequire( cache[ url.pathname ] );
				const detail = {docs: result, src, url, path};
				self.dispatchEvent(new CustomEvent('undo-loaded-docs', {detail, bubbles: true, composed: true}));
				const next = this.pending.shift();
				if(next){
					next()
				}
			});
	}
}

customElements.define('undo-docs', UndoDocs);
