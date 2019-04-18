<template>
  <div class="createCoin align-center">
    <div class="title">{{$t('createCoin.tittle')}}</div>
    <div class="form">
      <h5>{{$t('createCoin.manCount')}}</h5>
      <el-input v-model="manCount">
      </el-input>
      <h5>{{$t('createCoin.destruction')}}</h5>
      <el-input v-model="destruction">
      </el-input>
      <h5>{{$t('transfer.estimatedGas')}}</h5>
      <el-input v-model="gas">
      </el-input>
      <button class="common-button"
              @click="signTransfer">{{$t('createCoin.confirm')}}</button>
    </div>
  </div>
</template>

<script>
export default {
  name: 'Contract',
  data () {
    return {
      manCount: 100000,
      destruction: 'MAN.3GJF5vPbrmbUG7ZTFyFogdiuXY3Lp',
      gas: '',
      newTxData: ''
    }
  },
  methods: {
    signTransfer () {
      try {
        this.httpProvider.man.sendRawTransaction(this.newTxData)
      } catch (e) {
        this.$message.error(e.message)
      }
    }
  },
  mounted () {
    this.newTxData = this.$route.params.newTxData
  }
}
</script>

<style scoped lang="less">
.createCoin {
  .title {
    font-size: 1.25rem;
    color: #2c365c;
    letter-spacing: 0.18px;
    margin-top: 2.06rem;
  }
  .form {
    width: 26.5rem;
    text-align: left;
    .input-title {
      font-size: 0.88rem;
      color: #2c365c;
      letter-spacing: 0.13px;
      margin: 24px 0 16px 0;
    }
  }
  .common-button {
    margin: 32px 0 48px 0;
  }
  .addButton {
    font-size: 0.875rem;
    color: #1c51dd;
    letter-spacing: 0.13px;
    cursor: pointer;
    margin: 1rem 0 2rem;
    text-align: center;
  }
  .hint-error {
    font-size: 0.875rem;
    color: #ed3c1c;
    letter-spacing: 0.13px;
    float: right;
    cursor: pointer;
  }
}
</style>
