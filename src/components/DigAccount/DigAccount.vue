<template>
  <div class="digAccount">
    <div>
      <label class="stake-font">{{$t('digAccount.deposit_account')}}： {{totalValue}} MAN</label>
      <label class="transfer_font" style="background: #0066FF;
    border: 2px solid #0033ff;
    padding: 3px 20px;
    border-radius: 15px;
    color: #FFFFFF;"
                @click="goPage('CampaignNode')">{{$t('digAccount.deposit')}}</label>
      <div class="role_font">
          <label >
            {{$t('digAccount.role')}}
            : {{role === '0x10'?$t('digAccount.miner'):(role === '0x80'?$t('digAccount.validator'):'')}}
          </label>
          <label >
            {{$t('digAccount.signaddress')}}
            : {{signAddress}}
          </label>
      </div>
      <div>
        <div class="minningcard">
            <div style="width:200px;margin-left:15px">
              <div class="title">
                <span> {{$t('digAccount.regular')}}</span>
              </div>
              <div class="valuediv">
                <label>{{regularDepositValue}} MAN</label>
              </div>
              <div>
                <a class="abutton" @click="goPage('RegularDetail',{regularDepositList: regularDepositList,regularDepositValue:regularDepositValue})">{{$t('digAccount.withdraw_detail')}}</a>
              </div>
            </div>
            <el-divider direction="vertical"></el-divider>
            <div style="margin-left:15px;min-width:200px">
              <div class="title">
                <span>{{$t('digAccount.current')}}</span>
              </div>
              <div class="valuediv">
                <label> {{currentDepositValue}} MAN</label>
              </div>
              <div>
                <a @click="goPage('CurrentWithdrawals',{currentDepositValue:currentDepositValue})"
                   class="abutton">{{$t('digAccount.withdraw_deposit')}}</a>
                <a class="alink" @click="goPage('RegularMortgage',{currentDepositValue:currentDepositValue})">{{$t('digAccount.change_regular')}}</a>
              </div>
            </div>
            <el-divider direction="vertical" style="height:4rem;margin: 16px 8px;"></el-divider>
        </div>
      </div>
    </div>
    <div class="stake-font">
      {{$t('digAccount.refund_account')}}： {{totalWithdrawalsValue}} MAN
    </div>
     <div>
        <div class="minningcard">
            <div style="width:200px;margin-left:15px">
              <div class="title">
                <span> {{$t('digAccount.regular')}}</span>
              </div>
              <div class="valuediv">
                <label>{{regularWithdrawalsValue}} MAN</label>
              </div>
              <div>
                <a class="abutton" @click="goPage('RegularWithdrawals',{regularWithdrawalsList:regularWithdrawalsList})">{{$t('digAccount.withdrawals_detail')}}</a>
              </div>
            </div>
             <el-divider direction="vertical" ></el-divider>
            <div style="margin-left:15px;min-width:200px">
              <div class="title">
                <span>{{$t('digAccount.current')}}</span>
              </div>
              <div class="valuediv">
                <label> {{currentWithdrawalsValue}} MAN</label>
              </div>
              <div>
                <a class="abutton" @click="goPage('CurrentRefund',{currentWithdrawalsList:currentWithdrawalsList})"
                  >{{$t('digAccount.withdrawals_detail')}}</a>
              </div>
            </div>
            <el-divider direction="vertical" ></el-divider>
        </div>
      </div>
  </div>
</template>

<script>
import filter from '@/assets/js/filters'
import BigNumber from 'bignumber.js'
export default {
  name: 'digAccount',
  data () {
    return {
      role: '',
      signAddress: '',
      regularDepositValue: 0,
      currentDepositValue: 0,
      regularDepositList: [],
      currentDepositList: {},
      totalValue: 0,
      regularWithdrawalsList: [],
      currentWithdrawalsList: [],
      currentWithdrawalsValue: 0,
      regularWithdrawalsValue: 0,
      totalWithdrawalsValue: 0
    }
  },
  methods: {
    goPage (url, params) {
      if (params) {
        this.$router.push({ name: url, params: params })
      } else {
        this.$router.push({ name: url })
      }
    },
    getDepositInfo () {
      let depositList = this.httpProvider.man.getDepositByAddr(this.address)
      if (depositList != null) {
        let regularWithdrawalsValue = new BigNumber(0)
        let currentWithdrawalsValue = new BigNumber(0)
        let regularDepositValue = new BigNumber(0)
        let currentDepositValue = new BigNumber(0)
        this.regularDepositList = []
        this.regularWithdrawalsList = []
        this.currentWithdrawalsList = []
        this.role = depositList.Role
        this.signAddress = depositList.AddressA1
        depositList.Dpstmsg.forEach(item => {
          if (item.Position !== 0) {
            if (item.WithDrawInfolist.length > 0) {
              regularWithdrawalsValue = regularWithdrawalsValue.plus(filter.weiToNumber(item.DepositAmount))
              item.WithDrawInfolist[0].position = item.Position
              item.WithDrawInfolist[0].WithDrawAmount = item.DepositAmount
              this.regularWithdrawalsList.push(item.WithDrawInfolist[0])
            } else {
              this.regularDepositList.push(item)
              regularDepositValue = regularDepositValue.plus(filter.weiToNumber(item.DepositAmount))
            }
          } else {
            currentDepositValue = currentDepositValue.plus(filter.weiToNumber(item.DepositAmount))
            this.currentDepositList = item
            this.currentWithdrawalsList = item.WithDrawInfolist
            if (this.currentWithdrawalsList.length > 0) {
              this.currentWithdrawalsList.forEach(function (value) {
                currentWithdrawalsValue = currentWithdrawalsValue.plus(filter.weiToNumber(value.WithDrawAmount))
              })
            }
          }
        })
        this.regularDepositValue = regularDepositValue.toString(10)
        this.currentDepositValue = currentDepositValue.toString(10)
        this.totalValue = regularDepositValue.plus(currentDepositValue).plus(regularWithdrawalsValue)
        this.currentWithdrawalsValue = currentWithdrawalsValue.toString(10)
        this.regularWithdrawalsValue = regularWithdrawalsValue.toString(10)
        this.totalWithdrawalsValue = currentWithdrawalsValue.plus(regularWithdrawalsValue)
      }
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
  },
  watch: {
    $route (to, from) {
      if (to.path.indexOf('digAccount') > -1) {
        this.getDepositInfo()
      }
    }
  }

}
</script>

<style scoped lang="less">
.digAccount {
  padding: 1.5rem 0 2rem;
  .minningcard{
    background: rgba(242, 244, 248, 0.3);
    background: rgb(255, 255, 255);
    box-shadow: 0px 2px 48px rgba(0, 0, 0, 0.04);
    border-radius:20px;
    display: flex;
    flex-direction: row;
    margin-top: 30px;
    margin-bottom: 50px;
    padding: 1rem 1rem;
    .title{
      color: rgb(119, 131, 143);
      font-family: Open Sans;
      font-size: 12px;
      font-weight: 400;
      line-height: 16px;
      letter-spacing: 0.8571429252624512px;
      text-align: left;
      text-transform: uppercase;
    }
    .valuediv{
      margin-top: 10px;
      margin-bottom: 10px;
      color: rgb(37, 39, 38);
      font-family: Open Sans;
      font-size: 22px;
      font-weight: 400;
      line-height: 30px;
      letter-spacing: 0.8799999952316284px;
      text-align: left;
      text-transform: uppercase;
    }
    .abutton{
      background: rgb(0, 102, 255);
      border: 2px solid rgb(0, 51, 255);
      border-radius:13px;
      padding: 0.1rem 1rem;
      color: #FFFF;
      font-family: Open Sans;
      font-size: 11px;
      font-weight: 400;
      line-height: 15px;
      letter-spacing: 0.785714328289032px;
      cursor: pointer;
    }
    .alink{
      margin-left: 30px;
      color: rgb(0, 126, 255);
      font-family: DM Sans;
      font-size: 16px;
      font-weight: 400;
      line-height: 21px;
      letter-spacing: 0px;
      text-align: left;
      cursor: pointer;
    }
  }
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
  .stake-font {
    font-size: 1.55rem;
    color: #2c365c;
    letter-spacing: 0.18px;
    font-weight: bold;
  }
  .stake-font1 {
    margin: 1.5rem 0 1rem 5rem;
    font-size: 0.875rem;
    color: #2c365c;
    letter-spacing: 0.11px;
  }
  .role_font {
      font-size: 0.75rem;
      color: #2c365c;
      letter-spacing: 0.11px;
      margin: 1rem 0;
      text-align: left;
      label:not(:first-child) {
        margin-left: 2.63rem;
      }
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
    border-radius: 5px;
    .tr1_info {
      background: rgba(242, 244, 248, 0.8);
      color: #2c365c;
      letter-spacing: 0.13px;
      height: 3rem;
      font-size: 0.875rem;
      :first-child {
        padding-left: 0rem;
      }
      td {
        display: flex;
        height: 3rem;
        align-items: center;
        :nth-child(1) {
          width: 15%;
        }
        :nth-child(2) {
          width: 45%;
        }
        :nth-child(3) {
          width: 40%;
        }
      }
      a {
        color: #1989fa;
        cursor: pointer;
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
      td {
        display: flex;
        height: 3rem;
        align-items: center;
        :nth-child(1) {
          width: 15%;
        }
        :nth-child(2) {
          width: 45%;
        }
        :nth-child(3) {
          width: 40%;
        }
      }
      a {
        color: #1989fa;
        cursor: pointer;
      }
    }
  }
  hr {
    margin: 2.5rem 0 2.5rem 0;
    border: 1px solid #d5d7de;
  }
  /deep/.el-divider--vertical {
    height: 4rem;
    margin: 10px 18px;
  }
}
</style>
