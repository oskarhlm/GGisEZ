import{w as u}from"./index.06352de7.js";var _;const g=((_=globalThis.__sveltekit_hl4bof)==null?void 0:_.base)??"";var h;const v=((h=globalThis.__sveltekit_hl4bof)==null?void 0:h.assets)??g,k="1685025134023",A="sveltekit:snapshot",R="sveltekit:scroll",T="sveltekit:index",f={tap:1,hover:2,viewport:3,eager:4,off:-1};function I(e){let t=e.baseURI;if(!t){const n=e.getElementsByTagName("base");t=n.length?n[0].href:e.URL}return t}function S(){return{x:pageXOffset,y:pageYOffset}}function i(e,t){return e.getAttribute(`data-sveltekit-${t}`)}const d={...f,"":f.hover};function b(e){let t=e.assignedSlot??e.parentNode;return(t==null?void 0:t.nodeType)===11&&(t=t.host),t}function y(e,t){for(;e&&e!==t;){if(e.nodeName.toUpperCase()==="A"&&e.hasAttribute("href"))return e;e=b(e)}}function x(e,t){let n;try{n=new URL(e instanceof SVGAElement?e.href.baseVal:e.href,document.baseURI)}catch{}const a=e instanceof SVGAElement?e.target.baseVal:e.target,l=!n||!!a||m(n,t)||(e.getAttribute("rel")||"").split(/\s+/).includes("external")||e.hasAttribute("download");return{url:n,external:l,target:a}}function O(e){let t=null,n=null,a=null,l=null,r=null,o=null,s=e;for(;s&&s!==document.documentElement;)a===null&&(a=i(s,"preload-code")),l===null&&(l=i(s,"preload-data")),t===null&&(t=i(s,"keepfocus")),n===null&&(n=i(s,"noscroll")),r===null&&(r=i(s,"reload")),o===null&&(o=i(s,"replacestate")),s=b(s);return{preload_code:d[a??"off"],preload_data:d[l??"off"],keep_focus:t==="off"?!1:t===""?!0:null,noscroll:n==="off"?!1:n===""?!0:null,reload:r==="off"?!1:r===""?!0:null,replace_state:o==="off"?!1:o===""?!0:null}}function p(e){const t=u(e);let n=!0;function a(){n=!0,t.update(o=>o)}function l(o){n=!1,t.set(o)}function r(o){let s;return t.subscribe(c=>{(s===void 0||n&&c!==s)&&o(s=c)})}return{notify:a,set:l,subscribe:r}}function E(){const{set:e,subscribe:t}=u(!1);let n;async function a(){clearTimeout(n);const l=await fetch(`${v}/_app/version.json`,{headers:{pragma:"no-cache","cache-control":"no-cache"}});if(l.ok){const o=(await l.json()).version!==k;return o&&(e(!0),clearTimeout(n)),o}else throw new Error(`Version check failed: ${l.status}`)}return{subscribe:t,check:a}}function m(e,t){return e.origin!==location.origin||!e.pathname.startsWith(t)}function U(e){e.client}const L={url:p({}),page:p({}),navigating:u(null),updated:E()};export{T as I,f as P,R as S,A as a,x as b,O as c,S as d,g as e,y as f,I as g,U as h,m as i,L as s};
