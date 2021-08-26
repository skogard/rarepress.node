/**************************************************
*
* 1. Create token draft
* 2. some time passes...
* 3. Query saved token draft
* 4. Create trade draft
* 5. publish token
* 6. publish trade
*
**************************************************/
const Rareterm = require('../index');
const rarepress = new Rareterm();
(async () => {
  // 1. initialize
  await rarepress.init({ host: "https://rinkeby.rarenet.app/v1" })

  // 2. create token
  const cid = await rarepress.fs.add("https://thisartworkdoesnotexist.com")

  // 3. Create a signed token locally
  let token = await rarepress.token.create({
    type: "ERC721",
    metadata: {
      name: "Title goes here",
      description: "Description goes here",
      image: "/ipfs/" + cid,
    },
  })

  // Time passes....

  // 4. Query from DB
  let item = await rarepress.token.queryOne({
    where: { tokenId: token.tokenId }
  })
  console.log("queried item", item)
  let storedToken = JSON.parse(item.body)

  console.log("stored token", storedToken)

  // 5. Create trade
  let trade = await rarepress.trade.create({
    what: { type: "ERC721", id: storedToken.tokenId, },
    with: { type: "ETH", value: 23* 100000000000000000 }
  })
  console.log("trade = ", trade)

  // 6. Publish (files, token, trade)

  // 6.1. Publish files to IPFS
  await rarepress.fs.push(item.image)
  await rarepress.fs.push(item.uri)

  // 6.2. Publish token
  let sentToken = await rarepress.token.send(token)
  console.log("sent token", sentToken)

  // 6.3. Publish trade
  let sentTrade = await rarepress.trade.send(trade)
  console.log("sent trade", sentTrade)

  process.exit()
})();
