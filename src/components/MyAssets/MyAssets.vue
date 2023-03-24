<template>
  <div class="my-assets">
    <div class="account">
      <div class="assetcard">
        <div style="margin-top:20px;text-align: left;">
          <label class="title_font">MAN {{$t('myWallet.assets')}}</label>
          <label class="transfer_font"
                @click="goTransfer(balance[0].balance, 'MAN')">{{$t('myWallet.transfer')}}</label>
          <label class="transfer_font"
                @click="goPage('undo')">{{$t('record.undo')}}</label>
        </div>
        <div class="money_font">
          <template v-for="(item, index) in balance">
            <label style="font-size: 3rem;
    color: #FFFF;
    font-weight: bold;
    margin-left: 1.5rem;
    margin-top: 1rem;" v-if="item.accountType == 0"
                  :key='index'>
            {{item.balance | weiToNumber}}
            </label>
          </template>
        </div>
        <div style="margin-left: 1.5rem;text-align: start;font-size: 0.8rem;">
           <label style="color:#FFFFFF">{{address}}</label>
           <label style="color:#FFFFFF;margin-left: 3rem;"
               v-clipboard="address"
                  @success="copySuccess"
                  @error="copyError">
                  <i class="el-icon-copy-document"></i>
                  {{$t('createWallet.copy')}}</label>
        </div>
      </div>
      <div class=" account-info">
        <table class="tab_info">
          <tbody>
            <tr class="tr2_info">
               <td><span style="color: rgb(37, 39, 38);
                  font-family: Open Sans;
                  font-size: 18px;
                  font-weight: 400;
                  line-height: 25px;
                  letter-spacing: 0.7199999690055847px;
                  text-align: left;
                  ">{{address}}</span>
              </td>
              <td><img v-clipboard="address"
                  @success="copySuccess"
                  @error="copyError" style="width:20px" src="../../assets/images/copy.png" alt=""></td>
              <td><img style="width:20px" @click="goTransfer(balance[0].balance, 'MAN')" src="../../assets/images/send.png" alt=""></td>
            </tr>
          </tbody>
        </table>
        <div class="money_font">
          <template v-for="(item, index) in balance">
            <div class="money_div" v-if="item.accountType == 0"
                  :key='index'>
              <label>
              {{$t('myWallet.availableAssets')}}
            </label>
            <div class="money_balance">
                 {{item.balance | weiToNumber}} (MAN)
            </div>
            </div>
            <div class="money_div" v-if="item.accountType == 3"
                  :key='index'>
              <label>
              {{$t('myWallet.revocableAssets')}}
              <div class="money_balance">
                {{item.balance | weiToNumber}} (MAN)
              </div>
              </label>
            </div>
          </template>
          <div class="money_div">
            <label>
            {{$t('myWallet.stakedAssets')}}
            </label>
            <div class="money_balance">
            0 (MAN)
            </div>
          </div>
        </div>
        <label style="color: rgb(119, 131, 143);
font-family: Open Sans;
font-size: 10px;
font-weight: 400;
line-height: 14px;
letter-spacing: 0.7142857313156128px;
text-align: left;
text-transform: uppercase;">Quıck shortcut</label>
        <div style=" display: flex;flex-direction: row;">
           <div class="token_btn"
                  v-clipboard="address"
                  @success="copySuccess"
                  @error="copyError">Copy MAN Address</div>
          <div class="token_btn"
                @click="goPage('token')"> {{$t('myWallet.addToken')}} </div>
          <div class="token_btn"
              @click="goPage('createCoin')"> {{$t('createCoin.tittle')}} </div>
        </div>
      </div>
    </div>
    <hr class="bottom_hr">
    <div class="account">
      <div class="assetcard">
        <div style="margin-top:20px;text-align: left;">
          <label class="title_font">{{currency}} {{$t('myWallet.assets')}}</label>
          <label class="transfer_font"
                @click="goTransfer(selectedCurrency.balance[0].balance, currency)">{{$t('myWallet.transfer')}}</label>
          <el-select style="width:66px;margin-left:2rem" v-model="currency"
                    :placeholder="$t('CampaignNode.select')"
                    @change="changeCurrency">
            <el-option v-for="item in matrixCoin"
                      :key="item"
                      :label="item"
                      :value="item">
            </el-option>
          </el-select>
        </div>
        <div class="money_font">
          <template v-for="(item, index) in selectedCurrency.balance">
            <label style="font-size: 3rem;
                    color: #FFFF;
                    font-weight: bold;
                    margin-left: 1.5rem;
                    margin-top: 1rem;"
                    v-if="item.accountType == 0"
                  :key='index'>
            {{item.balance | weiToNumber}}
            </label>
          </template>
        </div>
        <div style="margin-left: 1.5rem;text-align: start;font-size: 0.8rem;">
          <label style="color:#FFFFFF">{{selectedCurrency.address}}</label>
          <label style="color:#FFFFFF;margin-left: 3rem;"
              v-clipboard="selectedCurrency.address"
                  @success="copySuccess"
                  @error="copyError">
                  <i class="el-icon-copy-document"></i>
                  {{$t('createWallet.copy')}}</label>
        </div>
      </div>
      <div class="account-info"
          v-if="matrixCoin != null">
        <div class="money_font">
          <template v-for="(item, index) in selectedCurrency.balance">
            <div class="money_div" v-if="item.accountType == 0"
                  :key='index'>
              <label>{{$t('myWallet.availableAssets')}}</label>
              <div class="money_balance">{{item.balance | weiToNumber}} ({{currency}})</div>
            </div>
            <div class="money_div" v-if="item.accountType == 3"
                  :key='index'>
              <label>{{$t('myWallet.revocableAssets')}}</label>
              <div class="money_balance">{{item.balance | weiToNumber}} ({{currency}})</div>
            </div>
          </template>
          <div class="money_div">
            <label>
              {{$t('myWallet.stakedAssets')}}
            </label>
            <div class="money_balance">
              0 ({{currency}})
            </div>
          </div>
        </div>
         <label style="color: rgb(119, 131, 143);
            font-family: Open Sans;
            font-size: 10px;
            font-weight: 400;
            line-height: 14px;
            letter-spacing: 0.7142857313156128px;
            text-align: left;
            text-transform: uppercase;">Quıck shortcut</label>
        <div style=" display: flex;flex-direction: row;">
           <div class="token_btn"
                  v-clipboard="selectedCurrency.address"
                  @success="copySuccess"
                  @error="copyError">Copy {{currency}} Address</div>
          <div class="token_btn"
                @click="goPage('token')"> {{$t('myWallet.addToken')}} </div>
        </div>
        <table class="tab_info">
          <tbody>
            <tr class="tr2_info">
              <td><span style="color: rgb(37, 39, 38);
                  font-family: Open Sans;
                  font-size: 18px;
                  font-weight: 400;
                  line-height: 25px;
                  letter-spacing: 0.7199999690055847px;
                  text-align: left;
                  ">{{selectedCurrency.address}}</span>
              </td>
              <td><img v-clipboard="selectedCurrency.address"
                  @success="copySuccess"
                  @error="copyError" style="width:20px" src="../../assets/images/copy.png" alt=""></td>
              <td><img style="width:20px" src="../../assets/images/send.png" alt=""></td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  </div>
</template>
<script>
import WalletUtil from '@/assets/js/WalletUtil'
export default {
  name: 'my-assets',
  data () {
    return {
      address: '',
      balance: [],
      currency: '',
      selectedCurrency: {
        address: '',
        balance: []
      },
      matrixCoin: null
    }
  },
  methods: {
    copySuccess () {
      this.$message.success(this.$t('myWallet.copySuccess'))
    },
    copyError () {
      this.$message.error(this.$t('myWallet.copyFile'))
    },
    getBalance (address) {
      try {
        return this.httpProvider.man.getBalance(address)
      } catch (e) {
        this.$message.error(e.message)
        this.$router.push({ path: '/my-wallet/myWalletFirst' })
        this.$store.commit('OFFLINE', null)
        this.$store.commit('UPDATE_WALLET', null)
      }
    },
    goTransfer (balance, currency) {
      this.$router.push({ name: 'OnlineTransfer', params: { balance: balance, currency: currency } })
    },
    goPage (route) {
      this.$router.push({ path: '/my-wallet/openWallet/' + route })
    },
    changeCurrency () { // 选择币种查看余额
      let address = WalletUtil.getCurrencyAddress(this.address, this.currency)
      this.selectedCurrency.address = address
      this.selectedCurrency.balance = this.getBalance(address)
    },
    getMatrixCoin () { // 获取链的多币种
      try {
        this.matrixCoin = this.httpProvider.man.getMatrixCoin('latest')
        // this.matrixCoin = ['AAA', 'NNNN']
        if (this.matrixCoin != null && this.matrixCoin.length !== 0) {
          this.currency = this.matrixCoin[0]
          let address = WalletUtil.getCurrencyAddress(this.address, this.matrixCoin[0])
          this.selectedCurrency.address = address
          this.selectedCurrency.balance = this.getBalance(address)
        }
      } catch (e) {
        this.$message.error(e.message)
      }
    }
  },
  mounted () {
    if (this.$store.state.wallet != null) {
      this.address = this.$store.getters.wallet.address
    } else {
      this.address = this.$store.state.offline
    }
    this.balance = this.getBalance(this.address)
    this.getMatrixCoin()
  }
}
</script>
<style scoped lang="less">
.my-assets {
  /deep/.el-card__body {
    padding: 1rem 2.5rem 3rem 2.5rem;
  }
  .query_assets_top {
    text-align: left;
  }
  .two-input {
    /deep/ .el-select {
      width: 100% !important;
    }
  }
  hr {
    background-color: #d5d7de;
    margin-top: 1rem;
    margin-bottom: 1.5rem;
    border: none;
    height: 1px;
  }
  .account{
    display: flex;
    flex-direction: row;
    margin-top: 2rem;
    .title_font {
      font-size: 1.25rem;
      color: #FFFFFF;
      letter-spacing: 0.18px;
      margin-top: 0.5rem;
      margin-left: 1.5rem;
      margin-bottom: 0.25rem;
      font-weight: bold;
    }
    .transfer_font {
      text-align: center;
      background: rgb(0, 102, 255);
      border: 2px solid rgb(0, 51, 255);
      border-radius: 23.5px;
      margin: 1rem 0rem 1rem 2rem;
      font-size: 13px;
      letter-spacing: 0.13px;
      height: 2.625rem;
      line-height: 2.625rem;
      padding: 0.3rem 1rem;
      color: #FFFFFF;
      cursor: pointer;
    }
     .money_font {
      display: flex;
      flex-direction: row;
      font-size: 0.75rem;
      color: #2c365c;
      letter-spacing: 0.11px;
      margin: 1rem 0;
      text-align: left;
      .money_div{
        margin-right: 2rem;
        label{
          color: rgb(119, 131, 143);
          font-family: Open Sans;
          font-size: 10px;
          font-weight: 400;
          line-height: 14px;
          letter-spacing: 0.7142857313156128px;
          text-align: left;
          text-transform: uppercase;
        }
        label:not(:first-child) {
          margin-left: 2.63rem;
        }
        .money_balance{
          color: rgb(37, 39, 38);
          font-family: Mulish-SemiBold;
          font-size: 18px;
          font-weight: undefined;
          line-height: 27px;
          letter-spacing: 0.7199999690055847px;
          text-align: left;
          text-transform: uppercase;
        }
      }
    }
    .account-info {
      margin-left: 1rem;
    text-align: left;
    .account-header {
      .el-select {
        float: right;
      }
    }
    .tab_info {
      width: 100%;
      margin-top: 1rem;
      border-spacing: 0px;
      .tr1_info {
        background: rgba(242, 244, 248, 0.8);
        height: 2.5rem;
        font-size: 0.88rem;
        color: #2c365c;
        letter-spacing: 0.15px;
        td:first-of-type {
          // padding-left: 1rem;
          width: 64%;
          .matrix_fontSmall {
            font-size: 0.625rem;
            color: #9298ae;
            letter-spacing: 0.13px;
            line-height: 1.25rem;
            opacity: 0.5;
            margin-left: 0.31rem;
          }
        }

        td:nth-of-type(2) {
          width: 16.6%;
        }
      }

      .tr2_info {
        color: #2c365c;
        letter-spacing: 0.13px;
        height: 3rem;
        font-size: 0.75rem;
        background: rgba(242, 244, 248, 0.3);
        td:first-of-type {
          // padding-left: 1rem;
          a {
            margin-left: 1.25rem;
          }
        }
        a {
          color: #1989fa;
          text-decoration: none;
        }
      }
    }
  }
  }
  .assetcard{
    background: url('../../assets/images/balance.png') no-repeat;
    background-size:  100%;
    width: 403px;
    height: 240px;
  }
  .bottom_hr {
    margin: 1rem 0;
    border: 1px solid rgba(0, 102, 255, 0.28);
  }
  .token_btn {
    text-align: center;
    background: rgb(0, 102, 255);
    border: 2px solid rgb(0, 51, 255);
    border-radius: 23.5px;
    margin: 1rem 1rem;
    font-size: 13px;
    letter-spacing: 0.13px;
    height: 2.625rem;
    line-height: 2.625rem;
    padding: 0rem 1rem;
    color: #FFFFFF;
    cursor: pointer;
    .a{
       color: #FFFFFF;
    }
  }
  .active {
    color: #2c365c;
  }
  .optionBtn {
    text-align: center;
    color: #1c51dd;
  }
  /deep/.el-input--suffix .el-input__inner{
    background: rgb(0, 102, 255);
    border: 2px solid rgb(0, 51, 255);
    border-radius: 23.5px;
    color: #FFFFFF;
  }
}
</style>
