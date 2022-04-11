<template>
  <div>
    <div class="common-wrapper">
      <!--列表-->
      <el-table :data="lists" ref="table" highlight-current-row v-loading="listLoading" style="width: 100%;"
                :row-key="getRowKeys" type="selection" @selection-change="handleSelectionChange">
        <el-table-column type="selection" :reserve-selection="true" :selectable="checkSelectable"></el-table-column>
        <el-table-column prop="id" label="id"> </el-table-column>
        <el-table-column prop="time" label="time"> </el-table-column>
      </el-table>
      <!--工具条-->
      <el-col :span="24" class="toolbar">
        &ensp;&nbsp;
        <el-checkbox v-model="allCheck" @change="allCheckEvent">全选所有</el-checkbox>&emsp;
        <el-pagination :current-page="this.page" layout="total , prev, pager, next"
                       @current-change="handleCurrentChange" :page-size="10" :total="total" style="float:right;">
        </el-pagination>
      </el-col>
      <div class="clearfix"></div>
    </div>
  </div>
</template>

<script>
import axios from 'axios';
export default {
  data () {
    return {
      lists: [
        { id: '1', time: '2019-09-09 12:12:12' },
        { id: '2', time: '2019-09-09 12:12:12' },
        { id: '3', time: '2019-09-09 12:12:12' },
        { id: '4', time: '2019-09-09 12:12:12' },
        { id: '5', time: '2019-09-09 12:12:12' },
        { id: '6', time: '2019-09-09 12:12:12' },
        { id: '7', time: '2019-09-09 12:12:12' },
        { id: '8', time: '2019-09-09 12:12:12' },
        { id: '9', time: '2019-09-09 12:12:12' },
        { id: '10', time: '2019-09-09 12:12:12' },
      ],
      total: 13,
      page: 1,
      listLoading: false,
      multipleSelectionAll: [],//所有选中的数据包含跨分页数据
      allCheck: false,
      getRowKeys (row) {
        return row.id;
      },
    };
  },
  methods: {
    // 分页全选-选中框改变事件
    handleSelectionChange (val) {
      // 数据去重
      this.multipleSelectionAll = this.reduceSame(val);
      // 选中所有选择框时勾选全选按钮
      if (this.multipleSelectionAll.length === this.total) {
        this.allCheck = true;
      }
      // 将row是对象数组数据转换为字符串
      this.multipleSelectionAll = this.multipleSelectionAll.map(function (val) {
        return val.id;
      }).toString();
      // 选中后的数据
      console.log(this.multipleSelectionAll)
    },
    // 分页全选-全选按钮change事件
    allCheckEvent () {
      let _this = this;
      if (_this.allCheck) {
        // 全选选中时当前页所有数据选中
        _this.lists.forEach(row => {
          if (row) {
            _this.$refs.table.toggleRowSelection(row, true);
          }
        });
      } else {
        _this.$refs.table.clearSelection();
      }
    },
    // 分页全选-全选时禁用选择框
    checkSelectable (row, index) {
      return !this.allCheck;
    },
    // 数组对象去重
    reduceSame: function (arr) {
      let obj = {};
      return arr.reduce(function (prev, item) {
        obj[item.id] ? "" : (obj[item.id] = 1 && prev.push(item))
        return prev
          ;
      }, []);
    },
    // 分页
    handleCurrentChange (val) {
      this.page = val;
      if (val === 1) {
        this.lists = [
          { id: '1', time: '2019-09-09 12:12:12' },
          { id: '2', time: '2019-09-09 12:12:12' },
          { id: '3', time: '2019-09-09 12:12:12' },
          { id: '4', time: '2019-09-09 12:12:12' },
          { id: '5', time: '2019-09-09 12:12:12' },
          { id: '6', time: '2019-09-09 12:12:12' },
          { id: '7', time: '2019-09-09 12:12:12' },
          { id: '8', time: '2019-09-09 12:12:12' },
          { id: '9', time: '2019-09-09 12:12:12' },
          { id: '10', time: '2019-09-09 12:12:12' },
        ]
      } else {
        this.lists = [
          { id: '11', time: '2019-09-09 12:12:12' },
          { id: '12', time: '2019-09-09 12:12:12' },
          { id: '13', time: '2019-09-09 12:12:12' },
        ]
      }
    },
  },
  mounted () {

  },
  watch: {
    // 分页全选-监听数据变化
    lists: {
      handler (value) {
        if (this.allCheck) {
          this.lists.forEach(row => {
            if (row) {
              this.$refs.table.toggleRowSelection(row, true)
            }
          });
        }
      },
      deep: true
    },
  }
}

</script>

