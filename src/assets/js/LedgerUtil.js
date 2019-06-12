import TransportWebUSB from '@ledgerhq/hw-transport-webusb'
import MatrixApp from 'ledger-matrix'
import WalletUtil from './WalletUtil'

let LedgerUtil = {}
LedgerUtil.getAddress = (account, change, addressIndex) => {
  return new Promise((resolve, reject) => {
    try {
      TransportWebUSB.list().then(usbs => {
        if (usbs && usbs.length > 0) {
          TransportWebUSB.create().then(transport => {
            if (transport) {
              let app = new MatrixApp(transport)
              app.getAddress(account, change, addressIndex).then(result => {
                if (result) {
                  result.address = WalletUtil.getManAddress(WalletUtil.getEthAddress(result.address))
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
          reject(new Error('no usb'))
        }
      })
    } catch (e) {
      reject(e)
    }
  })
}
export default LedgerUtil
