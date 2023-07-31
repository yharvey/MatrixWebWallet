<template>
  <div class="Medical align-center">
    <el-card class="box-card">
      <span class="back-tittle"
                @click="backPage">
            <i class="el-icon-arrow-left"></i>
            {{$t('openWallet.back')}}
        </span>
      <div class="title">
        <div class="mycard" style="display:flex;text-align: left;">
          <img v-if="type==22" src="../../assets/images/ai1.png" alt="">
          <img v-if="type==21" src="../../assets/images/ai2.png" alt="">
          <img v-if="type==20" src="../../assets/images/ai3.png" alt="">
          <img v-if="type==19" src="../../assets/images/ai4.png" alt="">
          <div style="position: relative;margin-top:10px">
            <label  v-if="type==22">{{$t('ai.medical')}}</label>
            <label  v-if="type==21">{{$t('ai.posture')}}</label>
            <label  v-if="type==20">{{$t('ai.object')}}</label>
            <label  v-if="type==19">{{$t('ai.mania')}}</label>
            <div class="title-1" v-if="type==22">{{$t('medical.tittle1')}}{{$t('medical.tittle2')}}</div>
            <!-- <div class="title-1" v-if="type==22">{{$t('medical.tittle2')}}</div> -->
            <div class="title-1" v-if="type==21">{{$t('medical.pose1')}}{{$t('medical.pose2')}}</div>
            <!-- <div class="title-1" v-if="type==21">{{$t('medical.pose2')}}</div> -->
            <div class="title-1" v-if="type==20">{{$t('medical.obj')}}</div>
            <div class="title-1" v-if="type==19">{{$t('medical.mania')}}</div>
            <div class="title-1" v-if="type==18">{{$t('medical.animation')}}</div>
            <div class="title-2" v-if="type!=22&&type!=19">{{$t('medical.pose3')}}</div>
            <div class="title-2" v-if="type==19">{{$t('medical.tips')}}</div>
          </div>
        </div>
      </div>
    <!-- <div class="footer">
      <button class="common-button"
              @click="start">{{$t('medical.start_experience')}}</button>
      <div class="footer-info" v-if="type==22">{{$t('medical.future')}}</div>
    </div> -->
    <!-- <medical :type="type"
               v-if="type!=23&&isUpload!==true"
               @uploadAi="uploadAi"></medical> -->
      <!-- <ai-record v-if="type==23"></ai-record> -->
      <distributed-storage :type="type" v-if="isUpload===true&&type!==19"></distributed-storage>
      <distributed-storage3 :type="type" v-if="isUpload===true&&type===19"></distributed-storage3>
      <!-- <distributed-storage3 :type="type" ></distributed-storage3> -->
     </el-card>
  </div>
</template>

<script>
// import Medical from '@/components/Medical/Medical'
import DistributedStorage from '@/components/DistributedStorage/DistributedStorage2'
import DistributedStorage3 from '@/components/DistributedStorage/DistributedStorage3'
import aiRecord from '@/pages/AIApplication/AIRecord'
export default {
  name: 'Medical',
  data () {
    return {
      type: 22,
      isUpload: true
    }
  },
  methods: {
    backPage () {
      this.$router.back()
    },
    start () {
      this.$emit('uploadAi', true)
    }
  },
  mounted () {
    this.type = this.$route.params.type
  },
  watch: {
    $route (to, from) {
      if (to.path.indexOf('medical') > -1) {
        this.type = this.$route.params.type
      }
    }
  },
  props: {
    // type: {
    //   default: 22,
    //   type: Number
    // }
  },
  components: {
    // Medical,
    DistributedStorage,
    DistributedStorage3,
    aiRecord
  }
}
</script>

<style scoped lang="less">
.Medical {
  margin: auto;
  width: 960px;
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
  .back-tittle {
    position: relative;
    left: 811px;
    cursor: pointer;
    color: #1c51dd;
    font-size: 0.88rem;
    letter-spacing: 0.13px;
  }
  .title {
    width: 80%;
    font-size: 0.88rem;
    color: #2c365c;
    letter-spacing: 0.13px;
    text-align: center;
    margin: 2rem 3rem;
    .title-2{
      margin-top: 1rem;
    }
    img{
      margin-top: 10px;
      margin-left: 10px;
      margin-right: 50px;
      width:110px;
      height: 110px;
      display: inline-block;
      vertical-align: middle;
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
  .content {
    border-bottom: 1px #d5d7de solid;
    .pic {
      background: #f2f4f8;
      width: 22.5rem;
      height: 17.5rem;
      margin: auto;
      img {
        width: 21.25rem;
        height: 16.25rem;
        margin-top: 0.63rem;
      }
    }
    .info {
      font-size: 0.88rem;
      color: #9298ae;
      letter-spacing: 0.13px;
      margin: 0.5rem 0 2rem 0;
    }
  }
  .footer {
    .common-button {
      margin: 2rem 0 1.5rem 0;
    }
    &-info {
      font-size: 0.88rem;
      color: #949db3;
      letter-spacing: 0.13px;
      margin-bottom: 3rem;
    }
  }
}
</style>
