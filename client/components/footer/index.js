Component({
  data: {
    items: [{
      id: 1,
      url: '/pages/home/home',
      title: '首页',
      icon: 'home',
      iconfill: 'homefill'
    }, {
      id: 2,
      url: '/pages/top100/top100',
      title: '热门',
      icon: 'hot',
      iconfill: 'hotfill'
    }, {
      id: 3,
      url: '/pages/whole/whole',
      title: '全部',
      icon: 'shop',
      iconfill: 'shopfill'
    }]
  },
  properties: {
    current: {
      type: Number,
      value: 1,
      observer: '_pageChange'
    }
  },
  methods: {
    _pageChange(newVal, oldVal) {
      this.setData({
        cid: newVal
      })
    }
  } 
})