import*as e from"fs";import{readFileSync as t}from"fs";import{resolve as n,dirname as a}from"path";import{initialize as r}from"zokrates-js";import i from"keccak256";import{ethers as s}from"ethers";import o from"seedrandom";import p from"isomorphic-unfetch";import{Web3Storage as y}from"web3.storage";import{CarReader as u}from"@ipld/car/reader";import{Readable as d}from"readable-stream";import*as l from"multiformats/block";import{sha256 as c}from"multiformats/hashes/sha2";import*as m from"multiformats/codecs/raw";import*as f from"@ipld/dag-json";import*as b from"@ipld/dag-cbor";import{CarWriter as h}from"@ipld/car/writer";import{MerkleTree as w}from"merkletreejs";import g from"axios";function T(e){function t(e){if(Object(e)!==e)return Promise.reject(new TypeError(e+" is not an object."));var t=e.done;return Promise.resolve(e.value).then(function(e){return{value:e,done:t}})}return T=function(e){this.s=e,this.n=e.next},T.prototype={s:null,n:null,next:function(){return t(this.n.apply(this.s,arguments))},return:function(e){var n=this.s.return;return void 0===n?Promise.resolve({value:e,done:!0}):t(n.apply(this.s,arguments))},throw:function(e){var n=this.s.return;return void 0===n?Promise.reject(e):t(n.apply(this.s,arguments))}},new T(e)}function v(){return v=Object.assign?Object.assign.bind():function(e){for(var t=1;t<arguments.length;t++){var n=arguments[t];for(var a in n)Object.prototype.hasOwnProperty.call(n,a)&&(e[a]=n[a])}return e},v.apply(this,arguments)}class A{constructor(e){this.nodeEndpoint=void 0,this.web3storageApiKey=void 0,this.factoryAddress=void 0,this.apikey=void 0,this.baseUrl=void 0,this.traceHubAddress=void 0,this.nodeEndpoint=e.nodeEndpoint||"http://127.0.0.1:8545",this.baseUrl=e.baseUri||"http://localhost:5000/",this.apikey=e.apikey,this.web3storageApiKey=e.web3storageApiKey,this.factoryAddress=e.factoryAddress||"0x610178da211fef7d417bc0e6fed39f05609ad788",this.traceHubAddress=e.traceHubAddress||"0x8A791620dd6260079BF849Dc5567aDC3F2FdC318"}invoke(e,t){const n=`${this.baseUrl}${e}`,a=v({},t,{headers:{"content-type":"application/json",apiKey:this.apikey}});return p(n,a).then(e=>{if(200===e.status)return e.json();throw new Error("call failed")})}getWeb3StorageKey(){return this.web3storageApiKey}async getProvider(){return new s.providers.JsonRpcProvider(this.nodeEndpoint)}getFactoryAddress(){return this.factoryAddress}getTraceHubAddress(){return this.traceHubAddress}}class k extends A{constructor(...t){var n;super(...t),n=this,this.initilizeWeb3Storage=async function(){return new y({token:await n.getWeb3StorageKey()})},this.uploadCarToIPFS=async function(t){try{const a=await n.initilizeWeb3Storage(),r=e.createReadStream(`./cars/${t}.car`),i=await u.fromIterable(r);return await a.putCar(i,{name:`${t}.car`,decoders:[b]})}catch(e){throw new Error(e)}},this.readData=async function(e){let t;try{return await g.get(`https://ipfs.io/api/v0/dag/get/${e}`).then(e=>{t=e.data.data}).catch(e=>{throw new Error(e)}),t}catch(e){throw new Error(e)}},this.utf8Encoder=new TextEncoder,this.utf8Decoder=new TextDecoder,this.createBlock=async function(e){const t=[];try{const n=await l.encode({value:{data:e},hasher:c,codec:b});return t.push(n),{blocks:t,roots:[n.cid]}}catch(e){throw new Error(e)}},this.write=async function(t,n,a){try{e.existsSync("./cars")||e.mkdirSync("./cars");const{writer:r,out:i}=h.create(t);d.from(i).pipe(e.createWriteStream(`cars/${a}.car`));for(const e of n)await r.put(e),await r.close();return i}catch(e){throw new Error(e)}},this.readCar=async function(t){const a={[m.code]:m,[f.code]:f,[b.code]:b},r={[c.code]:c};try{const d=e.createReadStream(t),c=await u.fromIterable(d),m=(await c.getRoots(),[]);let f,b;var i,s=!1,o=!1;try{for(var p,y=function(e){var t,n,a,r=2;for("undefined"!=typeof Symbol&&(n=Symbol.asyncIterator,a=Symbol.iterator);r--;){if(n&&null!=(t=e[n]))return t.call(e);if(a&&null!=(t=e[a]))return new T(t.call(e));n="@@asyncIterator",a="@@iterator"}throw new TypeError("Object is not async iterable")}(c.blocks());s=!(p=await y.next()).done;s=!1){const{cid:e,bytes:t}=p.value;{const i=await l.create({cid:e,bytes:t,codec:a[e.code],hasher:r[e.multihash.code]});m.push(i);const s=i.value instanceof Uint8Array?n.utf8Decoder.decode(i.value):i.value;f=JSON.parse(JSON.stringify(s.data)),b=e.toString()}}}catch(e){o=!0,i=e}finally{try{s&&null!=y.return&&await y.return()}finally{if(o)throw i}}return{blockCid:b,data:f}}catch(e){throw new Error(e)}},this.updatPreviousBlockCid=(e,t)=>{let n=e;return n.previousBlockCid=t,n},this.updateCar1=async function(e,t,a){let r;try{const i=n.updatPreviousBlockCid(e,a),{blocks:s,roots:o}=await n.createBlock(i);return await n.write(o,s,t),r=await n.uploadCarToIPFS(t),r}catch(e){throw new Error(e)}},this.writeCar=async function(e,t){let a;try{const{blocks:r,roots:i}=await n.createBlock(e);return await n.write(i,r,t),a=await n.uploadCarToIPFS(t),{message:"ok",cid:a}}catch(e){throw new Error(e)}},this.buff2Hex=e=>"0x"+e.toString("hex"),this.getMerkelTree=async function(e){try{const t=e.map(e=>n.buff2Hex(i(e))),a=new w(t,i,{sortPairs:!0}),r=n.buff2Hex(a.getRoot());return{tree:a,root:r}}catch(e){throw new Error(e)}},this.getleave=e=>this.buff2Hex(i(e)),this.verifyMerkelProof=async function(e,t,a){try{const{tree:r,root:i}=await n.getMerkelTree(a),s=n.getleave(t);return r.verify(e,s,i)}catch(e){throw new Error(e)}},this.createProof=async function(e,t){try{const a=n.getleave(e);return await n.getMerkelProof1(a,t)}catch(e){throw new Error(e)}}}async readCid(e){return this.invoke(`storage/readData/${e}`)}async readCarData(e){return this.invoke(`storage/createCar/${e}`)}async createCar(e,t){return this.invoke(`storage/createCar/${t}`,{method:"POST",body:JSON.stringify(e)})}async uploadCar(e){return this.invoke(`storage/uploadCar/${e}`,{method:"POST"})}async updateCar(e,t){return this.invoke(`storage/createCar/${t}`,{method:"PUT",body:JSON.stringify(e)})}async getMerkelProof(e,t){return this.invoke(`storage/getMerkelProof/${e}/${t}`,{method:"GET"})}async getMerkelProof1(e,t){try{const{tree:n}=await this.getMerkelTree(t);return n.getHexProof(e)}catch(e){throw new Error(e)}}}class P extends k{constructor(...e){super(...e),this.rootFromPath="../circuit",this.rootToPath="sdk/circuit/root.zok"}async randomNumber(e){let t=[];for(let n=0;n<4;n++){const n=o(e,{entropy:!0});t.push(Math.abs(n.int32()).toString())}return t}async getNullifier(e){const t=o(e,{entropy:!1});return Math.abs(t.int32())}async fileSystemResolver(e,r){const i=n(a(n(e)),r);return t(i).toString()}async getSource(e,t){return await this.fileSystemResolver(e,t)}async getZokrateProvider(){return await r()}async getArtifacts(e){return(await this.getZokrateProvider()).compile(e)}async getPreImage(e){try{const t=await this.getZokrateProvider(),n=await this.getSource("../circuit","sdk/circuit/preImage.zok"),a=await this.getArtifacts(n),{output:r}=t.computeWitness(a,e);return JSON.parse(r)}catch(e){console.log(e)}}async generateZkProof(e){try{const t=s.utils.defaultAbiCoder,n=await this.getProvider(),a=parseInt(Math.round((new Date).getTime()/1e3).toString()),r=await this.randomNumber(e),o=await this.getNullifier(e),p=await this.getZokrateProvider(),y=await this.getSource(this.rootFromPath,this.rootToPath),u=await this.getArtifacts(y),d=await this.getPreImage(r),l=await n.getBlockNumber(),c=this.buff2Hex(i(t.encode(["uint","uint","uint","string"],[o,a,l,e]))),m=[...r,...d],{witness:f}=p.computeWitness(u,m),b=p.setup(u.program),h=p.generateProof(u.program,f,b.pk),w=b.vk;return{message:"ok",details:{proofBuffer:JSON.stringify(h),verifierKeyBuffer:JSON.stringify(w),nullifier:c}}}catch(e){throw new Error(e)}}async verifyZkProof(e){const t=e.verifierKeyBuffer,n=JSON.parse(e.proofBuffer),a=JSON.parse(t);try{const e=(await this.getZokrateProvider()).verify(a,n);return e?{message:"Ok",isVerified:e}:{message:"invalid Proof Provided",isVerified:e}}catch(e){throw new Error(e)}}async verifyZkProof1(e){return this.invoke("zk/verifyProof",{method:"POST",body:JSON.stringify(e)})}}const M=[{inputs:[{internalType:"address",name:"_traceHub",type:"address"},{internalType:"address",name:"_traceAgreementImplementation",type:"address"}],stateMutability:"nonpayable",type:"constructor"},{anonymous:!1,inputs:[{indexed:!0,internalType:"uint256",name:"time",type:"uint256"},{indexed:!0,internalType:"address",name:"agreementAddress",type:"address"},{indexed:!0,internalType:"uint256",name:"id",type:"uint256"}],name:"AgreementCreated",type:"event"},{inputs:[{internalType:"address",name:"agreementAddress",type:"address"}],name:"getAgreementDetais",outputs:[{components:[{internalType:"bytes32",name:"verifierRoot",type:"bytes32"},{internalType:"bytes32[]",name:"nullifiers",type:"bytes32[]"},{internalType:"string",name:"agreementUri",type:"string"},{internalType:"uint256",name:"agreementId",type:"uint256"}],internalType:"struct TraceAgreementFactory.TraceAgreementDetails",name:"",type:"tuple"}],stateMutability:"view",type:"function"},{inputs:[],name:"getFactoryAddress",outputs:[{internalType:"address",name:"",type:"address"}],stateMutability:"view",type:"function"},{inputs:[{internalType:"address",name:"agreementAddress",type:"address"}],name:"getId",outputs:[{internalType:"uint256",name:"",type:"uint256"}],stateMutability:"view",type:"function"},{inputs:[{internalType:"uint256",name:"id",type:"uint256"}],name:"getTraceAddress",outputs:[{internalType:"address",name:"",type:"address"}],stateMutability:"view",type:"function"},{inputs:[{internalType:"bytes32",name:"_verifierRoot",type:"bytes32"},{internalType:"bytes32[]",name:"_nullifiers",type:"bytes32[]"},{internalType:"string",name:"agreementUri",type:"string"},{internalType:"address",name:"_traceAgreement",type:"address"}],name:"initilizeAgreement",outputs:[],stateMutability:"nonpayable",type:"function"},{inputs:[{internalType:"address",name:"traceAdmin",type:"address"},{internalType:"address",name:"_supplier",type:"address"}],name:"newTraceAgreement",outputs:[{internalType:"address",name:"",type:"address"},{internalType:"uint256",name:"",type:"uint256"}],stateMutability:"nonpayable",type:"function"},{inputs:[],name:"traceHub",outputs:[{internalType:"address",name:"",type:"address"}],stateMutability:"view",type:"function"}],x=[{inputs:[{internalType:"address",name:"hubAdmin",type:"address"}],stateMutability:"nonpayable",type:"constructor"},{anonymous:!1,inputs:[{indexed:!0,internalType:"address",name:"newDefaultAdmin",type:"address"}],name:"DeafultAdminChanged",type:"event"},{anonymous:!1,inputs:[{indexed:!0,internalType:"bool",name:"accepted",type:"bool"}],name:"ProposalAccepted",type:"event"},{anonymous:!1,inputs:[{indexed:!0,internalType:"bytes32",name:"role",type:"bytes32"},{indexed:!0,internalType:"bytes32",name:"previousAdminRole",type:"bytes32"},{indexed:!0,internalType:"bytes32",name:"newAdminRole",type:"bytes32"}],name:"RoleAdminChanged",type:"event"},{anonymous:!1,inputs:[{indexed:!0,internalType:"address",name:"hubAdmin",type:"address"}],name:"RoleGranted",type:"event"},{anonymous:!1,inputs:[{indexed:!0,internalType:"bytes32",name:"role",type:"bytes32"},{indexed:!0,internalType:"address",name:"account",type:"address"},{indexed:!0,internalType:"address",name:"sender",type:"address"}],name:"RoleGranted",type:"event"},{anonymous:!1,inputs:[{indexed:!0,internalType:"address",name:"hubAdmin",type:"address"}],name:"RoleRevoked",type:"event"},{anonymous:!1,inputs:[{indexed:!0,internalType:"bytes32",name:"role",type:"bytes32"},{indexed:!0,internalType:"address",name:"account",type:"address"},{indexed:!0,internalType:"address",name:"sender",type:"address"}],name:"RoleRevoked",type:"event"},{inputs:[],name:"DEFAULT_ADMIN_ROLE",outputs:[{internalType:"bytes32",name:"",type:"bytes32"}],stateMutability:"view",type:"function"},{inputs:[],name:"HUB_ADMIN",outputs:[{internalType:"bytes32",name:"",type:"bytes32"}],stateMutability:"view",type:"function"},{inputs:[{internalType:"address",name:"traceAddress",type:"address"}],name:"acceptProposal",outputs:[],stateMutability:"nonpayable",type:"function"},{inputs:[{internalType:"address",name:"_traceFactory",type:"address"}],name:"addFactory",outputs:[],stateMutability:"nonpayable",type:"function"},{inputs:[{internalType:"address",name:"newDeafultAdmin",type:"address"}],name:"changeDeafultAdmin",outputs:[],stateMutability:"nonpayable",type:"function"},{inputs:[{internalType:"address",name:"addr",type:"address"}],name:"checkDeafultAdmin",outputs:[{internalType:"bool",name:"",type:"bool"}],stateMutability:"view",type:"function"},{inputs:[{internalType:"address",name:"hubAdmin",type:"address"}],name:"checkHubAdmin",outputs:[{internalType:"bool",name:"",type:"bool"}],stateMutability:"view",type:"function"},{inputs:[{internalType:"address",name:"traceAddress",type:"address"},{internalType:"bytes32",name:"nullifier",type:"bytes32"}],name:"checkNullExist",outputs:[{internalType:"bool",name:"",type:"bool"}],stateMutability:"view",type:"function"},{inputs:[{internalType:"address",name:"_traceAgreement",type:"address"}],name:"checkNullLength",outputs:[{internalType:"uint256",name:"",type:"uint256"}],stateMutability:"view",type:"function"},{inputs:[{internalType:"address",name:"_traceAgreement",type:"address"},{internalType:"bytes32",name:"_nullifier",type:"bytes32"}],name:"checkNullifier",outputs:[{internalType:"bool",name:"",type:"bool"},{internalType:"uint256",name:"",type:"uint256"}],stateMutability:"view",type:"function"},{inputs:[{internalType:"address",name:"traceAddress",type:"address"}],name:"checkSupplierApproved",outputs:[{internalType:"bool",name:"",type:"bool"}],stateMutability:"view",type:"function"},{inputs:[{internalType:"address",name:"_traceAgreement",type:"address"}],name:"getAgreementDetails",outputs:[{internalType:"address",name:"",type:"address"},{internalType:"uint256",name:"",type:"uint256"},{internalType:"uint256",name:"",type:"uint256"}],stateMutability:"view",type:"function"},{inputs:[{internalType:"address",name:"_traceAgreement",type:"address"}],name:"getAgreementId",outputs:[{internalType:"uint256",name:"",type:"uint256"}],stateMutability:"view",type:"function"},{inputs:[],name:"getAgreementLog",outputs:[{components:[{internalType:"address",name:"traceAgreementContract",type:"address"},{internalType:"uint256",name:"id",type:"uint256"},{internalType:"uint256",name:"createdAt",type:"uint256"},{internalType:"string",name:"uri",type:"string"},{internalType:"bytes32[]",name:"nullifiers",type:"bytes32[]"}],internalType:"struct TraceHub.Agreement[]",name:"",type:"tuple[]"}],stateMutability:"view",type:"function"},{inputs:[{internalType:"address",name:"_traceAgreement",type:"address"}],name:"getAgreementUri",outputs:[{internalType:"string",name:"",type:"string"}],stateMutability:"view",type:"function"},{inputs:[{internalType:"bytes32",name:"role",type:"bytes32"}],name:"getRoleAdmin",outputs:[{internalType:"bytes32",name:"",type:"bytes32"}],stateMutability:"view",type:"function"},{inputs:[{internalType:"uint256",name:"id",type:"uint256"}],name:"getTraceAddress",outputs:[{internalType:"address",name:"",type:"address"}],stateMutability:"view",type:"function"},{inputs:[{internalType:"address",name:"hubAdmin",type:"address"}],name:"grantAdminRole",outputs:[],stateMutability:"nonpayable",type:"function"},{inputs:[{internalType:"bytes32",name:"role",type:"bytes32"},{internalType:"address",name:"account",type:"address"}],name:"grantRole",outputs:[],stateMutability:"nonpayable",type:"function"},{inputs:[{internalType:"bytes32",name:"role",type:"bytes32"},{internalType:"address",name:"account",type:"address"}],name:"hasRole",outputs:[{internalType:"bool",name:"",type:"bool"}],stateMutability:"view",type:"function"},{inputs:[{internalType:"address",name:"traceAddress",type:"address"},{internalType:"bytes32",name:"nullifier",type:"bytes32"}],name:"initiateAgreement",outputs:[],stateMutability:"nonpayable",type:"function"},{inputs:[{internalType:"address",name:"addr",type:"address"}],name:"removeRole",outputs:[],stateMutability:"nonpayable",type:"function"},{inputs:[{internalType:"bytes32",name:"role",type:"bytes32"},{internalType:"address",name:"account",type:"address"}],name:"renounceRole",outputs:[],stateMutability:"nonpayable",type:"function"},{inputs:[{internalType:"bytes32",name:"role",type:"bytes32"},{internalType:"address",name:"account",type:"address"}],name:"revokeRole",outputs:[],stateMutability:"nonpayable",type:"function"},{inputs:[{internalType:"bytes4",name:"interfaceId",type:"bytes4"}],name:"supportsInterface",outputs:[{internalType:"bool",name:"",type:"bool"}],stateMutability:"view",type:"function"},{inputs:[{internalType:"address",name:"_traceAgreement",type:"address"},{internalType:"string",name:"agreementUri",type:"string"},{internalType:"bytes32[]",name:"_nullifiers",type:"bytes32[]"},{internalType:"uint256",name:"id",type:"uint256"}],name:"updatAgreementLog",outputs:[],stateMutability:"nonpayable",type:"function"},{inputs:[{internalType:"address",name:"_traceAgreement",type:"address"},{internalType:"string",name:"agreementUri",type:"string"}],name:"updatAgreementUri",outputs:[],stateMutability:"nonpayable",type:"function"},{inputs:[{internalType:"address",name:"_traceAgreement",type:"address"},{internalType:"bytes32",name:"_nullifier",type:"bytes32"}],name:"updateNullifier",outputs:[{internalType:"bool",name:"",type:"bool"}],stateMutability:"nonpayable",type:"function"},{inputs:[{internalType:"address",name:"traceAddress",type:"address"},{internalType:"bytes32",name:"nullifier",type:"bytes32"}],name:"zkProof",outputs:[],stateMutability:"nonpayable",type:"function"}],E=[{anonymous:!1,inputs:[{indexed:!0,internalType:"uint256",name:"signCount",type:"uint256"},{indexed:!0,internalType:"bool",name:"verified",type:"bool"}],name:"Verified",type:"event"},{inputs:[],name:"activate",outputs:[{internalType:"bool",name:"",type:"bool"}],stateMutability:"nonpayable",type:"function"},{inputs:[{internalType:"address",name:"_traceAdmin",type:"address"},{internalType:"address",name:"_supplier",type:"address"},{internalType:"address",name:"_factoryAddress",type:"address"},{internalType:"address",name:"_traceHub",type:"address"}],name:"addTraceAdmin",outputs:[],stateMutability:"nonpayable",type:"function"},{inputs:[],name:"checkState",outputs:[{internalType:"uint256",name:"",type:"uint256"}],stateMutability:"view",type:"function"},{inputs:[],name:"getAgreementId",outputs:[{internalType:"uint256",name:"",type:"uint256"}],stateMutability:"view",type:"function"},{inputs:[],name:"getSupplier",outputs:[{internalType:"address",name:"",type:"address"}],stateMutability:"view",type:"function"},{inputs:[],name:"getTraceAdmin",outputs:[{internalType:"address",name:"",type:"address"}],stateMutability:"view",type:"function"},{inputs:[{internalType:"bytes32",name:"_verifierRoot",type:"bytes32"},{internalType:"bytes32[]",name:"_nullifiers",type:"bytes32[]"},{internalType:"string",name:"agreementUri",type:"string"}],name:"initilize",outputs:[],stateMutability:"nonpayable",type:"function"},{inputs:[],name:"status",outputs:[{internalType:"enum TraceAgreement.AgreementStatus",name:"",type:"uint8"}],stateMutability:"view",type:"function"},{inputs:[],name:"traceHub",outputs:[{internalType:"address",name:"",type:"address"}],stateMutability:"view",type:"function"},{inputs:[{internalType:"bytes32[]",name:"_proof",type:"bytes32[]"},{internalType:"bytes32",name:"nullifier",type:"bytes32"}],name:"verifyByOrder",outputs:[{internalType:"bool",name:"",type:"bool"}],stateMutability:"nonpayable",type:"function"}];class S extends P{async createTraceAgreement(e,t,n){try{await this.getProvider();const a=new s.Contract(this.getFactoryAddress(),M,n);let r=[];const i=await a.newTraceAgreement(e,t),o=await i.wait();if(1!=o.status)throw new Error("Creation Failed");for(let e of o.events)r.push(e.event);const p=await o.events[0].args.agreementAddress,y=await o.events[0].args.id;return{message:"ok",transactionHash:o.transactionHash,details:{agreementAddress:p,agreementId:y.toString()}}}catch(e){throw new Error(e)}}async acceptProposal(e,t){try{let n=[];const a=new s.Contract(this.getTraceHubAddress(),x,t),r=await a.acceptProposal(e,{gasLimit:21e4,maxFeePerGas:s.utils.parseUnits("80","gwei"),maxPriorityFeePerGas:s.utils.parseUnits("80","gwei")}),i=await r.wait();if(1!=i.status)throw new Error("verification failed");for(let e of i.events)n.push(e.event);return await i.events[0].args.accepted}catch(e){throw new Error(e)}}async initilizeAgreement(e,t,n,a){try{const r=[],i=(await this.getProvider(),new s.Contract(t,E,a)),o=(await this.getVerifiersDetails(e)).details,p={traceAddress:t,verifiersRoot:o.verifiersRoot,verifiers:e,txDetails:n,previousBlockCid:""},y=await this.writeCar(p,t),u=await i.initilize(o.verifiersRoot,o.nullifiers,y.cid,{gasLimit:21e6,maxFeePerGas:s.utils.parseUnits("80","gwei"),maxPriorityFeePerGas:s.utils.parseUnits("80","gwei")}),d=await u.wait();if(1!=d.status)throw new Error("initilization failed");for(let t=0;t<e.length;t++){const n=await this.createProof(e[t],e),a={verifier:e[t],nullifier:o.nullifiers[t],merkelProof:await n};r.push(a)}return{message:"ok",transactionHash:d.transactionHash,verificationDetails:r}}catch(e){throw console.log(e),new Error(e)}}async getVerifiersProof(e){const t=[];for(let n=0;n<e.length;n++){const a=await this.createProof(e[n],e),r={verifier:e[n],merkelProof:await a};t.push(r)}return t}async verifyByOrder(e,t,n,a){try{await this.getProvider();const r=new s.Contract(e,E,a);let i=[];const o=await r.verifyByOrder(t,n,{gasLimit:21e4,maxFeePerGas:s.utils.parseUnits("80","gwei"),maxPriorityFeePerGas:s.utils.parseUnits("80","gwei")}),p=await o.wait();if(1!=p.status)throw new Error("verification failed");for(let e of p.events)i.push(e.event);return{message:"ok",details:{verifiedCount:await p.events[0].args.signCount,verified:await p.events[0].args.verified}}}catch(e){throw new Error(e)}}async createZkProof(e,t){try{await this.getProvider();const n=await this.generateZkProof(e),a=new s.Contract(this.getTraceHubAddress(),x,t);if(!await a.checkSupplierApproved(e))throw new Error("Supplier has not approved");const r=await a.zkProof(e,n.details.nullifier,{gasLimit:21e6,maxFeePerGas:s.utils.parseUnits("80","gwei"),maxPriorityFeePerGas:s.utils.parseUnits("80","gwei")});if(1!=(await r.wait()).status)throw new Error("verification failed");return n.details}catch(e){throw new Error(e)}}async activateTraceAgreement(e,t,n){try{await this.getProvider();const a=new s.Contract(this.getTraceHubAddress(),x,n);if(!await a.checkNullExist(e,t.nullifier))throw new Error("Invalid Nullifier");if("Ok"!=(await this.verifyZkProof({proofBuffer:t.proofBuffer,verifierKeyBuffer:t.verifierKeyBuffer})).message)throw new Error("Invalid ZK Proof Provided");const r=await a.initiateAgreement(e,t.nullifier,{gasLimit:21e6,maxFeePerGas:s.utils.parseUnits("80","gwei"),maxPriorityFeePerGas:s.utils.parseUnits("80","gwei")});if(1!=(await r.wait()).status)throw new Error("failed to initiate");return{message:"ok"}}catch(e){throw new Error(e)}}async getVerifiersDetails(e){var t=this;try{let n=[];const a=s.utils.defaultAbiCoder,{root:r}=(await this.getProvider(),await this.getMerkelTree(e)),o=parseInt(Math.round((new Date).getTime()/1e3).toString());return e.forEach(async function(e){const r=await t.getNullifier(e);n.push(t.buff2Hex(i(a.encode(["uint","uint"],[r,o]))))}),{message:"ok",details:{verifiersRoot:r,nullifiers:n}}}catch(e){throw new Error(e)}}}class C extends S{}var O;O=C,[S].forEach(e=>{Object.getOwnPropertyNames(e.prototype).forEach(t=>{Object.defineProperty(O.prototype,t,Object.getOwnPropertyDescriptor(e.prototype,t)||Object.create(null))})});export{C as default};
