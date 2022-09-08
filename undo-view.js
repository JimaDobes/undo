/*
this component handles content for a given page, how content is transformed, renders that into itself to view the info and all related components, including loading and registering those respective components from this one; parent handles routing, loading, etc unrelated to rendering the view with those respective components;

docs parent will call the content method with response text for the given page
this view can process as desired, example follows
 */
class UndoView extends HTMLElement{
	constructor(){
		super();
		this._docs = null;
this.list = [];
		this.attachShadow({mode:'open'}).innerHTML = `
<style>
:host{
	display:block;
	margin:0;
	padding:0;
	width: 100vw;
	height: 100vh;
	overflow: auto;
}
svg[icon]{height:var(--icon-size, 1em);width:var(--icon-size, 1em);display:inline-block;}
header{
	display: flex;
	position: sticky;
	top: 0;
	border-bottom: thin solid var(--c-neutral, #aaa);
	background-color: var(--c-bg, #fff);
	color: var(--c-fg, #333);
}
header svg{
	--icon-size: var(--sz-logo, 20px);
}
footer svg{
	--icon-size: 12px;
}
main{
	display:flex;
}
section[sidenav]{
	display: flex;
	flex-direction: column;
	width: 20rem;
	background-color:rgba(255,255,255,0.5);
}
section[content]{

}
</style>
<header>
<a href="/"><div class="css-s5xdrg"><svg icon aria-hidden="true" role="img" viewBox="0 0 30 26" fill="#FA0F00" aria-label="Adobe" class="css-4277n7"><polygon points="19,0 30,0 30,26"></polygon><polygon points="11.1,0 0,0 0,26"></polygon><polygon points="15,9.6 22.1,26 17.5,26 15.4,20.8 10.2,20.8"></polygon></svg><strong class="spectrum-Heading spectrum-Heading--sizeXXS css-129j81v"><span class="css-ppngqo">Adobe&nbsp;</span>Developer</strong></div></a>
<a href="/apis/" role="tab" aria-selected="false"><span class="spectrum-Tabs-itemLabel">Products</span></a>
<nav sitenav></nav>
<input type=search>
<button>Console</button>
<button>Sign in</button>
</header>
<main>
<section sidenav>
...
</section>
<section content>
<slot>...</slot>
</section>
</main>
<footer>
<section>

<div><h3 class="spectrum-Heading spectrum-Heading--sizeXS">APIs and Services</h3><ul class="spectrum-Body spectrum-Body--sizeS"><li><a href="/creative-cloud" class="spectrum-Link spectrum-Link--quiet spectrum-Link--secondary">Adobe Creative Cloud</a></li><li><a href="/experience-platform-apis" class="spectrum-Link spectrum-Link--quiet spectrum-Link--secondary">Adobe Experience Platform</a></li><li><a href="/document-services/homepage" class="spectrum-Link spectrum-Link--quiet spectrum-Link--secondary">Adobe Document Cloud</a></li><li><a href="/apis" class="spectrum-Link spectrum-Link--quiet"><strong>View all</strong></a></li></ul></div>
<div class="css-qnhoxw"><ul class="spectrum-Body spectrum-Body--sizeS"><li><a href="/experience-cloud/cloud-manager" class="spectrum-Link spectrum-Link--quiet spectrum-Link--secondary">Adobe Cloud Manager</a></li><li><a href="/analytics-apis/docs/2.0" class="spectrum-Link spectrum-Link--quiet spectrum-Link--secondary">Adobe Analytics</a></li><li><a href="/app-builder" class="spectrum-Link spectrum-Link--quiet spectrum-Link--secondary">App Builder</a></li></ul></div>
</div>


<div class="css-1d3oxfz">
<h3 class="spectrum-Heading spectrum-Heading--sizeXS">Community</h3><ul class="spectrum-Body spectrum-Body--sizeS"><li><a target="_blank" rel="noopener noreferrer nofollow" href="https://medium.com/adobetech" class="spectrum-Link spectrum-Link--quiet spectrum-Link--secondary">Adobe Tech Blog</a></li><li><a target="_blank" rel="noopener noreferrer nofollow" href="https://github.com/adobe" class="spectrum-Link spectrum-Link--quiet spectrum-Link--secondary">Adobe on GitHub</a></li><li><a target="_blank" rel="noopener noreferrer nofollow" href="https://youtube.com/channel/UCDtYqOjS9Eq9gacLcbMwhhQ" class="spectrum-Link spectrum-Link--quiet spectrum-Link--secondary">Adobe Developer on YouTube</a></li><li><a target="_blank" rel="noopener noreferrer nofollow" href="https://twitter.com/adobedevs" class="spectrum-Link spectrum-Link--quiet spectrum-Link--secondary">Adobe Developer on Twitter</a></li><li><a target="_blank" rel="noopener noreferrer nofollow" href="https://adobe.com/communities/index.html" class="spectrum-Link spectrum-Link--quiet spectrum-Link--secondary">Community Forums</a></li></ul>
<div class="css-bfgfhu"><hr role="separator" aria-orientation="vertical" class="spectrum-Divider spectrum-Divider--sizeM spectrum-Divider--vertical" height="100%"></div>
</div>

<div class="css-1k624f9">
<h3 class="spectrum-Heading spectrum-Heading--sizeXS">Support</h3><ul class="spectrum-Body spectrum-Body--sizeS"><li><a href="/developer-support" class="spectrum-Link spectrum-Link--quiet spectrum-Link--secondary">Adobe Developer support</a></li><li><a target="_blank" rel="noopener noreferrer nofollow" href="https://helpx.adobe.com/contact/enterprise-support.html" class="spectrum-Link spectrum-Link--quiet spectrum-Link--secondary">Adobe Product support</a></li></ul>
</div>

<div class="css-3ldaur"><h3 class="spectrum-Heading spectrum-Heading--sizeXS">Adobe Developer</h3><ul class="spectrum-Body spectrum-Body--sizeS"><li><a href="/developer-console" class="spectrum-Link spectrum-Link--quiet spectrum-Link--secondary">Adobe Developer Console</a></li><li><a href="/open" class="spectrum-Link spectrum-Link--quiet spectrum-Link--secondary">Open source at Adobe</a></li><li><a href="/console/downloads" class="spectrum-Link spectrum-Link--quiet spectrum-Link--secondary">Download SDKs</a></li><li><a href="/developer-console/docs/guides/authentication" class="spectrum-Link spectrum-Link--quiet spectrum-Link--secondary">Authentication</a></li><li><a target="_blank" rel="noopener noreferrer nofollow" href="https://adobe.com/careers.html" class="spectrum-Link spectrum-Link--quiet spectrum-Link--secondary">Careers</a></li></ul></div>

</section>
<hr>
<div class="css-1ud0h0j">
<div><ul class="spectrum-Body spectrum-Body--sizeXS css-3indta"><li><a target="_blank" rel="noopener noreferrer nofollow" href="https://adobe.com/privacy.html" class="spectrum-Link spectrum-Link--quiet spectrum-Link--secondary">Privacy</a></li><li><a target="_blank" rel="noopener noreferrer nofollow" href="https://adobe.com/legal/terms.html" class="spectrum-Link spectrum-Link--quiet spectrum-Link--secondary">Terms of Use</a></li><li><a id="openPrivacy" href="#" class="spectrum-Link spectrum-Link--quiet spectrum-Link--secondary"></a></li><li><a target="_blank" rel="noopener noreferrer nofollow" href="https://adobe.com/privacy/ca-rights.html" class="spectrum-Link spectrum-Link--quiet spectrum-Link--secondary">Do not sell my personal information</a></li><li class="css-112tzfn"><svg icon viewBox="0 0 71.38 75.48" class="css-1ez8dht"><path d="M71.43,46.62c6.63-3.61,7.81-8.22.11-12.78L17.44,4.31c-6.57-3.71-12-.64-12,6.84V69.36c0,9.58,5,10.51,11.63,6.91l6.18-3.44c1-.67,3.38-2.69,2.72-5.42-.61-2.54-2.8-3.33-5.31-2.64-3.68,2-6,0-6-4.16V19.16c0-4.16,3-5.87,6.63-3.8L58.63,36.68c3.65,2.07,3.62,5.39-.06,7.39l-23.06,12V42a3.95,3.95,0,1,0-7.89,0V62c0,2.18,1.9,3.74,3.95,4.47a5.36,5.36,0,0,0,3.72-.23Z" transform="translate(-5.49 -2.73)"></path><path d="M35.9,31.33a4.14,4.14,0,1,1-4.14-4.14,4.14,4.14,0,0,1,4.14,4.14" transform="translate(-5.49 -2.73)"></path></svg><a target="_blank" rel="noopener noreferrer nofollow" href="https://adobe.com/privacy/opt-out.html#interest-based-ads" class="spectrum-Link spectrum-Link--quiet spectrum-Link--secondary">AdChoices</a></li></ul></div>
<div><span class="spectrum-Body spectrum-Body--sizeXS css-1a02qau">Copyright © 2022 Adobe. All rights reserved.</span></div>
</div>
</footer>
		`;
	}
	connectedCallback(){
		this.render();
	}

	get docs(){
		return this._docs;
	}
	set docs(docs=null){
		this._docs = docs;
		this.renderNav(docs);
	}

	renderPagesNav({header, title, path, pages=[]}, i){
		return `<nav path=${ path }><a href="${ this.pathPrefix }${ path }" ${ header ? 'header':'' }>${ title }</a><ul>${ pages.map(this.renderPagesNav, this).join(' ') }</ul></nav>`;
	}

	renderNav(docs){
		cancelAnimationFrame(this._renderNav);
		if(!docs){
			this._renderNav = requestAnimationFrame(()=>{
				this.shadowRoot.querySelector('header nav[sitenav]').innerHTML = '';
				this.shadowRoot.querySelector('section[sidenav]').innerHTML = '';
			});
			return;
		}
		let { siteMetadata, pathPrefix } = docs;
		pathPrefix = pathPrefix.replace(/\/$/,'');
		this.pathPrefix = pathPrefix;

		this._renderNav = requestAnimationFrame(()=>{
console.warn(`TODO fix routing/nav for / and Producs (first 2 items), render this in itself?`);
			this.shadowRoot.querySelector('header nav[sitenav]').innerHTML = siteMetadata.pages.map(({title, path}, i)=>{
				const link = `<a href="${ pathPrefix }${ path }">${ title }</a>`;
				if(i===0){
					return `${ link } <select>${ siteMetadata.versions.map(({title, path, selected})=>{
						return `<option value=${ path } ${ selected ? 'selected':'' }>${ title }</option>`;
					}).join(' ') }</select>`;
				}
				return link;
			}).join(' ');

			this.shadowRoot.querySelector('section[sidenav]').innerHTML = siteMetadata.subPages.map(this.renderPagesNav, this).join(' ');

		});
	}

	render(html=this.localName){
		cancelAnimationFrame(this._render);
		this._render = requestAnimationFrame(()=>{
			this.innerHTML = html;
			// reset view here?
			this.scrollTop = 0;
		});
	}

	content(response={}){

		const {text='', path, page, markdown, docs} = response;
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
this.docs = docs;
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
			.replace(/\bimport\s+([A-Za-z0-9_-]+)\s+from\s+['"]([^'"]+)['"];?/ig, function _unimport(all, $1, $2, i, str){
				unimport[ $1 ] = $2;
				return '';
			})
			.replace(/<([A-Za-z0-9-]+)([^>]*?)\/>/g, function _importToSrc(all, $1, $2, str){
				const src = unimport[ $1 ];
				return `<template tag=undo-${ $1 }${ $2 }${ src ? ` src="${ src }"`:'' }></template tag=undo-${ $1 }${ $2 }>`;
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
