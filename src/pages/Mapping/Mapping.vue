<template>
  <div class="mapping">
    <el-card>
      <unlock-eth-wallet :title="$t('myWallet.queryWallet')"
                         @openWallet="openWallet()"></unlock-eth-wallet>
    </el-card>
  </div>
</template>
<script>
import UnlockEthWallet from '@/components/UnlockWallet/UnlockETHWallet'
export default {
  name: 'mapping',
  data () {
    return {
    }
  },
  mounted () {
  },
  methods: {
    openWallet () {
      let msg = this.$t('unlock.unlockSuccess')
      this.$message({
        message: msg,
        type: 'success',
        duration: 3000
      })
      this.$router.push({ path: '/sendEth' })
    }
  },
  components: {
    UnlockEthWallet
  }
}
</script>

<style scoped lang="less">
.mapping {
  width: 1040px;
  /deep/.el-card__body {
    padding: 2.5rem 0 3rem 0;
  }
  /deep/.el-input {
    width: 26.5rem;
  }
}
</style>
