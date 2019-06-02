<template>
  <div class="removeCurrentMortgage">
    <div>
      <div class="first-left">
        活期抵押账户： 200 MAN
      </div>
      <h1>解除抵押</h1>
      <div class="dis-bottom">
         <el-input v-model="mortgageAddrress" placeholder="请输入解除抵押数量"></el-input>
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
.removeCurrentMortgage {
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
