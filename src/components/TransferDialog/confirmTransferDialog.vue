<template>
  <el-dialog :visible.sync="confirmVisible"
             :showClose=false
             customClass="common-dialog"
             :width="width"
             :before-close="handleClose"
             center>
    <div class="content">
      <div class="msg">{{msg}}</div>
      <hr class="hr-bottom">
      <div class="amount">{{amount}} <span>{{sendCoin}}</span></div>
      <div class="info">
        <div class="transfer-item">
          <label class="from">{{from}}</label>
          <img src="../../assets/images/transfer.png" />
          <label class="to">{{to}}</label>
        </div>
      </div>
      <hr class="hr-dis">
      <div v-if="addressList.length > 0">
        <div v-for=" (item,index) in addressList"
             :key="index">
          <div class="amount">{{item.value}} <span>{{sendCoin}}</span></div>
          <div class="info">
            <div class="transfer-item">
              <label class="from">{{from}}</label>
              <img src="../../assets/images/transfer.png" />
              <label class="to">{{item.to}}</label>
            </div>
          </div>
          <hr class="hr-dis">
        </div>
      </div>
      <button @click="confirmSend('cancel')">{{$t('HistoricalIncome.cancel')}}</button>
      <button class="button-color"
              @click="confirmSend('ok')">{{$t('HistoricalIncome.determine')}}</button>
    </div>
  </el-dialog>
</template>

<script>
export default {
  name: 'TransferDialog',
  methods: {
    confirmSend (status) {
      this.$emit('confirmSend', status)
    },
    handleClose () {
      this.$emit('confirmSend', false)
    }
  },
  data () {
    return {
      product: ''
    }
  },
  props: {
    confirmVisible: {
      default: false,
      type: Boolean
    },
    status: {
      default: '',
      type: String
    },
    amount: {
      default: '',
      type: String
    },
    title: {
      default: '',
      type: String
    },
    msg: {
      default: '',
      type: String
    },
    okText: {
      default: '',
      type: String
    },
    cancelText: {
      default: '',
      type: String
    },
    width: {
      default: '30%',
      type: String
    },
    to: {
      default: '',
      type: String
    },
    from: {
      default: '',
      type: String
    },
    addressList: {
      default: () => {
        return []
      },
      type: Array
    },
    sendCoin: {
      default: '',
      type: String
    }
  },
  watch: {
    confirmVisible (newVal) {
      this.$emit('confirmVisible', newVal)
    }
  },
  mounted () {
  }
}
</script>

<style scoped lang="less">
/deep/ .el-dialog__body {
  padding: 0 !important;
}
/deep/ .el-dialog__header {
  padding: 0;
  height: 2rem;
}
/deep/ .el-dialog__footer {
  background: rgba(44, 54, 92, 0.03);
  border-radius: 0px 0px 2px 2px;
  height: 3.5rem;
  margin-top: 2.06rem;
}
.common-dialog {
  .content {
    padding: 0 2.5rem;
    text-align: center;
    color: #2c365c;
    img {
      width: 2.25rem;
      margin-bottom: 1rem;
    }
    .msg {
      font-size: 1.25rem;
      color: #2c365c;
      letter-spacing: 0.18px;
      font-weight: bold;
      margin-bottom: 1.5rem;
    }
    .amount {
      font-size: 1.25rem;
      color: #4d7cfe;
      letter-spacing: 0.29px;
      margin-bottom: 1.5rem;
      span {
        font-size: 0.75rem;
        color: #2c365c;
        letter-spacing: 0.12px;
        opacity: 0.5;
      }
    }
    .info {
      .transfer-item {
        display: flex;
        justify-content: space-between;
        align-items: center;
        img {
          width: 1.5rem;
          height: 1.13rem;
          margin-top: 0.69rem;
        }
        label {
          display: block;
          width: 20.25rem;
          height: 2.5rem;
          line-height: 2.5rem;
          background: rgba(213, 215, 222, 0.16);
          font-size: 0.75rem;
          color: #2c365c;
          letter-spacing: 0.11px;
          border: 1px solid #d5d7de;
        }
      }
    }
    .tip {
      font-size: 0.75rem;
      color: #9298ae;
      letter-spacing: 0.11px;
      text-align: center;
      margin-top: 1.5rem;
      a {
        color: #1c51dd;
      }
    }
    button {
      background: #ffffff;
      border: 1px solid #1c51dd;
      border-radius: 5px;
      width: 12.5rem;
      height: 2.63rem;
      margin-bottom: 2.5rem;
      font-size: 0.88rem;
      color: #1c51dd;
      letter-spacing: 0.13px;
      text-align: center;
    }
    .button-color {
      margin-left: 1.5rem;
      background: #0066FF;
      color: #ffffff;
    }
    hr {
      background: #d5d7de;
      border: none;
      height: 2px;
      margin: 0;
    }
    .hr-bottom {
      margin-bottom: 2rem;
    }
    .hr-dis {
      margin: 2rem 0 2.5rem 0;
    }
  }
}
</style>
