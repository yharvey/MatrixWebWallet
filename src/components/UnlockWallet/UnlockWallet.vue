<template>
  <div class="unlock-wallet">
    <div class="switch_offline">
      <el-switch v-model="offSwitch"
                 active-color="#13ce66">
      </el-switch>
      <span v-html="!offSwitch?$t('unlock.offline'):$t('unlock.online')"></span>
    </div>
    <h1 style="text-align: left;
    margin-left: 6rem;">{{title === $t('myWallet.queryWallet') ? $t('myWallet.openWallet') : ''}}</h1>
    <h4 style="text-align: left;margin-left: 6rem;" v-if="offSwitch">{{$t('myWallet.choose')}}</h4>
    <div style="display:flex;flex-direction: row;justify-content: left;margin-left: 4rem;" v-if="offSwitch">
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
          <div class="check_font" @click="selectWay('mnemonic')">
            <img v-if="unlockType === 'mnemonic'" src="../../assets/images/radiof.png" alt="">
            <img v-if="unlockType !== 'mnemonic'" src="../../assets/images/radio.png" alt="">
          </div>
           <div class="pic_dis mnemonic">
            <img src="../../assets/images/mnemonic.png">
          </div>
        </div>
        <!--ledger硬件钱包 Card-->
        <div class="card_way div_dis"
             @click="selectUnlock('ledger')">
          <div class="check_font" @click="selectWay('ledger')">
            <img v-if="unlockType === 'ledger'" src="../../assets/images/radiof.png" alt="">
            <img v-if="unlockType !== 'ledger'" src="../../assets/images/radio.png" alt="">
          </div>
          <div class="pic_dis">
            <img src="../../assets/images/ledger.png">
          </div>
        </div>
      </div>
      <!--keystore 输入密码-->
      <div class="cardcontent" v-show="unlockType == 'keystore'">
        <h3 style="text-align: left;font-family: Poppins;">Keystore {{$t('myWallet.file')}}</h3>
        <div class="pass_input"
             v-if="keyStore != null">
          <input class="storeInput"
                 :type="isShowPassword ? 'text' : 'password'"
                 :placeholder="$t('myWallet.enterPassword')"
                 v-model="password">
          <div class="pass_pic"
               :class="{'passwordClose': !isShowPassword, 'passwordOpen' : isShowPassword }"
               @click="changeShowPassword">
            <img style="width:1.5rem" :src="isShowPassword ? require('../../assets/images/password_open.png') : require('../../assets/images/password_close.png')">
          </div>
        </div>
        <div class="hint_error"
             v-show="keystoreError">*{{$t('createWallet.passWordError')}}</div>
        <div style="height:4rem"></div>

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
      <!--私钥解锁-->
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
      <!--助记词-->
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
      <div class="cardcontent ledger" v-show="unlockType == 'ledger'">
        <h3 style="text-align: left">Ledger</h3>
        <h4 style="margin-top: 4rem;">Please connect your Ledger hardware wallet</h4>
        <div class="hint_error"
             v-show="keyPrivateError">*{{$t('myWallet.ledgerIncorrect')}}</div>
        <div class="file_btn"
             @click="openWallet">{{$t('myWallet.openWallet')}}</div>
      </div>
    </div>
    <div v-if="!offSwitch">
      <el-input type="text"
                :placeholder="$t('queryWallet.pleaseInput')"
                v-model="address"></el-input>
      <div class="div-width">
        <span class="spanStyle">{{$t('unlock.unlockTips')}}</span>
      </div>
      <div class="file_btn"
           @click="loginOffline">{{$t('HistoricalIncome.determine')}}</div>
    </div>
  </div>
</template>

<script>
import WalletUtil from '@/assets/js/WalletUtil'
import LedgerUtil from '@/assets/js/LedgerUtil'
import Validate from '@/assets/js/Validate'
import store from '@/store'
import Bus from '@/assets/js/Bus'
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
      offSwitch: this.$store.state.mode,
      address: '',
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
    if (historyUrl.indexOf('green-mining') > -1 || historyUrl.indexOf('aiApplication') > -1 || historyUrl.indexOf('contract') > -1 || historyUrl.indexOf('jointMining') > -1) {
      if (historyUrl.indexOf('jointMining') > -1) {
        this.$router.push({ path: '/jointMining/jointMiningfirst' })
        return
      }
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
        store.commit('UPDATE_WALLET', result)
        this.keyStore = null
        this.isShowPassword = false
        this.password = ''
        this.keystoreError = false
        this.$refs.file.value = ''
        this.$emit('openWallet')
        if (this.isEmit) {
          Bus.$emit('openWallet')
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
          store.commit('UPDATE_WALLET', wallet)
          this.privateKey = ''
          this.keyPrivateError = false
          this.$emit('openWallet')
          if (this.isEmit) {
            Bus.$emit('openWallet')
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
          store.commit('UPDATE_WALLET', wallet)
          this.mnemonic = ''
          this.keyPrivateError = false
          this.$emit('openWallet')
          if (this.isEmit) {
            Bus.$emit('openWallet')
          }
        }
      } else if (this.unlockType === 'ledger') {
        let loading = this.$loading({
          lock: true,
          text: 'Loading',
          spinner: 'el-icon-loading',
          background: 'rgba(0, 0, 0, 0.7)'
        })
        LedgerUtil.getAddress(0, 0, 0).then((result) => {
          loading.close()
          let wallet = {
            address: '',
            pubKey: ''
          }
          wallet.address = result.address
          wallet.pubKey = result.pubKey
          store.commit('UPDATE_WALLET', wallet)
          this.$emit('openWallet')
          if (this.isEmit) {
            Bus.$emit('openWallet')
          }
        }).catch(err => {
          loading.close()
          this.$message.error(err.message)
        })
      }
    },
    loginOffline () {
      try {
        this.address = this.address.trim()
        if (WalletUtil.validateManAddress(this.address)) {
          this.$store.commit('OFFLINE', this.address)
          this.address = this.$store.getters.offline
          let historyUrl = store.state.historyUrl
          if (historyUrl === '/my-wallet/myWalletFirst' && store.state.beforeUrl != null) {
            historyUrl = store.state.beforeUrl
          }
          let greetings = storeLocal.get('greetings')
          let msg = this.$t('unlock.unlockSuccess')
          if (greetings != null) {
            let address = this.$store.state.offline
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
          if (historyUrl.indexOf('green-mining') > -1 || historyUrl.indexOf('aiApplication') > -1 || historyUrl.indexOf('contract') > -1 || historyUrl.indexOf('jointMining') > -1) {
            if (historyUrl.indexOf('jointMining') > -1) {
              this.$router.push({ path: '/jointMining/jointMiningfirst' })
              return
            }
            this.$router.push({ path: historyUrl })
          } else {
            this.$router.push({ path: '/my-wallet/openWallet/myAssets' })
          }
        } else {
          this.$message.error(this.$t('errorMsgs.invalidManAddress'))
        }
      } catch (e) {
        this.$message.error(e.message)
      }
    }
  },
  components: {
  },
  watch: {
    offSwitch: {
      handler: function (val, oldval) {
        this.$store.commit('MODE', val)
      },
      deep: true
    }
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
      margin-left: -3rem;
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
    width: 45%;
  }
  .ledger {
    h4 {
      margin-top: 1rem;
    }
  }
  .spanStyle {
    font-size: 0.75rem;
    color: #9298ae;
    letter-spacing: 0.11px;
    text-align: center;
  }
  .switch_offline {
    position: relative;
    right: -310px;
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
    margin: 0.4rem auto;
    width: 27.56rem;
    text-align: left;
  }
  .input-file {
    display: none;
  }
  .file_btn {
    margin: 5rem 1.5rem 5rem 1.5rem auto !important;
    border-radius: 5px;
    width: 268px;
  }
  /deep/.el-input {
    margin-top: 1rem;
    width: 26.5rem;
  }
  .div-width {
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
