<template>
  <div class="jointDetail">
    <el-card class="box-card1">
      <div class="distance-bottom">
        <span class="back-tittle"
              @click="backPage">
          <i class="el-icon-arrow-left"></i>
          {{$t('openWallet.back')}}
        </span>
      </div>
      <div class="header">
        <div class="text-left">
          <div class="distance-top"><span class="font-weight-style">{{$t('jointFirst.jointMining')}}</span>{{detailObj.jointAccount}}</div>
          <div class="distance-top"><span class="font-weight-style">{{$t('jointFirst.createJoint')}}</span>{{detailObj.createAddress}}</div>
          <div class="distance-top"><span class="font-weight-style">签名账户：</span>{{detailObj.signAddress}}</div>
          <div class="distance-top"><span class="font-weight-style ">参与人数：</span>{{detailObj.activeCount}}</div>
          <div class="distance-top"><span class="font-weight-style">抵押总额：</span>{{detailObj.allAmount}}</div>
          <div class="distance-top"><span class="font-weight-style">奖励总额：</span>{{detailObj.reward}}</div>
          <div class="distance-top"><span class="font-weight-style">收益权重分配：</span>
            <span v-for="(item,key) in detailObj.levelRate"
                  :key="key">R{{key+1}} ：{{item}} &nbsp;</span>
          </div>
        </div>
        <div><button class="common-button"
                  @click="jointAdd()"
                  v-if="!detailObj.alreadyWithdraw">
            加入挖矿</button>
          <div class="distance-top"
               v-if="!detailObj.alreadyWithdraw&&address===detailObj.createAddress">
            <button @click="openDialog()"
                    class="common-button">关闭挖矿</button>
          </div>
          <div class="distance-top"
               v-if="!detailObj.alreadyWithdraw&&address===detailObj.createAddress">
            <button @click="setSignAccount()"
                    class="common-button">修改签名地址</button>
          </div>
        </div>
      </div>
    </el-card>
    <el-card class="box-card2">
      <div v-for="(item,index) in detailObj.validatorMap"
           :key="index">
        <div class="dis-flex between left-distance distance-top text-left">
          <div class="list-width">
            <div class="dis-flex distance-top ">
              <div class="account-width"><span class="font-weight-style">账户：</span> {{item.Address}}</div>
              <div><span class="font-weight-style">累计奖励：{{item.Reward | weiToNumber}}MAN</span></div>
            </div>
            <div class="distance-top"><span class="font-weight-style">抵押总金额：{{item.AllAmount | weiToNumber}} </span></div>
          </div>
          <div class="distance-top"
               v-if="address===item.Address">
            <a @click="participantsDetail(item)">详情</a>
          </div>
        </div>
      </div>
      <hr>
    </el-card>
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
    <common-dialog-cancel :commonDialogExitVisible="commonDialogExitVisible"
                          :address="address"
                          :title="'关闭挖矿'"
                          :msg="'你将解散这个联合'"
                          :time="''"
                          :okText="$t('miningTransactionOverview.determine')"
                          :cancelText="$t('miningTransactionOverview.cancel')"
                          :width="'365px'"
                          @closeExitDialog="closeExitDialog"></common-dialog-cancel>
  </div>
</template>

<script>
import { joinChildAbi } from '@/assets/js/config.js'
import store from 'store'
import WalletUtil from '@/assets/js/WalletUtil'
import TradingFuns from '@/assets/js/TradingFuns'
import SendTransfer from '@/assets/js/SendTransfer'
import OfflineDialog from '@/components/TransferDialog/TipOfflineDialog'
import sendSign from '@/components/TransferDialog/sendSignTransfer'
import AllDialog from '@/components/TransferDialog/AllDialog'
import CommonDialogCancel from '@/components/CommonDialog/CommonDialogCancel'
import BigNumber from 'bignumber.js'
export default {
  name: 'jointDetail',
  data () {
    return {
      detailObj: { reward: '0' },
      address: '',
      msg: '',
      hash: '',
      confirmOffline: false,
      jsonObj: '',
      sendSignVisible: false,
      information: '',
      visible: false,
      commonDialogExitVisible: false
    }
  },
  methods: {
    openSendSign () {
      this.sendSignVisible = true
    },
    changeSendSign (data) {
      this.sendSignVisible = false
      if (data != null && data !== false) {
        this.hash = data.hash
        this.visible = true
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
    goPage (url) {
      this.$router.push({ path: '/jointMining/' + url })
    },
    participantsDetail (item) {
      item.jointAccount = this.detailObj.jointAccount
      item.creatAddress = this.detailObj.createAddress
      item.alreadyWithdraw = this.detailObj.alreadyWithdraw
      let obj = JSON.parse(JSON.stringify(item))
      this.$router.push({ name: 'ParticipantsDetail', params: { participantsDetail: obj } })
    },
    jointAdd () {
      console.log(this.detailObj.jointAccount)
      this.$router.push({ name: 'JointAdd', params: { jointAccount: this.detailObj.jointAccount, stakeValue: this.detailObj.allAmount } })
    },
    backPage () {
      this.$router.back()
    },
    withdrawAll () {
      try {
        let abiArray = JSON.parse(joinChildAbi)
        let contractAddress = this.detailObj.jointAccount
        let contract = this.ethProvider.eth.Contract(abiArray, contractAddress)
        let nonce = this.httpProvider.man.getTransactionCount(this.address)
        nonce = WalletUtil.numToHex(nonce)
        let data = {
          to: this.detailObj.jointAccount,
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
        } else {
          this.confirmOffline = true
          this.jsonObj = JSON.stringify(jsonObj)
        }
      } catch (e) {
        this.$message.error(e.message)
      }
    },
    setSignAccount () {
      this.$router.push({ name: 'SetSignAccount', params: { jointAccount: this.detailObj.jointAccount } })
    },
    closeExitDialog (state) {
      if (state === 'ok') {
        this.withdrawAll()
      }
      this.commonDialogExitVisible = false
    },
    openDialog () {
      this.commonDialogExitVisible = true
    }
  },
  watch: {
    $route (to, from) {
      if (to.path.indexOf('jointDetail') > -1) {
        if (this.$route.params.detailObj) {
          this.detailObj = this.$route.params.detailObj
        }
        this.detailObj.reward = new BigNumber(0)
        for (let index = 0; index < this.detailObj.validatorMap.length; index++) {
          const element = this.detailObj.validatorMap[index]
          this.detailObj.reward.plus(new BigNumber(element.Reward))
        }
        this.detailObj.reward = this.detailObj.reward.toString(10)
      }
    }
  },
  mounted () {
    this.detailObj = this.$route.params.detailObj
    this.detailObj.reward = new BigNumber(0)
    this.detailObj.validatorMap.forEach(element => {
      this.detailObj.reward.plus(new BigNumber(element.Reward))
    })
    this.detailObj.reward = this.detailObj.reward.toString(10)
    console.log(this.detailObj.reward)
    if (this.$store.state.offline != null) {
      this.address = this.$store.state.offline
    } else {
      this.address = this.$store.getters.wallet.address
    }
  },
  components: {
    AllDialog,
    OfflineDialog,
    sendSign,
    CommonDialogCancel
  }
}
</script>

<style scoped lang="less">
.jointDetail {
  margin: auto;
  width: 1040px;
  .box-card1 {
    .header {
      padding: 0 2rem;
      display: flex;
      justify-content: space-between;
      align-items: center;
      h1 {
        font-size: 2.25rem;
      }
      .common-button {
        width: 10.5rem;
      }
    }
  }
  .text-left {
    text-align: left;
  }
  .font-weight-style {
    font-size: 0.875rem;
    color: #2c365c;
    letter-spacing: 0.13px;
    font-weight: bold;
  }
  .dis-flex {
    display: flex;
  }
  .between {
    justify-content: space-between;
  }
  .left-distance {
    padding-left: 2rem;
    padding-right: 3rem;
  }
  .distance-top {
    margin-top: 1rem;
  }
  .distance-bottom {
    margin-bottom: 1rem;
  }
  a {
    font-size: 0.875rem;
    color: #1c51dd;
    margin-left: 1.5rem;
    cursor: pointer;
  }
  .list-width {
    width: 75%;
  }
  .back-tittle {
    position: relative;
    left: 441px;
    cursor: pointer;
    color: #1c51dd;
    font-size: 0.88rem;
    letter-spacing: 0.13px;
  }
  .account-width {
    width: 430px;
  }
}
</style>
