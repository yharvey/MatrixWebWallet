<template>
  <el-dialog :visible.sync="commonDialogExitVisible"
             :showClose=false
             customClass="common-dialog"
             :width="width"
             :before-close="handleClose"
             center>
    <div class="content">
      <div class="title">{{title}}</div>
      <div class="msg">{{msg}}</div>
    </div>
    <span slot="footer"
          class="dialog-footer">
      <button @click="confirm('cancel')">{{cancelText}}</button>
      <button @click="confirm('ok')">{{okText}}</button>
    </span>
  </el-dialog>
</template>

<script>
import WalletUtil from '@/assets/js/WalletUtil'
import SendTransfer from '@/assets/js/SendTransfer'
import { mortgage, contract } from '@/assets/js/config'
import TradingFuns from '@/assets/js/TradingFuns'

export default {
  name: 'CommonDialog',
  data () {
    return {
      functions: []
    }
  },
  methods: {
    confirm (status) {
      if (status === 'ok') {
        try {
          let tAbi = JSON.parse(mortgage.abi)
          for (let i in tAbi) {
            if (tAbi[i].type === 'function') {
              tAbi[i].inputs.map(function (i) {
                i.value = ''
              })
              this.functions.push(tAbi[i])
            }
          }
          let curFunc = this.functions[5]
          let fullFuncName = WalletUtil.solidityUtils.transformToFullName(curFunc)
          let funcSig = WalletUtil.getFunctionSignature(fullFuncName)
          let typeName = WalletUtil.solidityUtils.extractTypeName(fullFuncName)
          var types = typeName.split(',')
          types = types[0] === '' ? [] : types
          var values = []
          for (let i in curFunc.inputs) {
            if (curFunc.inputs[i].value) {
              if (curFunc.inputs[i].type.indexOf('[') !== -1 && curFunc.inputs[i].type.indexOf(']') !== -1) {
                values.push(curFunc.inputs[i].value.split(','))
              } else {
                values.push(curFunc.inputs[i].value)
              }
            } else values.push('')
          }
          let nonce = this.httpProvider.man.getTransactionCount(this.address)
          nonce = WalletUtil.numToHex(nonce)
          let data = {
            to: contract,
            value: 0,
            gasLimit: 210000,
            data: '',
            gasPrice: 18000000000,
            extra_to: [[0, 0, []]],
            nonce: nonce
          }
          let jsonObj = TradingFuns.getTxData(data)
          jsonObj.data = '0x' + funcSig + WalletUtil.solidityCoder.encodeParams(types, values)
          let tx = WalletUtil.createTx(jsonObj)
          let privateKey = this.$store.state.wallet.privateKey
          privateKey = Buffer.from(privateKey.indexOf('0x') > -1 ? privateKey.substring(2, privateKey.length) : privateKey, 'hex')
          tx.sign(privateKey)
          let serializedTx = tx.serialize()
          this.newTxData = SendTransfer.getTxParams(serializedTx)
          this.httpProvider.man.sendRawTransaction(this.newTxData)
          // this.$message.success(this.$t('successHint.refund'))
        } catch (e) {
          this.$message.error(e.message)
        }
      }
      this.$emit('closeExitDialog', status)
    },
    handleClose () {
      this.$emit('closeExitDialog', 'cancel')
    }
  },
  props: {
    commonDialogExitVisible: {
      default: false,
      type: Boolean
    },
    title: {
      default: '',
      type: String
    },
    msg: {
      default: '',
      type: String
    },
    okText: {
      default: '',
      type: String
    },
    cancelText: {
      default: '',
      type: String
    },
    width: {
      default: '30%',
      type: String
    },
    address: {
      default: '',
      type: String
    }
  }
}
</script>

<style scoped lang="less">
/deep/ .el-dialog__body {
  padding: 0 !important;
}
/deep/ .el-dialog__footer {
  background: rgba(44, 54, 92, 0.03);
  border-radius: 0px 0px 2px 2px;
  height: 3.5rem;
  margin-top: 2.06rem;
}
.common-dialog {
  .content {
    text-align: center;
    color: #2c365c;
    .title {
      font-size: 1rem;
      letter-spacing: -0.28px;
      font-weight: bold;
      margin: 0.75rem 0 0.5rem 0;
    }
    .msg {
      font-size: 0.88rem;
      letter-spacing: -0.5px;
      padding: 0 5.38rem;
    }
  }
  .dialog-footer {
    button {
      width: 5rem;
      height: 2rem;
      border-radius: 2px;
      text-align: center;
      letter-spacing: -0.21px;
      font-size: 0.75rem;
    }
    button:last-child {
      margin-left: 1.5rem;
      color: #fff;
      background: #1c51dd;
    }
    button:first-child {
      background: #fafcff;
      border: 1px solid #2c365c;
      color: #2c365c;
    }
  }
}
</style>
