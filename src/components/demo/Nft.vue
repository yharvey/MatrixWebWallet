<template>
  <div class="nft" style="text-align: left;">
    <div class="conversion-table">
       <el-input  v-model="contractAddr"
                  :placeholder="'NFT contract address'"
                  class="input1">
        </el-input>
    </div>
     <div class="conversion-table">
        <el-input v-model="url"
                  :placeholder='"tokenURI"'
                  class="input1">
        </el-input>
         <!-- <el-input v-model="url2"
                  :placeholder='"tokenURI"'
                  class="input1">
        </el-input> -->
      <button class="common-button button-width" @click="confirm">创建nft</button>
    </div>
    <div class="conversion-table">
       <el-input v-model="name"
                  :placeholder="'NFTName'"
                  class="input1">
        </el-input>
         <el-input v-model="symbol"
                  :placeholder="'NFTsymble'"
                  class="input2">
        </el-input>
      <button class="common-button button-width" @click="getName">getName&symbol</button>
    </div>
     <div class="conversion-table">
       <el-input v-model="totalNft"
                  :placeholder='"NFTAmount"'
                  class="input1">
        </el-input>
      <button class="common-button button-width" @click="getAllNFT">获取总数量数量</button>
    </div>
     <div class="conversion-table">
       <el-input v-model="tokenId"
                  :placeholder='"tokenId"'
                  class="input1">
        </el-input>
      <button class="common-button button-width" @click="ownerOf">获取nft属于</button>
    </div>
    <!-- <div class="conversion-table">
       <button class="common-button button-width" @click="safeTransferFrom">转币</button>
    </div> -->
    <div class="conversion-table">
      <el-input v-model="tokenId"
                  :placeholder='"tokenId"'
                  class="input2">
        </el-input>
      <el-input v-model="tokenURI"
                  :placeholder='"token URI"'
                  class="input1">
      </el-input>
      <button class="common-button button-width" @click="getTokenURI">tokenURI</button>
   </div>
   <!-- <div class="conversion-table">
        <div class="lable-width">
          <label>{{$t('Custom RPC')}}:</label>
        </div>
        <el-input v-model="changeName"
                  :placeholder="$t('ChainID')"
                  class="input2">
        </el-input>
        <button class="common-button button-width"
                @click="change()">{{$t('Save')}}</button>
    </div> -->
  </div>
</template>

<script>
import { nftAbi } from '@/assets/js/config.js'
import TradingFuns from '@/assets/js/TradingFuns'
import WalletUtil from '@/assets/js/WalletUtil'
import SendTransfer from '@/assets/js/SendTransfer'
export default {
  mounted () {
    if (this.$store.state.offline != null) {
      this.address = this.$store.state.offline
    } else {
      this.address = this.$store.getters.wallet.address
    }
  },
  data () {
    return {
      tokenURI: '',
      url: '',
      url2: '',
      address: '',
      tokenId: 0,
      contractAddr: '',
      totalNft: 0,
      symbol: '',
      name: ''
    }
  },
  methods: {
    confirm () {
      try {
        let abiArray = JSON.parse(nftAbi)
        let contractAddress = this.contractAddr
        let contract = this.httpProvider.man
          .contract(abiArray)
          .at(contractAddress)
        let nonce = this.httpProvider.man.getTransactionCount(this.address)
        nonce = WalletUtil.numToHex(nonce)
        let data = {
          to: contractAddress,
          value: '0x0',
          gasLimit: 2100000,
          data: '',
          gasPrice: 18000000000,
          extra_to: [[0, 0, []]],
          nonce: nonce
        }
        let jsonObj = TradingFuns.getTxData(data)
        jsonObj.data = contract.createNFT.getData(this.url)
        if (this.$store.state.wallet != null) {
          let tx = WalletUtil.createTx(jsonObj)
          let privateKey = this.$store.state.wallet.privateKey
          privateKey = Buffer.from(
            privateKey.indexOf('0x') > -1
              ? privateKey.substring(2, privateKey.length)
              : privateKey,
            'hex'
          )
          tx.sign(privateKey)
          let serializedTx = tx.serialize()
          this.newTxData = SendTransfer.getTxParams(serializedTx)
          let hash = this.httpProvider.man.sendRawTransaction(this.newTxData)
          console.log('hash', hash)
          this.$message.success('success!')
          this.url = ''
        } else {
          this.confirmOffline = true
          this.jsonObj = JSON.stringify(jsonObj)
        }
      } catch (e) {
        this.$message.error(e.message)
      }
    },
    getAllNFT () {
      let abiArray = JSON.parse(nftAbi)
      let contractAddress = this.contractAddr
      console.log(this.httpProvider.man)
      let contract = this.httpProvider.man
        .contract(abiArray)
        .at(contractAddress)
      console.log('contract', contract)
      const result = contract.getAllNft({ currency: 'MAN' })
      console.log('result', result.toString())
      this.totalNft = Number(result)
    },
    getName () {
      let abiArray = JSON.parse(nftAbi)
      let contractAddress = this.contractAddr
      console.log(this.httpProvider.man)
      let contract = this.httpProvider.man
        .contract(abiArray)
        .at(contractAddress)
      const result = contract.name({ currency: 'MAN' })
      const result2 = contract.symbol({ currency: 'MAN' })
      console.log('Name', result.toString())
      this.name = result.toString()
      this.symbol = result2.toString()
    },
    ownerOf () {
      let abiArray = JSON.parse(nftAbi)
      let contractAddress = this.contractAddr
      console.log(this.httpProvider.man)
      let contract = this.httpProvider.man
        .contract(abiArray)
        .at(contractAddress)
      console.log('contract', contract)
      const result = contract.ownerOf(this.tokenId, { currency: 'MAN' })
      console.log('result', result.toString())
    },
    getTokenURI () {
      let abiArray = JSON.parse(nftAbi)
      let contractAddress = this.contractAddr
      console.log(this.httpProvider.man)
      let contract = this.httpProvider.man
        .contract(abiArray)
        .at(contractAddress)
      console.log('contract', contract)
      const result = contract.tokenURI(this.tokenId, { currency: 'MAN' })
      // const result2 = contract.getTokenURI(this.tokenId, { currency: 'MAN' })
      console.log('result', result.toString())
      // console.log('result2', result2.toString())
      this.tokenURI = result.toString()
    },
    safeTransferFrom () {
      let abiArray = JSON.parse(nftAbi)
      let contractAddress = this.contractAddr
      let contract = this.httpProvider.man
        .contract(abiArray)
        .at(contractAddress)
      let nonce = this.httpProvider.man.getTransactionCount(this.address)
      nonce = WalletUtil.numToHex(nonce)
      let data = {
        to: contractAddress,
        value: '0x0',
        gasLimit: 210000,
        data: '',
        gasPrice: 18000000000,
        extra_to: [[0, 0, []]],
        nonce: nonce
      }
      let jsonObj = TradingFuns.getTxData(data)
      jsonObj.data = contract.safeTransferFrom.getData(
        '0x8c5876959f775078a117e4e05cca0dd74040e14c',
        '0x57f7cf2c8f38156d4419f1d6d9859dca7c836875',
        this.tokenId
      )
      if (this.$store.state.wallet != null) {
        let tx = WalletUtil.createTx(jsonObj)
        let privateKey = this.$store.state.wallet.privateKey
        privateKey = Buffer.from(
          privateKey.indexOf('0x') > -1
            ? privateKey.substring(2, privateKey.length)
            : privateKey,
          'hex'
        )
        tx.sign(privateKey)
        let serializedTx = tx.serialize()
        this.newTxData = SendTransfer.getTxParams(serializedTx)
        let hash = this.httpProvider.man.sendRawTransaction(this.newTxData)
        console.log('hash', hash)
      } else {
        this.confirmOffline = true
        this.jsonObj = JSON.stringify(jsonObj)
      }
    }
  }
}
</script>
<style scoped lang="less">
.nft {
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
}
</style>
