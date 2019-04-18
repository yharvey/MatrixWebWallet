import Vue from 'vue'
import Router from 'vue-router'
import Layout from '@/pages/Layout/Layout'
import AIApplication from '@/pages/AIApplication/AIApplication'
import Contract from '@/pages/Contract/Contract'
import GreenMining from '@/pages/GreenMining/GreenMining'
import MiningTransactionOverview from '@/components/MiningTransactionOverview/MiningTransactionOverview'
import HistoricalIncome from '@/components/HistoricalIncome/HistoricalIncome'
import MortgageHistory from '@/components/MortgageHistory/MortgageHistory'
import MyWallet from '@/pages/MyWallet/MyWallet'
import OfflineTransfer from '@/pages/OfflineTransfer/OfflineTransfer'
import OfflineTransferFirst from '@/components/OfflineTransferFirst/OfflineTransferFirst'
import OfflineTransferSecond from '@/components/OfflineTransferSecond/OfflineTransferSecond'
import OfflineTransferThird from '@/components/OfflineTransferThird/OfflineTransferThird'
import OfflineTransferFourth from '@/components/OfflineTransferFourth/OfflineTransferFourth'
import OpenWallet from '@/pages/OpenWallet/OpenWallet'
import CreateWallet from '@/pages/CreateWallet/CreateWallet'
import CreateWalletSecond from '@/pages/CreateWallet/CreateWalletSecond'
import SetGreetings from '@/pages/SetGreetings/SetGreetings'
import QueryWallet from '@/pages/QueryWallet/QueryWallet'
import MyWalletFirst from '@/pages/MyWallet/MyWalletFirst'
import MyAssets from '@/components/MyAssets/MyAssets'
import Token from '@/components/Token/Token'
import Record from '@/components/Record/Record'
import OnlineTransfer from '@/pages/OnlineTransfer/OnlineTransfer'
import store from '@/store'
import SetUp from '@/pages/SetUp/SetUp'
import Associate from '@/components/Associate/Associate'
import AddAssociate from '@/components/Associate/AddAssociate'
import Conversion from '@/components/Conversion/Conversion'
import PrivateKey from '@/components/PrivateKey/PrivateKey'
import CopyKeyStore from '@/components/CopyKeyStore/CopyKeyStore'
import Medical from '@/components/Medical/Medical'
import DistributedStorage2 from '@/components/DistributedStorage/DistributedStorage2'
import CampaignNode from '@/components/CampaignNode/CampaignNode'
import StartNode from '@/components/StartNode/StartNode'
import SecondKey from '@/components/SecondKey/SecondKey'
import CancelSecondKey from '@/components/SecondKey/CancelSecondKey'
import EntrustRecord from '@/components/EntrustRecord/EntrustRecord'
import Mapping from '@/pages/Mapping/Mapping'
import SendEth from '@/components/SendEth/SendEth'
import CancelEntrust from '@/components/CancelEntrust/CancelEntrust'
import AIRecord from '@/pages/AIApplication/AIRecord'
import CreateCoin from '@/pages/CreateCoin/CreateCoin'
import CreateCoinSecond from '@/pages/CreateCoin/CreateCoinSecond'
import BlackList from '@/components/BlackList/BlackList'

Vue.use(Router)

let router = new Router({
  routes: [{
    path: '/',
    name: 'layout',
    component: Layout,
    redirect: '/my-wallet/myWalletFirst',
    children: [{
      path: '/my-wallet',
      name: 'MyWallet',
      component: MyWallet,
      redirect: '/my-wallet/myWalletFirst',
      children: [{
        path: 'openWallet',
        name: 'OpenWallet',
        component: OpenWallet,
        children: [{
          path: 'myAssets',
          name: 'MyAssets',
          component: MyAssets
        }, {
          path: 'token',
          name: 'Token',
          component: Token
        }, {
          path: 'record',
          name: 'Record',
          component: Record
        }, {
          path: 'onlineTransfer',
          name: 'OnlineTransfer',
          component: OnlineTransfer
        }, {
          path: 'createCoin',
          name: 'CreateCoin',
          component: CreateCoin
        }, {
          path: 'createCoinSecond',
          name: 'CreateCoinSecond',
          component: CreateCoinSecond
        }]
      }, {
        path: 'myWalletFirst',
        name: 'MyWalletFirst',
        component: MyWalletFirst
      }, {
        path: 'createWallet',
        name: 'CreateWallet',
        component: CreateWallet
      }, {
        path: 'queryWallet',
        name: 'QueryWallet',
        component: QueryWallet
      }, {
        path: 'createWalletSecond',
        name: 'CreateWalletSecond',
        component: CreateWalletSecond
      }, {
        path: 'setGreetings',
        name: 'SetGreetings',
        component: SetGreetings
      }]
    }, {
      path: '/green-mining',
      name: 'GreenMining',
      component: GreenMining,
      children: [{
        path: 'mining-transaction-overview',
        name: 'MiningTransactionOverview',
        component: MiningTransactionOverview
      }, {
        path: 'mortgage-history',
        name: 'MortgageHistory',
        component: MortgageHistory
      }, {
        path: 'campaignNode',
        name: 'CampaignNode',
        component: CampaignNode
      }, {
        path: 'startNode',
        name: 'StartNode',
        component: StartNode
      }, {
        path: 'secondKey',
        name: 'SecondKey',
        component: SecondKey
      }, {
        path: 'cancelSecondKey',
        name: 'CancelSecondKey',
        component: CancelSecondKey
      }, {
        path: 'entrustRecord',
        name: 'EntrustRecord',
        component: EntrustRecord
      }, {
        path: 'historical-income',
        name: 'HistoricalIncome',
        component: HistoricalIncome
      }]
    }, {
      path: '/offline-transfer',
      name: 'OfflineTransfer',
      component: OfflineTransfer,
      children: [{
        path: 'offline-transfer-first',
        name: 'OfflineTransferFirst',
        component: OfflineTransferFirst
      }, {
        path: 'offline-transfer-second',
        name: 'OfflineTransferSecond',
        component: OfflineTransferSecond
      }, {
        path: 'offline-transfer-third',
        name: 'OfflineTransferThird',
        component: OfflineTransferThird
      }, {
        path: 'offline-transfer-fourth',
        name: 'OfflineTransferFourth',
        component: OfflineTransferFourth
      }]
    }, {
      path: '/ai-application',
      name: 'AIApplication',
      component: AIApplication,
      children: [{
        path: 'medical',
        name: 'Medical',
        component: Medical
      }, {
        path: 'distributedStorage',
        name: 'DistributedStorage',
        component: DistributedStorage2
      }, {
        path: 'aiRecord',
        name: 'AIRecord',
        component: AIRecord
      }]
    }, {
      path: '/contract',
      name: 'Contract',
      component: Contract
    }, {
      path: '/setUp',
      name: 'SetUp',
      component: SetUp,
      children: [{
        path: 'associate',
        name: 'associate',
        component: Associate,
        redirect: '/setUp/associate/addAssociate',
        children: [{
          path: 'addAssociate',
          name: 'AddAssociate',
          component: AddAssociate
        }, {
          path: 'cancelEntrust',
          name: 'CancelEntrust',
          component: CancelEntrust
        }]
      }, {
        path: 'conversion',
        name: 'Conversion',
        component: Conversion
      }, {
        path: 'privateKey',
        name: 'PrivateKey',
        component: PrivateKey
      }, {
        path: 'copyKeyStore',
        name: 'CopyKeyStore',
        component: CopyKeyStore
      }, {
        path: 'blackList',
        name: 'BlackList',
        component: BlackList
      }]
    }, {
      path: '/mapping',
      name: 'Mapping',
      component: Mapping
    }, {
      path: 'sendEth',
      name: 'SendEth',
      component: SendEth
    }]
  }]
})

// 判断是否解锁钱包
router.beforeEach((to, from, next) => {
  store.commit('UPDATE_HISTORYURL', to.path)
  if ((store.state.offline === null && store.state.wallet === null && to.path.indexOf('my-wallet') < 0) && to.path.indexOf('offline-transfer') < 0 && to.path.indexOf('mapping') < 0 && to.path.indexOf('conversion') < 0 && to.path.indexOf('sendEth') < 0) {
    // location.href = location.href.split('#')[0]
    // console.log(this.$router)
    next({
      path: '/my-wallet/myWalletFirst'
    })
  } else {
    next()
  }
})

export default router
