<template>
  <div class="record">
    <div class="content-left">
      <span class="span-font span-spacing">{{$t('record.transaction')}}</span>
      <el-dropdown split-button
                   type="Info"
                   class="select-spacing"
                   @command="changeTxType">
        {{txType === 'all' ? $t('record.all') : txType === 'receipt' ? $t('record.into') : $t('record.out')}}
        <el-dropdown-menu slot="dropdown">
          <el-dropdown-item command="all">{{$t('record.all')}}</el-dropdown-item>
          <el-dropdown-item command="receipt">{{$t('record.into')}}</el-dropdown-item>
          <el-dropdown-item command="transfer">{{$t('record.out')}}</el-dropdown-item>
        </el-dropdown-menu>
      </el-dropdown>
      <span class="span-font span-spacing">{{$t('transfer.transferMethod')}}</span>
      <el-dropdown split-button
                   type="Info"
                   @command="changeTxMode">
        {{txMode === 'timely' ? $t('record.nowTransaction') : $t('record.timeTransaction')}}
        <el-dropdown-menu slot="dropdown">
          <el-dropdown-item command="timely">{{$t('record.nowTransaction')}}</el-dropdown-item>
          <el-dropdown-item command="timing">{{$t('record.timeTransaction')}}</el-dropdown-item>
        </el-dropdown-menu>
      </el-dropdown>
      <div class="commonTable top-spacing">
        <el-table :data="tableData"
                  style="width: 100%">
          <el-table-column type="index"
                           :label="$t('record.index')"
                           width="84">
          </el-table-column>
          <el-table-column :label="$t('record.time')"
                           width="147">
            <template slot-scope="scope">
              <div>{{scope.row.timestamp | dateFormat('MM.DD.YYYY HH:mm')}}</div>
            </template>
          </el-table-column>
          <el-table-column prop="money"
                           :label="$t('record.transactionValue')"
                           width="168">
            <template slot-scope="scope">
              <div class="amount">{{scope.row.addrFrom == address ? '-' : '+'}} {{scope.row.value | weiToNumber}} {{scope.row.currency}}</div>
            </template>
          </el-table-column>
          <el-table-column width="247"
                           :label="$t('record.transactionDetails')">
            <template slot-scope="scope">
              <div class="font-color hash"
                   @click="openBrowser(scope.row.hash)">{{scope.row.hash}}</div>
            </template>
          </el-table-column>
          <el-table-column :label="$t('record.transactionType')"
                           width="108">
            <template slot-scope="scope">
              <div class="font-color">{{scope.row.matrixType | txTypeFilter}}</div>
            </template>
          </el-table-column>
          <el-table-column prop="state"
                           width="108"
                           :label="$t('record.transactionState')">

          </el-table-column>
          <el-table-column prop="matrixType"
                           :label="$t('record.operation')">
            <template slot-scope="scope">
              <div class="font-color"
                   v-if="scope.row.matrixType===3"
                   @click="revocableTransfer(scope.row.hash)">{{$t('record.undo')}}</div>
            </template>
          </el-table-column>
        </el-table>
        <div class="content-between">
          <div class="hint_font top_spacing"
               @click="openBrowser('')">{{$t('record.browser_detailed')}}</div>
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
  </div>
</template>
<script>
import { browserUrl } from '@/assets/js/config'
import TradingFuns from '@/assets/js/TradingFuns'
import WalletUtil from '@/assets/js/WalletUtil'
import SendTransfer from '@/assets/js/SendTransfer'
import AllDialog from '@/components/TransferDialog/AllDialog'

export default {
  name: 'record',
  data () {
    return {
      txType: 'all',
      txMode: 'timely',
      pageNumber: 1,
      pageSize: 10,
      address: this.$store.state.wallet.address,
      tableData: [],
      total: 0,
      ruleForm: {
        value: '',
        to: '',
        IsEntrustTx: '',
        ExtraTimeTxType: '0',
        gasLimit: 210000,
        gasPrice: 18000000000,
        extra_to: [[4, 0, []]],
        data: '',
        nonce: ''
      },
      hash: '',
      msg: this.$t('record.mortgageSuccess'),
      visible: false
    }
  },
  mounted () {
    this.getTxs()
    this.getTxCount()
  },
  methods: {
    changeVisible (state) {
      this.visible = state
    },
    currentChange (status) {
      this.pageNumber = status
      this.getTxs()
    },
    getTxs () {
      this.$http.get('findTxByAddress/' + this.address + '/' + this.pageNumber + '/' + this.pageSize + '/' + this.txType + '/' + this.txMode).then(res => {
        if (res.data.status === 200) {
          this.tableData = res.data.result
        } else {
          this.tableData = []
          this.$message.error(res.data.message)
        }
      })
    },
    getTxCount () {
      this.$http.get('findTxCountByAddress/' + this.address + '/' + this.txType + '/' + this.txMode).then(res => {
        if (res.data.status === 200) {
          this.total = res.data.result
        } else {
          this.total = 0
          this.$message.error(res.data.message)
        }
      })
    },
    changeTxType (command) {
      if (this.txType !== command) {
        this.pageNumber = 1
        this.txType = command
        this.getTxs()
        this.getTxCount()
      }
    },
    changeTxMode (command) {
      if (this.txMode !== command) {
        this.pageNumber = 1
        this.txMode = command
        this.getTxs()
        this.getTxCount()
      }
    },
    openBrowser (hash) {
      if (hash === '') {
        window.open(browserUrl)
      } else {
        window.open(browserUrl + '/tx/' + hash)
      }
    },
    revocableTransfer (hash) {
      try {
        this.ruleForm.nonce = this.httpProvider.man.getTransactionCount(this.address)
        this.ruleForm.nonce = WalletUtil.numToHex(this.ruleForm.nonce)
        this.ruleForm.to = this.address
        let jsonObj = TradingFuns.getTxData(this.ruleForm)
        jsonObj.data = hash
        let tx = WalletUtil.createTx(jsonObj)
        let privateKey = this.$store.state.wallet.privateKey
        privateKey = Buffer.from(privateKey.indexOf('0x') > -1 ? privateKey.substring(2, privateKey.length) : privateKey, 'hex')
        tx.sign(privateKey)
        let serializedTx = tx.serialize()
        let newTxData = SendTransfer.getTxParams(serializedTx)
        this.hash = this.httpProvider.man.sendRawTransaction(newTxData)
        this.visible = true
        this.msg = this.$t('record.undoSuccess')
      } catch (e) {
        this.$message.error(e.message)
      }
    }
  },
  components: {
    AllDialog
  }
}
</script>

<style scoped lang="less">
.record {
  .content-left {
    text-align: left;
  }
  .hash {
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
    padding-right: 1rem;
  }
  .span-font {
    font-size: 0.875rem;
    color: #2c365c;
    letter-spacing: 0;
    text-align: right;
    font-weight: bold;
  }
  .span-spacing {
    margin-right: 1rem;
  }
  .select-spacing {
    margin-right: 2.75rem;
  }
  /deep/ .el-button-group > .el-button:not(:last-child) {
    margin-right: -1px;
    width: 102px;
    height: 28px;
    text-align: left;
    padding: 0 0 0 0.5rem;
    background: rgba(44, 54, 92, 0.03);
  }
  /deep/ .el-button-group > .el-button:last-child {
    border-top-left-radius: 0;
    border-bottom-left-radius: 0;
    width: 32px;
    height: 28px;
    padding: 0;
  }
  /deep/ .el-button:active {
    border: 1px solid #dcdfe6 !important;
    color: #606266 !important;
  }
  /deep/ .el-button:focus,
  /deep/ .el-button:hover {
    border: 1px solid #dcdfe6 !important;
    color: #606266 !important;
  }
  .top-spacing {
    margin-top: 2rem;
  }
  .font-color {
    color: #1c51dd;
    cursor: pointer;
  }
  .content-between {
    display: flex;
    justify-content: space-between;
  }
  .hint_font {
    font-size: 12px;
    color: #1c51dd;
    letter-spacing: 0.11px;
    cursor: pointer;
  }
  .top_spacing {
    margin-top: 1.5rem;
  }
  .amount {
    overflow: hidden;
    white-space: nowrap;
    text-overflow: ellipsis;
  }
}
</style>
