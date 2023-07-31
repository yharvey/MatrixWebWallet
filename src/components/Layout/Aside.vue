<template>
  <div class="aside">
    <img src="../../assets/images/matrix_logo.png"
         @click="goFirst"
         class="logo cursor">
    <div class="menus"
         :class="{'en': lang == 'EN'}">
      <div class="mlabel">
         <img v-if="type==='my-wallet'" style="width:40px;height:40px" src="../../assets/images/myWalletf.png">
        <img v-else style="width:40px;height:40px" src="../../assets/images/mywalletn.png">
         <label :class="{'active' : type === 'my-wallet'}"
             @click="changeMenu('my-wallet')">
             <span class="sidespan">{{$t('header.myWallet')}}</span></label>
      </div>
      <div class="mlabel">
        <img v-if="type==='green-mining'" style="width:40px;height:40px" src="../../assets/images/greenf.png">
        <img v-else style="width:40px;height:40px" src="../../assets/images/greennormal.png">
        <label :class="{'active' : type === 'green-mining'}"
             @click="changeMenu('green-mining')">
             <span class="sidespan">{{$t('header.greenMining')}}</span></label>
      </div>
      <div class="mlabel">
        <img v-if="type==='jointMining'" style="width:40px;height:40px" src="../../assets/images/jointf.png">
        <img v-else style="width:40px;height:40px" src="../../assets/images/jointnormal.png">
        <label :class="{'active' : type === 'jointMining'}"
             @click="changeMenu('jointMining')">
             <span class="sidespan">{{$t('header.jointMining')}}</span></label>
      </div>
      <div class="mlabel">
        <img v-if="type==='aiApplication'" style="width:40px;height:40px" src="../../assets/images/aif.png">
        <img v-else style="width:40px;height:40px" src="../../assets/images/ainormal.png">
        <label :class="{'active' : type === 'aiApplication'}"
             @click="changeMenu('aiApplication')">
             <span class="sidespan">{{$t('header.aiApplication')}}</span></label>
      </div>
      <div class="mlabel">
        <img v-if="type==='contract'" style="width:40px;height:40px" src="../../assets/images/contractf.png">
        <img v-else style="width:40px;height:40px" src="../../assets/images/contractnormal.png">
        <label :class="{'active' : type === 'contract'}"
             @click="changeMenu('contract')">
             <span class="sidespan">{{$t('header.contracts')}}</span></label>
      </div>
      <div class="mlabel">
        <img v-if="type==='offlineSend'" style="width:40px;height:40px" src="../../assets/images/offlinef.png">
        <img v-else style="width:40px;height:40px" src="../../assets/images/offlinenormal.png">
         <label :class="{'active' : type === 'offlineSend'}"
             @click="changeMenu('offlineSend')">
             <span class="sidespan">{{$t('header.offlineSend')}}</span></label>
      </div>
      <div class="mlabel">
          <img v-if="type==='crossChain'" style="width:40px;height:40px" src="../../assets/images/wormholef.png">
        <img v-else style="width:40px;height:40px" src="../../assets/images/wormholenormal.png">
          <label :class="{'active' : type === 'crossChain'}"
             @click="changeMenu('crossChain')">
             <span class="sidespan">{{$t('header.crossChain')}}</span>
             </label>
      </div>
    </div>
    <div class="info">
      <div class="mlabel">
        <el-dropdown trigger="click" placement="bottom-start">
          <div>
             <img style="width:40px;height:40px" src="../../assets/images/setting.png">
          <span class="sidespan">setting</span>
          </div>
          <el-dropdown-menu slot="dropdown">
            <el-dropdown-item v-show="isUnlock || $store.state.offline!=null"
                              @click.native="goPage('associate')">{{$t('setUp.associate')}}</el-dropdown-item>
            <el-dropdown-item @click.native="goPage('conversion')">{{$t('setUp.conversion')}}</el-dropdown-item>
            <el-dropdown-item @click.native="goPage('networks')">{{$t('setUp.networks')}}</el-dropdown-item>
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
      </div>
      <div class="mlabel">
        <div v-show="isUnlock || $store.state.offline!= null" @click="logout">
          <img src="../../assets/images/logout.png"
          :title="$t('setUp.logout')"
          >
          <span>
          {{$t('setUp.logout')}}
          </span>
        </div>
      </div>
      <div v-if="$store.state.offline != null">&nbsp;&nbsp;&nbsp;{{$t('unlock.offline')}}</div>
      <div v-if="$store.state.wallet != null">&nbsp;&nbsp;&nbsp;{{$t('unlock.online')}}</div>
      <el-divider></el-divider>
      <div class="mlabel" style="height:20px;text-align: right;margin-top:0px">
        <el-dropdown trigger="click" @command="changeLang">
          <div>
            <img style="width:20px;height:20px" src="../../assets/images/lang.png">
            <!-- <span class="sidespan">
              {{lang === 'CN' ? $t('lang.cn') : $t('lang.en')}}<i class="el-icon-arrow-down el-icon--right"></i>
            </span> -->
          </div>
          <el-dropdown-menu slot="dropdown">
            <el-dropdown-item command="CN" :class="{'lang-active' : lang === 'CN'}">{{$t('lang.cn')}}</el-dropdown-item>
            <el-dropdown-item command="EN" :class="{'lang-active' : lang === 'EN'}">{{$t('lang.en')}}</el-dropdown-item>
          </el-dropdown-menu>
        </el-dropdown>
      </div>
    </div>
  </div>
</template>
<script>
import Bus from '@/assets/js/Bus'
import store from '@/store'
import * as storeLocal from 'store'

export default {
  name: 'Aside',
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
          if (this.beforeUrl === 'aiApplication' || this.beforeUrl === 'contract' || this.beforeUrl === 'green-mining') {
            this.type = this.beforeUrl
          }
        } else {
          this.type = 'my-wallet'
        }
      } else if (to.path.indexOf('green-mining') > -1) {
        this.type = 'green-mining'
      } else if (to.path.indexOf('offline-transfer') > -1) {
        this.type = 'offline-transfer'
      } else if (to.path.indexOf('aiApplication') > -1) {
        this.type = 'aiApplication'
      } else if (to.path.indexOf('contract') > -1) {
        this.type = 'contract'
      } else if (to.path.indexOf('mapping') > -1) {
        this.type = 'mapping'
      } else if (to.path.indexOf('jointMining') > -1) {
        this.type = 'jointMining'
      } else if (to.path.indexOf('crossChain') > -1) {
        this.type = 'crossChain'
      }
      let wallet = this.$store.state.wallet
      if (wallet != null) {
        let greetings = storeLocal.get('greetings')
        if (greetings != null) {
          if (typeof (greetings) === 'string') {
            greetings = JSON.parse(greetings)
          }
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
    try {
      let wallet = this.$store.state.wallet
      if (wallet != null) {
        let greetings = storeLocal.get('greetings')
        if (typeof (greetings) === 'string') {
          greetings = JSON.parse(greetings)
        }
        for (let i = 0, length = greetings.length; i < length; i++) {
          if (greetings[i].address === wallet.address) {
            this.userName = greetings.content
            break
          }
        }
      }
    } catch (error) {
    }
  },
  methods: {
    changeLang (lang) {
      if (lang !== this.lang) {
        Bus.$emit('changeLang', lang)
        storeLocal.set('lang', lang)
        this.lang = lang
        this.$i18n.locale = lang
      }
    },
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
            store.commit('UPDATE_BEFOREURL', '/green-mining/digAccount')
            this.$router.push({ path: '/green-mining/digAccount' })
          } else if (status === 'my-wallet') {
            store.commit('UPDATE_HISTORYURL', '/my-wallet/openWallet/myAssets')
            this.$router.push({ path: '/my-wallet/myWalletFirst' })
          } else if (status === 'aiApplication') {
            store.commit('UPDATE_BEFOREURL', '/aiApplication/aiHome')
            store.commit('UPDATE_HISTORYURL', '/aiApplication/aiHome')
            this.$router.push({ path: '/aiApplication/aiHome' })
          } else if (status === 'offlineSend') {
            store.commit('UPDATE_BEFOREURL', '/sendOffline/offlineUnlock')
            store.commit('UPDATE_HISTORYURL', '/sendOffline/offlineUnlock')
            this.$router.push({ path: '/sendOffline/offlineUnlock' })
          } else if (status === 'jointMining') {
            store.commit('UPDATE_BEFOREURL', '/jointMining/jointMiningfirst')
            store.commit('UPDATE_HISTORYURL', '/jointMining/jointMiningfirst')
            this.$router.push({ path: '/jointMining/jointMiningfirst' })
          } else if (status === 'crossChain') {
            store.commit('UPDATE_BEFOREURL', '/crossChain/bridge')
            store.commit('UPDATE_HISTORYURL', '/crossChain/bridge')
            this.$router.push({ path: '/crossChain/bridge' })
          } else {
            store.commit('UPDATE_BEFOREURL', '/' + status)
            this.$router.push({ path: '/' + status })
          }
        }
      }
    },
    goPage (url) {
      console.log('url', url)
      this.$router.push({ path: '/setUp/' + url })
    },
    goGreeting () {
      this.$router.push({ path: '/my-wallet/setGreetings' })
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
.aside {
  align-items: center;
  margin: auto;
  width: 220px;
  line-height:5px;
  .logo {
    height: 55px;
    width: 181px;
    margin-top: 51px;
    margin-bottom: 41px;
  }
  .menus {
    .mlabel{
      height: 40px;
      margin-top:10px;
      text-align: left;
      text-align: -webkit-left;
      text-align: -moz-left;
      label {
      display: inline-block;
      position: absolute;
      width: 150px;
      margin-top: 10px;
      color: rgb(0, 102, 255);
      color: #77838F;
      font-family: Open Sans;
      font-size: 16px;
      font-weight: 600;
      line-height: 22px;
      letter-spacing: 1px;
      text-align: left;
      cursor: pointer;
    }
    label:not(:first-child) {
      margin-left: 1rem;
    }
    .active {
      opacity: 1;
      color: #0066FF;
    }
    .active:after {
      content: "";
      display: inline-block;
      position: absolute;
      width: 2px;
      margin-top: 0px;
      height: 25px;
      background: #0066FF;
      margin-left: 3rem;
    }
    label:nth-child(3):after {
      margin-left: -34px;
    }
    label:nth-child(4):after {
      margin-left: -30px;
    }
    label:nth-child(5):after {
      margin-left: -22px;
    }
    }
  }
  .en {
    // margin-left: 2rem;
    .active:after {
       content: "";
      display: inline-block;
      position: absolute;
      width: 2px;
      margin-top: 0px;
      height: 25px;
      background: #0066FF;
      margin-left: 5rem;
    }
    label:nth-child(2):after {
      margin-left: -50px;
    }
    label:nth-child(3):after {
      margin-left: -48px;
    }
    label:nth-child(4):after {
      margin-left: -50px;
    }
    label:nth-child(5):after {
      margin-left: -36px;
    }
    // label:last-child:after {
    //   margin-left: -36px;
    // }
  }
  .sidespan{
    width: 125px;
    display: inline-block;
  }
  .info {
    // display: flex;
    margin-top: 60px;
    // align-items: center;
    text-align: left;
    text-align: -webkit-left;
    text-align: -moz-left;
    // flex: 1;
    justify-content : end;
     .mlabel{
      height: 40px;
      margin-top:10px;
      text-align: left;
      text-align: -webkit-left;
      text-align: -moz-left;
      img {
        // margin-left: 1.5rem;
        cursor: pointer;
        height: 40px;
        width: 40px;
      }
      label {
        display: inline-block;
        position: absolute;
        width: 150px;
        margin-top: 10px;
        color: #77838F;
        font-family: Open Sans;
        font-size: 16px;
        font-weight: 600;
        line-height: 22px;
        letter-spacing: 1px;
        text-align: left;
        cursor: pointer;
      }
      el-dropdown{
        width: 150px;
      }
      span {
        display: inline-block;
        position: absolute;
        width: 150px;
        margin-top: 10px;
        color: #77838F;
        font-family: Open Sans;
        font-size: 16px;
        font-weight: 600;
        line-height: 22px;
        letter-spacing: 1px;
        text-align: left;
        cursor: pointer;
      }
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
