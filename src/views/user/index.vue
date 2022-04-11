<template>
  <div class="className">
    <el-card class="anoCard">
      <div slot="header">
        <span>注册用户信息</span>
      </div>
      <div class="searchDiv">
        <el-input
          type="text"
          placeholder="请输入"
          class="width1"
          clearable
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
        <el-tag type="info">当前注册用户数：{{ total }}</el-tag>
        <!--        <el-button-->
        <!--          type="primary"-->
        <!--          icon="el-icon-circle-plus-outline"-->
        <!--          @click="addTab"-->
        <!--          >添加</el-button-->
        <!--        >-->
      </div>
      <el-table :data="tableData" border stripe>
        <el-table-column prop="id" label="序号" width="60"></el-table-column>
        <el-table-column prop="name" label="用户名"></el-table-column>
        <el-table-column prop="telephone" label="手机号"></el-table-column>
        <el-table-column prop="email" label="邮箱"></el-table-column>
        <el-table-column prop="university" label="单位"></el-table-column>
        <el-table-column prop="uniShort" label="单位简称"></el-table-column>
        <el-table-column prop="createTime" label="创建时间"></el-table-column>
        <el-table-column prop="lastLogin" label="最近登录"></el-table-column>
      
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
    </el-card>
  </div>
</template>

<script>
import { getPageTab2 } from "@/api/table";
import { getAllUsers } from "@/api/user";
export default {
  data() {
    return {
      tableData: [],
      allList: [],
      schArr: [],
      sch_order: "",
      sch_status: null,
      sch_date: null,
      currentPage: 1,
      pageSize: 10,
      total: 0,
      pageSizes: [10, 20, 30, 40],
      diaIsShow: false,
      formData: {},
      editType: "",
      options: [
        { label: "用户名", value: 1 },
        { label: "手机号", value: 2 },
        { label: "单位名", value: 0 },
        { label: "单位简称", value: 3 },
      ],
      rowIndex: 0,
      rules: {
        // order: [{ required: true, message: '请输入订单号', trigger: 'blur' }],
        time: [
          {
            // type: 'datetime',
            required: true,
            message: "请输入时间",
            trigger: "change",
          },
        ],
        address: [{ required: true, message: "请输入地址", trigger: "blur" }],
        phone: [{ required: true, message: "请输入联系方式", trigger: "blur" }],
        name: [{ required: true, message: "请输入姓名", trigger: "blur" }],
        status: [
          { required: true, message: "请选择订单状态", trigger: "change" },
        ],
      },
    };
  },
  created() {
    this.getUserData();
  },
  filters: {
    statusText(val) {
      if (val === undefined) return;
      if (val === 0) {
        return "已完成";
      } else if (val === 1) {
        return "待审核";
      } else if (val === 2) {
        return "配送中";
      } else {
        return "已取消";
      }
    },
    tagClass(val) {
      if (val === undefined) return;
      if (val === 0) {
        return "success";
      } else if (val === 1) {
        return "info";
      } else if (val === 2) {
        return "warning";
      } else {
        return "danger";
      }
    },
  },
  watch: {
    sch_order: {
      handler() {
        this.searchContent();
      },
    },
  },
  methods: {
    handleSize(val) {
      this.pageSize = val;
      this.getPageData();
    },
    handlePage(val) {
      this.currentPage = val;
      this.getPageData();
    },
    sendData() {
      this.$axios
        .post("/testPost", { aa: 123 })
        .then((response) => {
          console.log(response);
        })
        .catch((error) => {
          console.log(error);
        });
    },
    
    getUserData() {
      getAllUsers().then((res) => {
        this.allList = res.data.user_list;
        this.schArr = this.allList;
        this.getPageData();
        this.total = res.data.total;
      });
    },
    _getPageTab2() {
      getPageTab2()
        .then((res) => {
          this.allList = res.data.tableList;
          this.schArr = this.allList;
          this.getPageData();
          this.total = res.data.total;
        })
        .catch((error) => {
          this.$message.error(error.message);
        });
    },
    getPageData() {
      let start = (this.currentPage - 1) * this.pageSize;
      let end = start + this.pageSize;
      this.tableData = this.schArr.slice(start, end);
    },
    getBackendData() {
      this.$axios
        .get("/hello")
        .then((response) => {
          console.log(response.data);
        })
        .catch((error) => {
          this.$message.error(error.message);
        });
    },
    excelDow() {
      import("@/vendor/Export2Excel.js").then((module) => {
        const tHeader = [
          "序号",
          "用户名",
          "手机号",
          "邮箱",
          "单位",
          "单位简称",
          "创建时间",
          "最近登录",
        ];
        const filterVal = [
          "id",
          "name",
          "telephone",
          "email",
          "university",
          "uniShort",
          "createTime",
          "lastLogin",
        ];
        const list = this.schArr;
        const data = this.formatJson(filterVal, list);
        module.export_json_to_excel({
          header: tHeader,
          data,
          filename: "注册用户信息",
          autoWidth: true,
          bookType: "xlsx",
        });
      });
    },
    formatJson(filterVal, jsonData) {
      return jsonData.map((v) => filterVal.map((j) => v[j]));
    },

    searchContent() {
      let arrList = [];
      for (let item of this.allList) {
        if (
          this.sch_order.trim() === "" &&
          this.sch_status === null &&
          this.sch_date === null
        ) {
          arrList = this.allList;
          break;
        } else if (
          (item.name.startsWith(this.sch_order) ||
            item.telephone.startsWith(this.sch_order) ||
            item.email.startsWith(this.sch_order) ||
            item.university.startsWith(this.sch_order) ||
            item.uniShort.startsWith(this.sch_order)) &&
          (this.sch_status !== null ? item.status === this.sch_status : true) &&
          (this.sch_date !== null
            ? item.createTime.startsWith(this.sch_date)
            : true)
        ) {
          let obj = Object.assign({}, item);
          arrList.push(obj);
        }
      }
      this.schArr = arrList;
      this.total = arrList.length;
      this.currentPage = 1;
      this.pageSize = 10;
      this.getPageData();
    },
    // 查找
    searchTab() {
      let arrList = [];
      for (let item of this.allList) {
        if (
          this.sch_order.trim() === "" &&
          this.sch_status === null &&
          this.sch_date === null
        ) {
          arrList = this.allList;
          break;
        } else if (
          item.name.startsWith(this.sch_order) &&
          (this.sch_status !== null ? item.status === this.sch_status : true) &&
          (this.sch_date !== null
            ? item.createTime.startsWith(this.sch_date)
            : true)
        ) {
          let obj = Object.assign({}, item);
          arrList.push(obj);
        }
      }
      this.schArr = arrList;
      this.total = arrList.length;
      this.currentPage = 1;
      this.pageSize = 10;
      this.getPageData();
    },
    // add
    addTab() {
      this.formData = {};
      this.diaIsShow = true;
      this.formData.order = (Math.random() * 10e18).toString();
      this.formData.id = this.allList.length + 1;
      this.editType = "add";
      this.$nextTick(() => {
        this.$refs.diaForm.clearValidate();
      });
    },
    // 审核
    toConfirm(row) {
      row.status = 2;
      this.$notify({
        title: "成功",
        message: "审核提交成功",
        type: "success",
      });
    },
    // 完成
    toSuccess(row) {
      row.status = 0;
      this.$notify({
        title: "成功",
        message: "该订单已完成配送",
        type: "success",
      });
    },
    // 取消
    toDelete(row) {
      row.status = 3;
      this.$notify({
        title: "成功",
        message: "已取消该订单",
        type: "success",
      });
    },
    // 编辑
    editTable(index, row) {
      this.formData = Object.assign({}, row);
      this.editType = "update";
      this.diaIsShow = true;
      this.$nextTick(() => {
        this.$refs.diaForm.clearValidate();
      });
      this.rowIndex = index;
    },
    changeTab(form, type) {
      this.$refs[form].validate((valid) => {
        if (valid) {
          if (type === "update") {
            // 改变整个表格数据
            let start = (this.currentPage - 1) * this.pageSize;
            this.allList[start + this.rowIndex] = Object.assign(
              {},
              this.formData
            );
            // 解决数组不能通过索引响应数据变化
            this.$set(
              this.tableData,
              this.rowIndex,
              Object.assign({}, this.formData)
            );
            this.$notify({
              title: "成功",
              message: "订单已修改成功",
              type: "success",
            });
          } else {
            this.tableData.unshift(Object.assign({}, this.formData));
            this.allList.push(Object.assign({}, this.formData));
          }
          this.diaIsShow = false;
        } else {
          return;
        }
      });
    },
  },
};
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
    content: "";
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
.searchDiv [class^="el-icon"] {
  color: #fff;
}
</style>
