/******************************************************************************
*
* Add file from Stream
*
* 1. initizliae with default Ethereum derivation path
* 2. download image from a url
* 3. add the buffer to rarepress
* 4. mint an NFT
*
******************************************************************************/
const got = require('got')
const terminalImage = require('terminal-image');
const Rareterm = require('../index');
(async () => {
  // 1. initialize
  const rarepress = new Rareterm()
  await rarepress.init({ host: "https://rinkeby.rarenet.app/v1" })

  // 2. Download image as ReadableStream
  const stream =  await got.stream("https://thisartworkdoesnotexist.com")

  // 3. Add Stream to IPFS
  let cid = await rarepress.fs.add(stream)
  console.log("cid = ", cid)

  // 4. Create Token
  let token = await rarepress.token.create({
    type: "ERC721",
    metadata: {
      name: "Rare",
      description: "Press",
      image: "/ipfs/" + cid
    }
  })
  console.log("token = ", token)

  // 5. publish files to ipfs
  await rarepress.fs.push(cid)
  await rarepress.fs.push(token.uri)

  // 6. publish token
  await rarepress.token.send(token)

})()
