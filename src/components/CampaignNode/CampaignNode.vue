<template>
  <div class="CampaignNode">
    <div class="addForm">
      <div>
        <!-- <h5>交易数量</h5>
        <el-input v-model="number"
                  placeholder="要发送的交易数量"></el-input>
        <div>
          <button class="common-button"
                  @click="getMinnerTxData">{{$t('CampaignNode.mortgage-button')}}</button>
        </div> -->
        <div class="flex-style">
          <div class="title">
            {{$t('CampaignNode.mortgage')}}
          </div>
          <div v-if="checkShow">
            <el-checkbox v-model="isEdit"
                         @change="changeType"></el-checkbox><span class="check-font">{{$t('CampaignNode.onlyChange')}}</span>
          </div>
        </div>
        <div v-if="!isEdit">
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
          <el-input v-model="value"
                    :placeholder="$t('CampaignNode.mortgage_man')"></el-input>
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
        </div>
      </div>
      <h5>{{$t('CampaignNode.Mining_type')}}</h5>
      <el-select v-model="mortgageType"
                 :placeholder="$t('CampaignNode.select')">
        <el-option v-for="item in mortgageList"
                   :key="item.key"
                   :label="item.name"
                   :value="item.key">
        </el-option>
      </el-select>
      <h5>{{$t('CampaignNode.dig_address')}}</h5>
      <el-input v-model="mortgageAddrress"></el-input>
      <div style="display: flex; justify-content: center;">
        <div style="text-align:left">
          <p>{{$t('CampaignNode.mortgage_hint1')}}</p>
          <p>{{$t('CampaignNode.mortgage_hint2')}}</p>
          <p>{{$t('digAccount.tips1')}}</p>
          <p>{{$t('digAccount.tips2')}}</p>
          <p>{{$t('digAccount.tips3')}}</p>
          <p>{{$t('digAccount.tips4')}}</p>
        <!--<h4 class="h4-botDis"
            v-html="$t('CampaignNode.mortgage_hint2')"></h4>
        <h4 class="h4-botDis"
            v-html="$t('digAccount.tips1')"></h4>
        <h4 class="h4-botDis"
            v-html="$t('digAccount.tips2')"></h4>
        <h4 class="h4-botDis"
            v-html="$t('digAccount.tips3')"></h4>
        <h4 class="h4-botDis"
            v-html="$t('digAccount.tips4')"></h4> -->
        </div>
      </div>
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
import store from 'store'
import filter from '@/assets/js/filters'

export default {
  name: 'campaignNode',
  data () {
    return {
      isEdit: false,
      mortgageTypeAgo: '',
      address: '',
      mortgageList: [{ name: '', key: 'minerDeposit' }, { name: '', key: 'valiDeposit' }],
      mortgageWayList: [{ name: '', key: 'regular' }, { name: '', key: 'current' }],
      timeLimitList: [{ name: 'oneMonth', key: '1' }, { name: 'threeMonth', key: '3' }, { name: 'sixMonth', key: '6' }, { name: 'oneYear', key: '12' }],
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
      successVisible: false,
      checkShow: false,
      isDeposit: false,
      number: 0
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
    changeType () {
      if (this.mortgageType === 'minerDeposit') {
        this.mortgageType = 'valiDeposit'
      } else {
        this.mortgageType = 'minerDeposit'
      }
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
    changeDeposit () {
      try {
        this.mortgageAddrress = this.mortgageAddrress.trim()
        if (!WalletUtil.validateManAddress(this.mortgageAddrress)) {
          this.$message.error(this.$t('transfer.addressTip'))
          return
        }
        let abiArray = JSON.parse(mortgage.abi)
        let contractAddress = mortgage.address
        let contract = this.ethProvider.eth.Contract(abiArray, contractAddress)
        let inputData = ''
        console.log(WalletUtil.getEthAddress(this.mortgageAddrress))
        if (this.mortgageTypeAgo === 'valiDeposit') {
          inputData = contract.methods.minerDeposit(WalletUtil.getEthAddress(this.mortgageAddrress), 0).encodeABI()
        } else {
          inputData = contract.methods.valiDeposit(WalletUtil.getEthAddress(this.mortgageAddrress), 0).encodeABI()
        }
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
        jsonObj.data = inputData
        if (this.$store.state.wallet != null) {
          let tx = WalletUtil.createTx(jsonObj)
          let privateKey = this.$store.state.wallet.privateKey
          privateKey = Buffer.from(privateKey.indexOf('0x') > -1 ? privateKey.substring(2, privateKey.length) : privateKey, 'hex')
          tx.sign(privateKey)
          let serializedTx = tx.serialize()
          this.newTxData = SendTransfer.getTxParams(serializedTx)
          this.hash = this.httpProvider.man.sendRawTransaction(this.newTxData)
          this.visible = true
          let recordArray = store.get(this.address)
          if (recordArray == null) {
            recordArray = []
          }
          recordArray.push({ hash: this.hash, newTxData: { commitTime: this.newTxData.commitTime, txType: this.newTxData.txType } })
          store.set(this.address, recordArray)
        } else {
          this.confirmOffline = true
          this.jsonObj = JSON.stringify(jsonObj)
        }
        this.msg = this.$t('mortgageHistory.mortgageSuccess')
      } catch (e) {
        this.$message.error(e.message)
      }
    },
    getMinnerTxData () {
      let num = parseInt(this.number)
      for (let j = 0; j < num; j++) {
        try {
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
          nonce = WalletUtil.numToHex(nonce + j)
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
            let recordArray = store.get(this.address)
            if (recordArray == null) {
              recordArray = []
            }
            recordArray.push({ hash: this.hash, newTxData: { commitTime: this.newTxData.commitTime, txType: this.newTxData.txType } })
            store.set(this.address, recordArray)
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
    getTxData () {
      try {
        this.mortgageAddrress = this.mortgageAddrress.trim()
        if (this.isEdit) {
          this.changeDeposit()
          return
        }
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
        if (this.mortgageWay === '') {
          this.$message.error(this.$t('CampaignNode.selectMortgageWay'))
          return
        } else if (this.mortgageWay === 'regular') {
          if (this.timeLimit === '') {
            this.$message.error(this.$t('CampaignNode.selectTimeLimit'))
            return
          }
          if (this.isDeposit) {
            if (parseInt(this.value) < 2000) {
              this.$message.error(this.$t('CampaignNode.valueLessError1'))
              return
            }
          } else {
            if (this.mortgageType === 'minerDeposit') {
              if (parseInt(this.value) < 10000) {
                this.$message.error(this.$t('CampaignNode.valueLessError2'))
                return
              }
            } else {
              if (parseInt(this.value) < 100000) {
                this.$message.error(this.$t('CampaignNode.valueLessError3'))
                return
              }
            }
          }
        } else {
          if (parseInt(this.value) < 100) {
            this.$message.error(this.$t('CampaignNode.currentError'))
            return
          }
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
          let recordArray = store.get(this.address)
          if (recordArray == null) {
            recordArray = []
          }
          recordArray.push({ hash: this.hash, newTxData: { commitTime: this.newTxData.commitTime, txType: this.newTxData.txType } })
          store.set(this.address, recordArray)
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
    this.timeLimitList[3].name = this.$t('CampaignNode.oneYear')
    if (this.$store.state.offline != null) {
      this.address = this.$store.state.offline
    } else {
      this.address = this.$store.getters.wallet.address
    }
    this.initContract()
    let depositList = this.httpProvider.man.getDepositbyaddr(this.address)
    console.log(depositList)
    if (depositList != null) {
      this.isDeposit = true
      this.mortgageAddrress = WalletUtil.getManAddress(depositList.AddressA1)
      if (depositList.Role === 16) {
        this.mortgageTypeAgo = 'minerDeposit'
        this.mortgageType = 'minerDeposit'
        let depositTotal = new BigNumber(0)
        depositList.Dpstmsg.forEach(e => {
          depositTotal = depositTotal.plus(filter.weiToNumber(e.DepositAmount))
        })
        if (depositTotal.comparedTo(new BigNumber(100000)) === 1) {
          this.checkShow = true
        }
      } else {
        this.checkShow = true
        this.mortgageTypeAgo = 'valiDeposit'
        this.mortgageType = 'valiDeposit'
      }
    }
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
  p{
    font-size: 0.875rem;
    color: #9298ae;
    letter-spacing: 0.13px;
    font-weight: 400;
    margin-bottom: 0;
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
    margin-left: 260px;
    margin-bottom: 1rem;
  }
  .h4-delDis {
    margin-bottom: 0;
    margin-left: 129px;
  }
  .h4-botDis {
    margin-bottom: 0;
  }
  hr {
    background-color: #d5d7de;
    margin-top: 1rem;
    margin-bottom: 1.5rem;
    border: none;
    height: 1px;
  }
  .flex-style {
    margin: 1.5rem 0;
    display: flex;
    padding-left: 260px;
    .title {
      font-size: 0.875rem;
      color: #2c365c;
      letter-spacing: 0.13px;
      font-weight: bold;
      margin-right: 5rem;
    }
    /deep/.el-checkbox {
      margin-right: 0.5rem;
    }
    .check-font {
      font-size: 0.875rem;
    }
  }
}
</style>
