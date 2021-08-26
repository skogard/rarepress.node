/******************************************************************************
*
* Add file from Buffer
*
* 1. initizliae with default Ethereum derivation path
* 2. download image from a url
* 3. print preview
* 4. add the buffer to rarepress
* 5. mint an NFT
*
******************************************************************************/
const got = require('got')
const terminalImage = require('terminal-image');
const Rareterm = require('../index');
(async () => {
  // 1.  Initialize rarepress (Use the default ETH path by not specifying 'key'
  const rarepress = new Rareterm()
  await rarepress.init({ host: "https://ropsten.rarenet.app/v1" })

  // 2. Download image as buffer
  const buf =  await got("https://thisartworkdoesnotexist.com").buffer()

  // 3. Print preview of the buffer
  console.log(await terminalImage.buffer(buf));

  // 4. Add Buffer to IPFS
  let cid = await rarepress.fs.add(buf)
  console.log("cid = ", cid)

  // 5. Create Token
  let token = await rarepress.token.create({
    type: "ERC721",
    metadata: {
      name: "Rare",
      description: "Press",
      image: "/ipfs/" + cid
    }
  })
  console.log("token = ", token)

  // 6. publish files to IPFS
  await rarepress.fs.push(cid)
  await rarepress.fs.push(token.uri)

  // 7. publish token
  await rarepress.token.send(token)
})();
