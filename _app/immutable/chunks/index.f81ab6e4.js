function $(){}const U=t=>t;function xt(t,e){for(const n in e)t[n]=e[n];return t}function rt(t){return t()}function it(){return Object.create(null)}function E(t){t.forEach(rt)}function T(t){return typeof t=="function"}function Vt(t,e){return t!=t?e==e:t!==e||t&&typeof t=="object"||typeof t=="function"}let q;function Xt(t,e){return q||(q=document.createElement("a")),q.href=e,t===q.href}function wt(t){return Object.keys(t).length===0}function vt(t,...e){if(t==null)return $;const n=t.subscribe(...e);return n.unsubscribe?()=>n.unsubscribe():n}function Yt(t,e,n){t.$$.on_destroy.push(vt(e,n))}function Zt(t,e,n,i){if(t){const s=ot(t,e,n,i);return t[0](s)}}function ot(t,e,n,i){return t[1]&&i?xt(n.ctx.slice(),t[1](i(e))):n.ctx}function te(t,e,n,i){if(t[2]&&i){const s=t[2](i(n));if(e.dirty===void 0)return s;if(typeof s=="object"){const c=[],r=Math.max(e.dirty.length,s.length);for(let a=0;a<r;a+=1)c[a]=e.dirty[a]|s[a];return c}return e.dirty|s}return e.dirty}function ee(t,e,n,i,s,c){if(s){const r=ot(e,n,i,c);t.p(r,s)}}function ne(t){if(t.ctx.length>32){const e=[],n=t.ctx.length/32;for(let i=0;i<n;i++)e[i]=-1;return e}return-1}function ie(t){const e={};for(const n in t)n[0]!=="$"&&(e[n]=t[n]);return e}function se(t,e){const n={};e=new Set(e);for(const i in t)!e.has(i)&&i[0]!=="$"&&(n[i]=t[i]);return n}function re(t){const e={};for(const n in t)e[n]=!0;return e}function oe(t,e,n){return t.set(n),e}function ce(t){return t&&T(t.destroy)?t.destroy:$}const ct=typeof window<"u";let V=ct?()=>window.performance.now():()=>Date.now(),X=ct?t=>requestAnimationFrame(t):$;const S=new Set;function at(t){S.forEach(e=>{e.c(t)||(S.delete(e),e.f())}),S.size!==0&&X(at)}function Y(t){let e;return S.size===0&&X(at),{promise:new Promise(n=>{S.add(e={c:t,f:n})}),abort(){S.delete(e)}}}let W=!1;function kt(){W=!0}function Et(){W=!1}function Ct(t,e,n,i){for(;t<e;){const s=t+(e-t>>1);n(s)<=i?t=s+1:e=s}return t}function Nt(t){if(t.hydrate_init)return;t.hydrate_init=!0;let e=t.childNodes;if(t.nodeName==="HEAD"){const o=[];for(let l=0;l<e.length;l++){const f=e[l];f.claim_order!==void 0&&o.push(f)}e=o}const n=new Int32Array(e.length+1),i=new Int32Array(e.length);n[0]=-1;let s=0;for(let o=0;o<e.length;o++){const l=e[o].claim_order,f=(s>0&&e[n[s]].claim_order<=l?s+1:Ct(1,s,_=>e[n[_]].claim_order,l))-1;i[o]=n[f]+1;const u=f+1;n[u]=o,s=Math.max(u,s)}const c=[],r=[];let a=e.length-1;for(let o=n[s]+1;o!=0;o=i[o-1]){for(c.push(e[o-1]);a>=o;a--)r.push(e[a]);a--}for(;a>=0;a--)r.push(e[a]);c.reverse(),r.sort((o,l)=>o.claim_order-l.claim_order);for(let o=0,l=0;o<r.length;o++){for(;l<c.length&&r[o].claim_order>=c[l].claim_order;)l++;const f=l<c.length?c[l]:null;t.insertBefore(r[o],f)}}function St(t,e){t.appendChild(e)}function lt(t){if(!t)return document;const e=t.getRootNode?t.getRootNode():t.ownerDocument;return e&&e.host?e:t.ownerDocument}function jt(t){const e=ft("style");return At(lt(t),e),e.sheet}function At(t,e){return St(t.head||t,e),e.sheet}function Mt(t,e){if(W){for(Nt(t),(t.actual_end_child===void 0||t.actual_end_child!==null&&t.actual_end_child.parentNode!==t)&&(t.actual_end_child=t.firstChild);t.actual_end_child!==null&&t.actual_end_child.claim_order===void 0;)t.actual_end_child=t.actual_end_child.nextSibling;e!==t.actual_end_child?(e.claim_order!==void 0||e.parentNode!==t)&&t.insertBefore(e,t.actual_end_child):t.actual_end_child=e.nextSibling}else(e.parentNode!==t||e.nextSibling!==null)&&t.appendChild(e)}function ae(t,e,n){W&&!n?Mt(t,e):(e.parentNode!==t||e.nextSibling!=n)&&t.insertBefore(e,n||null)}function ut(t){t.parentNode&&t.parentNode.removeChild(t)}function le(t,e){for(let n=0;n<t.length;n+=1)t[n]&&t[n].d(e)}function ft(t){return document.createElement(t)}function Ot(t){return document.createElementNS("http://www.w3.org/2000/svg",t)}function Z(t){return document.createTextNode(t)}function ue(){return Z(" ")}function fe(){return Z("")}function _e(t,e,n,i){return t.addEventListener(e,n,i),()=>t.removeEventListener(e,n,i)}function de(t){return function(e){return e.preventDefault(),t.call(this,e)}}function he(t){return function(e){return e.stopPropagation(),t.call(this,e)}}function tt(t,e,n){n==null?t.removeAttribute(e):t.getAttribute(e)!==n&&t.setAttribute(e,n)}function Dt(t,e){const n=Object.getOwnPropertyDescriptors(t.__proto__);for(const i in e)e[i]==null?t.removeAttribute(i):i==="style"?t.style.cssText=e[i]:i==="__value"?t.value=t[i]=e[i]:n[i]&&n[i].set?t[i]=e[i]:tt(t,i,e[i])}function me(t,e){for(const n in e)tt(t,n,e[n])}function Pt(t,e){Object.keys(e).forEach(n=>{Rt(t,n,e[n])})}function Rt(t,e,n){e in t?t[e]=typeof t[e]=="boolean"&&n===""?!0:n:tt(t,e,n)}function pe(t){return/-/.test(t)?Pt:Dt}function Tt(t){return Array.from(t.childNodes)}function Bt(t){t.claim_info===void 0&&(t.claim_info={last_index:0,total_claimed:0})}function _t(t,e,n,i,s=!1){Bt(t);const c=(()=>{for(let r=t.claim_info.last_index;r<t.length;r++){const a=t[r];if(e(a)){const o=n(a);return o===void 0?t.splice(r,1):t[r]=o,s||(t.claim_info.last_index=r),a}}for(let r=t.claim_info.last_index-1;r>=0;r--){const a=t[r];if(e(a)){const o=n(a);return o===void 0?t.splice(r,1):t[r]=o,s?o===void 0&&t.claim_info.last_index--:t.claim_info.last_index=r,a}}return i()})();return c.claim_order=t.claim_info.total_claimed,t.claim_info.total_claimed+=1,c}function dt(t,e,n,i){return _t(t,s=>s.nodeName===e,s=>{const c=[];for(let r=0;r<s.attributes.length;r++){const a=s.attributes[r];n[a.name]||c.push(a.name)}c.forEach(r=>s.removeAttribute(r))},()=>i(e))}function ye(t,e,n){return dt(t,e,n,ft)}function ge(t,e,n){return dt(t,e,n,Ot)}function qt(t,e){return _t(t,n=>n.nodeType===3,n=>{const i=""+e;if(n.data.startsWith(i)){if(n.data.length!==i.length)return n.splitText(i.length)}else n.data=i},()=>Z(e),!0)}function $e(t){return qt(t," ")}function be(t,e){e=""+e,t.wholeText!==e&&(t.data=e)}function xe(t,e,n,i){n===null?t.style.removeProperty(e):t.style.setProperty(e,n,i?"important":"")}function we(t,e,n){t.classList[n?"add":"remove"](e)}function ht(t,e,{bubbles:n=!1,cancelable:i=!1}={}){const s=document.createEvent("CustomEvent");return s.initCustomEvent(t,n,i,e),s}function ve(t,e){return new t(e)}const z=new Map;let F=0;function Lt(t){let e=5381,n=t.length;for(;n--;)e=(e<<5)-e^t.charCodeAt(n);return e>>>0}function zt(t,e){const n={stylesheet:jt(e),rules:{}};return z.set(t,n),n}function et(t,e,n,i,s,c,r,a=0){const o=16.666/i;let l=`{
`;for(let m=0;m<=1;m+=o){const y=e+(n-e)*c(m);l+=m*100+`%{${r(y,1-y)}}
`}const f=l+`100% {${r(n,1-n)}}
}`,u=`__svelte_${Lt(f)}_${a}`,_=lt(t),{stylesheet:d,rules:h}=z.get(_)||zt(_,t);h[u]||(h[u]=!0,d.insertRule(`@keyframes ${u} ${f}`,d.cssRules.length));const g=t.style.animation||"";return t.style.animation=`${g?`${g}, `:""}${u} ${i}ms linear ${s}ms 1 both`,F+=1,u}function H(t,e){const n=(t.style.animation||"").split(", "),i=n.filter(e?c=>c.indexOf(e)<0:c=>c.indexOf("__svelte")===-1),s=n.length-i.length;s&&(t.style.animation=i.join(", "),F-=s,F||Ft())}function Ft(){X(()=>{F||(z.forEach(t=>{const{ownerNode:e}=t.stylesheet;e&&ut(e)}),z.clear())})}function ke(t,e,n,i){if(!e)return $;const s=t.getBoundingClientRect();if(e.left===s.left&&e.right===s.right&&e.top===s.top&&e.bottom===s.bottom)return $;const{delay:c=0,duration:r=300,easing:a=U,start:o=V()+c,end:l=o+r,tick:f=$,css:u}=n(t,{from:e,to:s},i);let _=!0,d=!1,h;function g(){u&&(h=et(t,0,1,r,c,a,u)),c||(d=!0)}function m(){u&&H(t,h),_=!1}return Y(y=>{if(!d&&y>=o&&(d=!0),d&&y>=l&&(f(1,0),m()),!_)return!1;if(d){const k=y-o,w=0+1*a(k/r);f(w,1-w)}return!0}),g(),f(0,1),m}function Ee(t){const e=getComputedStyle(t);if(e.position!=="absolute"&&e.position!=="fixed"){const{width:n,height:i}=e,s=t.getBoundingClientRect();t.style.position="absolute",t.style.width=n,t.style.height=i,Ht(t,s)}}function Ht(t,e){const n=t.getBoundingClientRect();if(e.left!==n.left||e.top!==n.top){const i=getComputedStyle(t),s=i.transform==="none"?"":i.transform;t.style.transform=`${s} translate(${e.left-n.left}px, ${e.top-n.top}px)`}}let P;function D(t){P=t}function A(){if(!P)throw new Error("Function called outside component initialization");return P}function Ce(t){A().$$.on_mount.push(t)}function Ne(t){A().$$.after_update.push(t)}function Se(t){A().$$.on_destroy.push(t)}function je(){const t=A();return(e,n,{cancelable:i=!1}={})=>{const s=t.$$.callbacks[e];if(s){const c=ht(e,n,{cancelable:i});return s.slice().forEach(r=>{r.call(t,c)}),!c.defaultPrevented}return!0}}function Ae(t,e){return A().$$.context.set(t,e),e}function Me(t){return A().$$.context.get(t)}function Oe(t,e){const n=t.$$.callbacks[e.type];n&&n.slice().forEach(i=>i.call(this,e))}const N=[],st=[];let j=[];const K=[],mt=Promise.resolve();let Q=!1;function pt(){Q||(Q=!0,mt.then(yt))}function De(){return pt(),mt}function R(t){j.push(t)}function Pe(t){K.push(t)}const J=new Set;let C=0;function yt(){if(C!==0)return;const t=P;do{try{for(;C<N.length;){const e=N[C];C++,D(e),It(e.$$)}}catch(e){throw N.length=0,C=0,e}for(D(null),N.length=0,C=0;st.length;)st.pop()();for(let e=0;e<j.length;e+=1){const n=j[e];J.has(n)||(J.add(n),n())}j.length=0}while(N.length);for(;K.length;)K.pop()();Q=!1,J.clear(),D(t)}function It(t){if(t.fragment!==null){t.update(),E(t.before_update);const e=t.dirty;t.dirty=[-1],t.fragment&&t.fragment.p(t.ctx,e),t.after_update.forEach(R)}}function Wt(t){const e=[],n=[];j.forEach(i=>t.indexOf(i)===-1?e.push(i):n.push(i)),n.forEach(i=>i()),j=e}let O;function gt(){return O||(O=Promise.resolve(),O.then(()=>{O=null})),O}function I(t,e,n){t.dispatchEvent(ht(`${e?"intro":"outro"}${n}`))}const L=new Set;let v;function Re(){v={r:0,c:[],p:v}}function Te(){v.r||E(v.c),v=v.p}function $t(t,e){t&&t.i&&(L.delete(t),t.i(e))}function Gt(t,e,n,i){if(t&&t.o){if(L.has(t))return;L.add(t),v.c.push(()=>{L.delete(t),i&&(n&&t.d(1),i())}),t.o(e)}else i&&i()}const bt={duration:0};function Be(t,e,n){const i={direction:"in"};let s=e(t,n,i),c=!1,r,a,o=0;function l(){r&&H(t,r)}function f(){const{delay:_=0,duration:d=300,easing:h=U,tick:g=$,css:m}=s||bt;m&&(r=et(t,0,1,d,_,h,m,o++)),g(0,1);const y=V()+_,k=y+d;a&&a.abort(),c=!0,R(()=>I(t,!0,"start")),a=Y(w=>{if(c){if(w>=k)return g(1,0),I(t,!0,"end"),l(),c=!1;if(w>=y){const M=h((w-y)/d);g(M,1-M)}}return c})}let u=!1;return{start(){u||(u=!0,H(t),T(s)?(s=s(i),gt().then(f)):f())},invalidate(){u=!1},end(){c&&(l(),c=!1)}}}function qe(t,e,n){const i={direction:"out"};let s=e(t,n,i),c=!0,r;const a=v;a.r+=1;function o(){const{delay:l=0,duration:f=300,easing:u=U,tick:_=$,css:d}=s||bt;d&&(r=et(t,1,0,f,l,u,d));const h=V()+l,g=h+f;R(()=>I(t,!1,"start")),Y(m=>{if(c){if(m>=g)return _(0,1),I(t,!1,"end"),--a.r||E(a.c),!1;if(m>=h){const y=u((m-h)/f);_(1-y,y)}}return c})}return T(s)?gt().then(()=>{s=s(i),o()}):o(),{end(l){l&&s.tick&&s.tick(1,0),c&&(r&&H(t,r),c=!1)}}}const Le=typeof window<"u"?window:typeof globalThis<"u"?globalThis:global;function Jt(t,e){Gt(t,1,1,()=>{e.delete(t.key)})}function ze(t,e){t.f(),Jt(t,e)}function Fe(t,e,n,i,s,c,r,a,o,l,f,u){let _=t.length,d=c.length,h=_;const g={};for(;h--;)g[t[h].key]=h;const m=[],y=new Map,k=new Map,w=[];for(h=d;h--;){const p=u(s,c,h),b=n(p);let x=r.get(b);x?i&&w.push(()=>x.p(p,e)):(x=l(b,p),x.c()),y.set(b,m[h]=x),b in g&&k.set(b,Math.abs(h-g[b]))}const M=new Set,nt=new Set;function G(p){$t(p,1),p.m(a,f),r.set(p.key,p),f=p.first,d--}for(;_&&d;){const p=m[d-1],b=t[_-1],x=p.key,B=b.key;p===b?(f=p.first,_--,d--):y.has(B)?!r.has(x)||M.has(x)?G(p):nt.has(B)?_--:k.get(x)>k.get(B)?(nt.add(x),G(p)):(M.add(B),_--):(o(b,r),_--)}for(;_--;){const p=t[_];y.has(p.key)||o(p,r)}for(;d;)G(m[d-1]);return E(w),m}function He(t,e){const n={},i={},s={$$scope:1};let c=t.length;for(;c--;){const r=t[c],a=e[c];if(a){for(const o in r)o in a||(i[o]=1);for(const o in a)s[o]||(n[o]=a[o],s[o]=1);t[c]=a}else for(const o in r)s[o]=1}for(const r in i)r in n||(n[r]=void 0);return n}function Ie(t){return typeof t=="object"&&t!==null?t:{}}function We(t,e,n){const i=t.$$.props[e];i!==void 0&&(t.$$.bound[i]=n,n(t.$$.ctx[i]))}function Ge(t){t&&t.c()}function Je(t,e){t&&t.l(e)}function Kt(t,e,n,i){const{fragment:s,after_update:c}=t.$$;s&&s.m(e,n),i||R(()=>{const r=t.$$.on_mount.map(rt).filter(T);t.$$.on_destroy?t.$$.on_destroy.push(...r):E(r),t.$$.on_mount=[]}),c.forEach(R)}function Qt(t,e){const n=t.$$;n.fragment!==null&&(Wt(n.after_update),E(n.on_destroy),n.fragment&&n.fragment.d(e),n.on_destroy=n.fragment=null,n.ctx=[])}function Ut(t,e){t.$$.dirty[0]===-1&&(N.push(t),pt(),t.$$.dirty.fill(0)),t.$$.dirty[e/31|0]|=1<<e%31}function Ke(t,e,n,i,s,c,r,a=[-1]){const o=P;D(t);const l=t.$$={fragment:null,ctx:[],props:c,update:$,not_equal:s,bound:it(),on_mount:[],on_destroy:[],on_disconnect:[],before_update:[],after_update:[],context:new Map(e.context||(o?o.$$.context:[])),callbacks:it(),dirty:a,skip_bound:!1,root:e.target||o.$$.root};r&&r(l.root);let f=!1;if(l.ctx=n?n(t,e.props||{},(u,_,...d)=>{const h=d.length?d[0]:_;return l.ctx&&s(l.ctx[u],l.ctx[u]=h)&&(!l.skip_bound&&l.bound[u]&&l.bound[u](h),f&&Ut(t,u)),_}):[],l.update(),f=!0,E(l.before_update),l.fragment=i?i(l.ctx):!1,e.target){if(e.hydrate){kt();const u=Tt(e.target);l.fragment&&l.fragment.l(u),u.forEach(ut)}else l.fragment&&l.fragment.c();e.intro&&$t(t.$$.fragment),Kt(t,e.target,e.anchor,e.customElement),Et(),yt()}D(o)}class Qe{$destroy(){Qt(this,1),this.$destroy=$}$on(e,n){if(!T(n))return $;const i=this.$$.callbacks[e]||(this.$$.callbacks[e]=[]);return i.push(n),()=>{const s=i.indexOf(n);s!==-1&&i.splice(s,1)}}$set(e){this.$$set&&!wt(e)&&(this.$$.skip_bound=!0,this.$$set(e),this.$$.skip_bound=!1)}}export{Ie as $,Kt as A,Qt as B,Zt as C,ee as D,ne as E,te as F,Mt as G,$ as H,Yt as I,_e as J,Oe as K,de as L,he as M,xt as N,Dt as O,ce as P,He as Q,T as R,Qe as S,E as T,se as U,A as V,Me as W,oe as X,Se as Y,ie as Z,Ae as _,ue as a,pe as a0,Ot as a1,ge as a2,me as a3,je as a4,Fe as a5,we as a6,Ee as a7,Ht as a8,ke as a9,R as aa,Be as ab,qe as ac,ze as ad,Xt as ae,Le as af,We as ag,Pe as ah,re as ai,le as aj,ae as b,$e as c,Gt as d,fe as e,Te as f,$t as g,ut as h,Ke as i,Ne as j,ft as k,ye as l,Tt as m,tt as n,Ce as o,xe as p,Z as q,qt as r,Vt as s,De as t,be as u,Re as v,st as w,ve as x,Ge as y,Je as z};
