<template>
  <div class="regularMortgage">
    <div>
      <div class="first-left">
        定期抵押账户： 100000 MAN
      </div>
      <div class="commonTable top-spacing">
        <el-table :data="tableData"
                  style="width: 100%">
          <el-table-column label="抵押开始时间"
                           prop="startTime">
          </el-table-column>
          <el-table-column label="抵押时间"
                           prop="depositeTime">
          </el-table-column>
          <el-table-column label="抵押金额"
                           prop="depositeValue">
          </el-table-column>
          <el-table-column label="利息收入"
                           prop="depositeGet">
          </el-table-column>
          <el-table-column label="状态"
                           prop="states">
          </el-table-column>
          <el-table-column label="操作"
                           prop="operation">
          </el-table-column>
        </el-table>
        <div class="content-between">
          <el-pagination background
                         class="top_spacing"
                         layout="prev, pager, next"
                         :page-size="pageSize"
                         :current-page="pageNumber"
                         @current-change="currentChange"
                         :total="total">
          </el-pagination>
        </div>
      </div>
      <button @click="confirm()">aaa</button>
    </div>
  </div>
</template>
<script>
import SendTransfer from '@/assets/js/SendTransfer'
import WalletUtil from '@/assets/js/WalletUtil'
import TradingFuns from '@/assets/js/TradingFuns'
import { mortgage, contract } from '@/assets/js/config'
export default {
  name: 'currentMortgage',
  data () {
    return {
      mortgageAddrress: '',
      tableData: [
        {
          startTime: '2019-1-1',
          depositeTime: '3个月',
          depositeValue: '100000 MAN',
          depositeGet: '173 MAN',
          states: '抵押中',
          operation: '解除抵押'
        }
      ],
      functions: [],
      address: ''
    }
  },
  methods: {
    confirm () {
      try {
        debugger
        let tAbi = JSON.parse(mortgage.abi)
        for (let i in tAbi) {
          if (tAbi[i].type === 'function') {
            tAbi[i].inputs.map(function (i) {
              i.value = ''
            })
            this.functions.push(tAbi[i])
          }
        }
        let curFunc = this.functions[3]
        let fullFuncName = WalletUtil.solidityUtils.transformToFullName(curFunc)
        let funcSig = WalletUtil.getFunctionSignature(fullFuncName)
        let typeName = WalletUtil.solidityUtils.extractTypeName(fullFuncName)
        var types = typeName.split(',')
        types = types[0] === '' ? [] : types
        // var values = []
        var values = [0, 200]
        // for (let i in curFunc.inputs) {
        //   if (curFunc.inputs[i].value) {
        //     if (curFunc.inputs[i].type.indexOf('[') !== -1 && curFunc.inputs[i].type.indexOf(']') !== -1) {
        //       values.push(curFunc.inputs[i].value.split(','))
        //     } else {
        //       values.push(curFunc.inputs[i].value)
        //     }
        //   } else values.push('')
        // }
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
        if (this.$store.state.wallet != null) {
          let tx = WalletUtil.createTx(jsonObj)
          let privateKey = this.$store.state.wallet.privateKey
          privateKey = Buffer.from(privateKey.indexOf('0x') > -1 ? privateKey.substring(2, privateKey.length) : privateKey, 'hex')
          tx.sign(privateKey)
          let serializedTx = tx.serialize()
          this.newTxData = SendTransfer.getTxParams(serializedTx)
          let hash = this.httpProvider.man.sendRawTransaction(this.newTxData)
          this.hash = hash
          this.allMsg = this.$t('successHint.refund')
          this.visible = true
          let recordArray = localStorage.getItem(this.address)
          if (recordArray == null) {
            recordArray = []
          } else {
            recordArray = JSON.parse(recordArray)
          }
          recordArray.push({ hash: this.hash, newTxData: { commitTime: this.newTxData.commitTime, txType: this.newTxData.txType } })
          localStorage.setItem(this.address, JSON.stringify(recordArray))
        } else {
          this.jsonObj = JSON.stringify(jsonObj)
          this.confirmOffline = true
        }
      } catch (e) {
        this.$message.error(e.message)
      }
    }

  },
  mounted () {
    if (this.$store.state.offline != null) {
      this.address = this.$store.state.offline
    } else {
      this.address = this.$store.getters.wallet.address
    }
  }
}
</script>
<style scoped lang="less">
.regularMortgage {
  .first-left {
    text-align: left;
  }
  text-align: center;
  padding: 1.5rem 0 2.5rem;
  /deep/.el-input {
    width: 26.5rem;
  }
  .dis-bottom {
    margin-top: 1rem;
    margin-bottom: 1.5rem;
  }
  .top-spacing {
    margin-top: 2rem;
  }
}
</style>
