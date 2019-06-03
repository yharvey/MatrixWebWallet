<template>
  <div class="CampaignNode">
    <div class="addForm">
      <h1 class="h1-dis">{{$t('CampaignNode.mortgage')}}</h1>
      <h5>{{$t('CampaignNode.Mining_type')}}</h5>
      <el-select v-model="mortgageType"
                 :placeholder="$t('CampaignNode.select')">
        <el-option v-for="item in mortgageList"
                   :key="item.key"
                   :label="item.name"
                   :value="item.key">
        </el-option>
      </el-select>
      <h5>{{$t('CampaignNode.mortgage_man')}}</h5>
      <div>
        <el-select v-model="mortgageWay"
                   :placeholder="$t('CampaignNode.selectMortgageWay')">
          <el-option v-for="item in mortgageWayList"
                     :key="item.key"
                     :label="item.name"
                     :value="item.key">
          </el-option>
        </el-select>
      </div>
      <el-input v-model="value"></el-input>
      <div v-show="mortgageWay==='regular'">
        <el-select v-model="timeLimit"
                   :placeholder="$t('CampaignNode.selectTimeLimit')">
          <el-option v-for="item in timeLimitList"
                     :key="item.key"
                     :label="item.name"
                     :value="item.key">
          </el-option>
        </el-select>
      </div>
      <!-- <h5>{{$t('transfer.estimatedGas')}}</h5>
      <el-input disabled=""></el-input> -->
      <h5>{{$t('CampaignNode.dig_address')}}</h5>
      <el-input v-model="mortgageAddrress"></el-input>
      <h4 class="h4-delDis"
          v-html="$t('CampaignNode.mortgage_hint1')"></h4>
      <h4 v-html="$t('CampaignNode.mortgage_hint2')"></h4>
      <hr>
      <button class="common-button"
              @click="getTxData">{{$t('CampaignNode.mortgage-button')}}</button>
    </div>
    <all-dialog :visible="visible"
                @changeVisible="changeVisible"
                :width="'800px'"
                :msg="msg"
                :hash="hash"></all-dialog>
    <offline-dialog :width="'800px'"
                    :transferJson="jsonObj"
                    :confirmOffline="confirmOffline"
                    @changeConfirmOffline="changeConfirmOffline"
                    @openSendSign="openSendSign"></offline-dialog>
    <send-sign :visible="sendSignVisible"
               :width="'800px'"
               :information="information"
               @changeSendSign="changeSendSign"></send-sign>
  </div>
</template>

<script>
import WalletUtil from '@/assets/js/WalletUtil'
import SendTransfer from '@/assets/js/SendTransfer'
import { mortgage, contract } from '@/assets/js/config'
import TradingFuns from '@/assets/js/TradingFuns'
import AllDialog from '@/components/TransferDialog/AllDialog'
import GreenDialog from '@/components/TransferDialog/GreenDialog'
import BigNumber from 'bignumber.js'
import OfflineDialog from '@/components/TransferDialog/TipOfflineDialog'
import sendSign from '@/components/TransferDialog/sendSignTransfer'
import transferSuccess from '@/components/TransferDialog/transferSuccess'

export default {
  name: 'campaignNode',
  data () {
    return {
      address: '',
      mortgageList: [{ name: '', key: 'minerDeposit' }, { name: '', key: 'valiDeposit' }],
      mortgageWayList: [{ name: '', key: 'regular' }, { name: '', key: 'current' }],
      timeLimitList: [{ name: 'oneMonth', key: '1' }, { name: 'threeMonth', key: '3' }, { name: 'sixMonth', key: '6' }],
      timeLimit: '',
      mortgageWay: '',
      mortgageType: '',
      functions: [],
      value: '',
      mortgageAddrress: '',
      hash: '',
      msg: '',
      visible: false,
      alertable: true,
      confirmOffline: false,
      jsonObj: '',
      sendSignVisible: false,
      information: '',
      successVisible: false
    }
  },
  methods: {
    changeSuccess () {
      this.successVisible = false
    },
    openSendSign () {
      this.sendSignVisible = true
    },
    changeSendSign (data) {
      this.sendSignVisible = false
      if (data != null && data !== false) {
        this.hash = data.hash
        this.visible = true
        this.mortgageAddrress = ''
        this.value = ''
      }
    },
    changeConfirmOffline (data) {
      this.confirmOffline = false
      if (data !== false) {
        this.sendSignVisible = true
        this.information = data
      }
    },
    changeAlertable () {
      this.$router.push({ path: '/my-wallet/openWallet/myAssets' })
    },
    changeVisible (state) {
      this.visible = state
      this.mortgageAddrress = ''
      this.value = ''
    },
    initContract () {
      this.functions = []
      let tAbi = JSON.parse(mortgage.abi)
      for (var i in tAbi) {
        if (tAbi[i].type === 'function') {
          tAbi[i].inputs.map(function (i) {
            i.value = ''
          })
          this.functions.push(tAbi[i])
        }
      }
    },
    getTxData () {
      try {
        if (!WalletUtil.validateManAddress(this.mortgageAddrress)) {
          this.$message.error(this.$t('transfer.addressTip'))
          return
        }
        if (this.mortgageType === '') {
          this.$message.error(this.$t('CampaignNode.mortgageTypeError'))
          return
        }
        if (this.value.trim() === '') {
          this.$message.error(this.$t('CampaignNode.valueError'))
          return
        }
        let balances = this.httpProvider.man.getBalance(this.address)
        let balance = this.httpProvider.fromWei(balances[0].balance)
        let compareBalance = new BigNumber(balance)
        let campaignValue = new BigNumber(this.value)
        let flag = campaignValue.comparedTo(compareBalance)
        if (flag > 0) {
          this.$message.error(this.$t('CampaignNode.campaignvalueError2'))
          return
        }
        let curFunc
        this.functions.forEach(e => {
          if (e.name.indexOf(this.mortgageType) !== -1) {
            curFunc = e
          }
        })
        let addrTemp = this.mortgageAddrress
        curFunc.inputs[0].value = SendTransfer.sanitizeHex(WalletUtil.addressChange(addrTemp.split('.')[1]))

        if (this.mortgageWay === 'current') {
          curFunc.inputs[1].value = '0x' + new BigNumber(0).toString(16)
        } else {
          curFunc.inputs[1].value = '0x' + new BigNumber(parseInt(this.timeLimit)).toString(16)
        }
        let fullFuncName = WalletUtil.solidityUtils.transformToFullName(curFunc)
        let funcSig = WalletUtil.getFunctionSignature(fullFuncName)
        let typeName = WalletUtil.solidityUtils.extractTypeName(fullFuncName)
        var types = typeName.split(',')
        types = types[0] === '' ? [] : types
        var values = []
        for (var i in curFunc.inputs) {
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
          value: this.value,
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
          this.hash = this.httpProvider.man.sendRawTransaction(this.newTxData)
          this.visible = true
          let recordArray = window.localStorage.getItem(this.address)
          if (recordArray == null) {
            recordArray = []
          } else {
            recordArray = JSON.parse(recordArray)
          }
          recordArray.push({ hash: this.hash, newTxData: { commitTime: this.newTxData.commitTime, txType: this.newTxData.txType } })
          window.localStorage.setItem(this.address, JSON.stringify(recordArray))
        } else {
          this.confirmOffline = true
          this.jsonObj = JSON.stringify(jsonObj)
        }
        this.msg = this.$t('mortgageHistory.mortgageSuccess')
      } catch (e) {
        this.$message.error(e.message)
      }
    }
  },
  mounted () {
    this.mortgageList[0].name = this.$t('CampaignNode.Mining_mortgage')
    this.mortgageList[1].name = this.$t('CampaignNode.Validator_mortgage')
    this.mortgageWayList[0].name = this.$t('CampaignNode.regular')
    this.mortgageWayList[1].name = this.$t('CampaignNode.current')
    this.timeLimitList[0].name = this.$t('CampaignNode.oneMonth')
    this.timeLimitList[1].name = this.$t('CampaignNode.threeMonth')
    this.timeLimitList[2].name = this.$t('CampaignNode.sixMonth')
    if (this.$store.state.offline != null) {
      this.address = this.$store.state.offline
    } else {
      this.address = this.$store.getters.wallet.address
    }
    this.initContract()
  },
  components: {
    AllDialog,
    GreenDialog,
    OfflineDialog,
    sendSign,
    transferSuccess
  }
}
</script>
<style scoped lang="less">
.CampaignNode {
  .hint-error {
    font-size: 0.875rem;
    color: #ed3c1c;
    letter-spacing: 0.13px;
    cursor: pointer;
  }
  text-align: center;
  padding-bottom: 2.5rem;
  /deep/.el-input {
    width: 26.5rem;
    margin-bottom: 2rem;
  }
  .h1-dis {
    margin: 2rem 0 1.5rem;
  }
  h5 {
    font-size: 0.875rem;
    color: #2c365c;
    letter-spacing: 0.13px;
    font-weight: bold;
    display: flex;
    margin-left: 308px;
    margin-bottom: 1rem;
  }
  .h4-delDis {
    margin-bottom: 0;
    margin-left: 129px;
  }
  hr {
    background-color: #d5d7de;
    margin-top: 1rem;
    margin-bottom: 1.5rem;
    border: none;
    height: 1px;
  }
}
</style>
