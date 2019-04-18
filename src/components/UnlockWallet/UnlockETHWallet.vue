<template>
  <div class="unlock-eth-wallet">
    <h1>{{ $t('mapping.openWallet')}}</h1>
    <h4 v-if="lang === 'CN'">选择下面其中一种方式打开钱包</h4>
    <div class="card_pos">
      <div class="card_way"
           @click="selectUnlock('keystore')">
        <div class="pic_dis">
          <img src="../../assets/images/keystone.png">
        </div>
        <div class="check_font">
          <input type="radio"
                 v-model="unlockType"
                 value="keystore">
          <label>Keystore {{$t('myWallet.file')}}</label>
        </div>
      </div>
      <div class="card_way div_dis"
           @click="selectUnlock('privateKey')">
        <div class="pic_dis">
          <img src="../../assets/images/private_key.png">
        </div>
        <div class="check_font">
          <input type="radio"
                 v-model="unlockType"
                 value="privateKey">
          <label>{{$t('myWallet.privateKey')}}</label>
        </div>
      </div>
    </div>
    <div v-show="unlockType == 'keystore'">
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
    <div v-show="unlockType == 'privateKey'">
      <div>
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
    <div v-show="unlockType == 'mnemonic'">
      <div>
        <textarea class="key_text"
                  :placeholder="$t('myWallet.enterMnemonic')"
                  v-model="mnemonic"
                  rows="4"></textarea>
      </div>
      <div class="hint_error"
           v-show="keyPrivateError">*{{$t('myWallet.mnemonicIncorrect')}}</div>
      <div class="file_btn"
           @click="openWallet">{{$t('myWallet.openWallet')}}</div>
    </div>
  </div>
</template>

<script>
import WalletUtil from '@/assets/js/WalletUtil'
import Validate from '@/assets/js/Validate'
import store from '@/store'
export default {
  name: 'UnlockEthWallet',
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
      keyPrivateError: false
    }
  },
  props: {
    title: {
      default: '',
      type: String
    }
  },
  mounted () {
  },
  methods: {
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
      // if (this.password.length < 9) {
      //   this.keystoreError = true
      //   loading.close()
      // } else {
      this.keystoreError = false
      WalletUtil.keyStoreToWallet(this.keyStore, this.password).then((result) => {
        loading.close()
        store.commit('UNLOCK_WALLET', result)
        this.keyStore = null
        this.isShowPassword = false
        this.password = ''
        this.keystoreError = false
        this.$refs.file.value = ''
        this.$emit('openWallet')
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
          store.commit('UNLOCK_WALLET', wallet)
          this.privateKey = ''
          this.keyPrivateError = false
          this.$emit('openWallet')
        }
      } else if (this.unlockType === 'mnemonic') {
        if (this.mnemonic.split(' ').length !== 12) {
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
          store.commit('UNLOCK_WALLET', wallet)
          this.mnemonic = ''
          this.keyPrivateError = false
          this.$emit('openWallet')
        }
      }
    }
  },
  components: {
  }
}
</script>

<style scoped lang="less">
.unlock-eth-wallet {
  img {
    width: 2rem;
  }
  .div_dis {
    margin-left: 2.5rem;
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
      background: #415eaa;
      border: 1px solid #415eaa;
    }
  }
  .hint_error {
    font-size: 12px;
    color: #ed3c1c;
    letter-spacing: 0.11px;
    // position: relative;
    // left: -121px;
    width: 27.56rem;
    text-align: left;
    margin-top: 0.4rem;
  }
  .input-file {
    display: none;
  }
  .file_btn {
    margin-top: 1.5rem !important;
  }
}
</style>
