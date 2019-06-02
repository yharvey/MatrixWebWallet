<template>
  <div class="regularMortgage">
    <div>
      <div class="first-left">
        活期抵押账户： 100000 MAN
      </div>
      <h1>转入定期抵押账户</h1>
      <div class="dis-bottom">
         <el-input v-model="mortgageAddrress" placeholder="活期抵押数量"></el-input>
      </div>
      <button class="common-button">{{$t('transfer.confirm')}}</button>
    </div>
  </div>
</template>
<script>
export default {
  name: 'currentMortgage',
  data () {
    return {
      mortgageAddrress: ''
    }
  },
  methods: {

  }
}
</script>
<style scoped lang="less">
.regularMortgage {
  .first-left{
    text-align: left;
  }
  text-align: center;
  padding:1.5rem 0 2.5rem;
  /deep/.el-input {
    width: 26.5rem;
  }
  .dis-bottom{
    margin-top: 1rem;
    margin-bottom: 1.5rem
  }
}
</style>
