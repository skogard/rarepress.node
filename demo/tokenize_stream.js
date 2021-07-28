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
const Rarepress = require('../index');
const run = async () => {
  // 1.  Initialize rarepress (Use the default ETH path by not specifying 'key'
  const rarepress = new Rarepress()
  await rarepress.init({
    host: "https://ropsten.rarepress.org/v0"
  })

  // 2. Download image as ReadableStream
  const stream =  await got.stream("https://thisartworkdoesnotexist.com")

  // 3. Add Stream to IPFS
  let cid = await rarepress.add(stream).catch((e) => {
    console.log("ERROR", e)
  })
  console.log("cid = ", cid)

  // 4. Create Token
  let token = await rarepress.create({
    metadata: {
      name: "Rare",
      description: "Press",
      image: "/ipfs/" + cid
    }
  })
  console.log("token = ", token)

}
run()
