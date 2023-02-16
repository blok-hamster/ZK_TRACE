const VerifiersProof = [
  {
    verifier: "0x70997970C51812dc3A010C7d01b50e0d17dc79C8",
    nullifier:
      "0x7b7066e2dfd013f5a8fd6c703ea741d19233547c7c783d31b5355ba9b1c4a430",
    merkelProof: [
      "0x8a3552d60a98e0ade765adddad0a2e420ca9b1eef5f326ba7ab860bb4ea72c94",
      "0x1ebaa930b8e9130423c183bf38b0564b0103180b7dad301013b18e59880541ae",
    ],
  },
  {
    verifier: "0x3C44CdDdB6a900fa2b585dd299e03d12FA4293BC",
    nullifier:
      "0x8d194eddc01e3c1a3fb524d39be9804076bedfb3085e07fd483578139bb93d10",
    merkelProof: [
      "0x00314e565e0574cb412563df634608d76f5c59d9f817e85966100ec1d48005c0",
      "0x1ebaa930b8e9130423c183bf38b0564b0103180b7dad301013b18e59880541ae",
    ],
  },
  {
    verifier: "0x90F79bf6EB2c4f870365E785982E1f101E93b906",
    nullifier:
      "0x28d26f9eb862456054139fea3778dafe80cdbf35d29a8d57c8f43f15e8e8d51e",
    merkelProof: [
      "0x343750465941b29921f50a28e0e43050e5e1c2611a3ea8d7fe1001090d5e1436",
    ],
  },
];

const zkProof = {
  proofBuffer:
    '{"scheme":"g16","curve":"bn128","proof":{"a":["0x238337005821ee2cbd4a79e7606e0e6eac28c92caeb6f24fa19a758f7677797e","0x19c5032e4014160f58dfef3b4d6a4c20118c7a5bf6acd4e57ffdfb28206c647d"],"b":[["0x036334590f3a151d81f0fbd249f29140b5a8393f4b747bbb7a79c60292e38dd3","0x046c33ba1748a1b32bcd5484a16b6c58415bc84ec22c1ad4a14eab5934a23a2e"],["0x25cd57fde39f74e9000c26c1fd07200726d8d6fc8e936c62eda34d385fc6cdf5","0x0a9526b980e0c33428ed803ed69a50e048bcbdd0d033108e96851c03f029a5b8"]],"c":["0x2965b53f4b95c534e3352754060ef2601d943fcc568400ab6a6e97d01b40f580","0x1e185f70a2b5dde68a00590c2228561dfe48b95c2687887a33f65ab281f64801"]},"inputs":["0x00000000000000000000000000000000a527bdfda55f91477c389a8b6d52a910","0x000000000000000000000000000000007c0f2b563d068ab1b5976dd4ca982bb4"]}',
  verifierKeyBuffer:
    '{"scheme":"g16","curve":"bn128","alpha":["0x1d6877c6b50d19e4f050b51975c0849c45c6607a9c1a111b438ee5fdfdffc5e6","0x1feae3887326d0ce8ee61a223925cb4e47c9e7097db1673f56c85a993cedba2f"],"beta":[["0x1fc930b97a4cd5347f17dd09b30333636320f524db3516c1a7c35d7d1f4ced90","0x0a96e230d044f2b614c6f48d37054c18be545f3e33e1929435e3bc99505ef2df"],["0x0e599a92acb177be154d3adc329b24820b4b7d5cb1c968a4646f8ee144828c59","0x1b6c40763a36f6e7a4ecce71ca8a3b883e6769df9c0a2d6bffb3b6682bb56280"]],"gamma":[["0x1de523c88ce8d5f6b008fe5181cb3fdd83490affe814c66dc45fb7947764de5e","0x1d4cc2b2e3c78b2b0676624f5c5c4649fa7d1e700650f093381856498e4f008d"],["0x100edd5f4836b5cd415d29adba76d61eb253819cbe604bf929e19b0bf91f6f7e","0x13372bba36211a23f9f00af61c0e8e7fa7706a0d2ba7442fb30626e5f1266676"]],"delta":[["0x245b32648a8cb96057e51d79e9575ea22a5262da1249cf53b9afb3be37b350e3","0x2eb149b04ee5c81e9dd71d4d38c00add9b2a4cf74b023bf35df23f70a91ff919"],["0x031fc8c60695d97703e5506948d05a61997e61cf18e2cec21961e55cb4840f8c","0x20dc0be4a164810f90ab99fa15c96930a72a2561fc62e54198688a28259a8e80"]],"gamma_abc":[["0x1b7562f23c6614104e2c452fa3ac44cad45c85d589487efbdd5cd9b4e24e3909","0x28225ccc744bc4cada349e800f30cf7ab6a94dd239d69b8b8fa1c666cd019f52"],["0x002ea999f94c6aef116a70bf182040d2d2b4b12593d866770cdff6b54177c4a4","0x13914275d7e02502d7841a9017c376a8f3f12b48d97a4280cef5103bebdf3831"],["0x1590d251e3200c9761183e71a40dc35b6450557b3b4c99558f54fe285e130c11","0x14070e48c352b97313a99c39b671497ed9ec99adffe3e1cb6c8dcd7cb9d94b84"]]}',
  nullifier:
    "0xa3acdbea68a65e6accc18c8909803db35c281b78d86320e25f6307889d4baddc",
};