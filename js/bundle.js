(()=>{function e(e,t){(null==t||t>e.length)&&(t=e.length);for(var n=0,o=new Array(t);n<t;n++)o[n]=e[n];return o}var t="MISSING_ENV_VAR".API_KEY,n="MISSING_ENV_VAR".CHANNEL_ID;if(!t||!n){var o=document.getElementById("main-header"),r=document.createElement("h3");r.textContent="Error: API key or channel ID not set.",r.style.color="#ff9999",o.appendChild(r),document.getElementById("live-container").style.display="none",console.error("Error: API key or channel ID not set.")}var a="https://www.googleapis.com/youtube/v3/search?key=".concat(t,"&channelId=").concat(n,"&part=snippet,id&eventType=live&type=video"),i="https://www.googleapis.com/youtube/v3/search?key=".concat(t,"&channelId=").concat(n,"&part=snippet,id&eventType=upcoming&type=video"),l="https://www.googleapis.com/youtube/v3/search?key=".concat(t,"&channelId=").concat(n,"&part=snippet,id&eventType=completed&type=video"),c=document.getElementById("live-now"),s=document.getElementById("live-soon"),d=document.getElementById("live-past");function p(e){var t=e.id.videoId,n=e.snippet.title,o=e.snippet.thumbnails.medium.url,r=e.snippet.liveBroadcastContent,a=new Date(e.snippet.publishedAt),i=a.toLocaleTimeString("en-US",{timeZoneName:"short"}).split(" ")[2],l=document.createElement("div");l.classList.add("video");var c=document.createElement("img");c.src=o;var s=document.createElement("a");s.href="https://www.youtube.com/watch?v=".concat(t),s.target="_blank";var d=document.createElement("h3");d.textContent=n;var p=document.createElement("span");return p.textContent="upcoming"===r?"Scheduled for ".concat(a.toLocaleString("en-US",{timeZone:"UTC"})," ").concat(i):"Streamed on ".concat(a.toLocaleString("en-US",{timeZone:"UTC"})," ").concat(i),s.appendChild(c),s.appendChild(d),s.appendChild(p),l.appendChild(s),l}function u(e){e&&e.liveNow&&e.liveNow.items&&e.liveSoon&&e.liveSoon.items&&e.past&&e.past.items?(e.liveNow.items.length>0?e.liveNow.items.forEach((function(e){var t=p(e);c.appendChild(t)})):c.textContent="No live videos currently.",e.liveSoon.items.length>0?e.liveSoon.items.forEach((function(e){var t=p(e);s.appendChild(t)})):s.textContent="No scheduled livestreams. Stay tuned!",e.past.items.length>0?e.past.items.forEach((function(e){var t=p(e);d.appendChild(t)})):d.textContent="No past livestreams."):(console.error("Error displaying videos:",e),c.textContent="Error displaying videos. Please try again later.",s.textContent="Error displaying videos. Please try again later.",d.textContent="Error displaying videos. Please try again later.")}!function o(){if(t&&n){var r=localStorage.getItem("apiResponse");if(r)try{u(JSON.parse(r))}catch(e){console.error("Error parsing cached response:",e),localStorage.removeItem("apiResponse"),o()}else Promise.all([fetch(a).then((function(e){return e.json()})),fetch(i).then((function(e){return e.json()})),fetch(l).then((function(e){return e.json()}))]).then((function(t){var n,o,r=(o=3,function(e){if(Array.isArray(e))return e}(n=t)||function(e,t){var n=null==e?null:"undefined"!=typeof Symbol&&e[Symbol.iterator]||e["@@iterator"];if(null!=n){var o,r,a,i,l=[],c=!0,s=!1;try{if(a=(n=n.call(e)).next,0===t){if(Object(n)!==n)return;c=!1}else for(;!(c=(o=a.call(n)).done)&&(l.push(o.value),l.length!==t);c=!0);}catch(e){s=!0,r=e}finally{try{if(!c&&null!=n.return&&(i=n.return(),Object(i)!==i))return}finally{if(s)throw r}}return l}}(n,o)||function(t,n){if(t){if("string"==typeof t)return e(t,n);var o=Object.prototype.toString.call(t).slice(8,-1);return"Object"===o&&t.constructor&&(o=t.constructor.name),"Map"===o||"Set"===o?Array.from(t):"Arguments"===o||/^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(o)?e(t,n):void 0}}(n,o)||function(){throw new TypeError("Invalid attempt to destructure non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method.")}()),a={liveNow:r[0],liveSoon:r[1],past:r[2]};localStorage.setItem("apiResponse",JSON.stringify(a)),u(a)})).catch((function(e){console.error("Error fetching data from API:",e),c.textContent="Error fetching data. Please try again later.",s.textContent="Error fetching data. Please try again later.",d.textContent="Error fetching data. Please try again later."}))}}()})();