<template>
  <div class="online-transfer-form align-center">
    <el-form :rules="rules"
             ref="ruleForm"
             :model="ruleForm"
             class="demo-ruleForm">
      <div class="form-item">
        <div class="input-name"
             style="margin-top: 4px;">{{$t('transfer.Beneficiary')}}：</div>
        <div class="common-input">
          <el-form-item prop="to">
            <el-input :placeholder="$t('transfer.enterRecipient')"
                      v-model="ruleForm.to"></el-input>
          </el-form-item>
        </div>
      </div>
      <!-- 转账金额 -->
      <div class="form-item">
        <div class="input-name">{{$t('NFT ID')}}：</div>
        <div class="input-money">
          <div class="common-input">
            <el-form-item prop="value">
              <el-input :placeholder="$t('transfer.enter') + $t(' NFT ID')"
                        v-model="ruleForm.value"
                        class="input-with-select"
                        type="number">
                <el-select v-model="ruleForm.token"
                           slot="append">
                  <el-option v-for="(item, index) in matrixCoin"
                             :key="index"
                             :label="item.name"
                             :value="item.name"
                             @click.native="getTokenOrMoreBalance(item)"></el-option>
                </el-select>
              </el-input>
            </el-form-item>
          </div>
        </div>
      </div>
      <hr style="border:0.5px #d5d7de dashed">
      <!-- gas 支付方式 -->
      <div class="form-item">
        <div class="two-input">
          <div>
            <div class="input-name">{{$t('transfer.estimatedGas')}}：
              <!-- <a class="sendBalance-font font-dis"
                 @click="estimate">{{$t('transfer.estimate')}}</a> -->
            </div>
            <div class="common-input">
              <el-input v-model="ruleForm.gas"></el-input>
            </div>
          </div>
        </div>
      </div>
    </el-form>
    <!--  生成交易 -->
    <div class="step-button">
      <button class="common-button"
              @click="generateTx">{{$t('transfer.confirm')}}</button>
    </div>
    <transfer-dialog :transferDialogVisible="transferDialogVisible"
                     :width="'800px'"
                     :status="$t('transfer.success')"
                     :msg="$t('transfer.transferComplete')"
                     :amount="ruleForm.value"
                     :from="address"
                     :to="ruleForm.to"
                     :addressList="ruleForm.addressList"
                     :hash="hash"
                     :sendCoin="sendCoin"
                     @transferDialogVisible="changeTransferDialogVisible"></transfer-dialog>
    <confirm-transfer-dialog :confirmVisible="confirmTransfer"
                             :width="'800px'"
                             :status="$t('transfer.success')"
                             :msg="$t('transfer.confirmTransfer')"
                             :amount="ruleForm.value"
                             :from="address"
                             :to="ruleForm.to"
                             @confirmVisible="changeDialogVisible"
                             :addressList="ruleForm.addressList"
                             :sendCoin="sendCoin"
                             @confirmSend="confirmSend"></confirm-transfer-dialog>
    <offline-dialog :width="'800px'"
                    :transferJson="jsonObj"
                    :confirmOffline="confirmOffline"
                    @changeConfirmOffline="changeConfirmOffline"
                    @openSendSign="openSendSign"></offline-dialog>
    <send-sign :visible="sendSignVisible"
               :width="'800px'"
               :information="information"
               @changeSendSign="changeSendSign"></send-sign>
    <transfer-success :successVisible="successVisible"
                      :width="'800px'"
                      :status="$t('transfer.success')"
                      :msg="$t('transfer.transferComplete')"
                      :amount="ruleForm.value"
                      :from="address"
                      :to="ruleForm.to"
                      :addressList="ruleForm.addressList"
                      :hash="hash"
                      :sendCoin="sendCoin"
                      @changeSuccess="changeSuccess">
    </transfer-success>
  </div>
</template>
<script>
import RichText from '@/components/RichText/RichText'
import { nftAbi } from '@/assets/js/config.js'
import DistributedStorage from '@/components/DistributedStorage/DistributedStorage'
import TradingFuns from '@/assets/js/TradingFuns'
import WalletUtil from '@/assets/js/WalletUtil'
import SendTransfer from '@/assets/js/SendTransfer'
import TransferDialog from '@/components/TransferDialog/TransferDialog'
import confirmTransferDialog from '@/components/TransferDialog/confirmTransferDialog'
import Token from '@/assets/js/Token'
import BigNumber from 'bignumber.js'
import OfflineDialog from '@/components/TransferDialog/TipOfflineDialog'
import sendSign from '@/components/TransferDialog/sendSignTransfer'
import transferSuccess from '@/components/TransferDialog/transferSuccess'
import store from 'store'
export default {
  name: 'NFTTransferForm',
  data () {
    return {
      address: '',
      messageType: 'text',
      ruleForm: {
        addressList: [],
        value: '',
        to: '',
        IsEntrustTx: '',
        ExtraTimeTxType: '0',
        gas: this.httpProvider.fromWei(210000 * 18000000000),
        token: 'MAN',
        gasLimit: 210000,
        gasPrice: 18000000000,
        extra_to: [[0, 0, []]],
        data: '',
        nonce: ''
      },
      timingTime: '',
      rules: {
        value: [
          { required: true, message: this.$t('transfer.amountTip'), trigger: 'change' }
        ],
        to: [
          { validator: this.validAddress, trigger: 'change' }
        ]
      },
      balance: 0,
      matrixCoin: [],
      transferDialogVisible: false,
      confirmTransfer: false,
      newTxData: {},
      coinType: 'nfttoken',
      sendTokenObj: {},
      tokenObj: {},
      manBalance: 0,
      hash: '',
      moreType: '',
      sendCoin: 'MAN',
      confirmOffline: false,
      jsonObj: '',
      sendSignVisible: false,
      information: '',
      successVisible: false
    }
  },
  mounted () {
    this.balance = this.$route.params.balance
    this.manBalance = this.balance
    this.ruleForm.token = this.$route.params.currency
    // if (this.ruleForm.token !== 'MAN') {
    this.coinType = 'nfttoken'
    this.moreType = this.ruleForm.token
    this.sendCoin = this.ruleForm.token
    // }
    if (this.$store.state.wallet != null) {
      this.address = this.$store.getters.wallet.address
    } else {
      this.address = this.$store.state.offline
    }
    this.getToken()
  },
  methods: {
    changeSuccess () {
      this.successVisible = false
      this.ruleForm = {
        addressList: [],
        value: '',
        to: '',
        IsEntrustTx: '',
        ExtraTimeTxType: '0',
        gas: this.httpProvider.fromWei(210000 * 18000000000),
        token: 'MAN',
        gasLimit: 210000,
        gasPrice: 18000000000,
        extra_to: [[0, 0, []]],
        data: '',
        nonce: ''
      }
      this.ruleForm.token = 'MAN'
      this.coinType = ''
      this.moreType = ''
      this.sendCoin = 'MAN'
    },
    openSendSign () {
      this.sendSignVisible = true
    },
    changeSendSign (data) {
      this.sendSignVisible = false
      if (data != null && data !== false) {
        this.hash = data.hash
        this.successVisible = true
      }
    },
    changeConfirmOffline (data) {
      this.confirmOffline = false
      if (data !== false) {
        this.sendSignVisible = true
        this.information = data
      }
    },
    getToken () { // 获本地token代币
      let tokenArray = store.get('nftoken')
      if (tokenArray === undefined || tokenArray === null) {
        tokenArray = [{nftContract: 'MAN.2gRxHsKucf5EeDNi9Bg87EGG7Zxft', nftName: 'MANIA'}]
      } else {
        tokenArray.push({nftContract: 'MAN.2gRxHsKucf5EeDNi9Bg87EGG7Zxft', nftName: 'MANIA'})
      }
      if (typeof (tokenArray) === 'string') {
        tokenArray = JSON.parse(tokenArray)
      }
      console.log(tokenArray)
      if (tokenArray != null) {
        // tokenArray = JSON.parse(tokenArray)
        tokenArray.forEach(e => {
          this.matrixCoin.push({
            name: e.nftName,
            type: 'nftoken',
            tokenContract: e.nftContract,
            tokenName: e.nftName
          })
        })
      } else {
        this.$message.error('get nft token error!')
      }
      console.log('matrixCoin', this.matrixCoin)
    },
    getTokenOrMoreBalance (item) {
      console.log(item)
      try {
        if (item.type === 'nftoken') {
          let currency = item.tokenContract.split('.')[0]
          let tokenObj = new Token(WalletUtil.getAddress(item.tokenContract), WalletUtil.getAddress(this.address), item.tokenName, item.digits, currency)
          this.tokenObj = tokenObj
          let sendTokenBalance = tokenObj.setBalance()
          sendTokenBalance.currency = currency
          console.log(sendTokenBalance)
          let result = this.httpProvider.man.call(sendTokenBalance)
          this.coinType = 'nftoken'
          this.sendTokenObj = item
          if (result === '0x') {
            this.balance = 0
          } else {
            this.balance = result
          }
          this.ruleForm.addressList = []
          this.sendCoin = item.name
        } else {
          this.$message.error('Invalid NFT')
        }
      } catch (e) {
        this.$message.error(e.message)
      }
    },
    changeMessageType (status) {
      if (this.messageType !== status) {
        this.messageType = status
      }
    },
    changeDialogVisible (val) {
      this.confirmTransfer = val
    },
    changeTransferDialogVisible (val) {
      this.transferDialogVisible = val
      this.ruleForm = {
        addressList: [],
        value: '',
        to: '',
        IsEntrustTx: '',
        ExtraTimeTxType: '0',
        gas: this.httpProvider.fromWei(210000 * 18000000000),
        token: 'MAN',
        gasLimit: 210000,
        gasPrice: 18000000000,
        extra_to: [[0, 0, []]],
        data: '',
        nonce: ''
      }
      this.ruleForm.token = 'MAN'
      this.coinType = ''
      this.moreType = ''
      this.sendCoin = 'MAN'
    },
    queryRecordOrBalance (type) {
      this.balanceShow = type
    },
    generateTx () {
      this.$refs['ruleForm'].validate((valid) => {
        if (valid) {
          try {
            this.ruleForm.to = this.ruleForm.to.trim()
            // if (this.coinType === 'more') {
            //   let address = WalletUtil.getCurrencyAddress(this.address, this.moreType)
            //   this.ruleForm.nonce = this.httpProvider.man.getTransactionCount(address)
            //   this.ruleForm.nonce = WalletUtil.numToHex(this.ruleForm.nonce)
            // } else {
            this.ruleForm.nonce = this.httpProvider.man.getTransactionCount(this.address)
            this.ruleForm.nonce = WalletUtil.numToHex(this.ruleForm.nonce)
            // }
            if (new BigNumber(this.ruleForm.gas).comparedTo(this.httpProvider.fromWei(210000 * 18000000000)) === 1) {
              let gasNumber = new BigNumber(this.httpProvider.toWei(this.ruleForm.gas))
              this.ruleForm.gasLimit = parseInt(gasNumber.div(new BigNumber(18000000000)).toString(10)) + 1
            }
            if (this.ruleForm.value < 0) {
              this.$message.error(this.$t('errorMsgs.valueError'))
              return
            }
            this.ruleForm.extra_to = [[parseInt(this.ruleForm.ExtraTimeTxType), 0, []]]
            if (this.coinType === 'more' && this.ruleForm.to.split('.')[0] !== this.moreType) {
              this.$message.error(this.$t('transfer.addressTip'))
              return false
            }
            let jsonObj = TradingFuns.getTxData(this.ruleForm)
            // if (this.messageType === 'distributedStorage') {
            //   let dataStr = WalletUtil.str2hex(this.ruleForm.data)
            //   let crcNum = WalletUtil.crc32(this.ruleForm.data)
            //   let crcHex = (crcNum < 0 ? -crcNum : crcNum).toString(16)
            //   let data = '0x6d61747269780000' + dataStr + crcHex
            //   this.ruleForm.data = data
            // }
            // console.log(this)
            // 发送token代币
            let abiArray = JSON.parse(nftAbi)
            let contractAddress = this.sendTokenObj.tokenContract
            let contract = this.httpProvider.man
              .contract(abiArray)
              .at(contractAddress)
            jsonObj.data = contract.safeTransferFrom.getData(
              WalletUtil.getAddress(this.address),
              WalletUtil.getAddress(jsonObj.to),
              this.ruleForm.value
            )
            // jsonObj.data = this.tokenObj.getData(WalletUtil.getAddress(jsonObj.to), this.ruleForm.value).data
            jsonObj.to = this.sendTokenObj.tokenContract
            jsonObj.value = '0x0'
            console.log(jsonObj)
            if (this.$store.state.wallet != null) {
              if (this.$store.state.wallet.privateKey) {
                let tx = WalletUtil.createTx(jsonObj)
                let privateKey = this.$store.state.wallet.privateKey
                privateKey = Buffer.from(privateKey.indexOf('0x') > -1 ? privateKey.substring(2, privateKey.length) : privateKey, 'hex')
                tx.sign(privateKey)
                let serializedTx = tx.serialize()
                this.newTxData = SendTransfer.getTxParams(serializedTx)
                this.confirmTransfer = true
              } else {
                this.confirmOffline = true
                this.jsonObj = JSON.stringify(jsonObj)
              }
            } else {
              this.confirmOffline = true
              this.jsonObj = JSON.stringify(jsonObj)
            }
          } catch (e) {
            this.$message.error(e.message)
          }
        } else {
          return false
        }
      })
    },
    addAccount () {
      this.ruleForm.addressList.push({
        value: '',
        to: ''
      })
    },
    delrecords (index) {
      this.ruleForm.addressList.splice(index, 1)
    },
    editData (data) {
      this.ruleForm.data = data
    },
    confirmSend (state) {
      try {
        if (state === 'ok') {
          let hash = this.httpProvider.man.sendRawTransaction(this.newTxData)
          let recordArray = store.get(this.address)
          if ((typeof (recordArray) === 'string')) {
            recordArray = JSON.parse(recordArray)
          }
          if (recordArray == null) {
            recordArray = []
          }
          recordArray.push({ hash: hash, newTxData: { commitTime: this.newTxData.commitTime, txType: this.newTxData.txType } })
          store.set(this.address, recordArray)
          // store.set(this.address, recordArray)
          this.transferDialogVisible = true
          this.hash = hash
          this.confirmTransfer = false
        } else {
          this.confirmTransfer = false
        }
      } catch (e) {
        this.$message.error(e.message)
      }
    },
    validAddress (rule, address, callback) {
      if (!WalletUtil.validateAddress(address.trim())) {
        callback(new Error(window.i18n.t('transfer.addressTip' + '1')))
      } else if (this.coinType === 'more' && address.split('.')[0] !== this.moreType) {
        callback(new Error(window.i18n.t('transfer.addressTip' + '2')))
      } else {
        callback()
      }
    },
    inputData (data) {
      this.ruleForm.data = JSON.stringify(data)
    }
  },
  components: {
    RichText,
    DistributedStorage,
    TransferDialog,
    confirmTransferDialog,
    OfflineDialog,
    sendSign,
    transferSuccess
  }
  // watch: {
  //   ruleForm: {
  //     handler: function (val, oldval) {
  //
  //     },
  //     deep: true // 对象内部的属性监听，也叫深度监听
  //   }
  // }
}
</script>

<style scoped lang="less">
.online-transfer-form {
  text-align: left;
  .first_hr {
    background-color: #d5d7de;
    margin-top: 1rem;
    margin-bottom: 1.5rem;
    border: none;
    height: 1px;
  }
  .el-form {
    padding-bottom: 2rem;
    border-bottom: 1px #d5d7de solid;
  }
  .input-name {
    font-size: 14px;
    color: #2c365c;
    letter-spacing: 0.13px;
    margin-top: 1.94rem;
    margin-bottom: 1rem;
  }
  .input-money {
    display: flex;
  }
  .common-input {
    width: 26.5rem;
    height: 2.5rem;
  }
  /deep/ .el-select {
    width: 63px;
    .el-input__inner {
      padding-right: 0 !important;
      padding-left: 5px !important;
    }
  }
  hr {
    margin: 31px 0 15px 0;
  }
  .add-receipt {
    text-align: center;
    font-size: 0.88rem;
    color: #1c51dd;
    letter-spacing: 0.13px;
    cursor: pointer;
  }
  .two-input {
    /deep/ .el-select {
      width: 100% !important;
    }
  }
  .message-type {
    display: flex;
    margin-bottom: 1.63rem;
    div {
      width: 7.25rem;
      height: 2.25rem;
      line-height: 2.25rem;
      text-align: center;
      background: #f8f8fa;
      border-radius: 1px;
      font-size: 0.75rem;
      color: #2c365c;
      letter-spacing: 0;
      cursor: pointer;
    }
    .active {
      color: #1c51dd;
      background: #fff;
    }
  }
  .step-button {
    text-align: center;
    .common-button {
      margin: 2rem 0 3rem 0;
    }
  }
  .balance-font {
    font-size: 0.75rem;
    color: #9298ae;
    letter-spacing: 0.11px;
  }
  .sendBalance-font {
    font-size: 12px;
    color: #1c51dd;
    letter-spacing: 0.11px;
    cursor: pointer;
  }
  .balance-height {
    line-height: 60px;
  }
  .font-dis {
    margin-left: 1rem;
  }
  .hint-error {
    font-size: 0.875rem;
    color: #ed3c1c;
    letter-spacing: 0.13px;
    float: right;
    cursor: pointer;
  }
  /deep/.el-select {
    min-width: 114px;
  }
}
/deep/.el-card__body {
  padding: 1.625rem 0 3rem 0;
}
/deep/.el-input__prefix {
  display: none;
}
.block {
  margin: 1rem 0;
}
</style>
