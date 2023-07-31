<template>
  <div class="networks">
    <el-card class="card-width">
      <div style="text-align: center;">
        <h1 style="">Networks</h1>
        <span class="back-tittle"
              @click="backPage">
          <i class="el-icon-arrow-left"></i>
          {{$t('openWallet.back')}}
        </span>
      </div>
      <div class="conversion-table">
        <div class="lable-width">
        <label>{{$t('Select RPC')}}:</label>
        </div>
        <el-select v-model="value" @change="changeSelect" placeholder="请选择" class="select">
          <el-option
            v-for="item in chainurls"
            :key="item.value"
            :label="item.label"
            :value="item.value"
            class="select">
            <span style="float: left">{{ item.label }}</span>
            <span style="float: right; color: #8492a6; font-size: 13px">{{ item.value }}</span>
          </el-option>
        </el-select>
         <button class="common-button button-width"
                @click="Refresh()">{{$t('Refresh')}}</button>
      </div>
      <div class="conversion-table" style=" margin-top: 5px; color: blue; font: 12px sans-serif;">
         <div class="lable-width">
        <label>{{$t('Hint')}}:</label>
        </div>
        <label>{{'Pleae refresh the page for switching networks'}}</label>
      </div>
      <div class="conversion-table" >
        <div class="lable-width">
          <label>{{$t('Custom RPC')}}:</label>
        </div>
        <el-input v-model="newRPCUrl"
                  :placeholder="$t('New RPC URL')"
                  class="input1">
        </el-input>
        <el-input v-model="newRPCName"
                  :placeholder="$t('new RPC Name')"
                  class="input2">
        </el-input>
        <button class="common-button button-width"
                @click="saveRPC()">{{$t('Save')}}</button>
      </div>
    </el-card>
  </div>
</template>
<script>
// import WalletUtil from '@/assets/js/WalletUtil'
import Header from '../../Layout/Header.vue'
import store from 'store'
export default {
  components: { Header },
  name: 'networks',
  data () {
    return {
      chainurls: [],
      value: 'MainNet',
      newRPCUrl: '',
      newRPCName: '',
      changeResult: ''
    }
  },
  methods: {
    saveRPC () {
      if (this.newRPCUrl !== '' && this.newRPCName !== '') {
        let networks = []
        let url = store.get('networks')
        if (url != null && url !== undefined) {
          networks.push(url)
        }
        networks.push({'value': this.newRPCUrl, 'label': this.newRPCName})
        store.set('networks', networks)
        this.$message.success('Save success!')
      } else {
        this.$message.error('Invalid input!')
      }
    },
    Refresh () {
      location.reload()
    },
    changeSelect () {
      console.log(this.value)
      // this.httpProvider = new HttpProvider(this.value)
      store.set('chainUrl', this.value)
      this.$message.success(this.value)
    },
    backPage () {
      this.$router.back()
    }
  },
  mounted () {
    this.chainurls = [{
      value: 'https://api00.matrix.io',
      label: 'MainNet'
    }, {
      value: 'https://api01.matrix.io',
      label: 'MainNet1'
    }]
    let networks = store.get('networks')
    if (networks !== undefined) {
      this.chainurls = this.chainurls.concat(networks)
    }
    console.log(this.chainurls)
  }
}
</script>

<style scoped lang="less">
.networks {
  .card-width{
    margin: auto;
  }
  /deep/.el-card__body {
    padding: 2rem 70px 2.5rem;
    text-align: left;
  }
  .contain-left {
    text-align: left;
  }
  .conversion-table {
    display: flex;
    margin-top: 30px;
    .lable-width {
      width: 150px;
    }
    label {
      line-height: 2rem;
    }
    .input1 {
      width: 400px;
      margin-right: 0.5rem;
    }
    .input2 {
      width: 200px;
      margin-right: 0.5rem;
    }
    .input3 {
      width: 604px;
      margin-right: 1rem;
    }
    .button-width {
      width: 134px;
    }
  }
  .select {
      width: 604px;
      margin-right: 1rem;
    }
  .conversion-table-dis {
    margin-top: 1rem;
  }
  .back-tittle {
    position: relative;
    left: 400px;
    top: -30px;
    cursor: pointer;
    color: #1c51dd;
    font-size: 0.88rem;
    letter-spacing: 0.13px;
  }
}
</style>
