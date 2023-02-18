import * as e from "fs";
import { readFileSync as t } from "fs";
import { resolve as r, dirname as n } from "path";
import { initialize as a } from "zokrates-js";
import i from "keccak256";
import { ethers as s } from "ethers";
import o from "seedrandom";
import p from "isomorphic-unfetch";
import { Web3Storage as y } from "web3.storage";
import { CarReader as u } from "@ipld/car/reader";
import { Readable as l } from "readable-stream";
import * as d from "multiformats/block";
import { sha256 as c } from "multiformats/hashes/sha2";
import * as m from "multiformats/codecs/raw";
import * as f from "@ipld/dag-json";
import * as g from "@ipld/dag-cbor";
import { CarWriter as b } from "@ipld/car/writer";
import { MerkleTree as h } from "merkletreejs";
import w from "crypto-js";
import v from "axios";
import { customAlphabet as T } from "nanoid";
function A(e) {
  function t(e) {
    if (Object(e) !== e)
      return Promise.reject(new TypeError(e + " is not an object."));
    var t = e.done;
    return Promise.resolve(e.value).then(function (e) {
      return { value: e, done: t };
    });
  }
  return (
    (A = function (e) {
      (this.s = e), (this.n = e.next);
    }),
    (A.prototype = {
      s: null,
      n: null,
      next: function () {
        return t(this.n.apply(this.s, arguments));
      },
      return: function (e) {
        var r = this.s.return;
        return void 0 === r
          ? Promise.resolve({ value: e, done: !0 })
          : t(r.apply(this.s, arguments));
      },
      throw: function (e) {
        var r = this.s.return;
        return void 0 === r ? Promise.reject(e) : t(r.apply(this.s, arguments));
      },
    }),
    new A(e)
  );
}
function k() {
  return (
    (k = Object.assign
      ? Object.assign.bind()
      : function (e) {
          for (var t = 1; t < arguments.length; t++) {
            var r = arguments[t];
            for (var n in r)
              Object.prototype.hasOwnProperty.call(r, n) && (e[n] = r[n]);
          }
          return e;
        }),
    k.apply(this, arguments)
  );
}
class P {
  constructor(e) {
    (this.nodeEndpoint = void 0),
      (this.web3storageApiKey = void 0),
      (this.factoryAddress = void 0),
      (this.apikey = void 0),
      (this.baseUrl = void 0),
      (this.traceHubAddress = void 0),
      (this.nodeEndpoint = e.nodeEndpoint || "http://127.0.0.1:8545"),
      (this.baseUrl = e.baseUri || "http://localhost:5000/"),
      (this.apikey = e.apikey),
      (this.web3storageApiKey = e.web3storageApiKey),
      (this.factoryAddress =
        e.factoryAddress || "0x610178da211fef7d417bc0e6fed39f05609ad788"),
      (this.traceHubAddress =
        e.traceHubAddress || "0x8A791620dd6260079BF849Dc5567aDC3F2FdC318");
  }
  invoke(e, t) {
    const r = `${this.baseUrl}${e}`,
      n = k({}, t, {
        headers: { "content-type": "application/json", apiKey: this.apikey },
      });
    return p(r, n).then((e) => {
      if (200 === e.status) return e.json();
      throw new Error("call failed");
    });
  }
  getWeb3StorageKey() {
    return this.web3storageApiKey;
  }
  async getProvider() {
    return new s.providers.JsonRpcProvider(this.nodeEndpoint);
  }
  getFactoryAddress() {
    return this.factoryAddress;
  }
  getTraceHubAddress() {
    return this.traceHubAddress;
  }
}
class M extends P {
  constructor(...t) {
    var r;
    super(...t),
      (r = this),
      (this.initilizeWeb3Storage = async function () {
        try {
          return new y({ token: r.getWeb3StorageKey() });
        } catch (e) {
          throw (
            (console.error(e), new Error("Failed to initilize web3Storage"))
          );
        }
      }),
      (this.uploadCarToIPFS = async function (t) {
        try {
          const n = await r.initilizeWeb3Storage(),
            a = e.createReadStream(`./cars/${t}.car`),
            i = await u.fromIterable(a);
          return await n.putCar(i, { name: `${t}.car`, decoders: [g] });
        } catch (e) {
          throw (console.error(e), new Error("Upload trace details failed"));
        }
      }),
      (this.readData = async function (e) {
        let t;
        try {
          return (
            await v
              .get(`https://ipfs.io/api/v0/dag/get/${e}`)
              .then((e) => {
                t = e.data.data;
              })
              .catch((e) => {
                throw new Error(e);
              }),
            t
          );
        } catch (e) {
          throw (console.error(e), new Error("read trace data failed"));
        }
      }),
      (this.utf8Encoder = new TextEncoder()),
      (this.utf8Decoder = new TextDecoder()),
      (this.createBlock = async function (e) {
        const t = [];
        try {
          const r = await d.encode({ value: { data: e }, hasher: c, codec: g });
          return t.push(r), { blocks: t, roots: [r.cid] };
        } catch (e) {
          throw (console.error(e), new Error("IPLD block creation failed"));
        }
      }),
      (this.write = async function (t, r, n) {
        try {
          e.existsSync("./cars") || e.mkdirSync("./cars");
          const { writer: a, out: i } = b.create(t);
          l.from(i).pipe(e.createWriteStream(`cars/${n}.car`));
          for (const e of r) await a.put(e), await a.close();
          return i;
        } catch (e) {
          throw (console.error(e), new Error("Writing IPLD block failed"));
        }
      }),
      (this.readCar = async function (t) {
        const n = { [m.code]: m, [f.code]: f, [g.code]: g },
          a = { [c.code]: c };
        try {
          const l = e.createReadStream(t),
            c = await u.fromIterable(l),
            m = [];
          let f, g;
          var i,
            s = !1,
            o = !1;
          try {
            for (
              var p,
                y = (function (e) {
                  var t,
                    r,
                    n,
                    a = 2;
                  for (
                    "undefined" != typeof Symbol &&
                    ((r = Symbol.asyncIterator), (n = Symbol.iterator));
                    a--;

                  ) {
                    if (r && null != (t = e[r])) return t.call(e);
                    if (n && null != (t = e[n])) return new A(t.call(e));
                    (r = "@@asyncIterator"), (n = "@@iterator");
                  }
                  throw new TypeError("Object is not async iterable");
                })(c.blocks());
              (s = !(p = await y.next()).done);
              s = !1
            ) {
              const { cid: e, bytes: t } = p.value;
              {
                const i = await d.create({
                  cid: e,
                  bytes: t,
                  codec: n[e.code],
                  hasher: a[e.multihash.code],
                });
                m.push(i);
                const s =
                  i.value instanceof Uint8Array
                    ? r.utf8Decoder.decode(i.value)
                    : i.value;
                (f = JSON.parse(JSON.stringify(s.data))), (g = e.toString());
              }
            }
          } catch (e) {
            (o = !0), (i = e);
          } finally {
            try {
              s && null != y.return && (await y.return());
            } finally {
              if (o) throw i;
            }
          }
          return { blockCid: g, data: f };
        } catch (e) {
          throw (console.error(e), new Error("Read Car File Failed"));
        }
      }),
      (this.updatPreviousBlockCid = (e, t) => {
        try {
          let r = e;
          return (r.previousBlockCid = t), r;
        } catch (e) {
          throw (
            (console.error(e), new Error("Failed to update previous block ID"))
          );
        }
      }),
      (this.updateCar1 = async function (e, t, n) {
        let a;
        try {
          const i = r.updatPreviousBlockCid(e, n),
            { blocks: s, roots: o } = await r.createBlock(i);
          return await r.write(o, s, t), (a = await r.uploadCarToIPFS(t)), a;
        } catch (e) {
          throw (console.error(e), new Error("Car File Update Failed"));
        }
      }),
      (this.writeCar = async function (e, t) {
        let n;
        try {
          const { blocks: a, roots: i } = await r.createBlock(e);
          return (
            await r.write(i, a, t),
            (n = await r.uploadCarToIPFS(t)),
            { message: "ok", cid: n }
          );
        } catch (e) {
          console.error(e);
        }
      }),
      (this.buff2Hex = (e) => "0x" + e.toString("hex")),
      (this.getMerkelTree = async function (e) {
        try {
          const t = e.map((e) => r.buff2Hex(i(e))),
            n = new h(t, i, { sortPairs: !0 }),
            a = r.buff2Hex(n.getRoot());
          return { tree: n, root: a };
        } catch (e) {
          throw (console.error(e), new Error("getMerkelTree Failed"));
        }
      }),
      (this.getleave = (e) => this.buff2Hex(i(e))),
      (this.verifyMerkelProof = async function (e, t, n) {
        try {
          const { tree: a, root: i } = await r.getMerkelTree(n),
            s = r.getleave(t);
          return a.verify(e, s, i);
        } catch (e) {
          throw (
            (console.error(e), new Error("merkel Proof Verification failed"))
          );
        }
      }),
      (this.createProof = async function (e, t) {
        try {
          const n = r.getleave(e);
          return await r.getMerkelProof1(n, t);
        } catch (e) {
          console.error(e);
        }
      });
  }
  async readCid(e) {
    return this.invoke(`storage/readData/${e}`);
  }
  async readCarData(e) {
    return this.invoke(`storage/createCar/${e}`);
  }
  async createCar(e, t) {
    return this.invoke(`storage/createCar/${t}`, {
      method: "POST",
      body: JSON.stringify(e),
    });
  }
  async uploadCar(e) {
    return this.invoke(`storage/uploadCar/${e}`, { method: "POST" });
  }
  async updateCar(e, t) {
    return this.invoke(`storage/createCar/${t}`, {
      method: "PUT",
      body: JSON.stringify(e),
    });
  }
  async getMerkelProof(e, t) {
    return this.invoke(`storage/getMerkelProof/${e}/${t}`, { method: "GET" });
  }
  async getMerkelProof1(e, t) {
    try {
      const { tree: r } = await this.getMerkelTree(t);
      return r.getHexProof(e);
    } catch (e) {
      throw (console.error(e), new Error("Failed to get merkel proof"));
    }
  }
  async encryptData(e, t) {
    return w.AES.encrypt(JSON.stringify(e), t).toString();
  }
  async decryptData(e, t) {
    const r = await this.readData(e),
      n = w.AES.decrypt(r.encryptedData, t);
    return JSON.parse(n.toString(w.enc.Utf8));
  }
}
class x extends M {
  constructor(...e) {
    super(...e),
      (this.rootFromPath = "../circuit"),
      (this.rootToPath = "sdk/circuit/root.zok");
  }
  async randomNumber(e) {
    try {
      let t = [];
      for (let r = 0; r < 4; r++) {
        const r = o(e, { entropy: !0 });
        t.push(Math.abs(r.int32()).toString());
      }
      return t;
    } catch (e) {
      console.error(e);
    }
  }
  async getNullifier(e) {
    try {
      const t = o(e, { entropy: !1 });
      return Math.abs(t.int32());
    } catch (e) {
      console.error(e);
    }
  }
  async fileSystemResolver(e, a) {
    try {
      const i = r(n(r(e)), a);
      return t(i).toString();
    } catch (e) {
      console.error(e);
    }
  }
  async getSource(e, t) {
    try {
      return await this.fileSystemResolver(e, t);
    } catch (e) {
      console.error(e);
    }
  }
  async getZokrateProvider() {
    try {
      return await a();
    } catch (e) {
      console.error(e);
    }
  }
  async getArtifacts(e) {
    try {
      return (await this.getZokrateProvider()).compile(e);
    } catch (e) {
      console.error(e);
    }
  }
  async getPreImage(e) {
    try {
      const t = await this.getZokrateProvider(),
        r = await this.getSource("../circuit", "sdk/circuit/preImage.zok"),
        n = await this.getArtifacts(r),
        { output: a } = t.computeWitness(n, e);
      return JSON.parse(a);
    } catch (e) {
      throw (console.error(e), new Error("ZK preImage Error"));
    }
  }
  async generateZkProof(e) {
    try {
      const t = s.utils.defaultAbiCoder,
        r = await this.getProvider(),
        n = parseInt(Math.round(new Date().getTime() / 1e3).toString()),
        a = await this.randomNumber(e),
        o = await this.getNullifier(e),
        p = await this.getZokrateProvider(),
        y = await this.getSource(this.rootFromPath, this.rootToPath),
        u = await this.getArtifacts(y),
        l = await this.getPreImage(a),
        d = await r.getBlockNumber(),
        c = this.buff2Hex(
          i(t.encode(["uint", "uint", "uint", "string"], [o, n, d, e]))
        ),
        m = [...a, ...l],
        { witness: f } = p.computeWitness(u, m),
        g = p.setup(u.program),
        b = p.generateProof(u.program, f, g.pk),
        h = g.vk;
      return {
        message: "ok",
        details: {
          proofBuffer: JSON.stringify(b),
          verifierKeyBuffer: JSON.stringify(h),
          nullifier: c,
        },
      };
    } catch (e) {
      throw (console.error(e), new Error("generate zk proof error"));
    }
  }
  async verifyZkProof(e) {
    try {
      const t = e.verifierKeyBuffer,
        r = JSON.parse(e.proofBuffer),
        n = JSON.parse(t),
        a = (await this.getZokrateProvider()).verify(n, r);
      return a
        ? { message: "Ok", isVerified: a }
        : { message: "invalid Proof Provided", isVerified: a };
    } catch (e) {
      throw (console.error(e), new Error("Verify Zk Proof error"));
    }
  }
}
const S = [
    {
      inputs: [
        { internalType: "address", name: "_traceHub", type: "address" },
        {
          internalType: "address",
          name: "_traceAgreementImplementation",
          type: "address",
        },
      ],
      stateMutability: "nonpayable",
      type: "constructor",
    },
    {
      anonymous: !1,
      inputs: [
        { indexed: !0, internalType: "uint256", name: "time", type: "uint256" },
        {
          indexed: !0,
          internalType: "address",
          name: "agreementAddress",
          type: "address",
        },
        { indexed: !0, internalType: "uint256", name: "id", type: "uint256" },
      ],
      name: "AgreementCreated",
      type: "event",
    },
    {
      inputs: [
        { internalType: "address", name: "agreementAddress", type: "address" },
      ],
      name: "getAgreementDetais",
      outputs: [
        {
          components: [
            { internalType: "bytes32", name: "verifierRoot", type: "bytes32" },
            {
              internalType: "bytes32[]",
              name: "nullifiers",
              type: "bytes32[]",
            },
            { internalType: "string", name: "agreementUri", type: "string" },
            { internalType: "uint256", name: "agreementId", type: "uint256" },
          ],
          internalType: "struct TraceAgreementFactory.TraceAgreementDetails",
          name: "",
          type: "tuple",
        },
      ],
      stateMutability: "view",
      type: "function",
    },
    {
      inputs: [],
      name: "getFactoryAddress",
      outputs: [{ internalType: "address", name: "", type: "address" }],
      stateMutability: "view",
      type: "function",
    },
    {
      inputs: [
        { internalType: "address", name: "agreementAddress", type: "address" },
      ],
      name: "getId",
      outputs: [{ internalType: "uint256", name: "", type: "uint256" }],
      stateMutability: "view",
      type: "function",
    },
    {
      inputs: [{ internalType: "uint256", name: "id", type: "uint256" }],
      name: "getTraceAddress",
      outputs: [{ internalType: "address", name: "", type: "address" }],
      stateMutability: "view",
      type: "function",
    },
    {
      inputs: [
        { internalType: "bytes32", name: "_verifierRoot", type: "bytes32" },
        { internalType: "bytes32[]", name: "_nullifiers", type: "bytes32[]" },
        { internalType: "string", name: "agreementUri", type: "string" },
        { internalType: "address", name: "_traceAgreement", type: "address" },
        { internalType: "string", name: "enKey", type: "string" },
      ],
      name: "initilizeAgreement",
      outputs: [],
      stateMutability: "nonpayable",
      type: "function",
    },
    {
      inputs: [
        { internalType: "address", name: "traceAdmin", type: "address" },
        { internalType: "address", name: "_supplier", type: "address" },
        { internalType: "uint256", name: "dataAvailiblity", type: "uint256" },
      ],
      name: "newTraceAgreement",
      outputs: [
        { internalType: "address", name: "", type: "address" },
        { internalType: "uint256", name: "", type: "uint256" },
      ],
      stateMutability: "nonpayable",
      type: "function",
    },
    {
      inputs: [],
      name: "traceHub",
      outputs: [{ internalType: "address", name: "", type: "address" }],
      stateMutability: "view",
      type: "function",
    },
  ],
  E = [
    {
      inputs: [{ internalType: "address", name: "hubAdmin", type: "address" }],
      stateMutability: "nonpayable",
      type: "constructor",
    },
    {
      anonymous: !1,
      inputs: [
        {
          indexed: !0,
          internalType: "address",
          name: "newDefaultAdmin",
          type: "address",
        },
      ],
      name: "DeafultAdminChanged",
      type: "event",
    },
    {
      anonymous: !1,
      inputs: [
        { indexed: !0, internalType: "bool", name: "accepted", type: "bool" },
      ],
      name: "ProposalAccepted",
      type: "event",
    },
    {
      anonymous: !1,
      inputs: [
        { indexed: !0, internalType: "bytes32", name: "role", type: "bytes32" },
        {
          indexed: !0,
          internalType: "bytes32",
          name: "previousAdminRole",
          type: "bytes32",
        },
        {
          indexed: !0,
          internalType: "bytes32",
          name: "newAdminRole",
          type: "bytes32",
        },
      ],
      name: "RoleAdminChanged",
      type: "event",
    },
    {
      anonymous: !1,
      inputs: [
        {
          indexed: !0,
          internalType: "address",
          name: "hubAdmin",
          type: "address",
        },
      ],
      name: "RoleGranted",
      type: "event",
    },
    {
      anonymous: !1,
      inputs: [
        { indexed: !0, internalType: "bytes32", name: "role", type: "bytes32" },
        {
          indexed: !0,
          internalType: "address",
          name: "account",
          type: "address",
        },
        {
          indexed: !0,
          internalType: "address",
          name: "sender",
          type: "address",
        },
      ],
      name: "RoleGranted",
      type: "event",
    },
    {
      anonymous: !1,
      inputs: [
        {
          indexed: !0,
          internalType: "address",
          name: "hubAdmin",
          type: "address",
        },
      ],
      name: "RoleRevoked",
      type: "event",
    },
    {
      anonymous: !1,
      inputs: [
        { indexed: !0, internalType: "bytes32", name: "role", type: "bytes32" },
        {
          indexed: !0,
          internalType: "address",
          name: "account",
          type: "address",
        },
        {
          indexed: !0,
          internalType: "address",
          name: "sender",
          type: "address",
        },
      ],
      name: "RoleRevoked",
      type: "event",
    },
    {
      inputs: [],
      name: "DEFAULT_ADMIN_ROLE",
      outputs: [{ internalType: "bytes32", name: "", type: "bytes32" }],
      stateMutability: "view",
      type: "function",
    },
    {
      inputs: [],
      name: "HUB_ADMIN",
      outputs: [{ internalType: "bytes32", name: "", type: "bytes32" }],
      stateMutability: "view",
      type: "function",
    },
    {
      inputs: [
        { internalType: "address", name: "traceAddress", type: "address" },
      ],
      name: "acceptProposal",
      outputs: [],
      stateMutability: "nonpayable",
      type: "function",
    },
    {
      inputs: [
        { internalType: "address", name: "_traceFactory", type: "address" },
      ],
      name: "addFactory",
      outputs: [],
      stateMutability: "nonpayable",
      type: "function",
    },
    {
      inputs: [
        { internalType: "address", name: "newDeafultAdmin", type: "address" },
      ],
      name: "changeDeafultAdmin",
      outputs: [],
      stateMutability: "nonpayable",
      type: "function",
    },
    {
      inputs: [{ internalType: "address", name: "addr", type: "address" }],
      name: "checkDeafultAdmin",
      outputs: [{ internalType: "bool", name: "", type: "bool" }],
      stateMutability: "view",
      type: "function",
    },
    {
      inputs: [{ internalType: "address", name: "hubAdmin", type: "address" }],
      name: "checkHubAdmin",
      outputs: [{ internalType: "bool", name: "", type: "bool" }],
      stateMutability: "view",
      type: "function",
    },
    {
      inputs: [
        { internalType: "address", name: "traceAddress", type: "address" },
        { internalType: "bytes32", name: "nullifier", type: "bytes32" },
      ],
      name: "checkNullExist",
      outputs: [{ internalType: "bool", name: "", type: "bool" }],
      stateMutability: "view",
      type: "function",
    },
    {
      inputs: [
        { internalType: "address", name: "_traceAgreement", type: "address" },
      ],
      name: "checkNullLength",
      outputs: [{ internalType: "uint256", name: "", type: "uint256" }],
      stateMutability: "view",
      type: "function",
    },
    {
      inputs: [
        { internalType: "address", name: "_traceAgreement", type: "address" },
        { internalType: "bytes32", name: "_nullifier", type: "bytes32" },
      ],
      name: "checkNullifier",
      outputs: [{ internalType: "bool", name: "", type: "bool" }],
      stateMutability: "view",
      type: "function",
    },
    {
      inputs: [
        { internalType: "address", name: "traceAddress", type: "address" },
      ],
      name: "checkSupplierApproved",
      outputs: [{ internalType: "bool", name: "", type: "bool" }],
      stateMutability: "view",
      type: "function",
    },
    {
      inputs: [
        { internalType: "address", name: "_traceAgreement", type: "address" },
      ],
      name: "getAgreementDetails",
      outputs: [
        { internalType: "address", name: "", type: "address" },
        { internalType: "uint256", name: "", type: "uint256" },
        { internalType: "uint256", name: "", type: "uint256" },
      ],
      stateMutability: "view",
      type: "function",
    },
    {
      inputs: [
        { internalType: "address", name: "_traceAgreement", type: "address" },
      ],
      name: "getAgreementId",
      outputs: [{ internalType: "uint256", name: "", type: "uint256" }],
      stateMutability: "view",
      type: "function",
    },
    {
      inputs: [],
      name: "getAgreementLog",
      outputs: [
        {
          components: [
            {
              internalType: "address",
              name: "traceAgreementContract",
              type: "address",
            },
            { internalType: "uint256", name: "id", type: "uint256" },
            { internalType: "uint256", name: "createdAt", type: "uint256" },
            { internalType: "string", name: "uri", type: "string" },
            {
              internalType: "bytes32[]",
              name: "nullifiers",
              type: "bytes32[]",
            },
            { internalType: "string", name: "encryptionKey", type: "string" },
          ],
          internalType: "struct TraceHub.Agreement[]",
          name: "",
          type: "tuple[]",
        },
      ],
      stateMutability: "view",
      type: "function",
    },
    {
      inputs: [
        { internalType: "address", name: "_traceAgreement", type: "address" },
      ],
      name: "getAgreementUri",
      outputs: [{ internalType: "string", name: "", type: "string" }],
      stateMutability: "view",
      type: "function",
    },
    {
      inputs: [
        { internalType: "address", name: "_traceAgreement", type: "address" },
      ],
      name: "getEncryptionKey",
      outputs: [{ internalType: "string", name: "", type: "string" }],
      stateMutability: "view",
      type: "function",
    },
    {
      inputs: [{ internalType: "bytes32", name: "role", type: "bytes32" }],
      name: "getRoleAdmin",
      outputs: [{ internalType: "bytes32", name: "", type: "bytes32" }],
      stateMutability: "view",
      type: "function",
    },
    {
      inputs: [{ internalType: "uint256", name: "id", type: "uint256" }],
      name: "getTraceAddress",
      outputs: [{ internalType: "address", name: "", type: "address" }],
      stateMutability: "view",
      type: "function",
    },
    {
      inputs: [{ internalType: "address", name: "hubAdmin", type: "address" }],
      name: "grantAdminRole",
      outputs: [],
      stateMutability: "nonpayable",
      type: "function",
    },
    {
      inputs: [
        { internalType: "bytes32", name: "role", type: "bytes32" },
        { internalType: "address", name: "account", type: "address" },
      ],
      name: "grantRole",
      outputs: [],
      stateMutability: "nonpayable",
      type: "function",
    },
    {
      inputs: [
        { internalType: "bytes32", name: "role", type: "bytes32" },
        { internalType: "address", name: "account", type: "address" },
      ],
      name: "hasRole",
      outputs: [{ internalType: "bool", name: "", type: "bool" }],
      stateMutability: "view",
      type: "function",
    },
    {
      inputs: [
        { internalType: "address", name: "traceAddress", type: "address" },
        { internalType: "bytes32", name: "nullifier", type: "bytes32" },
      ],
      name: "initiateAgreement",
      outputs: [],
      stateMutability: "nonpayable",
      type: "function",
    },
    {
      inputs: [{ internalType: "address", name: "addr", type: "address" }],
      name: "removeRole",
      outputs: [],
      stateMutability: "nonpayable",
      type: "function",
    },
    {
      inputs: [
        { internalType: "bytes32", name: "role", type: "bytes32" },
        { internalType: "address", name: "account", type: "address" },
      ],
      name: "renounceRole",
      outputs: [],
      stateMutability: "nonpayable",
      type: "function",
    },
    {
      inputs: [
        { internalType: "bytes32", name: "role", type: "bytes32" },
        { internalType: "address", name: "account", type: "address" },
      ],
      name: "revokeRole",
      outputs: [],
      stateMutability: "nonpayable",
      type: "function",
    },
    {
      inputs: [{ internalType: "bytes4", name: "interfaceId", type: "bytes4" }],
      name: "supportsInterface",
      outputs: [{ internalType: "bool", name: "", type: "bool" }],
      stateMutability: "view",
      type: "function",
    },
    {
      inputs: [
        { internalType: "address", name: "_traceAgreement", type: "address" },
        { internalType: "string", name: "agreementUri", type: "string" },
        { internalType: "bytes32[]", name: "_nullifiers", type: "bytes32[]" },
        { internalType: "uint256", name: "id", type: "uint256" },
        { internalType: "string", name: "enKey", type: "string" },
      ],
      name: "updatAgreementLog",
      outputs: [],
      stateMutability: "nonpayable",
      type: "function",
    },
    {
      inputs: [
        { internalType: "address", name: "_traceAgreement", type: "address" },
        { internalType: "string", name: "agreementUri", type: "string" },
      ],
      name: "updatAgreementUri",
      outputs: [],
      stateMutability: "nonpayable",
      type: "function",
    },
    {
      inputs: [
        { internalType: "address", name: "_traceAgreement", type: "address" },
        { internalType: "bytes32", name: "_nullifier", type: "bytes32" },
      ],
      name: "updateNullifier",
      outputs: [{ internalType: "bool", name: "", type: "bool" }],
      stateMutability: "nonpayable",
      type: "function",
    },
    {
      inputs: [
        { internalType: "address", name: "traceAddress", type: "address" },
        { internalType: "bytes32", name: "nullifier", type: "bytes32" },
      ],
      name: "zkProof",
      outputs: [],
      stateMutability: "nonpayable",
      type: "function",
    },
  ],
  C = [
    {
      anonymous: !1,
      inputs: [
        {
          indexed: !0,
          internalType: "uint256",
          name: "signCount",
          type: "uint256",
        },
        { indexed: !0, internalType: "bool", name: "verified", type: "bool" },
      ],
      name: "Verified",
      type: "event",
    },
    {
      inputs: [],
      name: "activate",
      outputs: [{ internalType: "bool", name: "", type: "bool" }],
      stateMutability: "nonpayable",
      type: "function",
    },
    {
      inputs: [
        { internalType: "address", name: "_traceAdmin", type: "address" },
        { internalType: "address", name: "_supplier", type: "address" },
        { internalType: "address", name: "_factoryAddress", type: "address" },
        { internalType: "address", name: "_traceHub", type: "address" },
        { internalType: "uint256", name: "_dataAvailibality", type: "uint256" },
      ],
      name: "addTraceAdmin",
      outputs: [],
      stateMutability: "nonpayable",
      type: "function",
    },
    {
      inputs: [],
      name: "checkIsInitilized",
      outputs: [{ internalType: "bool", name: "", type: "bool" }],
      stateMutability: "view",
      type: "function",
    },
    {
      inputs: [],
      name: "checkState",
      outputs: [{ internalType: "uint256", name: "", type: "uint256" }],
      stateMutability: "view",
      type: "function",
    },
    {
      inputs: [],
      name: "getAgreementId",
      outputs: [{ internalType: "uint256", name: "", type: "uint256" }],
      stateMutability: "view",
      type: "function",
    },
    {
      inputs: [],
      name: "getAgreementUri",
      outputs: [{ internalType: "string", name: "", type: "string" }],
      stateMutability: "view",
      type: "function",
    },
    {
      inputs: [],
      name: "getDataAvailibality",
      outputs: [{ internalType: "uint256", name: "", type: "uint256" }],
      stateMutability: "view",
      type: "function",
    },
    {
      inputs: [],
      name: "getEncryptionKey",
      outputs: [{ internalType: "string", name: "", type: "string" }],
      stateMutability: "view",
      type: "function",
    },
    {
      inputs: [],
      name: "getSupplier",
      outputs: [{ internalType: "address", name: "", type: "address" }],
      stateMutability: "view",
      type: "function",
    },
    {
      inputs: [],
      name: "getTraceAdmin",
      outputs: [{ internalType: "address", name: "", type: "address" }],
      stateMutability: "view",
      type: "function",
    },
    {
      inputs: [
        { internalType: "bytes32", name: "_verifierRoot", type: "bytes32" },
        { internalType: "bytes32[]", name: "_nullifiers", type: "bytes32[]" },
        { internalType: "string", name: "_agreementUri", type: "string" },
        { internalType: "string", name: "enKey", type: "string" },
      ],
      name: "initilize",
      outputs: [],
      stateMutability: "nonpayable",
      type: "function",
    },
    {
      inputs: [],
      name: "status",
      outputs: [
        {
          internalType: "enum TraceAgreement.AgreementStatus",
          name: "",
          type: "uint8",
        },
      ],
      stateMutability: "view",
      type: "function",
    },
    {
      inputs: [],
      name: "traceHub",
      outputs: [{ internalType: "address", name: "", type: "address" }],
      stateMutability: "view",
      type: "function",
    },
    {
      inputs: [
        { internalType: "string", name: "_agreementUri", type: "string" },
      ],
      name: "updateAgreementUri",
      outputs: [{ internalType: "bool", name: "", type: "bool" }],
      stateMutability: "nonpayable",
      type: "function",
    },
    {
      inputs: [
        { internalType: "bytes32[]", name: "_proof", type: "bytes32[]" },
        { internalType: "bytes32", name: "nullifier", type: "bytes32" },
        { internalType: "bytes32", name: "leaf", type: "bytes32" },
      ],
      name: "verifyByOrder",
      outputs: [{ internalType: "bool", name: "", type: "bool" }],
      stateMutability: "nonpayable",
      type: "function",
    },
  ];
class D extends x {
  async createTraceAgreement(e, t, r, n) {
    try {
      await this.getProvider();
      const a = new s.Contract(this.getFactoryAddress(), S, n);
      let i = [];
      const o = await a.newTraceAgreement(e, t, r),
        p = await o.wait();
      if (1 != p.status) return void console.log("Creation Failed");
      for (let e of p.events) i.push(e.event);
      const y = await p.events[0].args.agreementAddress,
        u = await p.events[0].args.id;
      return {
        message: "ok",
        transactionHash: p.transactionHash,
        details: { agreementAddress: y, agreementId: u.toString() },
      };
    } catch (e) {
      throw (console.error(e), new Error("Create Trace Agreement failed"));
    }
  }
  async acceptProposal(e, t) {
    try {
      let r = [];
      const n = new s.Contract(this.getTraceHubAddress(), E, t),
        a = await n.acceptProposal(e, {
          gasLimit: 21e4,
          maxFeePerGas: s.utils.parseUnits("80", "gwei"),
          maxPriorityFeePerGas: s.utils.parseUnits("80", "gwei"),
        }),
        i = await a.wait();
      if (1 != i.status) return void console.log("verification failed");
      for (let e of i.events) r.push(e.event);
      return await i.events[0].args.accepted;
    } catch (e) {
      throw (console.error(e), new Error("Accept proposal error"));
    }
  }
  async initilizeAgreement(e, t, r, n) {
    try {
      const a = [],
        o = s.utils.defaultAbiCoder,
        p = await this.getProvider(),
        y = parseInt(Math.round(new Date().getTime() / 1e3).toString()),
        u = await p.getBlockNumber(),
        l = new s.Contract(t, C, n);
      if (1 == (await l.checkIsInitilized))
        return void console.log("Trace Agreement already initilized");
      const d = await l.getDataAvailibality(),
        c = (await this.getVerifiersDetails(e)).details,
        m = this.buff2Hex(i(o.encode(["uint", "uint"], [y, u]))),
        f = T(m, 32)();
      let g;
      "1" === d.toString() ? (g = f) : "2" === d.toString() && (g = ""),
        (g = f);
      const b = {
          traceAddress: t,
          verifiersRoot: c.verifiersRoot,
          verifiers: e,
          txDetails: r,
          previousBlockCid: "",
        },
        h = { encryptedData: await this.encryptData(b, f) },
        w = await this.writeCar(h, t),
        v = await l.initilize(c.verifiersRoot, c.nullifiers, w.cid, g, {
          gasLimit: 21e6,
          maxFeePerGas: s.utils.parseUnits("80", "gwei"),
          maxPriorityFeePerGas: s.utils.parseUnits("80", "gwei"),
        }),
        A = await v.wait();
      if (1 != A.status) return void console.log("initilization failed");
      for (let t = 0; t < e.length; t++)
        a.push({ verifier: e[t], nullifier: c.nullifiers[t] });
      return {
        message: "ok",
        transactionHash: A.transactionHash,
        verificationDetails: a,
        encryptionKey: f,
      };
    } catch (e) {
      throw (console.error(e), new Error(e));
    }
  }
  async createZkProof(e, t) {
    try {
      await this.getProvider();
      const r = await this.generateZkProof(e),
        n = new s.Contract(this.getTraceHubAddress(), E, t);
      if (!(await n.checkSupplierApproved(e)))
        return void console.log("Supplier has not approved");
      const a = await n.zkProof(e, r.details.nullifier, {
        gasLimit: 21e6,
        maxFeePerGas: s.utils.parseUnits("80", "gwei"),
        maxPriorityFeePerGas: s.utils.parseUnits("80", "gwei"),
      });
      return 1 != (await a.wait()).status
        ? void console.log("verification failed")
        : r.details;
    } catch (e) {
      throw (console.error(e), new Error("create ZK proof error"));
    }
  }
  async activateTraceAgreement(e, t, r) {
    try {
      await this.getProvider();
      const n = new s.Contract(this.getTraceHubAddress(), E, r);
      if (!(await n.checkNullExist(e, t.nullifier)))
        return void console.log("Invalid Nullifier");
      if (
        "Ok" !=
        (
          await this.verifyZkProof({
            proofBuffer: t.proofBuffer,
            verifierKeyBuffer: t.verifierKeyBuffer,
          })
        ).message
      )
        return void console.log("Invalid ZK Proof Provided");
      const a = await n.initiateAgreement(e, t.nullifier, {
        gasLimit: 21e6,
        maxFeePerGas: s.utils.parseUnits("80", "gwei"),
        maxPriorityFeePerGas: s.utils.parseUnits("80", "gwei"),
      });
      return 1 != (await a.wait()).status
        ? void console.log("failed to initiate")
        : { message: "ok" };
    } catch (e) {
      throw (console.error(e), new Error("Trace agreement activation error"));
    }
  }
  async verifyByOrder(e, t, r, n) {
    try {
      let a;
      const i = new s.Contract(e, C, r),
        o = await i.getDataAvailibality();
      if (2 === o && void 0 === n)
        return void console.log("encryption key is not defined");
      a = 1 === o ? await i.getEncryptionKey() : n;
      const p = await i.getAgreementUri(),
        y = (await this.decryptData(p, a)).verifiers,
        u = await this.createProof(r.address, y),
        l = this.getleave(r.address);
      let d = [];
      const c = await i.verifyByOrder(u, t, l, {
          gasLimit: 21e4,
          maxFeePerGas: s.utils.parseUnits("80", "gwei"),
          maxPriorityFeePerGas: s.utils.parseUnits("80", "gwei"),
        }),
        m = await c.wait();
      if (1 != m.status) return void console.log("verification failed");
      for (let e of m.events) d.push(e.event);
      return {
        message: "ok",
        details: {
          verifiedCount: await m.events[0].args.signCount,
          verified: await m.events[0].args.verified,
        },
      };
    } catch (e) {
      throw (console.error(e), new Error("ZKTrace Verification Error"));
    }
  }
  async getVerifiersDetails(e) {
    var t = this;
    try {
      let r = [];
      const n = s.utils.defaultAbiCoder,
        { root: a } = await this.getMerkelTree(e),
        o = parseInt(Math.round(new Date().getTime() / 1e3).toString());
      return (
        e.forEach(async function (e) {
          const a = await t.getNullifier(e);
          r.push(t.buff2Hex(i(n.encode(["uint", "uint"], [a, o]))));
        }),
        { message: "ok", details: { verifiersRoot: a, nullifiers: r } }
      );
    } catch (e) {
      throw (console.error(e), new Error("get verifier details error"));
    }
  }
  async getVerifiersProof(e) {
    try {
      const t = [];
      for (let r = 0; r < e.length; r++) {
        const n = await this.createProof(e[r], e),
          a = { verifier: e[r], merkelProof: await n };
        t.push(a);
      }
      return t;
    } catch (e) {
      throw (console.error(e), new Error("get verifier proof error"));
    }
  }
  async encryptionDetails(e) {
    try {
      const t = await this.getProvider(),
        r = new s.Contract(e, C, t);
      return {
        encryptionKey: await r.getEncryptionKey(),
        cid: await r.getAgreementUri(),
      };
    } catch (e) {
      console.error(e);
    }
  }
}
class F extends D {}
var I;
(I = F),
  [D].forEach((e) => {
    Object.getOwnPropertyNames(e.prototype).forEach((t) => {
      Object.defineProperty(
        I.prototype,
        t,
        Object.getOwnPropertyDescriptor(e.prototype, t) || Object.create(null)
      );
    });
  });
export { F as default };
