<template>
  <div>
    <el-table :data="tableData" style="width: 100%" max-height="500">
      <el-table-column fixed prop="goodsName" label="商品名称" min-width="150" align="center" />
      <el-table-column prop="goodsPrice" label="购买价格" min-width="120" align="center" />
      <el-table-column prop="goodsCount" label="购买数量" min-width="120" align="center" />
      <el-table-column prop="orderChannel" label="下单渠道" min-width="200" :formatter="channelFormatter" align="center" />
      <el-table-column prop="status" label="订单状态" min-width="120" :formatter="statusFormatter" align="center" />
      <el-table-column prop="createDate" label="下单时间" min-width="150" :formatter="dateFomatter" align="center" />
    </el-table>
  </div>
</template>

<script>
import request from '@/utils/request'
import moment from 'moment'

export default {
  name: 'Order',
  data() {
    return {
      tableData: [],
      goodsRow: '',
      num: 1,
      deadline: null,
      deadline2: null
    }
  },
  mounted() {
    this.getOrder()
  },
  methods: {
    getOrder() {
      request({
        url: '/order/info',
        method: 'get'
      }).then((response) => {
        console.log(response.data)
        this.tableData = response.data
      })
    },
    channelFormatter(row, column) {
      const orderChannel = row.orderChannel
      if (orderChannel === 1) {
        return '网页端'
      } else if (orderChannel === 2) {
        return '手机APP'
      } else {
        return '未知'
      }
    },
    statusFormatter(row, column) {
      const status = row.status
      if (status === 0) {
        return '订单未支付'
      } else if (status === 1) {
        return '已支付'
      } else if (status === 2) {
        return '已发货'
      } else if (status === 3) {
        return '锁已收货'
      } else if (status === 4) {
        return '已退款'
      } else if (status === 5) {
        return '已完成'
      } else {
        return '未知'
      }
    },
    dateFomatter(row, column) {
      var date = row.createDate
      return moment(date).format('YYYY-MM-DD HH:mm:ss')
    }
  }
}
</script>

<style lang="scss" scoped>

</style>
