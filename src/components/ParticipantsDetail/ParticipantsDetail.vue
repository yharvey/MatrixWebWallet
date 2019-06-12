<template>
  <div class="participantsDetail">
    <el-card class="box-card1">
      <div class="header">
        <div class="line-center between">
          <div class="line-center">
            <div><span class="font-weight-style">账户：</span>MAN.4Pn182LSJ3JNr9by4T5kDKsf127Jb</div>
            <div style="margin-left: 7rem;"><a>退出所有抵押</a> </div>
          </div>
          <div style=" text-align:right"><a>返回</a> </div>
        </div>
        <div class="line-center distance-top between">
          <div class="line-center">
            <div><span class="font-weight-style">抵押总额:</span>300000.992929929</div>
            <div style="margin-left: 17rem;"><span class="font-weight-style">累计奖励: 1000MAN</span> </div>
          </div>
          <div style="text-align:right"><a>奖励提款</a> </div>
        </div>
      </div>
    </el-card>
    <el-card>
      <div class="commonTable">
        <el-table :data="tableData"
                  style="width: 100%">
          <el-table-column label="类型"
                           prop="type">
          </el-table-column>
          <el-table-column label="金额"
                           prop="value">
          </el-table-column>
          <el-table-column label="时间"
                           prop="time">
          </el-table-column>
          <el-table-column label="状态"
                           prop="state">
          </el-table-column>
          <el-table-column label="操作"
                           prop="opration">
            <template slot-scope="scope">
              <el-button @click="opration(scope.row)"
                         type="text"
                         size="small">{{scope.row.opration}}</el-button>
            </template>
          </el-table-column>
        </el-table>
        <div class="content-between">
          <!-- <el-pagination background
                         class="top_spacing"
                         layout="prev, pager, next"
                         :page-size="pageSize"
                         :current-page="pageNumber"
                         @current-change="currentChange"
                         :total="total">
          </el-pagination> -->
        </div>
      </div>
    </el-card>
  </div>
</template>

<script>
export default {
  name: 'jointDetail',
  data () {
    return {
      tableData: [
        {
          type: '定期',
          value: '1000MAN',
          time: '2019/6/10 12:00:00',
          state: '抵押中',
          opration: '解除抵押'
        },
        {
          type: '活期',
          value: '1000MAN',
          time: '2019/6/10 12:00:00',
          state: '抵押中',
          opration: '解除抵押'
        },
        {
          type: '活期',
          value: '1000MAN',
          time: '2019/6/10 12:00:00',
          state: '抵押中',
          opration: '解除抵押'
        }, {
          type: '活期',
          value: '1000MAN',
          time: '2019/6/10 12:00:00',
          state: '抵押中',
          opration: '解除抵押'
        }

      ]
    }
  },
  methods: {
    goPage (url) {
      this.$router.push({ path: '/jointMining/' + url })
    },
    opration (row) {
      if (row.type === '定期') {
        this.$router.push({ path: '/jointMining/joinRegular' })
      } else {
        this.$router.push({ path: '/jointMining/joinCurrent' })
      }
    }
  },
  components: {
  },
  mounted () {
  }
}
</script>

<style scoped lang="less">
.participantsDetail {
  margin: auto;
  width: 1040px;
  .box-card1 {
    .header {
      text-align: left;
      padding: 0 2rem;
      h1 {
        font-size: 2.25rem;
      }
      .common-button {
        width: 10.5rem;
      }
    }
  }
  .text-left {
    text-align: left;
  }
  .font-weight-style {
    font-size: 0.875rem;
    color: #2c365c;
    letter-spacing: 0.13px;
    font-weight: bold;
  }
  .dis-flex {
    display: flex;
  }
  .line-center {
    display: flex;
  }
  .between {
    justify-content: space-between;
  }
  .left-distance {
    padding-left: 2rem;
    padding-right: 10rem;
  }
  .distance-top {
    margin-top: 1rem;
  }
  a {
    font-size: 0.875rem;
    color: #1c51dd;
    margin-left: 1.5rem;
    cursor: pointer;
  }
  .list-width {
    width: 75%;
  }
}
</style>
