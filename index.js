const Rareterm = require('rareterm')
const mushie = require('mushie')
const fetch = require('node-fetch')
const FormData = require('form-data');
const sigUtil = require('eth-sig-util');
const priv2addr = require('ethereum-private-key-to-address')
const { v4: uuidv4 } = require('uuid');
class FD extends FormData {
  append(key, blob) {
    let uuid = uuidv4();
    return super.append(key, blob, { filename: uuid })
  }
}
class RaretermNode extends Rareterm {
  async login (path) {
    await this.wallet.switch(path)
    await this.sync(this.wallet)
    return this.wallet.address
  }
  async init(o) {
    let maker = await mushie.maker()
    let derivationPath = (o.key ? o.key : "m'/44'/60'/0'/0/0")  // if there's no key, use the default ETH path
    let self = this;
    this.wallet = await maker.make({
      key: derivationPath,
      init: async (mushie) => {
        mushie.address = await mushie.ethereum.request({
          method: "eth_requestAccounts"
        }).then((r) => {
          return r[0]
        })
      },
      use: {
        ethereum: (key) => {
          return {
            request: async (o) => {
              if (o.method === "eth_signTypedData_v4") {
                return sigUtil.signTypedData_v4(key.privateKey, { data: JSON.parse(o.params[1]) });
              } else if (o.method === "personal_sign") {
                return sigUtil.personalSign(key.privateKey, { data: o.params[1] });
              } else if (o.method === "eth_requestAccounts") {
                return [priv2addr(key.privateKey)]
              }
            }
          }
        },
        host: (key) => {
          return o.host
        },
        http: (key) => {
          return {
            fetch,
            FormData: FD
          }
        }
      }
    })
    let account = await super.init(this.wallet)
    return account
  }
}
module.exports = RaretermNode
