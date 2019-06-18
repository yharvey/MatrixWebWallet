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
      <div v-for="(item,index) in validatorList"
           :key="index">
        <div class="dis-flex between left-distance distance-top">
          <div>
            <div><span class="font-weight-style">联合账户：</span> {{item.jointAccount}}</div>
            <div class="dis-flex between distance-top">
              <div><span class="font-weight-style">活跃账户：</span>{{item.activeCount}}</div>
              <div><span class="font-weight-style">总抵押：</span>{{item.allAmount }}MAN</div>
            </div>
          </div>
          <div class="text-right">
            <div class="font-style"
                 v-if="item.alreadyWithdraw"><span>抵押已解除</span></div>
            <div class="font-style"
                 v-else><span>抵押中</span></div>
            <a @click="jointDetail(item)">详情</a>
          </div>
        </div>
        <hr>
      </div>
    </el-card>
  </div>
</template>

<script>
import filter from '@/assets/js/filters'
import BigNumber from 'bignumber.js'
export default {
  name: 'jointMining',
  data () {
    return {
      validatorList: []
    }
  },
  methods: {
    goPage (url) {
      this.$router.push({ path: '/jointMining/' + url })
    },
    jointDetail (detailObj) {
      this.$router.push({ name: 'JointDetail', params: { detailObj: detailObj } })
    }
  },
  components: {
  },
  mounted () {
    let data = this.httpProvider.man.getValidatorGroupInfo()
    console.log(data)
    if (this.$store.state.offline != null) {
      this.address = this.$store.state.offline
    } else {
      this.address = this.$store.getters.wallet.address
    }
    let self = this
    Object.keys(data).forEach(function (key) {
      let item = data[key]
      let allAmount = new BigNumber(0)
      if (item.ValidatorMap != null) {
        item.ValidatorMap.forEach(validator => {
          allAmount = allAmount.plus(filter.weiToNumber(validator.AllAmount))
        })
        let alreadyWithdraw = false
        if (item.OwnerInfo.WithdrawAllTime !== 0) {
          alreadyWithdraw = true
        }
        self.validatorList.push({
          jointAccount: key,
          activeCount: item.ValidatorMap.length,
          allAmount: allAmount.toString(10),
          signAddress: item.OwnerInfo.SignAddress,
          validatorMap: item.ValidatorMap,
          createAddress: item.OwnerInfo.Owner,
          alreadyWithdraw: alreadyWithdraw
        })
      }
    })
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
  .font-style {
    font-size: 0.875rem;
    color: #2c365c;
    letter-spacing: 0.13px;
    margin-bottom: 1.4rem;
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
    cursor: pointer;
  }
  .text-right {
    text-align: right;
  }
}
</style>
