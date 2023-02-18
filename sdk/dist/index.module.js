import*as e from"fs";import{readFileSync as t}from"fs";import{resolve as r,dirname as n}from"path";import{initialize as i}from"zokrates-js";import o from"keccak256";import{ethers as s}from"ethers";import a from"seedrandom";import u from"isomorphic-unfetch";import{Web3Storage as c}from"web3.storage";import{CarReader as l}from"@ipld/car/reader";import{Readable as p}from"readable-stream";import*as y from"multiformats/block";import{sha256 as d}from"multiformats/hashes/sha2";import*as m from"multiformats/codecs/raw";import*as f from"@ipld/dag-json";import*as h from"@ipld/dag-cbor";import{CarWriter as v}from"@ipld/car/writer";import{MerkleTree as g}from"merkletreejs";import b from"crypto-js";import P from"axios";import{customAlphabet as T}from"nanoid";class w{constructor(e){this.nodeEndpoint=void 0,this.web3storageApiKey=void 0,this.factoryAddress=void 0,this.apikey=void 0,this.baseUrl=void 0,this.traceHubAddress=void 0,this.nodeEndpoint=e.nodeEndpoint||"http://127.0.0.1:8545",this.baseUrl=e.baseUri||"http://localhost:5000/",this.apikey=e.apikey,this.web3storageApiKey=e.web3storageApiKey,this.factoryAddress=e.factoryAddress||"0x610178da211fef7d417bc0e6fed39f05609ad788",this.traceHubAddress=e.traceHubAddress||"0x8A791620dd6260079BF849Dc5567aDC3F2FdC318"}invoke(e,t){const r={...t,headers:{"content-type":"application/json",apiKey:this.apikey}};return u(`${this.baseUrl}${e}`,r).then(e=>{if(200===e.status)return e.json();throw new Error("call failed")})}getWeb3StorageKey(){return this.web3storageApiKey}getProvider(){try{return Promise.resolve(new s.providers.JsonRpcProvider(this.nodeEndpoint))}catch(e){return Promise.reject(e)}}getFactoryAddress(){return this.factoryAddress}getTraceHubAddress(){return this.traceHubAddress}}function A(e,t){try{var r=e()}catch(e){return t(e)}return r&&r.then?r.then(void 0,t):r}const k="undefined"!=typeof Symbol?Symbol.iterator||(Symbol.iterator=Symbol("Symbol.iterator")):"@@iterator";function M(e,t,r){if(!e.s){if(r instanceof S){if(!r.s)return void(r.o=M.bind(null,e,t));1&t&&(t=r.s),r=r.v}if(r&&r.then)return void r.then(M.bind(null,e,t),M.bind(null,e,2));e.s=t,e.v=r;const n=e.o;n&&n(e)}}const S=/*#__PURE__*/function(){function e(){}return e.prototype.then=function(t,r){const n=new e,i=this.s;if(i){const e=1&i?t:r;if(e){try{M(n,1,e(this.v))}catch(e){M(n,2,e)}return n}return this}return this.o=function(e){try{const i=e.v;1&e.s?M(n,1,t?t(i):i):r?M(n,1,r(i)):M(n,2,i)}catch(e){M(n,2,e)}},n},e}();function x(e){return e instanceof S&&1&e.s}function j(e,t,r){if("function"==typeof e[k]){var n,i,o,s=e[k]();if(function e(a){try{for(;!((n=s.next()).done||r&&r());)if((a=t(n.value))&&a.then){if(!x(a))return void a.then(e,o||(o=M.bind(null,i=new S,2)));a=a.v}i?M(i,1,a):i=a}catch(e){M(i||(i=new S),2,e)}}(),s.return){var a=function(e){try{n.done||s.return()}catch(e){}return e};if(i&&i.then)return i.then(a,function(e){throw a(e)});a()}return i}if(!("length"in e))throw new TypeError("Object is not iterable");for(var u=[],c=0;c<e.length;c++)u.push(e[c]);return function(e,t,r){var n,i,o=-1;return function s(a){try{for(;++o<e.length&&(!r||!r());)if((a=t(o))&&a.then){if(!x(a))return void a.then(s,i||(i=M.bind(null,n=new S,2)));a=a.v}n?M(n,1,a):n=a}catch(e){M(n||(n=new S),2,e)}}(),n}(u,function(e){return t(u[e])},r)}const E="undefined"!=typeof Symbol?Symbol.asyncIterator||(Symbol.asyncIterator=Symbol("Symbol.asyncIterator")):"@@asyncIterator";class C extends w{constructor(){super(...arguments);const t=this,r=this,n=this,i=this,s=this,a=this,u=this,b=this;this.initilizeWeb3Storage=function(){try{try{const e=new c({token:b.getWeb3StorageKey()});return Promise.resolve(e)}catch(e){throw console.error(e),new Error("Failed to initilize web3Storage")}}catch(e){return Promise.reject(e)}},this.uploadCarToIPFS=function(t){try{return Promise.resolve(A(function(){return Promise.resolve(u.initilizeWeb3Storage()).then(function(r){const n=e.createReadStream(`./cars/${t}.car`);return Promise.resolve(l.fromIterable(n)).then(function(e){return Promise.resolve(r.putCar(e,{name:`${t}.car`,decoders:[h]}))})})},function(e){throw console.error(e),new Error("Upload trace details failed")}))}catch(e){return Promise.reject(e)}},this.readData=function(e){try{let t;return Promise.resolve(A(function(){return Promise.resolve(P.get(`https://ipfs.io/api/v0/dag/get/${e}`).then(e=>{t=e.data.data}).catch(e=>{throw new Error(e)})).then(function(){return t})},function(e){throw console.error(e),new Error("read trace data failed")}))}catch(e){return Promise.reject(e)}},this.utf8Encoder=new TextEncoder,this.utf8Decoder=new TextDecoder,this.createBlock=function(e){try{const t=[];return Promise.resolve(A(function(){return Promise.resolve(y.encode({value:{data:e},hasher:d,codec:h})).then(function(e){return t.push(e),{blocks:t,roots:[e.cid]}})},function(e){throw console.error(e),new Error("IPLD block creation failed")}))}catch(e){return Promise.reject(e)}},this.write=function(t,r,n){try{return Promise.resolve(A(function(){e.existsSync("./cars")||e.mkdirSync("./cars");const{writer:i,out:o}=v.create(t);p.from(o).pipe(e.createWriteStream(`cars/${n}.car`));const s=j(r,function(e){return Promise.resolve(i.put(e)).then(function(){return Promise.resolve(i.close()).then(function(){})})});return s&&s.then?s.then(function(){return o}):o},function(e){throw console.error(e),new Error("Writing IPLD block failed")}))}catch(e){return Promise.reject(e)}},this.readCar=function(t){try{const r={[m.code]:m,[f.code]:f,[h.code]:h},n={[d.code]:d};return Promise.resolve(A(function(){const i=e.createReadStream(t);return Promise.resolve(l.fromIterable(i)).then(function(e){function t(){return{blockCid:s,data:o}}const i=[];let o,s;const u=function(e,t,r){if("function"==typeof e[E]){var n=new S,i=e[E]();return i.next().then(s).then(void 0,a),n;function o(e){if(r&&r())return M(n,1,i.return?i.return().then(function(){return e}):e);i.next().then(s).then(void 0,a)}function s(e){e.done?M(n,1):Promise.resolve(t(e.value)).then(o).then(void 0,a)}function a(e){M(n,2,i.return?i.return().then(function(){return e}):e)}}return Promise.resolve(j(e,function(e){return Promise.resolve(e).then(t)},r))}(e.blocks(),function(e){let{cid:t,bytes:u}=e;return Promise.resolve(y.create({cid:t,bytes:u,codec:r[t.code],hasher:n[t.multihash.code]})).then(function(e){i.push(e);const r=e.value instanceof Uint8Array?a.utf8Decoder.decode(e.value):e.value,n=JSON.parse(JSON.stringify(r.data));o=n,s=t.toString()})});return u&&u.then?u.then(t):t()})},function(e){throw console.error(e),new Error("Read Car File Failed")}))}catch(e){return Promise.reject(e)}},this.updatPreviousBlockCid=(e,t)=>{try{let r=e;return r.previousBlockCid=t,r}catch(e){throw console.error(e),new Error("Failed to update previous block ID")}},this.updateCar1=function(e,t,r){try{let n;return Promise.resolve(A(function(){const i=s.updatPreviousBlockCid(e,r);return Promise.resolve(s.createBlock(i)).then(function(e){let{blocks:r,roots:i}=e;return Promise.resolve(s.write(i,r,t)).then(function(){return Promise.resolve(s.uploadCarToIPFS(t)).then(function(e){return n=e,n})})})},function(e){throw console.error(e),new Error("Car File Update Failed")}))}catch(e){return Promise.reject(e)}},this.writeCar=function(e,t){try{let r;return Promise.resolve(A(function(){return Promise.resolve(i.createBlock(e)).then(function(e){let{blocks:n,roots:o}=e;return Promise.resolve(i.write(o,n,t)).then(function(){return Promise.resolve(i.uploadCarToIPFS(t)).then(function(e){return r=e,{message:"ok",cid:r}})})})},function(e){console.error(e)}))}catch(e){return Promise.reject(e)}},this.buff2Hex=e=>"0x"+e.toString("hex"),this.getMerkelTree=function(e){try{try{const t=e.map(e=>n.buff2Hex(o(e))),r=new g(t,o,{sortPairs:!0}),i=n.buff2Hex(r.getRoot());return Promise.resolve({tree:r,root:i})}catch(e){throw console.error(e),new Error("getMerkelTree Failed")}}catch(e){return Promise.reject(e)}},this.getleave=e=>this.buff2Hex(o(e)),this.verifyMerkelProof=function(e,t,n){try{return Promise.resolve(A(function(){return Promise.resolve(r.getMerkelTree(n)).then(function(n){let{tree:i,root:o}=n;const s=r.getleave(t);return i.verify(e,s,o)})},function(e){throw console.error(e),new Error("merkel Proof Verification failed")}))}catch(e){return Promise.reject(e)}},this.createProof=function(e,r){try{return Promise.resolve(A(function(){const n=t.getleave(e);return Promise.resolve(t.getMerkelProof1(n,r))},function(e){console.error(e)}))}catch(e){return Promise.reject(e)}}}readCid(e){try{return Promise.resolve(this.invoke(`storage/readData/${e}`))}catch(e){return Promise.reject(e)}}readCarData(e){try{return Promise.resolve(this.invoke(`storage/createCar/${e}`))}catch(e){return Promise.reject(e)}}createCar(e,t){try{return Promise.resolve(this.invoke(`storage/createCar/${t}`,{method:"POST",body:JSON.stringify(e)}))}catch(e){return Promise.reject(e)}}uploadCar(e){try{return Promise.resolve(this.invoke(`storage/uploadCar/${e}`,{method:"POST"}))}catch(e){return Promise.reject(e)}}updateCar(e,t){try{return Promise.resolve(this.invoke(`storage/createCar/${t}`,{method:"PUT",body:JSON.stringify(e)}))}catch(e){return Promise.reject(e)}}getMerkelProof(e,t){try{return Promise.resolve(this.invoke(`storage/getMerkelProof/${e}/${t}`,{method:"GET"}))}catch(e){return Promise.reject(e)}}getMerkelProof1(e,t){try{const r=this;return Promise.resolve(A(function(){return Promise.resolve(r.getMerkelTree(t)).then(function(t){let{tree:r}=t;return r.getHexProof(e)})},function(e){throw console.error(e),new Error("Failed to get merkel proof")}))}catch(e){return Promise.reject(e)}}encryptData(e,t){try{const r=b.AES.encrypt(JSON.stringify(e),t).toString();return Promise.resolve(r)}catch(e){return Promise.reject(e)}}decryptData(e,t){try{return Promise.resolve(this.readData(e)).then(function(e){const r=b.AES.decrypt(e.encryptedData,t);return JSON.parse(r.toString(b.enc.Utf8))})}catch(e){return Promise.reject(e)}}}function D(e,t){try{var r=e()}catch(e){return t(e)}return r&&r.then?r.then(void 0,t):r}class I extends C{constructor(){super(...arguments),this.rootFromPath="../circuit",this.rootToPath="sdk/circuit/root.zok"}randomNumber(e){try{try{let t=[];for(let r=0;r<4;r++){const r=a(e,{entropy:!0});t.push(Math.abs(r.int32()).toString())}return Promise.resolve(t)}catch(e){console.error(e)}return Promise.resolve()}catch(e){return Promise.reject(e)}}getNullifier(e){try{try{const t=a(e,{entropy:!1});return Promise.resolve(Math.abs(t.int32()))}catch(e){console.error(e)}return Promise.resolve()}catch(e){return Promise.reject(e)}}fileSystemResolver(e,i){try{try{const o=r(n(r(e)),i),s=t(o).toString();return Promise.resolve(s)}catch(e){console.error(e)}return Promise.resolve()}catch(e){return Promise.reject(e)}}getSource(e,t){try{const r=this;return Promise.resolve(D(function(){return Promise.resolve(r.fileSystemResolver(e,t))},function(e){console.error(e)}))}catch(e){return Promise.reject(e)}}getZokrateProvider(){try{return Promise.resolve(D(i,function(e){console.error(e)}))}catch(e){return Promise.reject(e)}}getArtifacts(e){try{const t=this;return Promise.resolve(D(function(){return Promise.resolve(t.getZokrateProvider()).then(function(t){return t.compile(e)})},function(e){console.error(e)}))}catch(e){return Promise.reject(e)}}getPreImage(e){try{const t=this;return Promise.resolve(D(function(){return Promise.resolve(t.getZokrateProvider()).then(function(r){return Promise.resolve(t.getSource("../circuit","sdk/circuit/preImage.zok")).then(function(n){return Promise.resolve(t.getArtifacts(n)).then(function(t){const{output:n}=r.computeWitness(t,e);return JSON.parse(n)})})})},function(e){throw console.error(e),new Error("ZK preImage Error")}))}catch(e){return Promise.reject(e)}}generateZkProof(e){try{const t=this;return Promise.resolve(D(function(){const r=s.utils.defaultAbiCoder;return Promise.resolve(t.getProvider()).then(function(n){const i=parseInt(Math.round((new Date).getTime()/1e3).toString());return Promise.resolve(t.randomNumber(e)).then(function(s){return Promise.resolve(t.getNullifier(e)).then(function(a){return Promise.resolve(t.getZokrateProvider()).then(function(u){return Promise.resolve(t.getSource(t.rootFromPath,t.rootToPath)).then(function(c){return Promise.resolve(t.getArtifacts(c)).then(function(c){return Promise.resolve(t.getPreImage(s)).then(function(l){return Promise.resolve(n.getBlockNumber()).then(function(n){const p=t.buff2Hex(o(r.encode(["uint","uint","uint","string"],[a,i,n,e]))),y=[...s,...l],{witness:d}=u.computeWitness(c,y),m=u.setup(c.program),f=u.generateProof(c.program,d,m.pk),h=m.vk;return{message:"ok",details:{proofBuffer:JSON.stringify(f),verifierKeyBuffer:JSON.stringify(h),nullifier:p}}})})})})})})})})},function(e){throw console.error(e),new Error("generate zk proof error")}))}catch(e){return Promise.reject(e)}}verifyZkProof(e){try{const t=this;return Promise.resolve(D(function(){const r=e.verifierKeyBuffer,n=JSON.parse(e.proofBuffer),i=JSON.parse(r);return Promise.resolve(t.getZokrateProvider()).then(function(e){const t=e.verify(i,n);return t?{message:"Ok",isVerified:t}:{message:"invalid Proof Provided",isVerified:t}})},function(e){throw console.error(e),new Error("Verify Zk Proof error")}))}catch(e){return Promise.reject(e)}}}const F=[{inputs:[{internalType:"address",name:"_traceHub",type:"address"},{internalType:"address",name:"_traceAgreementImplementation",type:"address"}],stateMutability:"nonpayable",type:"constructor"},{anonymous:!1,inputs:[{indexed:!0,internalType:"uint256",name:"time",type:"uint256"},{indexed:!0,internalType:"address",name:"agreementAddress",type:"address"},{indexed:!0,internalType:"uint256",name:"id",type:"uint256"}],name:"AgreementCreated",type:"event"},{inputs:[{internalType:"address",name:"agreementAddress",type:"address"}],name:"getAgreementDetais",outputs:[{components:[{internalType:"bytes32",name:"verifierRoot",type:"bytes32"},{internalType:"bytes32[]",name:"nullifiers",type:"bytes32[]"},{internalType:"string",name:"agreementUri",type:"string"},{internalType:"uint256",name:"agreementId",type:"uint256"}],internalType:"struct TraceAgreementFactory.TraceAgreementDetails",name:"",type:"tuple"}],stateMutability:"view",type:"function"},{inputs:[],name:"getFactoryAddress",outputs:[{internalType:"address",name:"",type:"address"}],stateMutability:"view",type:"function"},{inputs:[{internalType:"address",name:"agreementAddress",type:"address"}],name:"getId",outputs:[{internalType:"uint256",name:"",type:"uint256"}],stateMutability:"view",type:"function"},{inputs:[{internalType:"uint256",name:"id",type:"uint256"}],name:"getTraceAddress",outputs:[{internalType:"address",name:"",type:"address"}],stateMutability:"view",type:"function"},{inputs:[{internalType:"bytes32",name:"_verifierRoot",type:"bytes32"},{internalType:"bytes32[]",name:"_nullifiers",type:"bytes32[]"},{internalType:"string",name:"agreementUri",type:"string"},{internalType:"address",name:"_traceAgreement",type:"address"},{internalType:"string",name:"enKey",type:"string"}],name:"initilizeAgreement",outputs:[],stateMutability:"nonpayable",type:"function"},{inputs:[{internalType:"address",name:"traceAdmin",type:"address"},{internalType:"address",name:"_supplier",type:"address"},{internalType:"uint256",name:"dataAvailiblity",type:"uint256"}],name:"newTraceAgreement",outputs:[{internalType:"address",name:"",type:"address"},{internalType:"uint256",name:"",type:"uint256"}],stateMutability:"nonpayable",type:"function"},{inputs:[],name:"traceHub",outputs:[{internalType:"address",name:"",type:"address"}],stateMutability:"view",type:"function"}],U=[{inputs:[{internalType:"address",name:"hubAdmin",type:"address"}],stateMutability:"nonpayable",type:"constructor"},{anonymous:!1,inputs:[{indexed:!0,internalType:"address",name:"newDefaultAdmin",type:"address"}],name:"DeafultAdminChanged",type:"event"},{anonymous:!1,inputs:[{indexed:!0,internalType:"bool",name:"accepted",type:"bool"}],name:"ProposalAccepted",type:"event"},{anonymous:!1,inputs:[{indexed:!0,internalType:"bytes32",name:"role",type:"bytes32"},{indexed:!0,internalType:"bytes32",name:"previousAdminRole",type:"bytes32"},{indexed:!0,internalType:"bytes32",name:"newAdminRole",type:"bytes32"}],name:"RoleAdminChanged",type:"event"},{anonymous:!1,inputs:[{indexed:!0,internalType:"address",name:"hubAdmin",type:"address"}],name:"RoleGranted",type:"event"},{anonymous:!1,inputs:[{indexed:!0,internalType:"bytes32",name:"role",type:"bytes32"},{indexed:!0,internalType:"address",name:"account",type:"address"},{indexed:!0,internalType:"address",name:"sender",type:"address"}],name:"RoleGranted",type:"event"},{anonymous:!1,inputs:[{indexed:!0,internalType:"address",name:"hubAdmin",type:"address"}],name:"RoleRevoked",type:"event"},{anonymous:!1,inputs:[{indexed:!0,internalType:"bytes32",name:"role",type:"bytes32"},{indexed:!0,internalType:"address",name:"account",type:"address"},{indexed:!0,internalType:"address",name:"sender",type:"address"}],name:"RoleRevoked",type:"event"},{inputs:[],name:"DEFAULT_ADMIN_ROLE",outputs:[{internalType:"bytes32",name:"",type:"bytes32"}],stateMutability:"view",type:"function"},{inputs:[],name:"HUB_ADMIN",outputs:[{internalType:"bytes32",name:"",type:"bytes32"}],stateMutability:"view",type:"function"},{inputs:[{internalType:"address",name:"traceAddress",type:"address"}],name:"acceptProposal",outputs:[],stateMutability:"nonpayable",type:"function"},{inputs:[{internalType:"address",name:"_traceFactory",type:"address"}],name:"addFactory",outputs:[],stateMutability:"nonpayable",type:"function"},{inputs:[{internalType:"address",name:"newDeafultAdmin",type:"address"}],name:"changeDeafultAdmin",outputs:[],stateMutability:"nonpayable",type:"function"},{inputs:[{internalType:"address",name:"addr",type:"address"}],name:"checkDeafultAdmin",outputs:[{internalType:"bool",name:"",type:"bool"}],stateMutability:"view",type:"function"},{inputs:[{internalType:"address",name:"hubAdmin",type:"address"}],name:"checkHubAdmin",outputs:[{internalType:"bool",name:"",type:"bool"}],stateMutability:"view",type:"function"},{inputs:[{internalType:"address",name:"traceAddress",type:"address"},{internalType:"bytes32",name:"nullifier",type:"bytes32"}],name:"checkNullExist",outputs:[{internalType:"bool",name:"",type:"bool"}],stateMutability:"view",type:"function"},{inputs:[{internalType:"address",name:"_traceAgreement",type:"address"}],name:"checkNullLength",outputs:[{internalType:"uint256",name:"",type:"uint256"}],stateMutability:"view",type:"function"},{inputs:[{internalType:"address",name:"_traceAgreement",type:"address"},{internalType:"bytes32",name:"_nullifier",type:"bytes32"}],name:"checkNullifier",outputs:[{internalType:"bool",name:"",type:"bool"}],stateMutability:"view",type:"function"},{inputs:[{internalType:"address",name:"traceAddress",type:"address"}],name:"checkSupplierApproved",outputs:[{internalType:"bool",name:"",type:"bool"}],stateMutability:"view",type:"function"},{inputs:[{internalType:"address",name:"_traceAgreement",type:"address"}],name:"getAgreementDetails",outputs:[{internalType:"address",name:"",type:"address"},{internalType:"uint256",name:"",type:"uint256"},{internalType:"uint256",name:"",type:"uint256"}],stateMutability:"view",type:"function"},{inputs:[{internalType:"address",name:"_traceAgreement",type:"address"}],name:"getAgreementId",outputs:[{internalType:"uint256",name:"",type:"uint256"}],stateMutability:"view",type:"function"},{inputs:[],name:"getAgreementLog",outputs:[{components:[{internalType:"address",name:"traceAgreementContract",type:"address"},{internalType:"uint256",name:"id",type:"uint256"},{internalType:"uint256",name:"createdAt",type:"uint256"},{internalType:"string",name:"uri",type:"string"},{internalType:"bytes32[]",name:"nullifiers",type:"bytes32[]"},{internalType:"string",name:"encryptionKey",type:"string"}],internalType:"struct TraceHub.Agreement[]",name:"",type:"tuple[]"}],stateMutability:"view",type:"function"},{inputs:[{internalType:"address",name:"_traceAgreement",type:"address"}],name:"getAgreementUri",outputs:[{internalType:"string",name:"",type:"string"}],stateMutability:"view",type:"function"},{inputs:[{internalType:"address",name:"_traceAgreement",type:"address"}],name:"getEncryptionKey",outputs:[{internalType:"string",name:"",type:"string"}],stateMutability:"view",type:"function"},{inputs:[{internalType:"bytes32",name:"role",type:"bytes32"}],name:"getRoleAdmin",outputs:[{internalType:"bytes32",name:"",type:"bytes32"}],stateMutability:"view",type:"function"},{inputs:[{internalType:"uint256",name:"id",type:"uint256"}],name:"getTraceAddress",outputs:[{internalType:"address",name:"",type:"address"}],stateMutability:"view",type:"function"},{inputs:[{internalType:"address",name:"hubAdmin",type:"address"}],name:"grantAdminRole",outputs:[],stateMutability:"nonpayable",type:"function"},{inputs:[{internalType:"bytes32",name:"role",type:"bytes32"},{internalType:"address",name:"account",type:"address"}],name:"grantRole",outputs:[],stateMutability:"nonpayable",type:"function"},{inputs:[{internalType:"bytes32",name:"role",type:"bytes32"},{internalType:"address",name:"account",type:"address"}],name:"hasRole",outputs:[{internalType:"bool",name:"",type:"bool"}],stateMutability:"view",type:"function"},{inputs:[{internalType:"address",name:"traceAddress",type:"address"},{internalType:"bytes32",name:"nullifier",type:"bytes32"}],name:"initiateAgreement",outputs:[],stateMutability:"nonpayable",type:"function"},{inputs:[{internalType:"address",name:"addr",type:"address"}],name:"removeRole",outputs:[],stateMutability:"nonpayable",type:"function"},{inputs:[{internalType:"bytes32",name:"role",type:"bytes32"},{internalType:"address",name:"account",type:"address"}],name:"renounceRole",outputs:[],stateMutability:"nonpayable",type:"function"},{inputs:[{internalType:"bytes32",name:"role",type:"bytes32"},{internalType:"address",name:"account",type:"address"}],name:"revokeRole",outputs:[],stateMutability:"nonpayable",type:"function"},{inputs:[{internalType:"bytes4",name:"interfaceId",type:"bytes4"}],name:"supportsInterface",outputs:[{internalType:"bool",name:"",type:"bool"}],stateMutability:"view",type:"function"},{inputs:[{internalType:"address",name:"_traceAgreement",type:"address"},{internalType:"string",name:"agreementUri",type:"string"},{internalType:"bytes32[]",name:"_nullifiers",type:"bytes32[]"},{internalType:"uint256",name:"id",type:"uint256"},{internalType:"string",name:"enKey",type:"string"}],name:"updatAgreementLog",outputs:[],stateMutability:"nonpayable",type:"function"},{inputs:[{internalType:"address",name:"_traceAgreement",type:"address"},{internalType:"string",name:"agreementUri",type:"string"}],name:"updatAgreementUri",outputs:[],stateMutability:"nonpayable",type:"function"},{inputs:[{internalType:"address",name:"_traceAgreement",type:"address"},{internalType:"bytes32",name:"_nullifier",type:"bytes32"}],name:"updateNullifier",outputs:[{internalType:"bool",name:"",type:"bool"}],stateMutability:"nonpayable",type:"function"},{inputs:[{internalType:"address",name:"traceAddress",type:"address"},{internalType:"bytes32",name:"nullifier",type:"bytes32"}],name:"zkProof",outputs:[],stateMutability:"nonpayable",type:"function"}],_=[{anonymous:!1,inputs:[{indexed:!0,internalType:"uint256",name:"signCount",type:"uint256"},{indexed:!0,internalType:"bool",name:"verified",type:"bool"}],name:"Verified",type:"event"},{inputs:[],name:"activate",outputs:[{internalType:"bool",name:"",type:"bool"}],stateMutability:"nonpayable",type:"function"},{inputs:[{internalType:"address",name:"_traceAdmin",type:"address"},{internalType:"address",name:"_supplier",type:"address"},{internalType:"address",name:"_factoryAddress",type:"address"},{internalType:"address",name:"_traceHub",type:"address"},{internalType:"uint256",name:"_dataAvailibality",type:"uint256"}],name:"addTraceAdmin",outputs:[],stateMutability:"nonpayable",type:"function"},{inputs:[],name:"checkIsInitilized",outputs:[{internalType:"bool",name:"",type:"bool"}],stateMutability:"view",type:"function"},{inputs:[],name:"checkState",outputs:[{internalType:"uint256",name:"",type:"uint256"}],stateMutability:"view",type:"function"},{inputs:[],name:"getAgreementId",outputs:[{internalType:"uint256",name:"",type:"uint256"}],stateMutability:"view",type:"function"},{inputs:[],name:"getAgreementUri",outputs:[{internalType:"string",name:"",type:"string"}],stateMutability:"view",type:"function"},{inputs:[],name:"getDataAvailibality",outputs:[{internalType:"uint256",name:"",type:"uint256"}],stateMutability:"view",type:"function"},{inputs:[],name:"getEncryptionKey",outputs:[{internalType:"string",name:"",type:"string"}],stateMutability:"view",type:"function"},{inputs:[],name:"getSupplier",outputs:[{internalType:"address",name:"",type:"address"}],stateMutability:"view",type:"function"},{inputs:[],name:"getTraceAdmin",outputs:[{internalType:"address",name:"",type:"address"}],stateMutability:"view",type:"function"},{inputs:[{internalType:"bytes32",name:"_verifierRoot",type:"bytes32"},{internalType:"bytes32[]",name:"_nullifiers",type:"bytes32[]"},{internalType:"string",name:"_agreementUri",type:"string"},{internalType:"string",name:"enKey",type:"string"}],name:"initilize",outputs:[],stateMutability:"nonpayable",type:"function"},{inputs:[],name:"status",outputs:[{internalType:"enum TraceAgreement.AgreementStatus",name:"",type:"uint8"}],stateMutability:"view",type:"function"},{inputs:[],name:"traceHub",outputs:[{internalType:"address",name:"",type:"address"}],stateMutability:"view",type:"function"},{inputs:[{internalType:"string",name:"_agreementUri",type:"string"}],name:"updateAgreementUri",outputs:[{internalType:"bool",name:"",type:"bool"}],stateMutability:"nonpayable",type:"function"},{inputs:[{internalType:"bytes32[]",name:"_proof",type:"bytes32[]"},{internalType:"bytes32",name:"nullifier",type:"bytes32"},{internalType:"bytes32",name:"leaf",type:"bytes32"}],name:"verifyByOrder",outputs:[{internalType:"bool",name:"",type:"bool"}],stateMutability:"nonpayable",type:"function"}];function R(e,t){try{var r=e()}catch(e){return t(e)}return r&&r.then?r.then(void 0,t):r}function H(e,t,r){if(!e.s){if(r instanceof N){if(!r.s)return void(r.o=H.bind(null,e,t));1&t&&(t=r.s),r=r.v}if(r&&r.then)return void r.then(H.bind(null,e,t),H.bind(null,e,2));e.s=t,e.v=r;const n=e.o;n&&n(e)}}const N=/*#__PURE__*/function(){function e(){}return e.prototype.then=function(t,r){const n=new e,i=this.s;if(i){const e=1&i?t:r;if(e){try{H(n,1,e(this.v))}catch(e){H(n,2,e)}return n}return this}return this.o=function(e){try{const i=e.v;1&e.s?H(n,1,t?t(i):i):r?H(n,1,r(i)):H(n,2,i)}catch(e){H(n,2,e)}},n},e}();class O extends I{createTraceAgreement(e,t,r,n){try{const i=this;return Promise.resolve(R(function(){return Promise.resolve(i.getProvider()).then(function(o){const a=new s.Contract(i.getFactoryAddress(),F,n);let u=[];return Promise.resolve(a.newTraceAgreement(e,t,r)).then(function(e){return Promise.resolve(e.wait()).then(function(e){if(1==e.status){for(let t of e.events)u.push(t.event);return Promise.resolve(e.events[0].args.agreementAddress).then(function(t){return Promise.resolve(e.events[0].args.id).then(function(r){return{message:"ok",transactionHash:e.transactionHash,details:{agreementAddress:t,agreementId:r.toString()}}})})}console.log("Creation Failed")})})})},function(e){throw console.error(e),new Error("Create Trace Agreement failed")}))}catch(e){return Promise.reject(e)}}acceptProposal(e,t){try{const r=this;return Promise.resolve(R(function(){let n=[];const i=new s.Contract(r.getTraceHubAddress(),U,t);return Promise.resolve(i.acceptProposal(e,{gasLimit:21e4,maxFeePerGas:s.utils.parseUnits("80","gwei"),maxPriorityFeePerGas:s.utils.parseUnits("80","gwei")})).then(function(e){return Promise.resolve(e.wait()).then(function(e){if(1==e.status){for(let t of e.events)n.push(t.event);return Promise.resolve(e.events[0].args.accepted)}console.log("verification failed")})})},function(e){throw console.error(e),new Error("Accept proposal error")}))}catch(e){return Promise.reject(e)}}initilizeAgreement(e,t,r,n){try{const i=this;return Promise.resolve(R(function(){const a=[],u=s.utils.defaultAbiCoder;return Promise.resolve(i.getProvider()).then(function(c){const l=parseInt(Math.round((new Date).getTime()/1e3).toString());return Promise.resolve(c.getBlockNumber()).then(function(c){let p;const y=new s.Contract(t,_,n);return Promise.resolve(y.checkIsInitilized).then(function(n){return 1==n?(console.log("Trace Agreement already initilized"),void(p=1)):Promise.resolve(y.getDataAvailibality()).then(function(n){return Promise.resolve(i.getVerifiersDetails(e)).then(function(p){const d=p.details,m=i.buff2Hex(o(u.encode(["uint","uint"],[l,c]))),f=T(m,32)();let h;return"1"===n.toString()?h=f:"2"===n.toString()&&(h=""),h=f,Promise.resolve(i.encryptData({traceAddress:t,verifiersRoot:d.verifiersRoot,verifiers:e,txDetails:r,previousBlockCid:""},f)).then(function(r){return Promise.resolve(i.writeCar({encryptedData:r},t)).then(function(t){return Promise.resolve(y.initilize(d.verifiersRoot,d.nullifiers,t.cid,h,{gasLimit:21e6,maxFeePerGas:s.utils.parseUnits("80","gwei"),maxPriorityFeePerGas:s.utils.parseUnits("80","gwei")})).then(function(t){return Promise.resolve(t.wait()).then(function(t){if(1==t.status){for(let t=0;t<e.length;t++)a.push({verifier:e[t],nullifier:d.nullifiers[t]});return{message:"ok",transactionHash:t.transactionHash,verificationDetails:a,encryptionKey:f}}console.log("initilization failed")})})})})})})})})})},function(e){throw console.error(e),new Error(e)}))}catch(e){return Promise.reject(e)}}createZkProof(e,t){try{const r=this;return Promise.resolve(R(function(){return Promise.resolve(r.getProvider()).then(function(n){return Promise.resolve(r.generateZkProof(e)).then(function(n){const i=new s.Contract(r.getTraceHubAddress(),U,t);return Promise.resolve(i.checkSupplierApproved(e)).then(function(t){if(t)return Promise.resolve(i.zkProof(e,n.details.nullifier,{gasLimit:21e6,maxFeePerGas:s.utils.parseUnits("80","gwei"),maxPriorityFeePerGas:s.utils.parseUnits("80","gwei")})).then(function(e){return Promise.resolve(e.wait()).then(function(e){if(1==e.status)return n.details;console.log("verification failed")})});console.log("Supplier has not approved")})})})},function(e){throw console.error(e),new Error("create ZK proof error")}))}catch(e){return Promise.reject(e)}}activateTraceAgreement(e,t,r){try{const n=this;return Promise.resolve(R(function(){return Promise.resolve(n.getProvider()).then(function(i){const o=new s.Contract(n.getTraceHubAddress(),U,r);return Promise.resolve(o.checkNullExist(e,t.nullifier)).then(function(r){if(r)return Promise.resolve(n.verifyZkProof({proofBuffer:t.proofBuffer,verifierKeyBuffer:t.verifierKeyBuffer})).then(function(r){if("Ok"==r.message)return Promise.resolve(o.initiateAgreement(e,t.nullifier,{gasLimit:21e6,maxFeePerGas:s.utils.parseUnits("80","gwei"),maxPriorityFeePerGas:s.utils.parseUnits("80","gwei")})).then(function(e){return Promise.resolve(e.wait()).then(function(e){if(1==e.status)return{message:"ok"};console.log("failed to initiate")})});console.log("Invalid ZK Proof Provided")});console.log("Invalid Nullifier")})})},function(e){throw console.error(e),new Error("Trace agreement activation error")}))}catch(e){return Promise.reject(e)}}verifyByOrder(e,t,r,n){try{const i=this;return Promise.resolve(R(function(){let o;const a=new s.Contract(e,_,r);return Promise.resolve(a.getDataAvailibality()).then(function(e){let u;function c(e){return u?e:Promise.resolve(a.getAgreementUri()).then(function(e){return Promise.resolve(i.decryptData(e,o)).then(function(e){return Promise.resolve(i.createProof(r.address,e.verifiers)).then(function(e){const n=i.getleave(r.address);let o=[];return Promise.resolve(a.verifyByOrder(e,t,n,{gasLimit:21e4,maxFeePerGas:s.utils.parseUnits("80","gwei"),maxPriorityFeePerGas:s.utils.parseUnits("80","gwei")})).then(function(e){return Promise.resolve(e.wait()).then(function(e){if(1==e.status){for(let t of e.events)o.push(t.event);return Promise.resolve(e.events[0].args.signCount).then(function(t){return Promise.resolve(e.events[0].args.verified).then(function(e){return{message:"ok",details:{verifiedCount:t,verified:e}}})})}console.log("verification failed")})})})})})}const l=function(){if(2===e&&void 0===n)console.log("encryption key is not defined"),u=1;else{const t=function(){if(1===e)return Promise.resolve(a.getEncryptionKey()).then(function(e){o=e});o=n}();if(t&&t.then)return t.then(function(){})}}();return l&&l.then?l.then(c):c(l)})},function(e){throw console.error(e),new Error("ZKTrace Verification Error")}))}catch(e){return Promise.reject(e)}}getVerifiersDetails(e){try{const t=this;return Promise.resolve(R(function(){let r=[];const n=s.utils.defaultAbiCoder;return Promise.resolve(t.getMerkelTree(e)).then(function(i){let{root:s}=i;const a=parseInt(Math.round((new Date).getTime()/1e3).toString());return e.forEach(function(e){try{return Promise.resolve(t.getNullifier(e)).then(function(e){r.push(t.buff2Hex(o(n.encode(["uint","uint"],[e,a]))))})}catch(e){return Promise.reject(e)}}),{message:"ok",details:{verifiersRoot:s,nullifiers:r}}})},function(e){throw console.error(e),new Error("get verifier details error")}))}catch(e){return Promise.reject(e)}}getVerifiersProof(e){try{const t=this;return Promise.resolve(R(function(){const r=[],n=(i=e,o=function(n){return Promise.resolve(t.createProof(e[n],e)).then(function(t){const i=e[n];return Promise.resolve(t).then(function(e){r.push({verifier:i,merkelProof:e})})})},u=-1,function e(t){try{for(;++u<i.length;)if((t=o(u))&&t.then){if(!((r=t)instanceof N&&1&r.s))return void t.then(e,a||(a=H.bind(null,s=new N,2)));t=t.v}s?H(s,1,t):s=t}catch(e){H(s||(s=new N),2,e)}var r}(),s);var i,o,s,a,u;return n&&n.then?n.then(function(){return r}):r},function(e){throw console.error(e),new Error("get verifier proof error")}))}catch(e){return Promise.reject(e)}}encryptionDetails(e){try{const t=this;return Promise.resolve(R(function(){return Promise.resolve(t.getProvider()).then(function(t){const r=new s.Contract(e,_,t);return Promise.resolve(r.getEncryptionKey()).then(function(e){return Promise.resolve(r.getAgreementUri()).then(function(t){return{encryptionKey:e,cid:t}})})})},function(e){console.error(e)}))}catch(e){return Promise.reject(e)}}}class K extends O{}var B;B=K,[O].forEach(e=>{Object.getOwnPropertyNames(e.prototype).forEach(t=>{Object.defineProperty(B.prototype,t,Object.getOwnPropertyDescriptor(e.prototype,t)||Object.create(null))})});export{K as default};
