<template>
  <div class="refund">
    <div class="container-1">
      <div class="demo-input-suffix">
        查询地址：
        <el-input placeholder="请输入查询地址" v-model="address"></el-input>
      </div>
      <button class="common-button"
              @click="query">{{$t('CampaignNode.query')}}</button>
    </div>
    <div class="container-1 info" v-if="nodeAddress != ''">
      <div class="demo-input-suffix">
        抵押资产：
        <el-input v-model="amount"></el-input>
      </div>
      <div class="demo-input-suffix">
        节点地址：
        <el-input v-model="nodeAddress"></el-input>
      </div>
      <div class="demo-input-suffix">
        节点状态：
        <el-input v-model="state"></el-input>
        <button class="common-button">ssss</button>
      </div>
    </div>
  </div>
</template>

<script>
import WalletUtil from '@/assets/js/WalletUtil'
import { mortgage } from '@/assets/js/config'

export default {
  name: 'refund',
  data () {
    return {
      address: '',
      state: '',
      amount: '',
      nodeAddress: ''
    }
  },
  methods: {
    query () {
      if (WalletUtil.validateManAddress(this.address)) {
        this.getDepositInfo()
      } else {
        this.$message.error('请输入正确的查询地址')
      }
    },
    getDepositInfo () {
      let abiArray = JSON.parse(mortgage.abi)
      let contractAddress = mortgage.address
      let contract = this.httpProvider.man.contract(abiArray)
      let myContractInstance = contract.at(contractAddress)
      let deposit = myContractInstance.getDepositInfo(WalletUtil.getEthAddress(this.address), { currency: 'MAN' })
      if (Number(deposit[3]) === 0) {
        this.state = '未抵押'
        return
      } else if (Number(deposit[3]) === 16) {
        this.state = '已抵押矿工'
      } else if (Number(deposit[3]) === 128) {
        this.state = '已抵押验证者'
      }
      if (deposit[1].indexOf('MAN') > -1) {
        this.nodeAddress = deposit[1]
      } else {
        this.nodeAddress = WalletUtil.getManAddress(deposit[1])
      }
      this.amount = this.httpProvider.fromWei(deposit[0])
    }
  },
  mounted () {
  },
  components: {
  }
}
</script>

<style scoped lang="less">
.refund {
  .container-1 {
    padding-top: 2rem;
    padding-bottom: 2rem;
    text-align: center;
    text-align: -webkit-center;
    text-align: -moz-center;
    .el-input {
      width: 37.5rem;
    }
    .common-button {
      margin-top: 1rem;
    }
  }
  .info {
    .el-input {
      margin-top: 1rem;
    }
  }
}
</style>
