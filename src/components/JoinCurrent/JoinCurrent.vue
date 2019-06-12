<template>
  <div class="jointRegular">
    <el-card>
      <el-input v-model="value"
                placeholder="活期解除抵押金额最少100 MAN"></el-input>>
      <button class="common-button">解除抵押</button>
    </el-card>
  </div>
</template>

<script>
export default {
  name: 'jointRegular',
  data () {
    return {
      value: '2000',
      time: '2019/06/10 12:30：00'
    }
  },
  methods: {
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
}
</style>
