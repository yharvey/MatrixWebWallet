<template>
  <div class="jointDetail">
    <el-card class="box-card1">
      <div>
          <span class="back-tittle"
              @click="backPage">
          <i class="el-icon-arrow-left"></i>
          {{$t('openWallet.back')}}
        </span>
      </div>
      <div class="header">
        <div class="text-left">
          <div class="distance-top"><span class="font-weight-style">联合账户：</span>{{detailObj.jointAccount}}</div>
          <div class="distance-top"><span class="font-weight-style">创建者账户：</span>{{detailObj.createAddress}}</div>
          <div class="distance-top"><span class="font-weight-style">签名账户：</span>{{detailObj.signAddress}}</div>
          <div class="dis-flex between distance-top">
            <div><span class="font-weight-style">参与人数：</span>{{detailObj.activeCount}}</div>
            <div><span class="font-weight-style">抵押总额：</span>{{detailObj.allAmount}}</div>
          </div>
        </div>
        <div><a @click="jointAdd()" v-if="!detailObj.alreadyWithdraw"> 参与联合</a></div>
      </div>
    </el-card>
    <el-card class="box-card2">
      <div v-for="(item,index) in detailObj.validatorMap"
           :key="index">
        <div class="dis-flex between left-distance distance-top text-left">
          <div class="list-width">
            <div class="dis-flex between distance-top ">
              <div><span class="font-weight-style">账户：</span> {{item.Address | getManAddress}}</div>
              <div><span class="font-weight-style">累计奖励：{{item.Reward | weiToNumber}}MAN</span></div>
            </div>
            <div class="distance-top"><span class="font-weight-style">抵押总金额：{{item.AllAmount | weiToNumber}} </span></div>
          </div>
          <div class="distance-top"
               v-if="ethAddress===item.Address">
            <a @click="participantsDetail(item)">详情</a>
          </div>
        </div>
      </div>
      <hr>
    </el-card>
  </div>
</template>

<script>
import WalletUtil from '@/assets/js/WalletUtil'
export default {
  name: 'jointDetail',
  data () {
    return {
      detailObj: [],
      address: '',
      ethAddress: ''
    }
  },
  methods: {
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
      this.$router.push({ name: 'JointAdd', params: { jointAccount: this.detailObj.jointAccount } })
    },
    backPage () {
      this.$router.back()
    }
  },
  components: {
  },
  watch: {
    $route (to, from) {
      if (to.path.indexOf('jointDetail') > -1) {
        console.log(this.detailObj)
        if (this.$route.params.detailObj) {
          console.log(this.detailObj.jointAccount + 'qqqqqqqqqqqqqq')
          this.detailObj = this.$route.params.detailObj
        }
      }
    }
  },
  mounted () {
    this.detailObj = this.$route.params.detailObj
    console.log(this.detailObj)
    if (this.$store.state.offline != null) {
      this.address = this.$store.state.offline
    } else {
      this.address = this.$store.getters.wallet.address
    }
    this.ethAddress = WalletUtil.getEthAddress(this.address)
  }
}
</script>

<style scoped lang="less">
.jointDetail {
  margin: auto;
  width: 1040px;
  .box-card1 {
    .header {
      padding: 0 6rem;
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
    padding-right: 10rem;
  }
  .distance-top {
    margin-top: 1rem;
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
    left: 374px;
    cursor: pointer;
    color: #1c51dd;
    font-size: 0.88rem;
    letter-spacing: 0.13px;
  }
}
</style>
