const VerifiersProof = [
  {
    message: "ok",
    transactionHash:
      "0xa0f67054d426afdefc72ab56c8bb7005b9479d50841d7fd4fb8d90526f7025d6",
    verificationDetails: [
      {
        verifier: "0x70997970C51812dc3A010C7d01b50e0d17dc79C8",
        nullifier:
          "0x4534f0fd96a43f67de18603f95937c793e4799c10062d10b859b46c79e65799b",
      },
      {
        verifier: "0x3C44CdDdB6a900fa2b585dd299e03d12FA4293BC",
        nullifier:
          "0xf996d8ec359bb98d33d6f40e3343a1d79dca222c6044cdccbb9a798a62991b82",
      },
      {
        verifier: "0x90F79bf6EB2c4f870365E785982E1f101E93b906",
        nullifier:
          "0x79e9de7c4098d57245063b79a2ac6fa576987c0419ebff9d6525ba8e437f4961",
      },
    ],
    encryptionKey: "3d81147de7d4637d8dc779e77673dc3b",
  },
];

const zkProof = {
  proofBuffer:
    '{"scheme":"g16","curve":"bn128","proof":{"a":["0x0910c7229caee3b8411853f660ec6a5a3e2ddb4975ea567f09f32e6803db5f5b","0x2e21a4290628619ebf70052558a4e7447509a1f933b81bc38b3bfd53bf12c689"],"b":[["0x0f293641c1f2e53787f229f25d586c7b4fb2c87fd2976ab73b3a5ab638e9e84e","0x2cc03f7594dc43b58100201d76f5e1e05709c1fd46877df060258bde887a29a8"],["0x1225259600bc15f44f96bc7c2e74aa5e9cbb84c62f6714aa766165a1261e3b19","0x002af224146c06c98b68b8ade3839aa84ca95edac0dc826ce889d5e8fe59a1a7"]],"c":["0x09454132dccd57620a1071f7dcdd415c8a11f6c3b22f921e797d547cd00d1d28","0x19249a8b2444bc0b41872bef8b39e86421cdcb301e59dc1b79fa497c8af01ee6"]},"inputs":["0x0000000000000000000000000000000061129c59aeada142929f962de0f05e36","0x000000000000000000000000000000009c1bcea7c83fbb1e5feea008b0c488fe"]}',
  verifierKeyBuffer:
    '{"scheme":"g16","curve":"bn128","alpha":["0x0a68efbdc1f1d20a339a410dfeb07118c9f72768092dc3c928ea7ba3f3de15dc","0x1128b03333f683dc595f6affd55e69988cbf7538fa0043be3ea6987760825712"],"beta":[["0x192a24ee048be6c79219fe1d6c7f28a9747db7e3cc0c2ec48c1cb8c9acc8afb9","0x0b3cbf1ff609a10b358714d485eb4e9b2fb1b72c6795ad390dde8ac76998d1e5"],["0x179aed8263f0c20b3eea90ee236708e3ff1b86ace921c0bb7fe5bc3fee8f0e9e","0x2645894d3e7f21a2cd1bedda018aec099210f3921847692267f5b814a15e7aa5"]],"gamma":[["0x00f2afab57826e900f3cedef719782ec45fb94cbd9e5cb1adbb6e06fd7d146c0","0x1f38a6c490641380756244911d26052eb926ab2cfc8ce41efad99c1a73c4d34f"],["0x10ebadf627f36a6d6c0d3ec6fb4d3e9d5bd0f3f08d4152331024da4aa52da179","0x2cd9201e1465e127a57ecd644e9c2df58e7458fbf96d50be867d92ffe058f565"]],"delta":[["0x12cf798022ec191e676c59119497d1b73698e2562d857c44bedda8e65bab632d","0x24211b1113677d23d9877b962de60ca79837cd3ce79c47adb9b6496d2a9bf2e6"],["0x0661f2f06684a24fb68256580ce9df9b9cc7b021a0f280fb9a95cb36136a5b46","0x0378f00c667714fc003a0d9efea8d53d652eeba1977d8bebeced2ab2e0141505"]],"gamma_abc":[["0x2d684eca7fc98870273fc873ff05f4b06a218ef1da6921cd72c2c2c331c80496","0x1bc44c75b8e7075f5bbe138a05c387569919284a8d369307321e5b23fbcfde9c"],["0x2c9316c015813738047cdb3c23ee37b57b16f6ce2fbc8e52384aa07b0681914c","0x15ac9ab440ddd9970dbda36cfb323032a4696c10db00467230b3457de8e37c31"],["0x125d4926acaecae1347790b53048d7cac02a5c5063542e89f4f65c877c0e4c5a","0x2c5a0b06b859d54cdc2652345da8192ca80cb07271c1c39c62e77b1fd66188e5"]]}',
  nullifier:
    "0x8dfcd64857a7f5f293559f552d9712a8d6c73fed4d5d5b2f8c985971a0f82e2e",
};
