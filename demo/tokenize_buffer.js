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
const Rarepress = require('../index');
const run = async () => {
  // 1.  Initialize rarepress (Use the default ETH path by not specifying 'key'
  const rarepress = new Rarepress()
  await rarepress.init({
    host: "https://ropsten.rarepress.org/v0"
  })

  // 2. Download image as buffer
  const buf =  await got("https://thisartworkdoesnotexist.com").buffer()

  // 3. Print preview of the buffer
  console.log(await terminalImage.buffer(buf));

  // 4. Add Buffer to IPFS
  let cid = await rarepress.add(buf).catch((e) => {
    console.log("ERROR", e)
  })
  console.log("cid = ", cid)

  // 5. Create Token
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
