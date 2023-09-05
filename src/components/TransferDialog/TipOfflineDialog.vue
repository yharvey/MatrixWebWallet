<template>
  <el-dialog :visible.sync="confirmOffline"
             :showClose=false
             customClass="offline-dialog"
             :width="width"
             :before-close="handleClose"
             center>
    <div class="content">
      <h1>{{$t('unlock.sign')}}</h1>
      <h5>{{$t('OfflineUnlock.noSignTransfer')}}：</h5>
      <el-input type="textarea"
                :autosize="{ minRows: 4, maxRows: 6}"
                v-model="transferJson"></el-input>
      <div  style="display:flex;flex-direction: row;justify-content: left;margin-left: 0rem;">
        <div class="card_pos">
          <!-- keystore -->
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
           <!-- privateKey -->
          <div class="card_way div_dis"
               @click="selectUnlock('privateKey')">
            <div class="check_font" @click="selectWay('privateKey')">
              <img v-if="unlockType === 'privateKey'" src="../../assets/images/radiof.png" alt="">
              <img v-if="unlockType !== 'privateKey'" src="../../assets/images/radio.png" alt="">
            </div>
            <div class="pic_dis">
              <img src="../../assets/images/private_key.png">
            </div>
            <!-- <div class="check_font">
              <input type="radio"
                     v-model="unlockType"
                     value="privateKey">
              <label>{{$t('myWallet.privateKey')}}</label>
            </div> -->
          </div>
           <!-- mnemonic -->
          <div class="card_way div_dis"
               @click="selectUnlock('mnemonic')">
            <div class="check_font" @click="selectWay('mnemonic')">
              <img v-if="unlockType === 'mnemonic'" src="../../assets/images/radiof.png" alt="">
              <img v-if="unlockType !== 'mnemonic'" src="../../assets/images/radio.png" alt="">
            </div>
            <div class="pic_dis">
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

        <div  class="cardcontent" v-show="unlockType == 'keystore'">
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
              <img
                :src="isShowPassword ? require('../../assets/images/password_open.png') : require('../../assets/images/password_close.png')">
            </div>
          </div>
          <div class="hint_error"
              v-show="keystoreError">*{{$t('createWallet.passWordError')}}
          </div>
          <button class="common-button button-top"
                  @click="selectFile"
                  v-if="keyStore == null">{{$t('myWallet.selectWalletFile')}}...
          </button>
          <button class="common-button button-top"
                  @click="unlockPassword"
                  v-if="keyStore != null">{{$t('myWallet.openWallet')}}
          </button>
          <input type="file"
                class="input-file"
                ref="file"
                @change="changeFile($event)"/>
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
              v-show="keyPrivateError">*{{$t('myWallet.privateIncorrect')}}
          </div>
          <button class="common-button button-top"
                  @click="openWallet">{{$t('myWallet.openWallet')}}
          </button>
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
              v-show="keyPrivateError">*{{$t('myWallet.mnemonicIncorrect')}}
          </div>
          <button class="common-button button-top"
                  @click="openWallet">{{$t('myWallet.openWallet')}}
          </button>
        </div>
        <!--ledger-->
        <div class="cardcontent ledger" v-show="unlockType == 'ledger'">
          <h3 style="text-align: left">Ledger</h3>
          <!-- <h4 style="margin-top: 4rem;" >请连接您的ledger硬件钱包</h4> -->
          <h4 style="margin-top: 4rem;" >Please connect your Ledger hardware wallet</h4>
          <div class="hint_error"
               v-show="keyPrivateError">*{{$t('myWallet.ledgerIncorrect')}}</div>
          <button class="common-button button-top"
                  @click="openWallet">{{$t('myWallet.openWallet')}}
          </button>
        </div>
    </div>
    <div class="error_font">{{$t('OfflineUnlock.offlineTip')}}</div>
    <!-- <button class="common-button button-top"
            @click="signTransfer"
            v-if="wallet!=null">{{$t('unlock.sign')}}</button> -->
    </div>
  </el-dialog>
</template>

<script>
import WalletUtil from '@/assets/js/WalletUtil'
import Validate from '@/assets/js/Validate'
import LedgerUtil from '@/assets/js/LedgerUtil'
import { chainId } from '@/assets/js/config' // 配置

export default {
  name: 'TransferDialog',
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
      wallet: null,
      mnemonicList: ['', '', '', '', '', '', '', '', '', '', '', '']
    }
  },
  props: {
    confirmOffline: {
      default: false,
      type: Boolean
    },
    width: {
      default: '',
      type: String
    },
    transferJson: {
      default: '',
      type: String
    }
  },
  methods: {
    selectWay (way) {
      this.unlockType = way
    },
    openSendSign () {
      this.$emit('changeConfirmOffline', false)
      this.$emit('openSendSign')
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
        this.signTransfer()
      }, () => {
        loading.close()
        this.keystoreError = true
      })
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
          this.signTransfer()
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
          this.signTransfer()
        }
      } else if (this.unlockType === 'ledger') {
        let loading = this.$loading({
          lock: true,
          text: 'Loading',
          spinner: 'el-icon-loading',
          background: 'rgba(0, 0, 0, 0.7)'
        })
        let tx = WalletUtil.createTx(JSON.parse(this.transferJson))
        tx.v = '0x' + chainId.toString(16)
        LedgerUtil.sign(tx.serialize()).then((result) => {
          loading.close()
          // let v = '0x' + (parseInt(result.v.toString('hex'), 16) + (chainId * 2 + 8)).toString(16)
          // let r = '0x' + result.r.toString('hex')
          // let s = '0x' + result.s.toString('hex')
          const r = '0x' + Buffer.from(result.signatureRSV.slice(0, 32)).toString('hex')
          const s = '0x' + Buffer.from(result.signatureRSV.slice(32, 64)).toString('hex')
          const v = '0x' + (parseInt(Buffer.from(result.signatureRSV.slice(64)).toString('hex'), 16) + (chainId * 2 + 8 + 27)).toString(16)
          tx.s = s
          tx.r = r
          tx.v = v
          let serializedTx = '0x' + tx.serialize().toString('hex')
          this.changeConfirmOffline = false
          this.wallet = null
          this.$emit('changeConfirmOffline', serializedTx)
        }).catch(err => {
          loading.close()
          this.$message.error(err.message)
        })
      }
    },
    signTransfer () {
      try {
        let tx = WalletUtil.createTx(JSON.parse(this.transferJson))
        let privateKey = this.wallet.privateKey
        privateKey = Buffer.from(privateKey.indexOf('0x') > -1 ? privateKey.substring(2, privateKey.length) : privateKey, 'hex')
        tx.sign(privateKey)
        let serializedTx = '0x' + tx.serialize().toString('hex')
        this.changeConfirmOffline = false
        this.wallet = null
        this.$emit('changeConfirmOffline', serializedTx)
      } catch (e) {
        this.$message.error(this.$t('errorMsgs.jsonError'))
      }
    },
    handleClose () {
      this.$emit('changeConfirmOffline', false)
      this.wallet = null
    }
  },
  mounted () {
  }
}
</script>

<style scoped lang="less">
  .offline-dialog {
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
      width: auto;
    }
    .ledger {
      h4 {
        margin-top: 1rem;
      }
    }
    /deep/ .el-dialog__body {
      padding: 0 !important;
    }
    /deep/ .el-dialog__header {
      padding: 0;
      height: 2rem;
    }
    /deep/ .el-dialog__footer {
      background: rgba(44, 54, 92, 0.03);
      border-radius: 0px 0px 2px 2px;
      height: 3.5rem;
      margin-top: 2.06rem;
    }
    .content {
      .input-file {
        display: none;
      }
      .hint_error {
        font-size: 12px;
        color: #ed3c1c;
        letter-spacing: 0.11px;
        margin-top: 0.4rem;
        width: 27.56rem;
        text-align: left;
      }
      text-align: center;
      .div_dis {
        margin-left: 2.5rem;
        .mnemonic {
          margin-bottom: 0;
        }
      }
      label {
        font-size: 14px;
        color: #1c51dd;
        letter-spacing: 0;
      }
      padding: 0 2.5rem;
      text-align: center;
      img {
        width: 4rem;
      }
      .button-top {
        margin: 2.5rem 0 0 0;
      }
      .send_font {
        font-size: 1rem;
        color: #1c51dd;
        letter-spacing: 0.13px;
        cursor: pointer;
        margin-top: 1rem;
      }
    }
    .error_font {
      font-size: 1rem;
      color: #ed3c1c;
      letter-spacing: 0.11px;
      margin-top: 1rem;
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
    .check_font{
      margin-top: 2.5rem;
      margin-right: 2rem;
      img{
        width: 2rem;
      }
    }
  }
</style>
