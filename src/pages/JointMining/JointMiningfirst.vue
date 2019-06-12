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
      <div class="dis-flex between left-distance distance-top">
        <div>
          <div><span class="font-weight-style">联合账户：</span> MAN.4Pn182LSJ3JNr9by4T5kDKsf127Jb</div>
          <div class="dis-flex between distance-top">
            <div><span class="font-weight-style">活跃账户：</span>318</div>
            <div><span class="font-weight-style">总抵押：</span>1000MAN</div>
          </div>
        </div>
        <div class="distance-top">
          <a @click="setSignAccount()">修改签名地址</a>
        </div>
      </div>
      <hr>
      <div class="dis-flex between left-distance distance-top">
        <div>
          <div><span class="font-weight-style">联合账户：</span> MAN.4Pn182LSJ3JNr9by4T5kDKsf127Jb</div>
          <div class="dis-flex between distance-top">
            <div><span class="font-weight-style">活跃账户：</span>318</div>
            <div><span class="font-weight-style">总抵押：</span>1000MAN</div>
          </div>
        </div>
        <div class="distance-top">
          <a @click="goPage('jointDetail')">详情</a>
        </div>
      </div>
      <hr>
      <div class="dis-flex between left-distance distance-top">
        <div>
          <div><span class="font-weight-style">联合账户：</span> MAN.4Pn182LSJ3JNr9by4T5kDKsf127Jb</div>
          <div class="dis-flex between distance-top">
            <div><span class="font-weight-style">活跃账户：</span>318</div>
            <div><span class="font-weight-style">总抵押：</span>1000MAN</div>
          </div>
        </div>
        <div class="distance-top">
          <a>详情</a>
        </div>
      </div>
      <hr>
      <div class="dis-flex between left-distance distance-top">
        <div>
          <div><span class="font-weight-style">联合账户：</span> MAN.4Pn182LSJ3JNr9by4T5kDKsf127Jb</div>
          <div class="dis-flex between distance-top">
            <div><span class="font-weight-style">活跃账户：</span>318</div>
            <div><span class="font-weight-style">总抵押：</span>1000MAN</div>
          </div>
        </div>
        <div class="distance-top">
          <a>详情</a>
        </div>
      </div>
      <hr>
      <div class="dis-flex between left-distance distance-top">
        <div>
          <div><span class="font-weight-style">联合账户：</span> MAN.4Pn182LSJ3JNr9by4T5kDKsf127Jb</div>
          <div class="dis-flex between distance-top">
            <div><span class="font-weight-style">活跃账户：</span>318</div>
            <div><span class="font-weight-style">总抵押：</span>1000MAN</div>
          </div>
        </div>
        <div class="distance-top">
          <a>详情</a>
        </div>
      </div>
      <hr>
    </el-card>
  </div>
</template>

<script>
import { joinChildAbi, joinContract } from '@/assets/js/config.js'
import store from 'store'
import WalletUtil from '@/assets/js/WalletUtil'
import TradingFuns from '@/assets/js/TradingFuns'
import SendTransfer from '@/assets/js/SendTransfer'
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
    withdrawAll () {
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
      jsonObj.data = contract.methods.withdrawAll().encodeABI()
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
        to: contractAddress,
        value: 100,
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
    },
    withdraw () {
      let abiArray = JSON.parse(joinChildAbi)
      let contractAddress = joinContract
      let contract = this.ethProvider.eth.Contract(abiArray, contractAddress)
      let nonce = this.httpProvider.man.getTransactionCount(this.address)
      nonce = WalletUtil.numToHex(nonce)
      let data = {
        to: contractAddress,
        value: 100,
        gasLimit: 210000,
        data: '',
        gasPrice: 18000000000,
        extra_to: [[0, 0, []]],
        nonce: nonce
      }
      let jsonObj = TradingFuns.getTxData(data)
      jsonObj.data = contract.methods.withdraw(0, this.httpProvider.toWei(100)).encodeABI()
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
    refund () {
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
      jsonObj.data = contract.methods.refund(0).encodeABI()
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
    getReward () {
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
      jsonObj.data = contract.methods.getReward().encodeABI()
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
    // let data = this.httpProvider.man.getValidatorGroupInfo()
    // // data.forEach(item => {
    // //   this.validatorList.push({
    // //     joinAddress: item
    // //     activeNumber: 0
    // //   })
    // // });
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
