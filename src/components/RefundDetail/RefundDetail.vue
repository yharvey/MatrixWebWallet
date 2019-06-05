<template>
  <div class="regularMortgage">
    <div>
      <div class="first-left">
        {{$t('digAccount.refund_account')}}: 100000 MAN
      </div>
      <div class="commonTable top-spacing">
        <el-table :data="tableData"
                  style="width: 100%">
          <el-table-column label="解除抵押时间">
          </el-table-column>
          <el-table-column label="来源">
          </el-table-column>
          <el-table-column label="金额">
          </el-table-column>
          <el-table-column label="状态">
          </el-table-column>
        </el-table>
        <div class="content-between">
          <el-pagination background
                         class="top_spacing"
                         layout="prev, pager, next"
                         :page-size="pageSize"
                         :current-page="pageNumber"
                         @current-change="currentChange"
                         :total="total">
          </el-pagination>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
export default {
  name: 'currentMortgage',
  data () {
    return {
      mortgageAddrress: '',
      tableData: [],
      regularDepositList: []
    }
  },
  methods: {
  },
  mounted () {
    this.regularDepositList = this.$route.params.regularDepositList
  }
}
</script>
<style scoped lang="less">
.regularMortgage {
  .first-left {
    text-align: left;
  }
  text-align: center;
  padding: 1.5rem 0 2.5rem;
  /deep/.el-input {
    width: 26.5rem;
  }
  .dis-bottom {
    margin-top: 1rem;
    margin-bottom: 1.5rem;
  }
  .top-spacing {
    margin-top: 2rem;
  }
}
</style>
