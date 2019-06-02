<template>
  <div class="digAccount">
    <div>
      <div class="mortgage-font">
        抵押账户： 100200 MAN
      </div>
      <table class="tab_info">
        <tbody>
          <tr class="tr1_info">
            <td><span class="dis-right2">定期</span> <span class="dis-right">10000 MAN</span> <a @click="goPage('removeRegularMortgage')">解除抵押</a> </td>
          </tr>
          <tr class="tr2_info">
            <td><span class="dis-right2">活期</span> <span class="dis-right"> 200 MAN</span> <a @click="goPage('removeCurrentMortgage')"
                 class="dis-right">解除抵押</a> <a @click="goPage('regularMortgage')">转入定期抵押</a></td>
          </tr>
        </tbody>
      </table>
      <!-- <div class="mortgage-font1">
        活期抵押账户： 10000 MAN <label class="transfer_font"
               @click="goPage('removeRegularMortgage')">解除抵押</label> <label class="transfer_font"
               @click="goPage('regularDetail')">转入定期抵押</label>
      </div>
      <div class="mortgage-font1">
        定期抵押账户： 10000 MAN <label class="transfer_font"
               @click="goPage('removeRegularMortgage')">解除抵押</label>
      </div> -->
    </div>
    <div class="mortgage-font">
      退款账户： 10000 MAN <label class="transfer_font"
             @click="goPage('refundValue')">取款</label>
    </div>
    <hr>
    <div class="tip-font">
      <p>1、定期抵押每个仓位最少一万个MAN</p>
      <p>2、活期抵押每次最少100个MAN</p>
      <p>3、验证是否满足相应的节点对MAN数量的要求已抵押的数量+活期抵押+定期抵押</p>
      <p>4、修改节点类型时，可进行活期0的抵押进行修改</p>
    </div>
  </div>
</template>

<script>
export default {
  name: 'digAccount',
  data () {
    return {
    }
  },
  methods: {
    goPage (url) {
      this.$router.push({ path: '/green-mining/' + url })
    },
    getDepositInfo () {
      let depositList = this.httpProvider.man.getDepositinfobyaddr('latest', this.address)
      console.log(depositList)
    }
  },
  mounted () {
    if (this.$store.state.wallet != null) {
      this.address = this.$store.getters.wallet.address
    } else {
      this.address = this.$store.state.offline
    }
    this.getDepositInfo()
  },
  components: {
  }
}
</script>

<style scoped lang="less">
.digAccount {
  padding: 1.5rem 0 2rem;
  .transfer_font {
    font-size: 0.875rem;
    color: #1c51dd;
    margin-left: 1.5rem;
    cursor: pointer;
  }
  .dis-right {
    width: 10rem;
    margin-right: 4rem;
  }
  .dis-right2 {
    margin-right: 4rem;
  }
  .mortgage-font {
    font-size: 1.25rem;
    color: #2c365c;
    letter-spacing: 0.18px;
    font-weight: bold;
  }
  .mortgage-font1 {
    margin: 1.5rem 0 1rem 5rem;
    font-size: 0.875rem;
    color: #2c365c;
    letter-spacing: 0.11px;
  }
  .tip-font {
    font-size: 0.875rem;
    color: #2c365c;
  }
  .flex-between {
    display: flex;
    justify-content: space-between;
  }

  .tab_info {
    width: 100%;
    margin-top: 1rem;
    border-spacing: 0px;
    margin-bottom: 1.5rem;
    .tr1_info {
      background: rgba(242, 244, 248, 0.8);
      color: #2c365c;
      letter-spacing: 0.13px;
      height: 3rem;
      font-size: 0.875rem;
      :first-child {
        padding-left: 3rem;
      }
      a {
        color: #1989fa;
      }
    }
    .tr2_info {
      color: #2c365c;
      letter-spacing: 0.13px;
      height: 3rem;
      font-size: 0.875rem;
      background: rgba(242, 244, 248, 0.3);
      :first-child {
        padding-left: 3rem;
      }
      a {
        color: #1989fa;
      }
    }
  }
  hr {
    margin: 2.5rem 0 2.5rem 0;
    border: 1px solid #d5d7de;
  }
}
</style>
