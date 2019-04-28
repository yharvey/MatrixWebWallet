<template>
  <div class="offlineUnlock">
    <h5>{{$t('OfflineUnlock.noSignTransfer')}}：</h5>
    <el-input type="textarea"
              class="input-bottom"
              :autosize="{ minRows: 4, maxRows: 6}"
              v-model="transferJson"></el-input>
    <unlock-wallet @openWallet="openWallet"></unlock-wallet>
    <div class="error_font">{{$t('OfflineUnlock.offlineTip')}}</div>
  </div>
</template>

<script>
import UnlockWallet from '@/pages/SendOffline/UnlockOfflineWallet'
import WalletUtil from '@/assets/js/WalletUtil'

export default {
  name: 'offlineUnlock',
  data () {
    return {
      copyData: '',
      address: '',
      wallet: {},
      transferJson: ''
    }
  },
  mounted () {
  },
  methods: {
    openWallet (data) {
      try {
        this.wallet = data
        let tx = WalletUtil.createTx(JSON.parse(this.transferJson))
        let privateKey = this.wallet.privateKey
        privateKey = Buffer.from(privateKey.indexOf('0x') > -1 ? privateKey.substring(2, privateKey.length) : privateKey, 'hex')
        tx.sign(privateKey)
        let serializedTx = '0x' + tx.serialize().toString('hex')
        this.$router.push({ name: 'SendSignTransfer', params: { serializedTx: serializedTx } })
      } catch (e) {
        this.$message.error(this.$t('errorMsgs.jsonError'))
      }
    },
    goPage () {
      this.$router.push({ path: '/sendOffline/sendSignTransfer' })
    }
  },
  components: {
    UnlockWallet
  }
}
</script>

<style scoped lang="less">
.offlineUnlock {
  .keyStoneHintFont {
    font-size: 0.75rem;
    color: #9298ae;
    letter-spacing: 0.11px;
    text-align: center;
  }
  a {
    font-size: 12px;
    color: #1c51dd;
    letter-spacing: 0.11px;
    text-align: center;
    line-height: 17px;
    cursor: pointer;
  }
  .input-bottom {
    margin-bottom: 1rem;
  }
  .error_font {
    font-size: 1rem;
    color: #ed3c1c;
    letter-spacing: 0.11px;
    margin-top: 1rem;
  }
}
</style>
