const e=document.getElementById("image-container"),t=document.getElementById("loading-container");let n=!1,a=0,r=0,o=[];async function i(){try{let i=await fetch("https://api.unsplash.com/photos/random/?client_id=yNiXBS7E0BE1WsNM4QbzcdNxtA7AdMzxUCHAs6Fy4i0&count=8"),l=await i.json();if(l.errors)throw Error(l.errors.message);o=l,a=0,r=o.length,o.map(o=>{let i=document.createElement("a");d(i,{href:o.links.html,target:"_blank",class:"img-link"});let l=document.createElement("img");d(l,{src:o.urls.regular,alt:o.alt_description,title:o.alt_description}),l.addEventListener("load",()=>{++a===r&&(n=!0,t?.classList.add("hidden"))}),i.appendChild(l),e?.appendChild(i)})}catch(n){(function(n){let a=document.createElement("h2"),r=document.createElement("iframe"),o=document.createElement("button");a.textContent=`${n.message}! Please try again later.`,d(a,{class:"error"}),d(r,{src:"https://lottie.host/embed/df3eb377-7228-421e-a5b8-6a68da51dabd/uqPXNHpPbo.json",frameBorder:"0",class:"error-image"}),o.textContent="Retry",d(o,{class:"retry-button"}),o.addEventListener("click",()=>{window.location.reload()}),e?.appendChild(a),e?.appendChild(r),e?.appendChild(o),e?.classList.replace("image-container","error-container"),t?.classList.add("hidden")})(n),console.error(n)}}function d(e,t){for(let n in t)e.setAttribute(n,t[n])}i(),window.addEventListener("scroll",()=>{window.innerHeight+window.scrollY>=document.body.offsetHeight-1e3&&n&&(n=!1,i())});
//# sourceMappingURL=index.b2145171.js.map