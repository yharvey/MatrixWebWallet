<template>
  <div class="aiApplication align-center">
    <el-card class="box-card">
      <!-- <div class="header"> -->
        <!-- <label :class="{'active' : type === 22}"
               @click="changeType(22)">{{$t('ai.medical')}}&nbsp;&nbsp;&nbsp;|&nbsp;&nbsp;&nbsp;</label>
        <label :class="{'active' : type === 21}"
               @click="changeType(21)">{{$t('ai.posture')}}&nbsp;&nbsp;&nbsp;|&nbsp;&nbsp;&nbsp;</label>
        <label :class="{'active' : type === 20}"
               @click="changeType(20)">{{$t('ai.object')}}&nbsp;&nbsp;&nbsp;|&nbsp;&nbsp;&nbsp;</label>
        <label :class="{'active' : type === 19}"
               @click="changeType(19)">{{$t('ai.mania')}}&nbsp;&nbsp;&nbsp;|&nbsp;&nbsp;&nbsp;</label> -->
         <!-- <label :class="{'active' : type === 22}"
               @click="goPage('Medical')">{{$t('ai.medical')}}&nbsp;&nbsp;&nbsp;|&nbsp;&nbsp;&nbsp;</label>
        <label :class="{'active' : type === 21}"
               @click="goPage('Medical')">{{$t('ai.posture')}}&nbsp;&nbsp;&nbsp;|&nbsp;&nbsp;&nbsp;</label>
        <label :class="{'active' : type === 20}"
               @click="goPage('Medical')">{{$t('ai.object')}}&nbsp;&nbsp;&nbsp;|&nbsp;&nbsp;&nbsp;</label>
        <label :class="{'active' : type === 19}"
               @click="goPage('Medical')">{{$t('ai.mania')}}&nbsp;&nbsp;&nbsp;|&nbsp;&nbsp;&nbsp;</label> -->
         <!-- <label :class="{'active' : type === 18}"
               @click="changeType(18)">{{$t('ai.animation')}}&nbsp;&nbsp;&nbsp;</label> -->
      <!-- </div> -->
      <div class="ai_list">
         <ul>
              <li>
                <div class="mycard">
                  <img src="../../assets/images/ai1.png" alt="">
                  <div style="position: relative;margin-top:10px">
                     <label @click="goPage('Medical')">{{$t('ai.medical')}}</label>
                    <div class="title-1" >{{$t('medical.tittle1')}}{{$t('medical.tittle2')}}</div>
                    <div class="mystart"  @click="goPage('Medical',22)" >Start</div>
                  </div>
                </div>
              </li>
              <li>
                <div class="mycard">
                  <img  src="../../assets/images/ai2.png" alt="">
                  <div style="position: relative;margin-top:10px">
                     <label :class="{'active' : type === 22}"
                        @click="goPage('Medical')">{{$t('ai.posture')}}</label>
                    <div class="title-1" >{{$t('medical.pose1')}}{{$t('medical.pose2')}}</div>
                     <div class="mystart" @click="goPage('Medical',21)" >Start</div>
                  </div>
                </div>
              </li>
              <li>
                <div class="mycard">
                  <img src="../../assets/images/ai3.png" alt="">
                  <div style="position: relative;margin-top:10px">
                     <label :class="{'active' : type === 22}"
                        @click="goPage('Medical')">{{$t('ai.object')}}</label>
                    <div class="title-1" >{{$t('medical.obj')}}</div>
                     <div class="mystart" @click="goPage('Medical',20)"  >Start</div>
                  </div>
                </div>
              </li>
              <li>
                <div class="mycard">
                  <img src="../../assets/images/ai4.png" alt="">
                  <div style="position: relative;margin-top:10px">
                     <label :class="{'active' : type === 22}"
                        @click="goPage('Medical')">{{$t('ai.mania')}}</label>
                    <div class="title-1" >{{$t('medical.mania')}}</div>
                    <div class="mystart"  @click="goPage('Medical',19)" >Start</div>
                  </div>
                </div>
              </li>
        </ul>
      </div>
    </el-card>
  </div>
</template>

<script>
export default {
  name: 'AIApplication',
  data () {
    return {
      type: 22,
      isUpload: false
    }
  },
  methods: {
    goPage (url, type) {
      this.type = type
      console.log(url, this.type)
      this.$router.push({ name: url, params: { type: type, ddd: 'ddd' } })
    },
    changeType (status) {
      this.isUpload = false
      if (status !== this.type) {
        this.type = status
      }
      if (status === 23) {
        this.$router.push({ path: '/aiApplication/aiRecord' })
      }
    },
    uploadAi (data) {
      this.isUpload = data
    }
  },
  mounted () {
  }
}
</script>

<style scoped lang="less">
.aiApplication {
  margin: auto;
  width: 960px;
  .ai_list {
    width: 100%;
    background: #FFFFFF;
    margin: 0 auto;
    ul {
      display: flex;
      flex-wrap: wrap;
      margin: 0;
      padding: 0;
      li {
        width: 46%;
        padding: 0 0;
        box-sizing: border-box;
        color: #333333;
        border-radius: 1rem;
        // height: 2rem;
        margin-top: 0.5rem;
        margin-bottom: 0.5rem;
        margin-left: auto;
        margin-right: 1rem;
        text-align: left;
        .mycard{
          border: 1px solid rgb(0, 128, 255);
          border-radius:25px;
          width:400px;display: flex;
          height: 239px;
          img{
            margin-top: 10px;
            margin-left: 10px;
            margin-right: 10px;
            width:110px;
            height: 110px;
            display: inline-block;
            vertical-align: middle;
          }
          .mystart{
            position: absolute;
            background: rgb(0, 126, 255);
            border-radius:5px;
            color: #FFFFFF;
            bottom: 20px;
            right: 20px;
            padding: 0.2rem 2rem;
            cursor: pointer;
          }
          label{
            color: rgb(51, 51, 51);
            font-family: Open Sans;
            font-size: 23px;
            font-weight: 700;
            line-height: 31px;
            letter-spacing: 0px;
            text-align: left;

          }
        }
        input {
          background-color: #F7F7FF;
          width: 100%;
          text-indent: 0rem;
          height: 3rem;
          border: none;
          border-radius: 5px;
          font-size: 0.9rem;
          color: rgba(120, 153, 206, 1);
        }
        input::-webkit-input-placeholder{
              color: rgba(120, 153, 206, 1);
            }
        }
        li::marker {
          content: '';
        }
    }
  }
  .box-card {
    text-align: left;
    padding: 0 3rem 2.5rem;
    .header {
      height: 4rem;
      line-height: 4rem;
      font-size: 1rem;
      color: #9aa0b6;
      letter-spacing: 0.15px;
      border-bottom: 1px #0066FF solid;
      label {
        cursor: pointer;
      }
      .active {
        color: #2c365c;
      }
    }
  }
}
</style>
