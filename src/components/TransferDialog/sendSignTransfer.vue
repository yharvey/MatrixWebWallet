<template>
  <el-dialog :visible.sync="visible"
             :showClose=false
             customClass="send-sign"
             :width="width"
             :before-close="handleClose"
             center>
    <div class="content">
      <el-input type="textarea"
                :autosize="{ minRows: 4, maxRows: 6}"
                v-model="information"></el-input>
      <button class="common-button button-top"
              @click="sendTransfer">{{$t('unlock.sendSignInformation')}}</button>
    </div>
  </el-dialog>
</template>
<script>
import SendTransfer from '@/assets/js/SendTransfer'
export default {
  name: 'TransferDialog',
  methods: {
    handleClose () {
      this.$emit('changeSendSign', false)
    },
    sendTransfer () {
      try {
        let newTxData = SendTransfer.getTxParams(this.information)
        let hash = this.httpProvider.man.sendRawTransaction(newTxData)
        let obj = { newTxData: newTxData, hash: hash }
        this.$emit('changeSendSign', obj)
      } catch (e) {
        this.$message.error(e.message)
      }
    }
  },
  data () {
    return {
      product: ''
    }
  },
  props: {
    visible: {
      default: false,
      type: Boolean
    },
    information: {
      default: '',
      type: String
    },
    width: {
      default: '',
      type: String
    }
  }
}
</script>

<style scoped lang="less">
.send-sign {
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
  .content {
    text-align: center;
    .button-top {
      margin-top: 2rem;
    }
  }
}
</style>
