let types = ['Pre-Release', 'Pending Delete', 'Auctions & Listings', 'Expiring Domains', 'Deleting Domains', '"In Auction" Domains', 'Pending Deletes', 'tdnam_all_listings', 'bidding_service_auctions', 'expiring_service_auctions']

window.app = new Vue({
  el: '#app',
  data: {
    sales: [],
    domains: [],
    distributeResult: [],
    remainDomains:[]
  },
  components: {
  },
  mounted() {
    this.getSales();
    this.getDomains();
   },
  methods: {
    domainDistribute(){
      this.distributeOrderedDomains();
      this.rearrangeSales();
      this.setRemainDomains();
      this.distributeRemainDomains();
      this.updateDistributedDomains();
    },

    distributeOrderedDomains(){
      this.domains.forEach(item=>{
        if(item.preOrder){
          item.distributed=true;
          this.distributeResult.push(item);
        }
      })
      console.log('Init Result With Ordered Domains:')
      console.log(this.distributeResult);
    },

    rearrangeSales(){
      let curDay = new Date().getDay();
      if(curDay != 0 && curDay != 1){ // not Sunday and Monday
        for(let i = 2; i <= curDay; i++){
          this.moveSaleItem();
        }
      }
    },

    moveSaleItem(){
      let firstItem = this.sales[0];
      let secondItem = this.sales[1];
      this.sales.splice(0,1);//remove first item
      this.sales.splice(0,1);// remove second item
      this.sales.unshift(secondItem);// add second item to first index
      this.sales.push(firstItem);// add first item to last index
      console.log('After Moved: ');
      console.log(this.sales);
    },

    setRemainDomains(){
      let comDomains=[];
      let netDomains=[];
      this.domains.forEach(item=>{
        if(!item.preOrder){
          let info = item.domain.split('.');
          let suffixe = info[info.length -1];
          if(suffixe=='com'){
            comDomains.push(item);
          }
          else if(suffixe=='net'){
            netDomains.push(item);
          }
        }
      })
      comDomains.forEach(item=>{
        this.remainDomains.push(item);
      })
      netDomains.forEach(item=>{
        this.remainDomains.push(item);
      })
       console.log('Remain Domains:');
       console.log(this.remainDomains);
    },

    distributeRemainDomains(){
      this.remainDomains.forEach((item,idx)=>{
        let resultIdx = idx;
        if(idx > this.sales.length -1){
           resultIdx = idx % (this.sales.length -1) -1;
        }
        if(this.sales[resultIdx]){
          item.saler = this.sales[resultIdx]._id;
          item.distributed = true;
          this.distributeResult.push(item);
        }
        
      })
      console.log('Final Distributed: ')
      console.log(this.distributeResult);
    },

    updateDistributedDomains(){
      axios.post('/api/distributedDomains', {data: this.distributeResult})
      .then((response) => {
        successMsg(`Update Sucessfully`)
      })
      .catch((error) => {
        console.log(`export error: `, error)
        cancelMsg(error.message)
      })
    },

    getSales(){
      axios.get('/api/getSales')
      .then((response) => {
        this.sales = response.data;
        console.log('Sales: ')
        console.log(this.sales);
      })
      .catch((error) => {
        console.log(`error: `, error)
      })
    },

    getDomains(){
      axios.post('/api/getDistributedDomains', { date: this.getCurrDate()})
      .then((response) => {
        this.domains = response.data
        console.log('Domains: ')
        console.log(this.domains);
      })
      .catch((error) => {
        console.log(`error: `, error)
      })
    },

    getCurrDate(){
       return moment().format("YYYY-MM-DD")
    },
  },

})

