/******************************************************************************
*
* Minimal mint + trade app
*
* 1. initizliae with default settings
* 2. add web image to rarepress
* 3. mint NFT
* 4. create a trade order
*
******************************************************************************/
const Rarepress = require('../index');
const run = async () => {
  // 1.  Initialize rarepress
  const rarepress = new Rarepress()
  await rarepress.init({ host: "https://ropsten.rarepress.org/v0" })

  // 2. Add to IPFS
  let cid = await rarepress.add("https://thisartworkdoesnotexist.com")

  // 3. Mint NFT
  let token = await rarepress.create({
    metadata: {
      name: "Rare",
      description: "Press",
      image: "/ipfs/" + cid
    }
  })
  console.log("token = ", token)

  // 4. Create a trade position
  let trade = await rarepress.trade.create({
    what: { type: "ERC721", id: token.tokenId, },
    with: { type: "ETH", value: 100000000000000000 }
  })
  console.log("trade = ", trade)

}
run()
