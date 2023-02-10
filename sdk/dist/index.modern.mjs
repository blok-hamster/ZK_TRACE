import{ethers as e}from"ethers";import t from"isomorphic-unfetch";function r(){return r=Object.assign?Object.assign.bind():function(e){for(var t=1;t<arguments.length;t++){var r=arguments[t];for(var o in r)Object.prototype.hasOwnProperty.call(r,o)&&(e[o]=r[o])}return e},r.apply(this,arguments)}class o{constructor(e){this.nodeEndpoint=void 0,this.apikey=void 0,this.baseUrl=void 0,this.nodeEndpoint=e.nodeEndpoint||"https://api.hyperspace.node.glif.io/rpc/v1",this.baseUrl=e.baseUri||"http://localhost:5000/",this.apikey=e.apikey}invoke(e,o){const n=`${this.baseUrl}${e}`,a=r({},o,{headers:{"content-type":"application/json",apiKey:this.apikey}});return t(n,a).then(e=>{if(200===e.status)return e.json();throw new Error("call failed")})}async getProvider(){return new e.providers.JsonRpcProvider(this.nodeEndpoint)}}class n extends o{async readCid(e){return this.invoke(`storage/readData/${e}`)}async readCarData(e){return this.invoke(`storage/createCar/${e}`)}async createCar(e,t){return this.invoke(`storage/createCar/${t}`,{method:"POST",body:JSON.stringify(e)})}async uploadCar(e){return this.invoke(`storage/uploadCar/${e}`,{method:"POST"})}async updateCar(e,t){return this.invoke(`storage/createCar/${t}`,{method:"PUT",body:JSON.stringify(e)})}async getMerkelProof(e,t){return this.invoke(`storage/getMerkelProof/${e}/${t}`,{method:"GET"})}}class a extends n{async generateZkProof(e){return this.invoke("zk/generateProof",{method:"POST",body:JSON.stringify({input:e})})}async verifyZkProof(e){return this.invoke("zk/verifyProof",{method:"POST",body:JSON.stringify(e)})}}class s extends o{}var i;i=s,[class extends a{async log(){console.log(await this.getProvider())}}].forEach(e=>{Object.getOwnPropertyNames(e.prototype).forEach(t=>{Object.defineProperty(i.prototype,t,Object.getOwnPropertyDescriptor(e.prototype,t)||Object.create(null))})});export{s as default};
