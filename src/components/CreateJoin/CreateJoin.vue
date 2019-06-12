<template>
  <div class="createJoin">
    <el-card>
      <div class="addForm">
        <h1>创建联合挖矿</h1>
        <span class="back-tittle"
              @click="backPage">
          <i class="el-icon-arrow-left"></i>
          {{$t('openWallet.back')}}
        </span>
        <!-- <h5>{{$t('associate.associateAddress')}}</h5> -->
        <el-input placeholder="抵押金额 大于10万MAN"></el-input>
        <el-input placeholder="签名地址后期可修改"></el-input>
        <el-input placeholder="抵押类型（活期/定期）"></el-input>
        <el-input placeholder="抵押类型（活期/定期）"></el-input>
        <el-input placeholder="创建者加权系数"></el-input>
        <div class="show-flex-between">
          <div>
            <el-input class="small-input"
                      placeholder="参与者加权系数1"></el-input>
          </div>
          <div>小于 1万 MAN</div>
        </div>
        <div class="show-flex-between">
          <div>
            <el-input class="small-input"
                      placeholder="参与者加权系数2"></el-input>
          </div>
          <div>1万 -- 10万 MAN</div>
        </div>
        <div class="show-flex-between">
          <div>
            <el-input class="small-input"
                      placeholder="参与者加权系数3"></el-input>
          </div>
          <div>大于 10万 MAN</div>
        </div>
        <button class="common-button"
                @click="confirm">新建联合</button>
      </div>
    </el-card>
  </div>
</template>

<script>
import SendTransfer from '@/assets/js/SendTransfer'
import { joinAbi, joinContract } from '@/assets/js/config.js'
import store from 'store'
import WalletUtil from '@/assets/js/WalletUtil'
import TradingFuns from '@/assets/js/TradingFuns'
export default {
  name: 'createJoin',
  data () {
    return {
    }
  },
  methods: {
    backPage () {
      this.$router.back()
    },
    confirm () {
      let abiArray = JSON.parse(joinAbi)
      let contractAddress = joinContract
      let contract = this.ethProvider.eth.Contract(abiArray, contractAddress)
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
      // console.log('0x' + WalletUtil.str2hex(JSON.stringify([1, 1, 1])))
      jsonObj.data = contract.methods.createValidatorGroup(WalletUtil.getEthAddress(this.address), 0, 1, [1, 10, 1]).encodeABI()
      debugger
      if (this.$store.state.wallet != null) {
        let tx = WalletUtil.createTx(jsonObj)
        let privateKey = this.$store.state.wallet.privateKey
        privateKey = Buffer.from(privateKey.indexOf('0x') > -1 ? privateKey.substring(2, privateKey.length) : privateKey, 'hex')
        tx.sign(privateKey)
        let serializedTx = tx.serialize()
        this.newTxData = SendTransfer.getTxParams(serializedTx)
        let hash = this.httpProvider.man.sendRawTransaction(this.newTxData)
        this.hash = hash
        this.visible = true
        let recordArray = store.get(this.address)
        if ((typeof (recordArray) === 'string')) {
          recordArray = JSON.parse(recordArray)
        }
        if (recordArray == null) {
          recordArray = []
        }
        recordArray.push({ hash: this.hash, newTxData: { commitTime: this.newTxData.commitTime, txType: this.newTxData.txType } })
        store.set(this.address, recordArray)
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
.createJoin {
  width: 1040px;
  .addForm {
    /deep/.el-input {
      width: 26.5rem;
    }
    h5 {
      font-size: 0.875rem;
      color: #2c365c;
      letter-spacing: 0.13px;
      font-weight: bold;
      display: flex;
      margin-left: 18.75rem;
      margin-bottom: 1rem;
    }
    /deep/.el-input {
      display: block;
      margin-top: 1rem;
    }
    .back-tittle {
      position: relative;
      left: 454px;
      top: -33px;
      cursor: pointer;
      color: #1c51dd;
      font-size: 0.88rem;
      letter-spacing: 0.13px;
    }
    .small-input {
      width: 10rem;
      margin-top: 0;
    }
    .show-flex-between {
      width: 26.5rem;
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-top: 1rem;
    }
    .common-button {
      margin-top: 1rem;
    }
  }
}
</style>
