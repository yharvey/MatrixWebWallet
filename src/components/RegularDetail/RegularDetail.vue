<template>
  <div class="regularMortgage">
    <div>
      <div class="first-left">
        {{$t('regularDetail.regular_account')}} {{regularDepositValue}} MAN
      </div>
      <div class="commonTable top-spacing">
        <el-table :data="regularDepositList"
                  style="width: 100%">
          <el-table-column :label="$t('regularDetail.begin_time')"
                           prop="BeginTime">
            <template slot-scope="scope">
              {{scope.row.BeginTime | dateFormat('MM.DD.YYYY HH:mm')}}
            </template>
          </el-table-column>
          <el-table-column :label="$t('regularDetail.deposit_time')"
                           prop="depositeTime">
            <template slot-scope="scope">
              {{scope.row.DepositType }}{{$t('regularDetail.month')}}
            </template>
          </el-table-column>
          <el-table-column :label="$t('regularDetail.deposit_value')"
                           prop="depositeValue">
            <template slot-scope="scope">
              {{scope.row.DepositAmount | weiToNumber}}
            </template>
          </el-table-column>
          <el-table-column :label="$t('regularDetail.interest')">
            <template slot-scope="scope">
              {{scope.row.Interest | weiToNumber}}
            </template>
          </el-table-column>
          <!-- <el-table-column label="状态"
                           prop="states">
            <template slot-scope="scope">
             {{scope.row.Interest}}
            </template>
          </el-table-column> -->
          <el-table-column :label="$t('regularDetail.operation')"
                           class="font-blue">
            <template slot-scope="scope">
              <el-button @click="confirm(scope.row)"
                         type="text"
                         size="small">{{$t('digAccount.withdraw_deposit')}}</el-button>
            </template>
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
// import filter from '@/assets/js/filters'
// import Man from 'aiman'
// import BigNumber from 'bignumber.js'
// const manUtil = new Man()
export default {
  name: 'currentMortgage',
  data () {
    return {
      mortgageAddrress: '',
      functions: [],
      address: '',
      regularDepositList: [
      ],
      allList: [],
      pageSize: 10,
      pageNumber: 1,
      total: 0,
      regularDepositValue: 0,
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
      this.mortgageAddrress = ''
      this.value = ''
    },
    confirm (obj) {
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
        let curFunc = this.functions[3]
        let fullFuncName = WalletUtil.solidityUtils.transformToFullName(curFunc)
        let funcSig = WalletUtil.getFunctionSignature(fullFuncName)
        let typeName = WalletUtil.solidityUtils.extractTypeName(fullFuncName)
        var types = typeName.split(',')
        types = types[0] === '' ? [] : types
        var values = [obj.Position, obj.DepositAmount]
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
        this.msg = this.$t('regularDetail.success')
      } catch (e) {
        this.$message.error(e.message)
      }
    },
    currentChange (status) {
      this.pageNumber = status
      if (this.allList >= this.pageNumber * this.pageSize) {
        this.regularDepositList = this.allList.slice((this.pageNumber - 1) * 10, this.pageNumber * this.pageSize)
      } else {
        this.regularDepositList = this.allList.slice((this.pageNumber - 1) * 10, this.allList.length)
      }
    }
  },
  mounted () {
    if (this.$store.state.offline != null) {
      this.address = this.$store.state.offline
    } else {
      this.address = this.$store.getters.wallet.address
    }
    // this.allList = [
    //   {
    //     BeginTime: 1559618000,
    //     DepositType: 1,
    //     DepositAmount: 1000000000000000000000,
    //     Interest: 1000000000000000000
    //   },
    //   {
    //     BeginTime: 1559618000,
    //     DepositType: 1,
    //     DepositAmount: 1000000000000000000000,
    //     Interest: 1000000000000000000
    //   },
    //   {
    //     BeginTime: 1559618000,
    //     DepositType: 1,
    //     DepositAmount: 1000000000000000000000,
    //     Interest: 1000000000000000000
    //   },
    //   {
    //     BeginTime: 1559618000,
    //     DepositType: 1,
    //     DepositAmount: 1000000000000000000000,
    //     Interest: 1000000000000000000
    //   },
    //   {
    //     BeginTime: 1559618000,
    //     DepositType: 1,
    //     DepositAmount: 1000000000000000000000,
    //     Interest: 1000000000000000000
    //   }, {
    //     BeginTime: 1559618000,
    //     DepositType: 1,
    //     DepositAmount: 1000000000000000000000,
    //     Interest: 1000000000000000000
    //   },
    //   {
    //     BeginTime: 1559618000,
    //     DepositType: 1,
    //     DepositAmount: 1000000000000000000000,
    //     Interest: 1000000000000000000
    //   },
    //   {
    //     BeginTime: 1559618000,
    //     DepositType: 1,
    //     DepositAmount: 1000000000000000000000,
    //     Interest: 1000000000000000000
    //   },
    //   {
    //     BeginTime: 1559618000,
    //     DepositType: 1,
    //     DepositAmount: 1000000000000000000000,
    //     Interest: 1000000000000000000
    //   },
    //   {
    //     BeginTime: 1559618000,
    //     DepositType: 1,
    //     DepositAmount: 1000000000000000000000,
    //     Interest: 1000000000000000000
    //   },
    //   {
    //     BeginTime: 1559618000,
    //     DepositType: 1,
    //     DepositAmount: 1000000000000000000000,
    //     Interest: 1000000000000000000
    //   }
    // ]
    this.allList = this.$route.params.regularDepositList
    if (this.allList.length <= 10) {
      this.regularDepositList = this.allList
    } else {
      this.regularDepositList = this.allList.slice(0, 9)
    }
    this.total = this.allList.length
    this.regularDepositValue = this.$route.params.regularDepositValue
  },
  components: {
    AllDialog,
    OfflineDialog,
    sendSign
  },
  watch: {
    $route (to, from) {
      if (to.path.indexOf('regularDetail') > -1) {
        this.allList = this.$route.params.regularDepositList
        if (this.allList.length <= 10) {
          this.regularDepositList = this.allList
        } else {
          this.regularDepositList = this.allList.slice(0, 9)
        }
        this.total = this.allList.length
        this.regularDepositValue = this.$route.params.regularDepositValue
      }
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
