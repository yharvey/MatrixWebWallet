<template>
  <div class="regularWithdrawals">
    <div>
      <div class="mortgage-font">
        活期取款
      </div>
      <div class="commonTable top-spacing">
        <el-table :data="currentWithdrawalsList"
                  style="width: 100%">
          <el-table-column label="解除抵押时间"
                           prop="depositeTime">
            <template slot-scope="scope">
              {{scope.row.WithDrawTime | dateFormat('MM.DD.YYYY HH:mm')}}
            </template>
          </el-table-column>
          <el-table-column label="金额">
            <template slot-scope="scope">
              {{scope.row.WithDrawAmount | weiToNumber}}
            </template>
          </el-table-column>
          <!-- <el-table-column label="状态"
                           prop="states">
          </el-table-column> -->
          <el-table-column label="操作"
                           class="font-blue">
            <template slot-scope="scope">
              <el-button @click="confirm(scope.row)"
                         type="text"
                         size="small">取款</el-button>
            </template>
          </el-table-column>
        </el-table>
        <div class="content-between">
          <!-- <el-pagination background
                         class="top_spacing"
                         layout="prev, pager, next"
                         :page-size="pageSize"
                         :current-page="pageNumber"
                         @current-change="currentChange"
                         :total="total">
          </el-pagination> -->
        </div>
      </div>
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
import SendTransfer from '@/assets/js/SendTransfer'
import WalletUtil from '@/assets/js/WalletUtil'
import TradingFuns from '@/assets/js/TradingFuns'
import { mortgage, contract } from '@/assets/js/config'
import AllDialog from '@/components/TransferDialog/AllDialog'
import OfflineDialog from '@/components/TransferDialog/TipOfflineDialog'
import sendSign from '@/components/TransferDialog/sendSignTransfer'
// import Man from 'aiman'
// import BigNumber from 'bignumber.js'
// const manUtil = new Man()
export default {
  name: 'currentMortgage',
  data () {
    return {
      functions: [],
      address: '',
      currentWithdrawalsList: [],
      pageSize: 10,
      pageNumber: 0,
      total: 0,
      visible: false,
      confirmOffline: false,
      jsonObj: '',
      sendSignVisible: false,
      information: '',
      successVisible: false,
      hash: '',
      msg: ''
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
    changeVisible (state) {
      this.visible = state
    },
    confirm () {
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
        let curFunc = this.functions[4]
        let fullFuncName = WalletUtil.solidityUtils.transformToFullName(curFunc)
        let funcSig = WalletUtil.getFunctionSignature(fullFuncName)
        let typeName = WalletUtil.solidityUtils.extractTypeName(fullFuncName)
        var types = typeName.split(',')
        types = types[0] === '' ? [] : types
        var values = [0]
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
    this.currentWithdrawalsList = this.$route.params.currentWithdrawalsList
    console.log(this.currentWithdrawalsList)
  },
  components: {
    AllDialog,
    OfflineDialog,
    sendSign
  },
  watch: {
    $route (to, from) {
      if (to.path.indexOf('currentRefund') > -1) {
        this.currentWithdrawalsList = []
        this.currentWithdrawalsList = this.$route.params.currentWithdrawalsList
        console.log(this.regularWithdrawalsList)
        this.total = this.regularWithdrawalsList.length
      }
    }
  }
}
</script>
<style scoped lang="less">
.regularWithdrawals {
  .mortgage-font {
    text-align: left;
    font-size: 1.25rem;
    color: #2c365c;
    letter-spacing: 0.18px;
    font-weight: bold;
  }
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
  /deep/.is-scrolling-none {
    tr {
      :last-child {
        :first-child {
          color: #1c51dd;
          cursor: pointer;
        }
      }
    }
  }
}
</style>
