<template>
  <div class="openWallet">
    <el-card class="box-card">
      <div class="query_assets_top">
        <img style="width:2rem" src="../../assets/images/wallet.png" alt="">
        <span class="query_assets"
              :class="{'active' : type === 'myAssets'}"
              @click="changeType('myAssets')">
              {{$t('myWallet.myAssets')}}</span>
        <img style="width:2rem" src="../../assets/images/nft.png" alt="">
        <span class="query_assets"
              :class="{'active' : type === 'NFTManage'}"
              @click="changeType('NFTManage')">
              {{$t('myWallet.NFTManage')}}</span>
        <!-- <span class="query_assets"
              :class="{'active' : type === 'NftTest'}"
              @click="changeType('NftTest')">{{$t('OperateNFT')}}</span>| -->
        <img style="width:2rem" src="../../assets/images/nft.png" alt="">
        <span class="transaction_records"
              @click="changeType('record')"
              :class="{'active' : type === 'record'}">
              {{$t('myWallet.transactionRecord')}}</span>
        <span class="back"
              @click="back"
              v-show="showBack">
          <i class="el-icon-arrow-left"></i>
          {{$t('openWallet.back')}}
        </span>
        <hr>
      </div>
      <router-view></router-view>
    </el-card>
  </div>
</template>

<script>
export default {
  name: 'openWallet',
  data () {
    return {
      type: 'myAssets',
      showBack: false
    }
  },
  watch: {
    $route (to, from) {
      if (to.name === 'Record') {
        this.type = 'record'
      } else if (to.name === 'MyAssets') {
        this.type = 'myAssets'
      }
      if (to.name === 'Token' || to.name === 'NFTTransfer' || to.name === 'CreateCoin' || to.name === 'NFToken' || to.name === 'OnlineTransfer' || to.name === 'Undo') {
        this.showBack = true
      } else {
        this.showBack = false
      }
    }
  },
  methods: {
    goPage (route) {
      this.$router.push({ path: '/' + route })
    },
    changeType (status) {
      if (status !== this.type) {
        this.type = status
        this.$router.push({ path: '/my-wallet/openWallet/' + status })
      }
    },
    back () {
      this.$router.back()
    }
  }
}
</script>

<style scoped lang="less">
.openWallet {
  /deep/.el-card__body {
    padding: 1rem 2.5rem 3rem 2.5rem;
  }
  .query_assets_top {
    text-align: left;
  }
  hr {
    background-color: #0066FF;
    // margin-top: 1rem;
    margin-bottom: 1.5rem;
    border: none;
    height: 1px;
  }
  .query_assets {
    font-size: 1rem;
    letter-spacing: 0.15px;
    margin-right: 1rem;
    display: inline-block;
    vertical-align: top;
    line-height: 34px;
    cursor: pointer;
    color: #989a9c;
  }
  .transaction_records {
    color: #989a9c;
    margin-left: 1rem;
    cursor: pointer;
    display: inline-block;
    vertical-align: top;
    line-height: 34px;
  }
  .bottom_hr {
    margin: 2rem 0;
  }
  .token_btn {
    text-align: center;
    background: #f2f4f8;
    font-size: 14px;
    letter-spacing: 0.13px;
    margin-top: 2rem;
    height: 2.625rem;
    line-height: 2.625rem;
    color: #1c51dd;
    cursor: pointer;
  }
  .active {
    color: #2c365c;
  }
  .back {
    float: right;
    cursor: pointer;
    color: #1c51dd;
    font-size: 0.88rem;
    letter-spacing: 0.13px;
  }
}
</style>
