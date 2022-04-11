<template>
  <div class="className">
    <el-card class="anoCard">
      <div slot="header">
        <span>司法考试赛道队伍信息</span>
      </div>
      <div class="searchDiv">
        <el-input
          type="text"
          placeholder="请输入"
          class="width1"
          v-model="sch_order"
        ></el-input>

        <el-button type="primary" icon="el-icon-search" @click="searchTab()"
          >搜索</el-button
        >
        <el-button
          type="primary"
          icon="el-icon-excel iconfont"
          @click="excelDow"
          >导出</el-button
        >
        <el-button
          v-if="activeName === 'submit' && JSON.stringify(selections) === '{}'"
          @click="deleteSelectModels"
          type="danger"
          icon="el-icon-delete"
          >删除</el-button
        >
        <el-button
          type="primary"
          v-if="isStage1"
          @click="changeOpenStatus(isStage1)"
          >关闭第一阶段</el-button
        >
        <el-button
          type="primary"
          v-else-if="!isStage1"
          @click="changeOpenStatus(isStage1)"
          >开启第一阶段</el-button
        >
        <el-button type="primary">关闭第二阶段</el-button>
        <el-tag type="info" v-if="activeName === 'group'">
          当前赛道报名队伍数：{{ total }}，总计参赛用户数：{{ curr_user_cnt }}
        </el-tag>
      </div>
      <el-tabs
        type="border-card"
        v-model="activeName"
        @tab-click="handleTabClick"
      >
        <el-tab-pane label="提交" name="submit">
          <el-table
            :data="tableData"
            ref="models"
            :row-key="getRowKeys"
            :key="model_pagination.total"
            border
            stripe
            @select="onSelect"
            @select-all="onSelectAll"
            :fit="true"
            tooltip-effect="dark"
          >
            <el-table-column
              type="selection"
              :reserve-selection="true"
            ></el-table-column>
            <el-table-column
              prop="uid"
              label="uid"
              width="300"
            ></el-table-column>
            <el-table-column
              prop="userID"
              label="队长号码"
              align="center"
            ></el-table-column>
            <el-table-column
              prop="leaderName"
              label="队长姓名"
              align="center"
            ></el-table-column>
            <el-table-column
              prop="realAuthorID"
              label="上传者号码"
              align="center"
            ></el-table-column>
            <el-table-column
              prop="realAuthorName"
              label="上传者姓名"
              align="center"
            ></el-table-column>
            <el-table-column
              prop="modelResult"
              label="模型结果"
            ></el-table-column>
            <el-table-column
              prop="createtime"
              label="上传时间"
            ></el-table-column>
          </el-table>
          <el-pagination
            background
            layout="total, sizes, prev, pager, next"
            :page-sizes="model_pagination.pageSizes"
            :page-size="model_pagination.pageSize"
            :current-page="model_pagination.currentPage"
            :total="model_pagination.total"
            class="fyDiv"
            @size-change="handleSize"
            @current-change="handlePage"
          ></el-pagination>
        </el-tab-pane>
        <el-tab-pane label="队伍" name="group">
          <el-table :data="tableData" border stripe>
            <el-table-column prop="groupName" label="队伍名"></el-table-column>
            <el-table-column prop="leaderID" label="队长ID"></el-table-column>

            <el-table-column
              prop="groupType"
              label="队伍类型"
            ></el-table-column>
            <el-table-column prop="groupOrg" label="队伍机构"></el-table-column>
            <el-table-column
              prop="memberNum"
              label="队伍人数"
            ></el-table-column>
            <el-table-column prop="members" label="队伍成员"></el-table-column>
          </el-table>
          <el-pagination
            background
            layout="total, sizes, prev, pager, next"
            :page-sizes="pageSizes"
            :page-size="pageSize"
            :current-page="currentPage"
            :total="total"
            class="fyDiv"
            @size-change="handleSize"
            @current-change="handlePage"
          >
          </el-pagination>
        </el-tab-pane>
      </el-tabs>
    </el-card>
    <el-dialog title="订单修改" :visible.sync="diaIsShow" class="diaForm">
      <el-form
        ref="diaForm"
        :model="formData"
        :rules="rules"
        label-width="140px"
      >
        <el-form-item label="订单号">
          <el-input
            type="text"
            v-model="formData.order"
            :disabled="true"
          ></el-input>
        </el-form-item>
        <el-form-item label="订单时间" prop="time">
          <el-date-picker
            v-model="formData.time"
            type="datetime"
            placeholder="选择日期时间"
            value-format="yyyy-MM-dd HH:mm:ss"
          ></el-date-picker>
        </el-form-item>
        <el-form-item label="配送地址" prop="address">
          <el-input
            type="text"
            placeholder="请输入地址"
            v-model="formData.address"
          ></el-input>
        </el-form-item>
        <el-form-item label="联系电话" prop="phone">
          <el-input
            type="text"
            placeholder="请输入电话"
            v-model="formData.phone"
          ></el-input>
        </el-form-item>
        <el-form-item label="配送员" prop="name">
          <el-input
            type="text"
            placeholder="请输入姓名"
            v-model="formData.name"
          ></el-input>
        </el-form-item>
        <el-form-item label="状态" prop="status">
          <el-select v-model="formData.status" placeholde="请选择状态">
            <el-option
              v-for="item in options"
              :label="item.label"
              :value="item.value"
              :key="item.value"
            ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="changeTab('diaForm', editType)"
            >确认</el-button
          >
          <el-button @click="diaIsShow = false">取消</el-button>
        </el-form-item>
      </el-form>
    </el-dialog>
  </div>
</template>

<script>
import { getPageTab2, getGroupByRaceID, getModelExeResult } from '@/api/table'
export default {
  data() {
    return {
      tableData: [],
      allList: [],
      schArr: [],
      sch_order: '',
      sch_status: null,
      sch_date: null,
      currentPage: 1,
      pageSize: 10,
      total: 0,
      pageSizes: [10, 20, 30, 40],
      diaIsShow: false,
      formData: {},
      editType: '',
      options: [
        { label: '用户名', value: 1 },
        { label: '手机号', value: 2 },
        { label: '单位名', value: 0 },
        { label: '单位简称', value: 3 }
      ],
      model_pagination: {
        currentPage: 1,
        pageSize: 10,
        total: 0,
        pageSizes: [10, 20, 30, 40]
      },
      rowIndex: 0,
      rules: {
        // order: [{ required: true, message: '请输入订单号', trigger: 'blur' }],
        time: [
          {
            // type: 'datetime',
            required: true,
            message: '请输入时间',
            trigger: 'change'
          }
        ],
        address: [{ required: true, message: '请输入地址', trigger: 'blur' }],
        phone: [{ required: true, message: '请输入联系方式', trigger: 'blur' }],
        name: [{ required: true, message: '请输入姓名', trigger: 'blur' }],
        status: [
          { required: true, message: '请选择订单状态', trigger: 'change' }
        ]
      },
      activeName: 'group',
      curr_user_cnt: 0,

      isStage1: false,
      isStage2: true,
      // 获取row的key值，row.uid
      getRowKeys(row) {
        return row.uid
      },
      selections: {},
      list: []
    }
  },
  created() {
    this.getGroupData()
    this.getStageStatus()
    console.log(JSON.stringify(this.selections) === '{}')
  },
  filters: {
    statusText(val) {
      if (val === undefined) return
      if (val === 0) {
        return '已完成'
      } else if (val === 1) {
        return '待审核'
      } else if (val === 2) {
        return '配送中'
      } else {
        return '已取消'
      }
    },
    tagClass(val) {
      if (val === undefined) return
      if (val === 0) {
        return 'success'
      } else if (val === 1) {
        return 'info'
      } else if (val === 2) {
        return 'warning'
      } else {
        return 'danger'
      }
    }
  },
  watch: {
    sch_order: {
      handler() {
        this.searchContent()
      }
    }
  },
  methods: {
    handleSize(val) {
      if (this.activeName === 'group') {
        this.pageSize = val
      } else {
        this.model_pagination.pageSize = val
      }
      this.getPageData()
    },
    handlePage(val) {
      if (this.activeName === 'group') {
        this.currentPage = val
      } else {
        this.model_pagination.currentPage = val
      }
      this.getPageData()
    },
    handleTabClick(tab, event) {
      if (tab.name === 'submit') {
        this.getModelData()
      } else {
        this.getGroupData()
      }
    },
    // 勾选时，记录[{uid, row}]
    onSelect(selection, row) {
      if (this.selections[row.uid]) {
        delete this.selections[row.uid]
      } else {
        this.selections[row.uid] = row
      }
    },
    // 全选情况
    onSelectAll(selection) {
      console.log(this.schArr)
      // 全选
      if (selection.length) {
        selection.forEach(row => {
          this.selections[row.uid] = row
        })
      } else {
        // 取消全选
        this.list.forEach(row => {
          delete this.selections[row.uid]
        })
      }
    },
    // 删除选中的模型
    deleteSelectModels() {
      let that = this
      Object.keys(that.selections).forEach(row => {
        that.schArr = that.schArr.filter(item => item.uid != row)
        this.model_pagination.total -= 1
        console.log(that.schArr)
      })
      this.getPageData()
      // this.schArr = this.schArr.filter(item => item === this.selections[0])
      // console.log(this.schArr)
      this.$confirm('此操作将永久删除该文件, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      })
        .then(() => {
          Object.keys(this.selections).forEach(row => {
            this.list.push(row)
          })
          this.list.forEach(uid => {
            for (let item in this.schArr) {
              if (item.uid === uid) {
                console.log(item)
                break
              }
            }
          })

          // this.$axios.post('/deleteSelectModels', {
          //   uids: this.list
          // })
          this.list = []
          // this.getModelData()
          this.$message({
            type: 'success',
            message: '删除成功!'
          })
        })
        .catch(() => {
          this.$message({
            type: 'info',
            message: '已取消删除'
          })
        })
    },
    isEmptyObject(obj) {
      for (const key in obj) {
        return false
      }
      return true
    },
    getGroupData() {
      getGroupByRaceID({race_id: 7})
        .then(res => {
          this.allList = res.data.group_list;
          this.schArr = this.allList
          this.getPageData()
          this.total = res.data.total
          this.curr_user_cnt = res.data.curr_user_cnt
        })
    },
    getModelData() {
      getModelExeResult({race_id: 7})
        .then(res => {
          this.allList = res.data.model_exe_list
          this.schArr = this.allList
          this.getPageData()
          this.model_pagination.total = res.data.total
        })
    },
    getStageStatus() {
      this.$axios
        .get('/changeReadingComprehensionStatus')
        .then(res => {
          this.isStage1 = res.data.stage1
          this.isStage2 = res.data.stage2
        })
        .catch(error => {
          this.$message.error(error.message)
        })
    },
    _getPageTab2() {
      getPageTab2()
        .then(res => {
          this.allList = res.data.tableList
          this.schArr = this.allList
          this.getPageData()
          this.total = res.data.total
        })
        .catch(error => {
          this.$message.error(error.message)
        })
    },
    // 用于刷新表格视图，每次修改表格想更新视图都得调用
    getPageData() {
      if (this.activeName === 'group') {
        let start = (this.currentPage - 1) * this.pageSize
        let end = start + this.pageSize
        this.tableData = this.schArr.slice(start, end)
      } else {
        let start =
          (this.model_pagination.currentPage - 1) *
          this.model_pagination.pageSize
        let end = start + this.model_pagination.pageSize
        this.tableData = this.schArr.slice(start, end)
      }
    },
    excelDow() {
      import('@/vendor/Export2Excel.js').then(module => {
        const tHeader = [
          '队伍名',
          '队长ID',
          '队伍类型',
          '队伍机构',
          '队伍人数',
          '队伍成员'
        ]
        const filterVal = [
          'groupName',
          'leaderID',
          'groupType',
          'groupOrg',
          'memberNum',
          'members'
        ]
        const list = this.allList
        const data = this.formatJson(filterVal, list)
        module.export_json_to_excel({
          header: tHeader,
          data,
          filename: '阅读理解队伍信息',
          autoWidth: true,
          bookType: 'xlsx'
        })
      })
    },
    formatJson(filterVal, jsonData) {
      return jsonData.map(v => filterVal.map(j => v[j]))
    },

    // test axios
    getBackendData() {
      this.$axios
        .get('/hello')
        .then(response => {
          console.log(response.data)
        })
        .catch(error => {
          this.$message.error(error.message)
        })
    },
    changeOpenStatus(stage) {
      this.isStage1 = !stage
      this.$axios.post('/changeReadingComprehensionStatus', {
        stage1: this.isStage1,
        stage2: this.isStage2
      })
    },
    searchContent() {
      let arrList = []
      for (let item of this.allList) {
        if (
          this.sch_order.trim() === '' &&
          this.sch_status === null &&
          this.sch_date === null
        ) {
          arrList = this.allList
          break
        } else if (
          item.groupName.startsWith(this.sch_order) ||
          item.leaderID.startsWith(this.sch_order) ||
          item.groupOrg.startsWith(this.sch_order) ||
          item.members.startsWith(this.sch_order)
        ) {
          let obj = Object.assign({}, item)
          arrList.push(obj)
        }
      }
      this.schArr = arrList
      this.total = arrList.length
      this.currentPage = 1
      this.pageSize = 10
      this.getPageData()
    },

    // 查找
    searchTab() {
      let arrList = []
      for (let item of this.allList) {
        console.log(item)
        console.log(this.sch_status)
        if (
          this.sch_order.trim() === '' &&
          this.sch_status === null &&
          this.sch_date === null
        ) {
          arrList = this.allList
          break
        } else if (
          item.groupName.startsWith(this.sch_order) ||
          item.groupType.startsWith(this.sch_order) ||
          item.groupOrg.startsWith(this.sch_order) ||
          item.leaderID.startsWith(this.sch_order)
          // &&
          // (this.sch_status !== null ? item.status === this.sch_status : true) &&
          // (this.sch_date !== null ? item.createTime.startsWith(this.sch_date) : true)
        ) {
          let obj = Object.assign({}, item)
          arrList.push(obj)
        }
      }
      this.schArr = arrList
      this.total = arrList.length
      this.currentPage = 1
      this.pageSize = 10
      this.getPageData()
    },
    // add
    addTab() {
      this.formData = {}
      this.diaIsShow = true
      this.formData.order = (Math.random() * 10e18).toString()
      this.formData.id = this.allList.length + 1
      this.editType = 'add'
      this.$nextTick(() => {
        this.$refs.diaForm.clearValidate()
      })
    },
    // 审核
    toConfirm(row) {
      row.status = 2
      this.$notify({
        title: '成功',
        message: '审核提交成功',
        type: 'success'
      })
    },
    // 完成
    toSuccess(row) {
      row.status = 0
      this.$notify({
        title: '成功',
        message: '该订单已完成配送',
        type: 'success'
      })
    },
    // 取消
    toDelete(row) {
      row.status = 3
      this.$notify({
        title: '成功',
        message: '已取消该订单',
        type: 'success'
      })
    },
    // 编辑
    editTable(index, row) {
      this.formData = Object.assign({}, row)
      this.editType = 'update'
      this.diaIsShow = true
      this.$nextTick(() => {
        this.$refs.diaForm.clearValidate()
      })
      this.rowIndex = index
    },
    changeTab(form, type) {
      this.$refs[form].validate(valid => {
        if (valid) {
          if (type === 'update') {
            // 改变整个表格数据
            let start = (this.currentPage - 1) * this.pageSize
            this.allList[start + this.rowIndex] = Object.assign(
              {},
              this.formData
            )
            // 解决数组不能通过索引响应数据变化
            this.$set(
              this.tableData,
              this.rowIndex,
              Object.assign({}, this.formData)
            )
            this.$notify({
              title: '成功',
              message: '订单已修改成功',
              type: 'success'
            })
          } else {
            this.tableData.unshift(Object.assign({}, this.formData))
            this.allList.push(Object.assign({}, this.formData))
          }
          this.diaIsShow = false
        } else {
          return
        }
      })
    }
  }
}
</script>
<style lang="scss" scoped>
.fyDiv {
  float: right;
  margin-top: 30px;
  padding-bottom: 20px;
}
.anoCard .el-table .el-button {
  padding: 8px 18px;
  font-size: 12px;
}
.searchDiv {
  margin-bottom: 20px;
  .el-button {
    padding: 11px 20px;
  }
}
.width1 {
  width: 180px;
  margin-right: 10px;
}
.diaForm {
  .el-input {
    width: 350px;
  }
}
</style>
<style lang="scss">
.anoCard {
  .el-card__body:after {
    content: '';
    clear: both;
    width: 0;
    height: 0;
    visibility: hidden;
    display: block;
  }
}
.diaForm .el-form-item__label {
  padding-right: 20px;
}
.searchDiv [class^='el-icon'] {
  color: #fff;
}
</style>
