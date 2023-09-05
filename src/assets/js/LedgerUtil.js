import TransportWebUSB from '@ledgerhq/hw-transport-webusb'
import MatrixAIApp from '@zondax/ledger-matrix'
import WalletUtil from './WalletUtil'

let LedgerUtil = {}
LedgerUtil.getAddress = (account, change, addressIndex) => {
  return new Promise((resolve, reject) => {
    try {
      TransportWebUSB.isSupported().then(status => {
        if (status) {
          TransportWebUSB.create().then(transport => {
            if (transport) {
              const PATH = "m/44'/318'/0'/0/0"
              let app = new MatrixAIApp(transport)
              // e.g "m/44'/5757'/5'/0/3")
              app.showAddressAndPubKey(PATH).then(result => {
                if (result) {
                  console.log(result)
                  let manaddr = Buffer.from(result.address.split(',')).toString()
                  result.address = WalletUtil.getManAddress(WalletUtil.getAddress(manaddr))
                  resolve(result)
                } else {
                  reject(new Error('get address failed'))
                }
              }).catch(err => {
                reject(err)
              })
            } else {
              reject(new Error('connection failed'))
            }
          }).catch(err => {
            reject(err)
          })
        } else {
          reject(new Error('no supported'))
        }
      })
    } catch (e) {
      reject(e)
    }
  })
}

LedgerUtil.sign = (tx) => {
  return new Promise((resolve, reject) => {
    try {
      TransportWebUSB.isSupported().then(status => {
        if (status) {
          TransportWebUSB.create().then(transport => {
            if (transport) {
              const PATH = "m/44'/318'/0'/0/0"
              // const BLOB = Buffer.from(
              //   'f84d8710000000000000850430e2340083033450a14d414e2e3246745a483939796f533747695564516a64514c553534364e65474739880de0b6b3a76400008001808080808464c3d5f5c4c38080c0',
              //   'hex'
              // )
              // const MatrixAI = new MatrixAIApp(transport)

              // // Retrieve pubkey and address and log them
              // const addressCmd = MatrixAI.getAddressAndPubKey(PATH)
              // console.log(addressCmd.address)
              // console.log(addressCmd.publicKey.toString('hex'))

              // // Try to sign a transaction and log the response
              // const signResponse = MatrixAI.sign(PATH, BLOB)
              // console.log(`Return code ${signResponse.returnCode}`)
              // console.log(`Error message ${signResponse.errorMessage}`)
              // console.log(`DER signature ${signResponse.signatureDER.toString('hex')}`)
              // console.log(`RSV signature ${signResponse.signatureRSV.toString('hex')}`)
              let app = new MatrixAIApp(transport)
              const buffer = Buffer.from(tx.toString('hex'), 'hex')
              // console.log(buffer)
              // const BLOB = Buffer.from(
              //   'f84d8710000000000000850430e2340083033450a14d414e2e3246745a483939796f533747695564516a64514c553534364e65474739880de0b6b3a76400008001808080808464c3d5f5c4c38080c0',
              //   'hex')
              // console.log(BLOB)
              app.sign(PATH, buffer).then(response => {
                console.log(response)
                if (response.returnCode === 36864) {
                  resolve(response)
                } else {
                  reject(new Error('ledger sign error'))
                }
              })
            } else {
              reject(new Error('connection failed'))
            }
          }).catch(err => {
            reject(err)
          })
        } else {
          reject(new Error('no supported'))
        }
      })
    } catch (e) {
      reject(new Error('error'))
    }
  })
}
export default LedgerUtil
