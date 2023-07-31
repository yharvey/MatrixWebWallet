<template>
  <div class="layout">
    <el-container class="maincontainer">
      <el-aside width="250px">
        <x-aside></x-aside>
      </el-aside>
      <el-container>
        <!-- <el-header>
          <x-header></x-header>
        </el-header> -->
        <el-main class="main-width">
          <router-view></router-view>
          <!-- <x-tip></x-tip> -->
        </el-main>
      </el-container>
    </el-container>
  </div>
</template>

<script>
import XHeader from '@/components/Layout/Header'
import XAside from '@/components/Layout/Aside'
import XFooter from '@/components/Layout/Footer'
import XTip from '@/components/Layout/Tip'
export default {
  name: 'Layout',
  components: {
    XHeader,
    XAside,
    XFooter,
    XTip
  }
}
</script>

<style scoped lang="less">
.layout {
  .el-container {
    min-height: 100vh;
    // height: 10%;
    .el-header,
    .el-footer {
      padding: 0;
      background: #2c365c;
      text-align: center;
      text-align: -webkit-center;
      text-align: -moz-center;
    }
    .el-aside {
      background-color: #FFFFFF;
      width: 250px;
      line-height: 200px;
      text-align: center;
      text-align: -webkit-center;
      text-align: -moz-center;
    }
    .el-header {
      height: 3.5rem !important;
      line-height: 3.5rem !important;
    }
    // .main-width{
    //   min-height: 90vh;
    // }
    .el-footer {
      height: 3rem !important;
      line-height: 3rem !important;
    }
  }
   .el-main {
    padding: 3.5rem 0 2.5rem 0;
    justify-content: center;
    text-align: -webkit-center;
    text-align: -moz-center;
  }
  .maincontainer{
    height: 100vh;
  }
}
</style>
