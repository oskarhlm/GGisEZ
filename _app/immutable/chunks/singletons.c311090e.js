import{H as d,s as E}from"./index.0358d19c.js";const c=[];function p(e,t=d){let n;const o=new Set;function l(s){if(E(e,s)&&(e=s,n)){const u=!c.length;for(const a of o)a[1](),c.push(a,e);if(u){for(let a=0;a<c.length;a+=2)c[a][0](c[a+1]);c.length=0}}}function i(s){l(s(e))}function r(s,u=d){const a=[s,u];return o.add(a),o.size===1&&(n=t(l)||d),s(e),()=>{o.delete(a),o.size===0&&n&&(n(),n=null)}}return{set:l,update:i,subscribe:r}}var g;const m=((g=globalThis.__sveltekit_9eo6hl)==null?void 0:g.base)??"";var k;const w=((k=globalThis.__sveltekit_9eo6hl)==null?void 0:k.assets)??m,A="1684931939258",I="sveltekit:snapshot",y="sveltekit:scroll",x="sveltekit:index",_={tap:1,hover:2,viewport:3,eager:4,off:-1};function O(e){let t=e.baseURI;if(!t){const n=e.getElementsByTagName("base");t=n.length?n[0].href:e.URL}return t}function U(){return{x:pageXOffset,y:pageYOffset}}function f(e,t){return e.getAttribute(`data-sveltekit-${t}`)}const b={..._,"":_.hover};function v(e){let t=e.assignedSlot??e.parentNode;return(t==null?void 0:t.nodeType)===11&&(t=t.host),t}function L(e,t){for(;e&&e!==t;){if(e.nodeName.toUpperCase()==="A"&&e.hasAttribute("href"))return e;e=v(e)}}function N(e,t){let n;try{n=new URL(e instanceof SVGAElement?e.href.baseVal:e.href,document.baseURI)}catch{}const o=e instanceof SVGAElement?e.target.baseVal:e.target,l=!n||!!o||S(n,t)||(e.getAttribute("rel")||"").split(/\s+/).includes("external")||e.hasAttribute("download");return{url:n,external:l,target:o}}function V(e){let t=null,n=null,o=null,l=null,i=null,r=null,s=e;for(;s&&s!==document.documentElement;)o===null&&(o=f(s,"preload-code")),l===null&&(l=f(s,"preload-data")),t===null&&(t=f(s,"keepfocus")),n===null&&(n=f(s,"noscroll")),i===null&&(i=f(s,"reload")),r===null&&(r=f(s,"replacestate")),s=v(s);return{preload_code:b[o??"off"],preload_data:b[l??"off"],keep_focus:t==="off"?!1:t===""?!0:null,noscroll:n==="off"?!1:n===""?!0:null,reload:i==="off"?!1:i===""?!0:null,replace_state:r==="off"?!1:r===""?!0:null}}function h(e){const t=p(e);let n=!0;function o(){n=!0,t.update(r=>r)}function l(r){n=!1,t.set(r)}function i(r){let s;return t.subscribe(u=>{(s===void 0||n&&u!==s)&&r(s=u)})}return{notify:o,set:l,subscribe:i}}function R(){const{set:e,subscribe:t}=p(!1);let n;async function o(){clearTimeout(n);const l=await fetch(`${w}/_app/version.json`,{headers:{pragma:"no-cache","cache-control":"no-cache"}});if(l.ok){const r=(await l.json()).version!==A;return r&&(e(!0),clearTimeout(n)),r}else throw new Error(`Version check failed: ${l.status}`)}return{subscribe:t,check:o}}function S(e,t){return e.origin!==location.origin||!e.pathname.startsWith(t)}function P(e){e.client}const Y={url:h({}),page:h({}),navigating:p(null),updated:R()};export{x as I,_ as P,y as S,I as a,N as b,V as c,U as d,m as e,L as f,O as g,P as h,S as i,Y as s};
