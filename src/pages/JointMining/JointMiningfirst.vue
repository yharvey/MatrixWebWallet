<template>
  <div class="jointMining">
    <el-card class="box-card1">
      <div class="header">
        <h1>联合挖矿</h1>
        <button class="common-button"
                @click="goPage('createJoin')">创建联合</button>
      </div>
    </el-card>
    <el-card class="box-card2">
      <div class="dis-flex between left-distance distance-top">
        <div>
          <div><span class="font-weight-style">联合账户：</span> MAN.4Pn182LSJ3JNr9by4T5kDKsf127Jb</div>
          <div class="dis-flex between distance-top">
            <div><span class="font-weight-style">活跃账户：</span>318</div>
            <div><span class="font-weight-style">总抵押：</span>1000MAN</div>
          </div>
        </div>
        <div class="distance-top">
          <a @click="goPage('jointDetail')">详情</a>
        </div>
      </div>
      <hr>
      <div class="dis-flex between left-distance distance-top">
        <div>
          <div><span class="font-weight-style">联合账户：</span> MAN.4Pn182LSJ3JNr9by4T5kDKsf127Jb</div>
          <div class="dis-flex between distance-top">
            <div><span class="font-weight-style">活跃账户：</span>318</div>
            <div><span class="font-weight-style">总抵押：</span>1000MAN</div>
          </div>
        </div>
        <div class="distance-top">
          <a @click="goPage('jointDetail')">详情</a>
        </div>
      </div>
      <hr>
      <div class="dis-flex between left-distance distance-top">
        <div>
          <div><span class="font-weight-style">联合账户：</span> MAN.4Pn182LSJ3JNr9by4T5kDKsf127Jb</div>
          <div class="dis-flex between distance-top">
            <div><span class="font-weight-style">活跃账户：</span>318</div>
            <div><span class="font-weight-style">总抵押：</span>1000MAN</div>
          </div>
        </div>
        <div class="distance-top">
          <a>详情</a>
        </div>
      </div>
      <hr>
      <div class="dis-flex between left-distance distance-top">
        <div>
          <div><span class="font-weight-style">联合账户：</span> MAN.4Pn182LSJ3JNr9by4T5kDKsf127Jb</div>
          <div class="dis-flex between distance-top">
            <div><span class="font-weight-style">活跃账户：</span>318</div>
            <div><span class="font-weight-style">总抵押：</span>1000MAN</div>
          </div>
        </div>
        <div class="distance-top">
          <a>详情</a>
        </div>
      </div>
      <hr>
      <div class="dis-flex between left-distance distance-top">
        <div>
          <div><span class="font-weight-style">联合账户：</span> MAN.4Pn182LSJ3JNr9by4T5kDKsf127Jb</div>
          <div class="dis-flex between distance-top">
            <div><span class="font-weight-style">活跃账户：</span>318</div>
            <div><span class="font-weight-style">总抵押：</span>1000MAN</div>
          </div>
        </div>
        <div class="distance-top">
          <a>详情</a>
        </div>
      </div>
      <hr>
    </el-card>
  </div>
</template>

<script>
export default {
  name: 'jointMining',
  data () {
    return {
    }
  },
  methods: {
    goPage (url) {
      this.$router.push({ path: '/jointMining/' + url })
    }
  },
  components: {
  },
  mounted () {
  }
}
</script>

<style scoped lang="less">
.jointMining {
  margin: auto;
  width: 1040px;
  .box-card1 {
    .header {
      display: flex;
      justify-content: space-between;
      h1 {
        font-size: 2.25rem;
      }
      .common-button {
        width: 10.5rem;
      }
    }
  }
  .font-weight-style {
    font-size: 0.875rem;
    color: #2c365c;
    letter-spacing: 0.13px;
    font-weight: bold;
  }
  .box-card2 {
    .dis-flex {
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
      margin-top: 1.5rem;
    }
  }
  a {
    font-size: 0.875rem;
    color: #1c51dd;
    margin-left: 1.5rem;
    cursor: pointer;
  }
}
</style>
