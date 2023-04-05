<template>
  <div>
    <el-table :data="tableData" style="width: 100%" max-height="500">
      <el-table-column fixed prop="goodsName" label="商品名称" width="150" />
      <el-table-column prop="goodsTitle" label="商品标题" width="120" />
      <el-table-column prop="goodsDetail" label="商品细节" width="120" />
      <el-table-column prop="goodsImg" label="商品图片" width="200">
        <template slot-scope="scope">
          <img
            :src="scope.row.goodsImg"
            alt=""
            style="width: 150px; height: 150px"
          >
        </template>
      </el-table-column>
      <el-table-column prop="goodsPrice" label="商品原价" min-width="100" align="center" />
      <el-table-column prop="goodsStock" label="商品库存" min-width="120" align="center" />
      <el-table-column prop="seckillPrice" label="秒杀价格" min-width="100" align="center" />
      <el-table-column prop="stockCount" label="秒杀库存" min-width="120" align="center" />
      <el-table-column prop="startDate" label="秒杀开始时间" min-width="150" :formatter="startDateFomatter" align="center" />
      <el-table-column prop="endDate" label="秒杀结束时间" min-width="150" :formatter="endDateFomatter" align="center" />
      <el-table-column fixed="right" label="操作" width="120" align="center">
        <template slot-scope="scope">
          <el-button
            type="text"
            size="small"
            @click="dialogFormVisible = true"
            @click.native.prevent="getGoodsDetial(scope.row)"
          >
            抢购
          </el-button>
        </template>
      </el-table-column>
    </el-table>

    <el-dialog title="秒杀商品" :visible.sync="dialogFormVisible">
      <el-form :model="form">
        <el-form-item label="秒杀状态" :label-width="formLabelWidth">
          <el-tag :key="item.label" v-model="item" :type="item.type">{{ item.label }}</el-tag>
        </el-form-item>
        <el-form-item v-show="showTimeDown" label="秒杀倒计时" :label-width="formLabelWidth">
          <el-statistic :value="deadline" time-indices format="HH:mm:ss" @finish="getGoodsDetial(goodsRow)" /></el-form-item>
        <el-form-item v-show="showTimeDownEnd" label="距秒杀结束" :label-width="formLabelWidth">
          <el-statistic :value="deadline2" time-indices format="HH:mm:ss" @finish="getGoodsDetial(goodsRow)" />
        </el-form-item>
        <el-form-item label="商品名称" :label-width="formLabelWidth">
          <el-input v-model="form.goodsName" autocomplete="off" disabled />
        </el-form-item>
        <el-form-item label="商品详情" :label-width="formLabelWidth">
          <el-input v-model="form.goodsDetail" autocomplete="off" disabled />
        </el-form-item>
        <el-form-item label="商品图片" :label-width="formLabelWidth">
          <img
            :src="form.goodsImg"
            alt=""
            style="width: 150px; height: 150px"
          >
        </el-form-item>
        <el-form-item label="秒杀价格" :label-width="formLabelWidth">
          <el-input v-model="form.seckillPrice" autocomplete="off" disabled />
        </el-form-item>
        <el-form-item label="剩余数量" :label-width="formLabelWidth">
          <el-input v-model="form.stockCount" autocomplete="off" disabled />
        </el-form-item>
        <el-form-item label="开始时间" :label-width="formLabelWidth">
          <el-input v-model="form.fomartStartDate" autocomplete="off" disabled />
        </el-form-item>
        <el-form-item label="结束时间" :label-width="formLabelWidth">
          <el-input v-model="form.fomartEndDate" autocomplete="off" disabled />
        </el-form-item>
        <el-form-item label="抢购数量" :label-width="formLabelWidth">
          <el-input-number v-model="num" :min="1" :max="2" />
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogFormVisible = false">取 消</el-button>
        <el-button
          type="primary"
          :disabled="purchase"
          @click="purchaseCommodity()"
        >抢 购</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import request from '@/utils/request'
import { Message } from 'element-ui'
import moment from 'moment'

export default {
  name: 'Goods',
  data() {
    return {
      tableData: [],
      dialogFormVisible: false,
      showTimeDown: false,
      showTimeDownEnd: false,
      purchase: true,
      goodsRow: '',
      item: '',
      items: [
        { type: 'warning', label: '秒杀未开始' },
        { type: 'success', label: '秒杀进行中' },
        { type: 'danger', label: '秒杀已结束' }
      ],
      form: {
        goodsName: '',
        goodsDetail: '',
        goodsImg: '',
        seckillPrice: '',
        stockCount: false,
        startDate: '',
        endDate: '',
        fomartStartDate: '',
        fomartEndDate: ''
      },
      formLabelWidth: '120px',
      num: 1,
      deadline: null,
      deadline2: null
    }
  },
  mounted() {
    this.getGoods()
  },
  methods: {
    getGoods() {
      request({
        url: '/goods/getGoodsList',
        method: 'get'
      }).then((response) => {
        this.tableData = response.data
      })
    },
    getGoodsDetial(row) {
      this.goodsRow = row
      request({
        url: `/goods/getGoodsDetail/` + row.id,
        method: 'post'
      }).then((response) => {
        this.form = response.data.goodsDetail
        this.form.fomartStartDate = moment(this.form.startDate).format('YYYY-MM-DD HH:mm:ss')
        this.form.fomartEndDate = moment(this.form.endDate).format('YYYY-MM-DD HH:mm:ss')
        this.goodsId = response.data.goodsDetail.id
        if (response.data.seckillStatus === 0) {
          this.item = this.items[0]
          this.showTimeDown = true
          this.showTimeDownEnd = false
          this.deadline = response.data.goodsDetail.startDate
          this.purchase = true
        } else if (response.data.seckillStatus === 1) {
          this.item = this.items[1]
          this.showTimeDown = false
          this.showTimeDownEnd = true
          this.deadline2 = response.data.goodsDetail.endDate
          this.purchase = false
        } else {
          this.item = this.items[2]
          this.showTimeDown = false
          this.showTimeDownEnd = false
          this.purchase = true
        }
      })
    },
    purchaseCommodity() {
      request({
        url: `/secKill/doSecKill/` + this.goodsRow.id + `/` + this.num,
        method: 'post'
      }).then((response) => {
        console.log(response)
        Message({
          message: response.message || '操作成功',
          type: 'success',
          duration: 3 * 1000
        })
      })
    },
    startDateFomatter(row, column) {
      var date = row.startDate
      return moment(date).format('YYYY-MM-DD HH:mm:ss')
    },
    endDateFomatter(row, column) {
      var date = row.endDate
      return moment(date).format('YYYY-MM-DD HH:mm:ss')
    }
  }
}
</script>

<style lang="scss" scoped>
</style>
