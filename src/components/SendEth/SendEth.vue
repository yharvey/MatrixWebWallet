<template>
  <div class="send-eth align-center">
    <!--<h1>{{$t('sendEth.fillUpTwo')}}</h1>-->
    <el-card>
      <h4>{{$t('sendEth.sendEthHint')}}</h4>
      <h4>{{$t('sendEth.MAN_count')}}: {{manBalance | weiToNumber}}MAN</h4>
      <h4>{{$t('sendEth.ETH_count')}}: {{ethBalance | weiToNumber}}ETH</h4>
      <el-form :model="ruleForm"
               :rules="rules"
               ref="ruleForm">
        <h5>{{$t('sendEth.mappingManAddress')}}</h5>
        <el-form-item prop="amount">
          <el-input type="number"
                    v-model="ruleForm.amount"></el-input>
        </el-form-item>
        <h5>{{$t('sendEth.getManAddress')}}</h5>
        <el-form-item>
          <el-input v-model="ruleForm.address"
                    readonly></el-input>
        </el-form-item>
        <h5>GasPrice (WEI)</h5>
        <el-form-item prop="gasPrice">
          <el-input type="number"
                    v-model="ruleForm.gasPrice"></el-input>
        </el-form-item>
        <h5>GasLimit (WEI)</h5>
        <el-form-item prop="gasLimit">
          <el-input type="number"
                    v-model="ruleForm.gasLimit"></el-input>
        </el-form-item>
      </el-form>
      <div>
        <button class="common-button"
                @click="submit">{{$t('sendEth.sure')}}</button>
      </div>
    </el-card>
    <eth-dialog :visible="visible"
                @changeVisible="changeVisible"
                :width="'800px'"
                :msg="msg"
                :hash="hash"></eth-dialog>
  </div>
</template>
<script>
import WalletUtil from '@/assets/js/WalletUtil'
import BigNumber from 'bignumber.js'
import { ethChainId, erc20Abi, ethContractAddress, destroyAddress } from '@/assets/js/config'
import Tx from 'ethereumjs-tx'
import ethDialog from '@/components/TransferDialog/ETHDialog'
// import Bus from '@/assets/js/Bus'
// import store from '@/store'

export default {
  name: 'sendEth',
  data () {
    // const validateAddress = (rule, value, callback) => {
    //   if (value === '') {
    //     callback(new Error('请输入映射地址'))
    //   } else if (!/^(0x)?[0-9a-f]{40}$/i.test(value)) {
    //     callback(new Error('请输入正确的ETH地址格式'))
    //   } else {
    //     callback()
    //   }
    // }
    return {
      hash: '',
      msg: '',
      visible: false,
      manBalance: 0,
      ethBalance: 0,
      gasPrice: 0,
      nonce: '',
      wallet: this.$store.state.unlockWallet,
      contract: null,
      ruleForm: {
        amount: '',
        address: destroyAddress,
        gasPrice: '',
        gasLimit: '150000'
      },
      rules: {
        amount: [
          { required: true, message: this.$t('sendEth.mappingCount'), trigger: 'blur' }
        ],
        address: [
          { validator: this.validAddress, trigger: 'blur' }
        ],
        gasPrice: [
          { required: true, message: this.$t('sendEth.inputGasPrice'), trigger: 'blur' }
        ],
        gasLimit: [
          { required: true, message: this.$t('sendEth.inputGasLimit'), trigger: 'blur' }
        ]
      }
    }
  },
  mounted () {
    this.ethProvider.eth.getGasPrice().then(result => {
      this.ruleForm.gasPrice = result
    })
    let abiArray = JSON.parse(erc20Abi)
    let contractAddress = ethContractAddress
    // let contractAddress = '0xe25bCec5D3801cE3a794079BF94adF1B8cCD802D'
    this.contract = this.ethProvider.eth.Contract(abiArray, contractAddress)
    this.getManBalance()
    this.getEthBalance()
    this.getNonce()
  },
  methods: {
    changeVisible (state) {
      this.visible = state
    },
    validAddress (rule, address, callback) {
      if (!/^(0x)?[0-9a-fA-F]{40}$/i.test(address)) {
        callback(new Error(window.i18n.t('errorMsgs.invalidETH')))
      } else {
        callback()
      }
    },
    getManBalance () {
      this.contract.methods.balanceOf(WalletUtil.getEthAddress(this.wallet.address)).call().then(balance => {
        this.manBalance = balance
      })
    },
    getEthBalance () {
      this.ethProvider.eth.getBalance(WalletUtil.getEthAddress(this.wallet.address)).then(result => {
        this.ethBalance = result
      })
    },
    getNonce () {
      this.ethProvider.eth.getTransactionCount(WalletUtil.getEthAddress(this.wallet.address)).then(result => {
        this.nonce = result
      })
    },
    submit () {
      this.$refs['ruleForm'].validate((valid) => {
        if (valid) {
          let loading = this.$loading({
            lock: true,
            text: 'Loading',
            spinner: 'el-icon-loading',
            background: 'rgba(0, 0, 0, 0.7)'
          })
          let rawTx = {
            nonce: this.ethProvider.utils.toHex(this.nonce),
            gasPrice: this.ethProvider.utils.toHex(this.ruleForm.gasPrice),
            gasLimit: this.ethProvider.utils.toHex(this.ruleForm.gasLimit),
            to: ethContractAddress,
            // to: '0xe25bCec5D3801cE3a794079BF94adF1B8cCD802D',
            value: '0x0',
            data: this.contract.methods.transfer(this.ruleForm.address, ('0x' + WalletUtil.toWeiHex(new BigNumber(this.ruleForm.amount)))).encodeABI(),
            chainId: ethChainId
          }
          let tx = new Tx(rawTx)
          let privateKey = this.wallet.privateKey
          privateKey = Buffer.from(privateKey.indexOf('0x') > -1 ? privateKey.substring(2, privateKey.length) : privateKey, 'hex')
          tx.sign(privateKey)
          let serializedTx = tx.serialize()
          this.ethProvider.eth.sendSignedTransaction('0x' + serializedTx.toString('hex'), (err, hash) => {
            if (!err) {
              loading.close()
              this.getNonce()
              this.msg = this.$t('mapping.mappingSuccess')
              this.visible = true
              this.hash = hash
              // this.$message.success(hash)
              this.ruleForm.amount = ''
            } else {
              loading.close()
              this.$message.error(JSON.parse(err.message.split('Node error:')[1]).message)
            }
          })
        } else {
          return false
        }
      })
    }
  },
  components: {
    ethDialog
  }
}
</script>

<style scoped lang="less">
.send-eth {
  width: 1040px;
  /deep/ .el-card__body {
    padding: 2.5rem 0 3rem 0;
  }
  /deep/.el-input {
    width: 26.5rem;
  }
  .el-form {
    padding-left: 308px;
    text-align: left;
    border: none;
  }
  h5 {
    margin-left: 0 !important;
    margin-top: 2rem;
  }
  h4 {
    margin-bottom: 1rem;
  }
}
</style>
