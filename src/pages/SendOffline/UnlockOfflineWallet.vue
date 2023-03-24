<template>
  <div class="unlock-wallet">
    <h1>{{$t('OfflineUnlock.signing')}}</h1>
    <h4 v-if="!offSwitch">{{$t('OfflineUnlock.selectSign')}}</h4>
    <div style="display:flex;flex-direction: row;justify-content: left;margin-left: 7rem;" v-if="!offSwitch">
      <div class="card_pos">
         <!--keystore Card-->
        <div class="card_way div_dis"
             @click="selectUnlock('keystore')">
           <div class="check_font" @click="selectWay('keystore')">
            <img v-if="unlockType === 'keystore'" src="../../assets/images/radiof.png" alt="">
            <img v-if="unlockType !== 'keystore'" src="../../assets/images/radio.png" alt="">
          </div>
          <div class="pic_dis">
            <img src="../../assets/images/keystone.png">
          </div>
        </div>
         <!--私钥 Card-->
        <div class="card_way div_dis"
             @click="selectUnlock('privateKey')">
          <div class="check_font" @click="selectWay('privateKey')">
            <img v-if="unlockType === 'privateKey'" src="../../assets/images/radiof.png" alt="">
            <img v-if="unlockType !== 'privateKey'" src="../../assets/images/radio.png" alt="">
          </div>
           <div class="pic_dis">
            <img src="../../assets/images/private_key.png">
          </div>
        </div>
         <!--助记词 Card-->
        <div class="card_way div_dis"
             @click="selectUnlock('mnemonic')">
          <div class="check_font" @click="selectWay('privateKey')">
            <img v-if="unlockType === 'mnemonic'" src="../../assets/images/radiof.png" alt="">
            <img v-if="unlockType !== 'mnemonic'" src="../../assets/images/radio.png" alt="">
          </div>
           <div class="pic_dis mnemonic">
            <img src="../../assets/images/mnemonic.png">
          </div>
        </div>
        <!--ledger硬件钱包解锁-->
        <div class="card_way div_dis"
             @click="selectUnlock('ledger')">
          <div class="check_font" @click="selectWay('privateKey')">
            <img v-if="unlockType === 'ledger'" src="../../assets/images/radiof.png" alt="">
            <img v-if="unlockType !== 'ledger'" src="../../assets/images/radio.png" alt="">
          </div>
          <div class="pic_dis">
            <img src="../../assets/images/ledger.png">
          </div>
        </div>
      </div>
      <div class="cardcontent" v-show="unlockType == 'keystore'">
         <h3 style="text-align: left">Keystore {{$t('myWallet.file')}}</h3>
        <div class="pass_input"
             v-if="keyStore != null">
          <input class="storeInput"
                 :type="isShowPassword ? 'text' : 'password'"
                 :placeholder="$t('myWallet.enterPassword')"
                 v-model="password">
          <div class="pass_pic"
               :class="{'passwordClose': !isShowPassword, 'passwordOpen' : isShowPassword }"
               @click="changeShowPassword">
            <img :src="isShowPassword ? require('../../assets/images/password_open.png') : require('../../assets/images/password_close.png')">
          </div>
        </div>
        <div class="hint_error"
             v-show="keystoreError">*{{$t('createWallet.passWordError')}}</div>
        <div class="file_btn"
             @click="selectFile"
             v-if="keyStore == null">{{$t('myWallet.selectWalletFile')}}...</div>
        <div class="file_btn"
             @click="unlockPassword"
             v-if="keyStore != null">{{$t('myWallet.openWallet')}}</div>
        <input type="file"
               class="input-file"
               ref="file"
               @change="changeFile($event)" />
      </div>
      <div class="cardcontent" v-show="unlockType == 'privateKey'">
        <div>
          <h3 style="text-align: left;">{{$t('myWallet.privateKey')}}</h3>
          <textarea class="key_text"
                    :placeholder="$t('myWallet.enterPrivate')"
                    v-model="privateKey"
                    rows="4"></textarea>
        </div>
        <div class="hint_error"
             v-show="keyPrivateError">*{{$t('myWallet.privateIncorrect')}}</div>
        <div class="file_btn"
             @click="openWallet">{{$t('myWallet.openWallet')}}</div>
      </div>
      <div class="cardcontent" v-show="unlockType == 'mnemonic'">
        <div>
          <h3 style="text-align: left;">{{$t('myWallet.mnemonic')}}{{$t('myWallet.mnemonicMan')}}</h3>
          <!-- <textarea class="key_text"
                    :placeholder="$t('myWallet.enterMnemonic')"
                    v-model="mnemonic"
                    rows="4"></textarea> -->
           <div class="mnemonic_list">
            <ul>
              <li v-for="(item,index) in mnemonicList"
                  :key="index">
                <span>word{{index+1}}</span>
                <input type="text" :id="index" v-model="mnemonicList[index]">
              </li>
            </ul>
          </div>
        </div>
        <div class="hint_error"
             v-show="keyPrivateError">*{{$t('myWallet.mnemonicIncorrect')}}</div>
        <div class="file_btn"
             @click="openWallet">{{$t('myWallet.openWallet')}}</div>
      </div>
      <!--ledger-->
      <div  class="ledger cardcontent" v-show="unlockType == 'ledger'">
        <h4>请连接您的ledger硬件钱包</h4>
        <div class="hint_error"
             v-show="keyPrivateError">*{{$t('myWallet.ledgerIncorrect')}}</div>
        <div class="file_btn"
             @click="openWallet">{{$t('myWallet.openWallet')}}</div>
      </div>
    </div>
  </div>
</template>

<script>
import WalletUtil from '@/assets/js/WalletUtil'
import Validate from '@/assets/js/Validate'
import store from '@/store'
import Bus from '@/assets/js/Bus'
import filter from '@/assets/js/filters'
import * as storeLocal from 'store'

export default {
  name: 'UnlockWallet',
  data () {
    return {
      lang: this.$i18n.locale,
      unlockType: 'keystore',
      keyStore: null,
      isShowPassword: false,
      privateKey: '',
      password: '',
      mnemonic: '',
      keystoreError: false,
      keyPrivateError: false,
      isEmit: true,
      offSwitch: false,
      address: '',
      wallet: {},
      mnemonicList: ['', '', '', '', '', '', '', '', '', '', '', '']
    }
  },
  props: {
    title: {
      default: '',
      type: String
    }
  },
  mounted () {
    let historyUrl = store.state.historyUrl
    if (historyUrl.indexOf('green-mining') > -1 || historyUrl.indexOf('aiApplication') > -1 || historyUrl.indexOf('contract') > -1) {
      this.isEmit = false
    }
  },
  methods: {
    selectWay (way) {
      this.unlockType = way
    },
    changeShowPassword () {
      this.isShowPassword = !this.isShowPassword
    },
    selectFile () {
      this.$refs.file.click()
    },
    unlockPassword () {
      let loading = this.$loading({
        lock: true,
        text: 'Loading',
        spinner: 'el-icon-loading',
        background: 'rgba(0, 0, 0, 0.7)'
      })
      this.keystoreError = false
      WalletUtil.keyStoreToWallet(this.keyStore, this.password).then((result) => {
        loading.close()
        // store.commit('UPDATE_WALLET', result)
        this.wallet = result
        this.keyStore = null
        this.isShowPassword = false
        this.password = ''
        this.keystoreError = false
        this.$refs.file.value = ''
        this.$emit('openWallet', this.wallet)
        if (this.isEmit) {
          Bus.$emit('openWallet', this.wallet)
        }
      }, () => {
        loading.close()
        this.keystoreError = true
      })
      // }
    },
    changeFile () {
      let file = this.$refs.file.files[0]
      let reader = new FileReader()
      reader.readAsText(file)
      reader.onload = (file) => {
        let fileTemp = file.srcElement || file.target
        try {
          let result = Validate.walletRequirePass(fileTemp.result)
          if (result) {
            this.keyStore = JSON.parse(fileTemp.result)
          }
        } catch (e) {
          this.$message.error(e)
        }
      }
    },
    selectUnlock (type) {
      this.unlockType = type
      this.keyStore = null
      this.isShowPassword = false
      this.privateKey = ''
      this.password = ''
      this.mnemonic = ''
      this.keystoreError = false
      this.keyPrivateError = false
      this.$refs.file.value = ''
    },
    openWallet () {
      if (this.unlockType === 'privateKey') {
        if (!/^[0-9a-fA-F]{64}$/.test(this.privateKey.trim())) {
          this.keyPrivateError = true
        } else {
          this.keyPrivateError = false
          let loading = this.$loading({
            lock: true,
            text: 'Loading',
            spinner: 'el-icon-loading',
            background: 'rgba(0, 0, 0, 0.7)'
          })
          let wallet = WalletUtil.privateKeyToWallet(this.privateKey.trim())
          loading.close()
          // store.commit('UPDATE_WALLET', wallet)
          this.wallet = wallet
          this.privateKey = ''
          this.keyPrivateError = false
          this.$emit('openWallet', this.wallet)
          if (this.isEmit) {
            Bus.$emit('openWallet', this.wallet)
          }
        }
      } else if (this.unlockType === 'mnemonic') {
        this.mnemonic = ''
        for (let i = 0; i < 12; i++) {
          if (this.mnemonicList[i] === '') {
            this.keyPrivateError = true
            return
          }
          if (i === 11) {
            this.mnemonic = this.mnemonic + this.mnemonicList[i].replace(/\s*/g, '')
          } else {
            this.mnemonic = this.mnemonic + this.mnemonicList[i].replace(/\s*/g, '') + ' '
          }
        }
        if (this.mnemonic.split(' ').length !== 24 && this.mnemonic.split(' ').length !== 12) {
          this.keyPrivateError = true
        } else {
          this.keyPrivateError = false
          let loading = this.$loading({
            lock: true,
            text: 'Loading',
            spinner: 'el-icon-loading',
            background: 'rgba(0, 0, 0, 0.7)'
          })
          let wallet = WalletUtil.privateKeyToWallet(WalletUtil.mnemonicToPrivateKey(this.mnemonic).toString('hex'))
          loading.close()
          // store.commit('UPDATE_WALLET', wallet)
          this.wallet = wallet
          this.mnemonic = ''
          this.keyPrivateError = false
          this.$emit('openWallet', this.wallet)
          if (this.isEmit) {
            Bus.$emit('openWallet', this.wallet)
          }
        }
      } else if (this.unlockType === 'ledger') {
        this.mnemonic = ''
        this.keyPrivateError = false
        this.$emit('openWallet', this.wallet)
        if (this.isEmit) {
          Bus.$emit('openWallet', this.wallet)
        }
      }
    },
    loginOffline () {
      if (WalletUtil.validateManAddress(this.address)) {
        this.$store.commit('OFFLINE', this.address)
        let historyUrl = store.state.historyUrl
        if (historyUrl === '/my-wallet/myWalletFirst' && store.state.beforeUrl != null) {
          historyUrl = store.state.beforeUrl
        }
        this.address = this.$store.getters.offline
        let balance = this.httpProvider.man.getBalance(this.address)
        let walletBlance = filter.weiToNumber(balance[0].balance)
        this.$store.commit('BALANCE', walletBlance)
        let greetings = storeLocal.get('greetings')
        let msg = this.$t('unlock.unlockSuccess')
        if (greetings != null) {
          let address = this.$store.state.offline
          // greetings = JSON.parse(greetings)
          if (typeof (greetings) === 'string') {
            greetings = JSON.parse(greetings)
          }
          for (let i = 0, length = greetings.length; i < length; i++) {
            if (greetings[i].address === address) {
              msg += ' ' + greetings[i].content
              break
            }
          }
        }
        this.$message({
          message: msg,
          duration: 3000,
          type: 'success',
          showClose: true
        })
        if (historyUrl.indexOf('green-mining') > -1 || historyUrl.indexOf('aiApplication') > -1 || historyUrl.indexOf('contract') > -1) {
          this.$router.push({ path: historyUrl })
        } else {
          this.$router.push({ path: '/my-wallet/openWallet/myAssets' })
        }
      } else {
        this.$message.error(this.$t('errorMsgs.invalidManAddress'))
      }
    }
  },
  components: {
  }
}
</script>

<style scoped lang="less">
.unlock-wallet {
  .mnemonic_list {
    width: 100%;
    background: #FFFFFF;
    margin: 0 auto;
    ul {
      display: flex;
      flex-wrap: wrap;
      li {
        width: 20%;
        padding: 0 0;
        box-sizing: border-box;
        color: #333333;
        border-radius: 1rem;
        // height: 2rem;
        margin-top: 0.1rem;
        margin-bottom: 0.1rem;
        margin-left: auto;
        margin-right: 1rem;
        text-align: left;
        input {
          background-color: #F7F7FF;
          width: 100%;
          text-indent: 0rem;
          height: 3rem;
          border: none;
          border-radius: 5px;
          font-size: 0.9rem;
          color: rgba(120, 153, 206, 1);
        }
        input::-webkit-input-placeholder{
              color: rgba(120, 153, 206, 1);
            }
        }
        li::marker {
          content: '';
        }
    }
  }
  .cardcontent{
    width: 50%;
  }
  .ledger {
    h4 {
      margin-top: 1rem;
    }
  }
  .switch_offline {
    position: relative;
    right: -413px;
    top: 25px;
  }
  img {
    width: 4rem;
  }
  .div_dis {
    margin-left: 2.5rem;
    .mnemonic {
      margin-bottom: 0;
    }
  }
  h4 {
    margin: 0 auto 2rem;
    font-size: 0.875rem;
    color: #9298ae;
    letter-spacing: 0.13px;
    text-align: center;
    font-weight: 400;
  }
  label {
    font-size: 14px;
    color: #1c51dd;
    letter-spacing: 0;
  }
  .font-blue {
    font-size: 14px;
    color: #1c51dd;
    letter-spacing: 0;
  }
  .storeInput {
    width: 22.625rem;
    height: 2.5rem;
    padding-left: 0.5rem;
    border: 1px solid #d5d7de;
  }
  .pass_input {
    display: flex;
    flex-direction: row;
    justify-content: center;
    margin-top: 2.5rem;
    .pass_pic {
      width: 3.3125rem;
      height: 2.6rem;
      line-height: 3rem;
      cursor: pointer;
    }
    .passwordClose {
      background: #f2f4f8;
      border: 1px solid #f2f4f8;
    }
    .passwordOpen {
      background: #0066FF;
      border: 1px solid #0066FF;
    }
  }
  .hint_error {
    font-size: 12px;
    color: #ed3c1c;
    letter-spacing: 0.11px;
    // position: relative;
    // left: -121px;
    margin-top: 0.4rem;
    width: 27.56rem;
    text-align: left;
  }
  .input-file {
    display: none;
  }
  .file_btn {
    margin: 1.5rem auto !important ;
  }
  /deep/.el-input {
    width: 26.5rem;
  }
  .check_font{
    margin-top: 2.5rem;
    margin-right: 2rem;
    img{
      width: 2rem;
    }
  }
}
</style>
