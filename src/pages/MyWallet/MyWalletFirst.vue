<template>
  <div class="my-WalletFirst">
    <el-card class="box-card">
      <unlock-wallet :title="$t('myWallet.queryWallet')"
                     @openWallet="openWallet('openWallet')"></unlock-wallet>
      <div>
        <span class="keyStoneHintFont">{{$t('myWallet.msg1')}}&nbsp; <a @click="goPage('createWallet')">{{$t('myWallet.create')}}</a></span>
      </div>
    </el-card>
  </div>
</template>

<script>
import UnlockWallet from '@/components/UnlockWallet/UnlockWallet'
import store from '@/store'
import WalletUtil from '@/assets/js/WalletUtil'
import { mortgage } from '@/assets/js/config'
import filter from '@/assets/js/filters'

export default {
  name: 'MyWallet',
  data () {
    return {
      copyData: '',
      address: ''
    }
  },
  mounted () {
    // console.log(WalletUtil.entropyToMnemonic('dd47e5391a7a3aa921dae322659537493219b779eca811006b239636c4446556'))
    try {
      let address
      if (this.$store.state.offline != null) {
        address = this.$store.state.offline
      } else {
        address = this.$store.getters.wallet.address
      }
      if (address) {
        this.$router.push({ path: '/my-wallet/openWallet/myAssets' })
      }
    } catch (error) {
    }
  },
  methods: {
    goPage (route) {
      this.$router.push({ path: '/my-wallet/' + route })
    },
    openWallet () {
      let historyUrl = store.state.historyUrl
      if (historyUrl === '/my-wallet/myWalletFirst' && store.state.beforeUrl != null) {
        historyUrl = store.state.beforeUrl
      }
      this.address = this.$store.getters.wallet.address
      let balance = this.httpProvider.man.getBalance(this.address)
      let walletBlance = filter.weiToNumber(balance[0].balance)
      this.$store.commit('BALANCE', walletBlance)
      let greetings = localStorage.getItem('greetings')
      let msg = this.$t('unlock.unlockSuccess')
      if (greetings != null) {
        let address = this.$store.state.wallet.address
        greetings = JSON.parse(greetings)
        for (let i = 0, length = greetings.length; i < length; i++) {
          if (greetings[i].address === address) {
            msg = greetings[i].content
            break
          }
        }
      }
      this.$message({
        message: msg,
        duration: 3000,
        type: 'success'
      })
      if (historyUrl.indexOf('green-mining') > -1 || historyUrl.indexOf('ai-application') > -1 || historyUrl.indexOf('contract') > -1) {
        if (historyUrl.indexOf('green-mining') > -1) {
          if (this.$store.state.wallet != null) {
            let deposit = this.getDepositInfo()
            if (!deposit) {
              this.$router.push({ path: '/green-mining/campaignNode' })
            } else {
              this.$router.push({ path: '/green-mining/campaignNode' })
            }
          }
        } else {
          this.$router.push({ path: historyUrl })
        }
      } else {
        this.$router.push({ path: '/my-wallet/openWallet/myAssets' })
      }
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
    }
  },
  components: {
    UnlockWallet
  }
}
</script>

<style scoped lang="less">
.my-WalletFirst {
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
  /deep/.el-card__body {
    padding: 2.5rem 0 3rem 0;
  }
}
</style>
