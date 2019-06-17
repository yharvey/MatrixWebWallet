<template>
  <div class="jointMining">
    <el-card class="box-card1">
      <div class="header">
        <h1>联合挖矿</h1>
        <button class="common-button"
                @click="goPage('createJoin')">创建联合</button>
      </div>
    </el-card>
    <el-card class="box-card2">
      <div v-for="(item,index) in validatorList"
           :key="index">
        <div class="dis-flex between left-distance distance-top">
          <div>
            <div><span class="font-weight-style">联合账户：</span> {{item.jointAccount}}</div>
            <div class="dis-flex between distance-top">
              <div><span class="font-weight-style">活跃账户：</span>{{item.activeCount}}</div>
              <div><span class="font-weight-style">总抵押：</span>{{item.allAmount }}MAN</div>
            </div>
          </div>
          <div>
            <div class="font-style"
                 v-if="item.alreadyWithdraw"><span>抵押已解除</span></div>
            <div class="font-style"
                 v-else><span>抵押中</span></div>
            <a @click="jointDetail(item)">详情</a>
          </div>
        </div>
        <hr>
      </div>
    </el-card>
  </div>
</template>

<script>
import { joinChildAbi, joinContract } from '@/assets/js/config.js'
import store from 'store'
import WalletUtil from '@/assets/js/WalletUtil'
import TradingFuns from '@/assets/js/TradingFuns'
import SendTransfer from '@/assets/js/SendTransfer'
import filter from '@/assets/js/filters'
import BigNumber from 'bignumber.js'
export default {
  name: 'jointMining',
  data () {
    return {
      validatorList: []
    }
  },
  methods: {
    goPage (url) {
      this.$router.push({ path: '/jointMining/' + url })
    },
    jointDetail (detailObj) {
      this.$router.push({ name: 'JointDetail', params: { detailObj: detailObj } })
    },
    setSignAccount () {
      let abiArray = JSON.parse(joinChildAbi)
      let contractAddress = joinContract
      let contract = this.ethProvider.eth.Contract(abiArray, contractAddress)
      let nonce = this.httpProvider.man.getTransactionCount(this.address)
      nonce = WalletUtil.numToHex(nonce)
      let data = {
        to: contractAddress,
        value: 0,
        gasLimit: 210000,
        data: '',
        gasPrice: 18000000000,
        extra_to: [[0, 0, []]],
        nonce: nonce
      }
      let jsonObj = TradingFuns.getTxData(data)
      jsonObj.data = contract.methods.setSignAccount(WalletUtil.getEthAddress('MAN.4QwwVrHiXPPuVqCddhEQFnPfGhri5')).encodeABI()
      if (this.$store.state.wallet != null) {
        let tx = WalletUtil.createTx(jsonObj)
        let privateKey = this.$store.state.wallet.privateKey
        privateKey = Buffer.from(privateKey.indexOf('0x') > -1 ? privateKey.substring(2, privateKey.length) : privateKey, 'hex')
        tx.sign(privateKey)
        let serializedTx = tx.serialize()
        this.newTxData = SendTransfer.getTxParams(serializedTx)
        let hash = this.httpProvider.man.sendRawTransaction(this.newTxData)
        this.hash = hash
        console.log(hash)
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
    },
    addDeposit () {
      let abiArray = JSON.parse(joinChildAbi)
      let contractAddress = joinContract
      let contract = this.ethProvider.eth.Contract(abiArray, contractAddress)
      let nonce = this.httpProvider.man.getTransactionCount(this.address)
      nonce = WalletUtil.numToHex(nonce)
      let data = {
        to: 'MAN.4N33zUiDrgL182kTkCgYEKJXwwyBV',
        value: 1000,
        gasLimit: 210000,
        data: '',
        gasPrice: 18000000000,
        extra_to: [[0, 0, []]],
        nonce: nonce
      }
      let jsonObj = TradingFuns.getTxData(data)
      jsonObj.data = contract.methods.addDeposit(0).encodeABI()
      if (this.$store.state.wallet != null) {
        let tx = WalletUtil.createTx(jsonObj)
        let privateKey = this.$store.state.wallet.privateKey
        privateKey = Buffer.from(privateKey.indexOf('0x') > -1 ? privateKey.substring(2, privateKey.length) : privateKey, 'hex')
        tx.sign(privateKey)
        let serializedTx = tx.serialize()
        this.newTxData = SendTransfer.getTxParams(serializedTx)
        let hash = this.httpProvider.man.sendRawTransaction(this.newTxData)
        this.hash = hash
        console.log(hash)
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
  components: {
  },
  mounted () {
    let data = this.httpProvider.man.getValidatorGroupInfo()
    console.log(data)
    if (this.$store.state.offline != null) {
      this.address = this.$store.state.offline
    } else {
      this.address = this.$store.getters.wallet.address
    }
    let self = this
    Object.keys(data).forEach(function (key) {
      let item = data[key]
      let allAmount = new BigNumber(0)
      if (item.ValidatorMap != null) {
        item.ValidatorMap.forEach(validator => {
          allAmount = allAmount.plus(filter.weiToNumber(validator.AllAmount))
        })
        let alreadyWithdraw = false
        if (item.OwnerInfo.WithdrawAllTime !== 0) {
          alreadyWithdraw = true
        }
        self.validatorList.push({
          jointAccount: WalletUtil.getManAddress(key),
          activeCount: item.ValidatorMap.length,
          allAmount: allAmount.toString(10),
          signAddress: WalletUtil.getManAddress(item.OwnerInfo.SignAddress),
          validatorMap: item.ValidatorMap,
          createAddress: WalletUtil.getManAddress(item.OwnerInfo.Owner),
          alreadyWithdraw: alreadyWithdraw
        })
      }
    })
  }
}
</script>

<style scoped lang="less">
.jointMining {
  margin: auto;
  width: 1040px;
  .box-card1 {
    .header {
      display: flex;
      justify-content: space-between;
      h1 {
        font-size: 2.25rem;
      }
      .common-button {
        width: 10.5rem;
      }
    }
  }
  .font-weight-style {
    font-size: 0.875rem;
    color: #2c365c;
    letter-spacing: 0.13px;
    font-weight: bold;
  }
  .font-style {
    font-size: 0.875rem;
    color: #2c365c;
    letter-spacing: 0.13px;
    margin-bottom: 1.4rem;
  }
  .box-card2 {
    .dis-flex {
      display: flex;
    }
    .between {
      justify-content: space-between;
    }
    .left-distance {
      padding-left: 2rem;
      padding-right: 10rem;
    }
    .distance-top {
      margin-top: 1.5rem;
    }
  }
  a {
    font-size: 0.875rem;
    color: #1c51dd;
    margin-left: 1.5rem;
    cursor: pointer;
  }
}
</style>
