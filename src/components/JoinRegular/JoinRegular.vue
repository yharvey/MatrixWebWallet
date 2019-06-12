<template>
  <div class="jointRegular">
    <el-card>
      <div>
        <span class="back-tittle"
              @click="backPage">
          <i class="el-icon-arrow-left"></i>
          {{$t('openWallet.back')}}
        </span>
      </div>
      <h5 class="h5-dis">定期抵押金额</h5>
      <el-input v-model="value"></el-input>
      <h5 class="h5-dis">到期时间</h5>
      <el-input v-model="time"></el-input>
      <button class="common-button h5-dis">解除抵押</button>
    </el-card>
  </div>
</template>

<script>
export default {
  name: 'jointRegular',
  data () {
    return {
      value: '2000',
      time: '2019/06/10 12:30：00 '
    }
  },
  methods: {
    backPage () {
      this.$router.back()
    }
  },
  components: {
  },
  mounted () {
  }
}
</script>

<style scoped lang="less">
.jointRegular {
  margin: auto;
  width: 1040px;
  /deep/.el-input {
    display: block;
    width: 26.5rem;
  }
  .h5-dis {
    margin-top: 1.5rem;
  }
  h5 {
    font-size: 0.875rem;
    color: #2c365c;
    letter-spacing: 0.13px;
    font-weight: bold;
    display: flex;
    margin-left: 18rem;
    margin-bottom: 1rem;
  }
  .back-tittle {
    position: relative;
    left: 446px;
    cursor: pointer;
    color: #1c51dd;
    font-size: 0.88rem;
    letter-spacing: 0.13px;
  }
}
</style>
