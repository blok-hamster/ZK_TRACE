import{ethers as t}from"ethers";import r from"isomorphic-unfetch";function e(){return e=Object.assign?Object.assign.bind():function(t){for(var r=1;r<arguments.length;r++){var e=arguments[r];for(var o in e)Object.prototype.hasOwnProperty.call(e,o)&&(t[o]=e[o])}return t},e.apply(this,arguments)}function o(t,r){t.prototype=Object.create(r.prototype),t.prototype.constructor=t,n(t,r)}function n(t,r){return n=Object.setPrototypeOf?Object.setPrototypeOf.bind():function(t,r){return t.__proto__=r,t},n(t,r)}var i,s=/*#__PURE__*/function(){function o(t){this.nodeEndpoint=void 0,this.apikey=void 0,this.baseUrl=void 0,this.nodeEndpoint=t.nodeEndpoint||"https://api.hyperspace.node.glif.io/rpc/v1",this.baseUrl=t.baseUri||"http://localhost:5000/",this.apikey=t.apikey}var n=o.prototype;return n.invoke=function(t,o){var n=""+this.baseUrl+t,i=e({},o,{headers:{"content-type":"application/json",apiKey:this.apikey}});return r(n,i).then(function(t){if(200===t.status)return t.json();throw new Error("call failed")})},n.getProvider=function(){try{return Promise.resolve(new t.providers.JsonRpcProvider(this.nodeEndpoint))}catch(t){return Promise.reject(t)}},o}(),c=/*#__PURE__*/function(t){function r(){return t.apply(this,arguments)||this}return o(r,t),r.prototype.log=function(){try{return Promise.resolve(this.getProvider()).then(function(t){console.log(t)})}catch(t){return Promise.reject(t)}},r}(/*#__PURE__*/function(t){function r(){return t.apply(this,arguments)||this}o(r,t);var e=r.prototype;return e.generateZkProof=function(t){try{return Promise.resolve(this.invoke("zk/generateProof",{method:"POST",body:JSON.stringify({input:t})}))}catch(t){return Promise.reject(t)}},e.verifyZkProof=function(t){try{return Promise.resolve(this.invoke("zk/verifyProof",{method:"POST",body:JSON.stringify(t)}))}catch(t){return Promise.reject(t)}},r}(/*#__PURE__*/function(t){function r(){return t.apply(this,arguments)||this}o(r,t);var e=r.prototype;return e.readCid=function(t){try{return Promise.resolve(this.invoke("storage/readData/"+t))}catch(t){return Promise.reject(t)}},e.readCarData=function(t){try{return Promise.resolve(this.invoke("storage/createCar/"+t))}catch(t){return Promise.reject(t)}},e.createCar=function(t,r){try{return Promise.resolve(this.invoke("storage/createCar/"+r,{method:"POST",body:JSON.stringify(t)}))}catch(t){return Promise.reject(t)}},e.uploadCar=function(t){try{return Promise.resolve(this.invoke("storage/uploadCar/"+t,{method:"POST"}))}catch(t){return Promise.reject(t)}},e.updateCar=function(t,r){try{return Promise.resolve(this.invoke("storage/createCar/"+r,{method:"PUT",body:JSON.stringify(t)}))}catch(t){return Promise.reject(t)}},e.getMerkelProof=function(t,r){try{return Promise.resolve(this.invoke("storage/getMerkelProof/"+t+"/"+r,{method:"GET"}))}catch(t){return Promise.reject(t)}},r}(s))),a=/*#__PURE__*/function(t){function r(){return t.apply(this,arguments)||this}return o(r,t),r}(s);i=a,[c].forEach(function(t){Object.getOwnPropertyNames(t.prototype).forEach(function(r){Object.defineProperty(i.prototype,r,Object.getOwnPropertyDescriptor(t.prototype,r)||Object.create(null))})});export{a as default};