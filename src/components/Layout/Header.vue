<template>
  <div class="header flex">
    <img src="../../assets/images/matrix_tittle.png"
         @click="goFirst"
         class="logo cursor">
    <div class="menus"
         :class="{'en': lang == 'EN'}">
      <label :class="{'active' : type === 'my-wallet'}"
             @click="changeMenu('my-wallet')">{{$t('header.myWallet')}}</label>
      <label :class="{'active' : type === 'green-mining'}"
             @click="changeMenu('green-mining')">{{$t('header.greenMining')}}</label>
      <!-- <label :class="{'active' : type === 'offline-transfer'}"
             @click="changeMenu('offline-transfer')">{{$t('header.offlineTransfer')}}</label> -->
      <label :class="{'active' : type === 'ai-application'}"
             @click="changeMenu('ai-application')">{{$t('header.aiApplication')}}</label>
      <label :class="{'active' : type === 'contract'}"
             @click="changeMenu('contract')">{{$t('header.contracts')}}</label>
      <!-- <label :class="{'active' : type === 'mapping'}"
             @click="changeMenu('mapping')">{{$t('header.mapping')}}</label> -->
      <label :class="{'active' : type === 'offlineSend'}"
             @click="changeMenu('offlineSend')">{{$t('header.offlineSend')}}</label>
    </div>
    <div class="info">
      <label v-html="userName"
             v-show="isUnlock"></label>
      <el-dropdown trigger="click">
        <span class="el-dropdown-link">
          <img src="../../assets/images/setting.svg">
        </span>
        <el-dropdown-menu slot="dropdown">
          <el-dropdown-item v-show="isUnlock || $store.state.offline!=null"
                            @click.native="goPage('associate')">{{$t('setUp.associate')}}</el-dropdown-item>
          <el-dropdown-item @click.native="goPage('conversion')">{{$t('setUp.conversion')}}</el-dropdown-item>
          <el-dropdown-item v-show="isUnlock"
                            @click.native="goPage('privateKey')">{{$t('setUp.privateBackups')}}</el-dropdown-item>
          <el-dropdown-item v-show="isUnlock"
                            @click.native="goPage('copyKeyStore')">{{$t('setUp.keyStoreBackups')}}</el-dropdown-item>
          <el-dropdown-item v-show="isUnlock"
                            @click.native="goGreeting()">{{$t('setUp.greetingsSet')}}</el-dropdown-item>
          <el-dropdown-item v-show="isUnlock"
                            @click.native="goPage('blackList')">{{$t('setUp.blackList')}}</el-dropdown-item>
        </el-dropdown-menu>
      </el-dropdown>
      <img v-show="isUnlock || $store.state.offline!= null"
           src="../../assets/images/logout.svg"
           :title="$t('setUp.logout')"
           @click="logout">
      <div v-if="$store.state.offline != null">&nbsp;&nbsp;&nbsp;{{$t('unlock.offline')}}</div>
      <div v-if="$store.state.wallet != null">&nbsp;&nbsp;&nbsp;{{$t('unlock.online')}}</div>
    </div>
  </div>
</template>
<script>
import Bus from '@/assets/js/Bus'
import store from '@/store'
import { mortgage } from '@/assets/js/config'
import WalletUtil from '@/assets/js/WalletUtil'

export default {
  name: 'Header',
  data () {
    return {
      type: 'my-wallet',
      lang: this.$i18n.locale,
      isUnlock: false,
      beforeUrl: '',
      userName: '',
      deposit: {}
    }
  },
  watch: {
    $route (to, from) {
      if (to.path.indexOf('my-wallet') > -1) {
        if (store.state.wallet === null) {
          if (this.beforeUrl === 'ai-application' || this.beforeUrl === 'contract' || this.beforeUrl === 'green-mining') {
            this.type = this.beforeUrl
          }
        } else {
          this.type = 'my-wallet'
        }
      } else if (to.path.indexOf('green-mining') > -1) {
        this.type = 'green-mining'
      } else if (to.path.indexOf('offline-transfer') > -1) {
        this.type = 'offline-transfer'
      } else if (to.path.indexOf('ai-application') > -1) {
        this.type = 'ai-application'
      } else if (to.path.indexOf('contract') > -1) {
        this.type = 'contract'
      } else if (to.path.indexOf('mapping') > -1) {
        this.type = 'mapping'
      }
      let wallet = this.$store.state.wallet
      if (wallet != null) {
        let greetings = window.localStorage.getItem('greetings')
        if (greetings != null) {
          greetings = JSON.parse(greetings)
          greetings.forEach(element => {
            if (element.address === this.$store.state.wallet.address) {
              this.userName = element.content
            }
          })
        }
      }
    }
  },
  mounted () {
    Bus.$on('changeLang', (data) => {
      this.lang = data
    })
    Bus.$on('openWallet', (data) => {
      if (data === 'close') {
        this.isUnlock = false
      } else {
        this.isUnlock = true
      }
    })
    // let route = this.$route
    // if (route.path.indexOf('my-wallet') > -1) {
    //   this.type = 'my-wallet'
    // } else if (route.path.indexOf('green-mining') > -1) {
    //   this.type = 'green-mining'
    // } else if (route.path.indexOf('offline-transfer') > -1) {
    //   this.type = 'offline-transfer'
    // } else if (route.path.indexOf('ai-application') > -1) {
    //   this.type = 'ai-application'
    // } else if (route.path.indexOf('contract') > -1) {
    //   this.type = 'contract'
    // } else if (route.path.indexOf('mapping') > -1) {
    //   this.type = 'mapping'
    // }
    try {
      let wallet = this.$store.state.wallet
      if (wallet != null) {
        let greetings = window.localStorage.getItem('greetings')
        greetings = JSON.parse(greetings)
        if (greetings.address === wallet.address) {
          this.userName = greetings.content
        }
      }
    } catch (error) {
    }
  },
  methods: {
    logout () { // 退出
      let self = this
      this.$confirm(this.$t('header.outHint'), self.$t('header.hint'), {
        confirmButtonText: self.$t('header.sure'),
        cancelButtonText: self.$t('header.cancel'),
        type: 'warning'
      }).then(() => {
        store.commit('UPDATE_WALLET', null)
        store.commit('OFFLINE', null)
        store.commit('UPDATE_BEFOREURL', store.state.historyUrl)
        this.isUnlock = false
        this.$router.push({ path: '/my-wallet/myWalletFirst' })
      }).catch(() => {
      })
    },
    changeMenu (status) {
      if (this.beforeUrl === 'mapping') {
        store.commit('UNLOCK_WALLET', null)
      }
      this.beforeUrl = status
      if (status === 'offline-transfer' || status === 'mapping') {
        this.type = status
        this.$router.push({ path: status === 'offline-transfer' ? '/offline-transfer/offline-transfer-first' : '/' + status })
      } else {
        if (status !== this.type) {
          this.type = status
          if (status === 'green-mining') {
            store.commit('UPDATE_BEFOREURL', '/green-mining/campaignNode')
            // if (store.state.wallet != null) {
            //   let deposit = this.getDepositInfo()
            //   if (!deposit) {
            //     this.$router.push({ path: '/green-mining/campaignNode' })
            //   } else {
            //     store.commit('UPDATE_BEFOREURL', '/green-mining/mining-transaction-overview')
            //     store.commit('UPDATE_HISTORYURL', '/green-mining/mining-transaction-overview')
            //     this.$router.push({ name: 'MiningTransactionOverview', params: { deposit: this.deposit } })
            //   }
            // } else {
            this.$router.push({ path: '/green-mining/campaignNode' })
            // }
          } else if (status === 'my-wallet') {
            store.commit('UPDATE_HISTORYURL', '/my-wallet/openWallet/myAssets')
            this.$router.push({ path: '/my-wallet/myWalletFirst' })
          } else if (status === 'ai-application') {
            store.commit('UPDATE_BEFOREURL', '/ai-application/medical')

            store.commit('UPDATE_HISTORYURL', '/ai-application/medical')
            this.$router.push({ path: '/ai-application/medical' })
          } else if (status === 'offlineSend') {
            store.commit('UPDATE_BEFOREURL', '/sendOffline/offlineUnlock')
            store.commit('UPDATE_HISTORYURL', '/sendOffline/offlineUnlock')
            this.$router.push({ path: '/sendOffline/offlineUnlock' })
          } else {
            store.commit('UPDATE_BEFOREURL', '/' + status)
            this.$router.push({ path: '/' + status })
          }
        }
      }
    },
    goPage (url) {
      this.$router.push({ path: '/setUp/' + url })
    },
    goGreeting () {
      this.$router.push({ path: '/my-wallet/setGreetings' })
    },
    getDepositInfo () {
      let loading = this.$loading({
        lock: true,
        text: 'Loading',
        spinner: 'el-icon-loading',
        background: 'rgba(0, 0, 0, 0.7)'
      })
      let abiArray = JSON.parse(mortgage.abi)
      let contractAddress = mortgage.address
      let contract = this.httpProvider.man.contract(abiArray)
      let myContractInstance = contract.at(contractAddress)
      let deposit = myContractInstance.getDepositInfo(WalletUtil.getEthAddress(store.state.wallet.address), { currency: 'MAN' })
      this.deposit = deposit
      loading.close()
      if (deposit[1] !== '0x') {
        return true
      } else {
        return false
      }
      // if (deposit[3].toNumber() === 128) {
      //   if (deposit[2].toNumber() === 0) {
      //     return false
      //   } else {
      //     return true
      //   }
      // } else if (deposit[3].toNumber() === 16) {
      //   if (deposit[2].toNumber() === 0) {
      //     return false
      //   } else {
      //     return true
      //   }
      // } else {
      //   return false
      // }
    },
    goFirst () {
      if (this.$store.state.wallet != null || this.$store.state.offline != null) {
        this.logout()
      } else {
        this.$router.push({ path: '/my-wallet/myWalletFirst' })
      }
    }
  }
}
</script>

<style scoped lang="less">
.header {
  align-items: center;
  margin: auto;
  width: 65rem;
  .logo {
    height: 1rem;
    width: 90px;
  }
  .menus {
    margin-left: 14.31rem;
    label {
      opacity: 0.5;
      font-size: 14px;
      color: #fff;
      letter-spacing: 0.13px;
      cursor: pointer;
    }
    label:not(:first-child) {
      margin-left: 3rem;
    }
    .active {
      opacity: 1;
    }
    .active:after {
      content: "";
      display: inline-block;
      position: absolute;
      top: 2.88rem;
      width: 1rem;
      height: 2px;
      background: #06fafb;
      margin-left: -37px;
    }
    label:nth-child(3):after {
      margin-left: -30px;
    }
    label:nth-child(4):after {
      margin-left: -22px;
    }
    label:nth-child(5):after {
      margin-left: -36px;
    }
    // label:last-child:after {
    //   margin-left: -42px;
    // }
  }
  .en {
    margin-left: 5rem;
    .active:after {
      content: "";
      display: inline-block;
      position: absolute;
      top: 2.88rem;
      width: 1rem;
      height: 2px;
      background: #06fafb;
      margin-left: -41px;
    }
    label:nth-child(2):after {
      margin-left: -57px;
    }
    label:nth-child(3):after {
      margin-left: -48px;
    }
    label:nth-child(4):after {
      margin-left: -37px;
    }
    label:nth-child(5):after {
      margin-left: -49px;
    }
    // label:last-child:after {
    //   margin-left: -36px;
    // }
  }
  .info {
    display: flex;
    align-items: center;
    flex: 1;
    justify-content: flex-end;
    img {
      margin-left: 1.5rem;
      cursor: pointer;
    }
    label {
      font-size: 12px;
      color: #ffffff;
      letter-spacing: 0.11px;
    }
  }
  /deep/.el-dropdown-menu {
    position: absolute;
    left: 1100px;
    top: 44px;
    z-index: 2007;
  }
  .el-dropdown {
    line-height: 0 !important;
  }
}
</style>
