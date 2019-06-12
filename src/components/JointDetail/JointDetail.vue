<template>
  <div class="jointDetail">
    <el-card class="box-card1">
      <div class="header">
        <div class="text-left">
          <div class="distance-top"><span class="font-weight-style">联合账户：</span>MAN.4Pn182LSJ3JNr9by4T5kDKsf127Jb</div>
          <div class="distance-top"><span class="font-weight-style">创建者账户：</span>MAN.4Pn182LSJ3JNr9by4T5kDKsf127Jb</div>
          <div class="dis-flex between distance-top">
            <div><span class="font-weight-style">参与人数：</span>100</div>
            <div><span class="font-weight-style">抵押总额：</span>300000.992929929</div>
          </div>
        </div>
        <div><a> 参与联合</a></div>
      </div>
    </el-card>
    <el-card class="box-card2">
      <div class="dis-flex between left-distance distance-top text-left">
        <div class="list-width">
          <div class="dis-flex between distance-top ">
            <div><span class="font-weight-style">账户：</span> MAN.4Pn182LSJ3JNr9by4T5kDKsf127Jb</div>
            <div><span class="font-weight-style">累计奖励：1000MAN</span></div>
          </div>
          <div class="distance-top"><span class="font-weight-style">抵押总金额：100 </span></div>
        </div>
        <div class="distance-top">
          <a @click="goPage('participantsDetail')">详情</a>
        </div>
      </div>
      <hr>
       <div class="dis-flex between left-distance distance-top text-left">
        <div class="list-width">
          <div class="dis-flex between distance-top ">
            <div><span class="font-weight-style">账户：</span> MAN.4Pn182LSJ3JNr9by4T5kDKsf127Jb</div>
            <div><span class="font-weight-style">累计奖励：1000MAN</span></div>
          </div>
          <div class="distance-top"><span class="font-weight-style">抵押总金额：100 </span></div>
        </div>
        <div class="distance-top">
          <a @click="goPage('ParticipantsDetail')">详情</a>
        </div>
      </div>
      <hr>
       <div class="dis-flex between left-distance distance-top text-left">
        <div class="list-width">
          <div class="dis-flex between distance-top ">
            <div><span class="font-weight-style">账户：</span> MAN.4Pn182LSJ3JNr9by4T5kDKsf127Jb</div>
            <div><span class="font-weight-style">累计奖励：1000MAN</span></div>
          </div>
          <div class="distance-top"><span class="font-weight-style">抵押总金额：100 </span></div>
        </div>
        <div class="distance-top">
          <a @click="goPage('ParticipantsDetail')">详情</a>
        </div>
      </div>
      <hr>
       <div class="dis-flex between left-distance distance-top text-left">
        <div class="list-width">
          <div class="dis-flex between distance-top ">
            <div><span class="font-weight-style">账户：</span> MAN.4Pn182LSJ3JNr9by4T5kDKsf127Jb</div>
            <div><span class="font-weight-style">累计奖励：1000MAN</span></div>
          </div>
          <div class="distance-top"><span class="font-weight-style">抵押总金额：100 </span></div>
        </div>
        <div class="distance-top">
          <a @click="goPage('ParticipantsDetail')">详情</a>
        </div>
      </div>
      <hr>
    </el-card>
  </div>
</template>

<script>
export default {
  name: 'jointDetail',
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
.jointDetail {
  margin: auto;
  width: 1040px;
  .box-card1 {
    .header {
      padding: 0 6rem;
      display: flex;
      justify-content: space-between;
      align-items: center;
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
  .list-width{
    width: 75%
  }
}
</style>
