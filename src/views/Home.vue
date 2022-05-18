<template>
  <div class="home">
    <el-popover trigger="click" style="margin-left: 320px">
      <el-checkbox-group v-model="colOptions" style="margin-left: 0">
        <el-checkbox
          v-for="item in colSelect"
          :label="item.value"
          :key="item.value"
          >{{ item.title }}</el-checkbox
        >
      </el-checkbox-group>
      <el-button
        slot="reference"
        size="mini"
        style="margin-top: 10px; margin-left: 10px"
        @click="resetForm()"
        >重置</el-button
      >
    </el-popover>
    <el-button
      :loading="downloadLoading"
      style="margin: 10px"
      icon="el-icon-download"
      @click="handleDownload"
      size="mini"
      type="primary"
      >导出</el-button
    >
    <!-- //查询 -->
    <el-button
      type="primary"
      size="mini"
      @click="getData()"
      style="margin: 10px"
      >查询</el-button
    >
    <!-- 打印/**-->
    <el-button type="primary" size="mini" plain v-print="'#fullScreenTable'"
      >打印</el-button
    >
    <!-- 分页 -->
    <!-- <div>
      <el-pagination
        :current-page="page"
        :page-size="size"
        :page-sizes="[20, 40, 50, 100]"
        :total="total"
        layout="total, sizes, prev, pager, next, jumper"
        style="margin: -40px 0 0 800px"
      ></el-pagination>
    </div> -->
    <div style="margin-top: 20px; width: auto">
      <el-table
        id="fullScreenTable"
        class="table"
        ref="tableDataRef"
        :model="tableDataRef"
        :summary-method="getSummaries"
        show-summary
        :header-cell-class-name="handleHeadAddClass"
        @sort-change="tableSortChange"
        stripe
        border
        row-key="id"
        :data="
          tableData.filter(
            (data) =>
              !search || data.name.toLowerCase().includes(search.toLowerCase())
          )
        "
        style="width: 100%"
      >
        <el-table-column
          type="selection"
          width="55"
          align="center"
        ></el-table-column>
        <el-table-column
          type="index"
          width="55"
          label="序号"
          align="center"
        ></el-table-column>
        <el-table-column
          v-for="(column, index) in columns"
          :key="index"
          :label="column.label"
          :prop="column.prop"
          :sortable="column.sortable"
          :width="column.width"
          align="center"
        >
          <template slot="header">
            <div
              v-if="filtersProps.includes(column.prop) && !isDownload"
              style="display: inline-block"
            >
              <TableHeaderInput
                :width="column.prop === 'date' ? 220 : 80"
                :inputType="column.filterType"
                :thName="column.label"
                :searchFn="searchFn1"
              />
            </div>
            <div v-else style="display: inline-block">{{ column.label }}</div>
          </template>
          <template slot-scope="scope">
            <el-popover
              v-if="column.prop === 'address'"
              trigger="hover"
              placement="top"
            >
              <p>{{ scope.row.address }}</p>
              <div slot="reference" class="name-wrapper">
                <el-tag size="medium">{{ scope.row.address }}</el-tag>
              </div>
            </el-popover>
            <el-tag
              v-else-if="column.prop === 'tag'"
              :type="scope.row.tag === '支出' ? 'primary' : 'success'"
              disable-transitions
              >{{ scope.row.tag }}</el-tag
            >
            <span v-else>{{ scope.row[column.prop] }}</span>
          </template>
        </el-table-column>
        <!-- 添加输入框 -->
        <template v-if="!isDownload">
          <el-table-column
            label="操作"
            width="150"
            align="center"
            fixed="right"
            v-if="tableBtnShow"
          >
            <template slot-scope="scope">
              <el-button
                size="mini"
                @click.native.prevent="deleteRow(scope.$index, tableData)"
                >删除</el-button
              >
            </template>
          </el-table-column>
          <el-table-column label="操作" width="150" align="center" v-else>
            <template slot-scope="scope">
              <el-button
                size="mini"
                @click.native.prevent="deleteRow(scope.$index, tableData)"
                >删除</el-button
              >
            </template>
          </el-table-column>
        </template>
      </el-table>
    </div>
  </div>
</template>
<script>
import Sortable from "sortablejs";
import columns from "./homeColumns.js";
import TableHeaderInput from "../components/tableHeaderInput";
import { exportExcel } from "@/assets/js/export.js";
export default {
  name: "Home",
  components: {
    TableHeaderInput,
  },
  props: {
    // 当前页面
    page: Number,
    // 每页数量
    size: Number,
    // 总数
    total: Number,
  },
  data() {
    return {
      tableData: [
        {
          id: "1",
          enterpriseName: "万联易达物流科技有限公司",
          name: "FYD20220215000004",
          amount1: "SC190001461102",
          address: "现金账户",
          tag: "支出",
          use: "司机运费",
          money: "10537.41",
          date: "2022-03-18 18:13",
          Abstract: "自动修订数据",
        },
        {
          id: "2",
          enterpriseName: "万联易达物流科技有限公司",
          name: "FYD20220215000004",
          amount1: "SC190001461102",
          address: "现金账户",
          tag: "支出",
          use: "司机运费",
          money: "10537.41",
          date: "2022-03-18 18:13",
          Abstract: "自动修订数据",
        },
        {
          id: "3",
          enterpriseName: "万联易达物流科技有限公司",
          name: "FYD20220215000004",
          amount1: "SC190001461102",
          address: "现金账户",
          tag: "支出",
          use: "司机运费",
          money: "10537.41",
          date: "2022-03-18 18:13",
          Abstract: "自动修订数据",
        },
        {
          id: "4",
          enterpriseName: "万联易达物流科技有限公司",
          name: "FYD20220215000004",
          amount1: "SC190001461102",
          address: "现金账户",
          tag: "支出",
          use: "司机运费",
          money: "10537.41",
          date: "2022-03-18 18:13",
          Abstract: "自动修订数据",
        },
        {
          id: "5",
          enterpriseName: "万联易达物流科技有限公司",
          name: "FYD20220215000004",
          amount1: "SC190001461102",
          address: "现金账户",
          tag: "支出",
          use: "司机运费",
          money: "10537.41",
          date: "2022-03-18 18:13",
          Abstract: "自动修订数据",
        },
        {
          id: "6",
          enterpriseName: "万联易达物流科技有限公司",
          name: "FYD20220215000004",
          amount1: "SC190001461102",
          address: "现金账户",
          tag: "支出",
          use: "司机运费",
          money: "10537.41",
          date: "2022-03-18 18:13",
          Abstract: "自动修订数据",
        },
        {
          id: "7",
          enterpriseName: "万联易达物流科技有限公司",
          name: "FYD20220215000004",
          amount1: "SC190001461102",
          address: "现金账户",
          tag: "支出",
          use: "司机运费",
          money: "10537.41",
          date: "2022-03-18 18:13",
          Abstract: "自动修订数据",
        },
        {
          id: "8",
          enterpriseName: "万联易达物流科技有限公司",
          name: "FYD20220215000004",
          amount1: "SC190001461102",
          address: "现金账户",
          tag: "支出",
          use: "司机运费",
          money: "10537.41",
          date: "2022-03-18 18:13",
          Abstract: "自动修订数据",
        },
        {
          id: "9",
          enterpriseName: "万联易达物流科技有限公司",
          name: "FYD20220215000004",
          amount1: "SC190001461102",
          address: "现金账户",
          tag: "支出",
          use: "司机运费",
          money: "10537.41",
          date: "2022-03-18 18:13",
          Abstract: "自动修订数据",
        },
        {
          id: "10",
          enterpriseName: "万联易达物流科技有限公司",
          name: "FYD20220215000004",
          amount1: "SC190001461102",
          address: "现金账户",
          tag: "支出",
          use: "司机运费",
          money: "10537.41",
          date: "2022-03-18 18:13",
          Abstract: "自动修订数据",
        },
        {
          id: "11",
          enterpriseName: "北京承测物流有限公司",
          name: "FYD20220215000004",
          amount1: "SC190001461102",
          address: "现金账户",
          tag: "支出",
          use: "司机运费",
          money: "10537.41",
          date: "2022-03-18 18:13",
          Abstract: "自动修订数据",
        },
        {
          id: "12",
          enterpriseName: "北京承测物流有限公司",
          name: "FYD20220215000004",
          amount1: "SC190001461102",
          address: "现金账户",
          tag: "支出",
          use: "司机运费",
          money: "10537.41",
          date: "2022-03-18 18:13",
          Abstract: "自动修订数据",
        },
        {
          id: "13",
          enterpriseName: "北京承测物流有限公司",
          name: "FYD20220215000004",
          amount1: "SC190001461102",
          address: "现金账户",
          tag: "支出",
          use: "预充值",
          money: "10537.41",
          date: "2022-03-18 18:13",
          Abstract: "自动修订数据",
        },
        {
          id: "14",
          enterpriseName: "北京承测物流有限公司",
          name: "FYD20220215000004",
          amount1: "SC190001461102",
          address: "现金账户",
          tag: "支出",
          use: "预充值",
          money: "10537.41",
          date: "2022-03-18 18:13",
          Abstract: "自动修订数据",
        },
        {
          id: "15",
          enterpriseName: "北京承测物流有限公司",
          name: "FYD20220215000004",
          amount1: "SC190001461102",
          address: "现金账户",
          tag: "支出",
          use: "预充值",
          money: "10537.41",
          date: "2022-03-18 18:13",
          Abstract: "自动修订数据",
        },
        {
          id: "16",
          enterpriseName: "北京承测物流有限公司",
          name: "FYD20220215000004",
          amount1: "SC190001461102",
          address: "现金账户",
          tag: "支出",
          use: "预充值",
          money: "10537.41",
          date: "2022-03-18 18:13",
          Abstract: "自动修订数据",
        },
        {
          id: "17",
          enterpriseName: "北京承测物流有限公司",
          name: "FYD20220215000004",
          amount1: "SC190001461102",
          address: "现金账户",
          tag: "支出",
          use: "预充值",
          money: "10537.41",
          date: "2022-03-18 18:13",
          Abstract: "自动修订数据",
        },
        {
          id: "18",
          enterpriseName: "北京承测物流有限公司",
          name: "FYD20220215000004",
          amount1: "SC190001461102",
          address: "现金账户",
          tag: "支出",
          use: "预充值",
          money: "10537.41",
          date: "2022-03-18 18:13",
          Abstract: "自动修订数据",
        },
        {
          id: "19",
          enterpriseName: "北京承测物流有限公司",
          name: "FYD20220215000004",
          amount1: "SC190001461102",
          address: "现金账户",
          tag: "支出",
          use: "预充值",
          money: "10537.41",
          date: "2022-03-18 18:13",
          Abstract: "自动修订数据",
        },
        {
          id: "20",
          enterpriseName: "北京承测物流有限公司",
          name: "FYD20220215000004",
          amount1: "SC190001461102",
          address: "现金账户",
          tag: "支出",
          use: "预充值",
          money: "10537.41",
          date: "2022-03-18 18:13",
          Abstract: "自动修订数据",
        },
        {
          id: "21",
          enterpriseName: "北京承测物流有限公司",
          name: "FYD20220215000004",
          amount1: "SC190001461102",
          address: "现金账户",
          tag: "支出",
          use: "预充值",
          money: "10537.41",
          date: "2022-03-18 18:13",
          Abstract: "自动修订数据",
        },
        {
          id: "22",
          enterpriseName: "北京承测物流有限公司",
          name: "FYD20220215000004",
          amount1: "SC190001461102",
          address: "现金账户",
          tag: "支出",
          use: "预充值",
          money: "10537.41",
          date: "2022-03-18 18:13",
          Abstract: "自动修订数据",
        },
        {
          id: "23",
          enterpriseName: "北京承测物流有限公司",
          name: "FYD20220215000004",
          amount1: "SC190001461102",
          address: "现金账户",
          tag: "支出",
          use: "预充值",
          money: "10537.41",
          date: "2022-03-18 18:13",
          Abstract: "自动修订数据",
        },
        {
          id: "24",
          enterpriseName: "北京承测物流有限公司",
          name: "FYD20220215000004",
          amount1: "SC190001461102",
          address: "现金账户",
          tag: "支出",
          use: "预充值",
          money: "10537.41",
          date: "2022-03-18 18:13",
          Abstract: "自动修订数据",
        },
        {
          id: "25",
          enterpriseName: "北京承测物流有限公司",
          name: "FYD20220215000004",
          amount1: "SC190001461102",
          address: "现金账户",
          tag: "支出",
          use: "预充值",
          money: "10537.41",
          date: "2022-03-18 18:13",
          Abstract: "自动修订数据",
        },
        {
          id: "26",
          enterpriseName: "北京承测物流有限公司",
          name: "FYD20220215000004",
          amount1: "SC190001461102",
          address: "现金账户",
          tag: "支出",
          use: "预充值",
          money: "10537.41",
          date: "2022-03-18 18:13",
          Abstract: "自动修订数据",
        },
        {
          id: "27",
          enterpriseName: "2016-05-2",
          name: "FYD20220215000004",
          amount1: "SC190001461102",
          address: "现金账户",
          tag: "支出",
          use: "预充值",
          money: "10537.41",
          date: "2022-03-18 18:13",
          Abstract: "自动修订数据",
        },
        {
          id: "28",
          enterpriseName: "吉林市合润运输有限责任公司",
          name: "FYD20220215000004",
          amount1: "SC190001461102",
          address: "现金账户",
          tag: "支出",
          use: "预充值",
          money: "10537.41",
          date: "2022-03-18 18:13",
          Abstract: "自动修订数据",
        },
        {
          id: "29",
          enterpriseName: "吉林市合润运输有限责任公司",
          name: "FYD20220215000004",
          amount1: "SC190001461102",
          address: "现金账户",
          tag: "支出",
          use: "预充值",
          money: "10537.41",
          date: "2022-03-18 18:13",
          Abstract: "自动修订数据",
        },
        {
          id: "30",
          enterpriseName: "吉林市合润运输有限责任公司",
          name: "FYD20220215000004",
          amount1: "SC190001461102",
          address: "现金账户",
          tag: "支出",
          use: "预充值",
          money: "10537.41",
          date: "2022-03-18 18:13",
          Abstract: "自动修订数据",
        },
      ],
      //公共
      tableDataRef: {
        date: [""],
        name: "",
        amount1: "",
        address: "",
        tag: "",
        enterpriseName: "",
        use: "",
        money: "",
        Abstract: "",
      },
      //colData
      colData: [
        { title: "企业名称", istrue: true, value: "enterpriseName" },
        { title: "申请编号", istrue: true, value: "name" },
        { title: "流水号", istrue: true, value: "amount1" },
        { title: "账户类型", istrue: true, value: "address" },
        { title: "类型", istrue: true, value: "tag" },
        { title: "用途", istrue: true, value: "use" },
        { title: "金额(元)", istrue: true, value: "money" },
        { title: "交易时间", istrue: true, value: "date" },
        { title: "摘要", istrue: true, value: "Abstract" },
      ],
      downloadLoading: false,
      search: "",
      colOptions: [],
      colSelect: [],
      multipleSelection: [],
      sortPropList: {},
      columns: columns.filter((item) => item.istrue),
      filtersProps: [
        "amount1",
        "tag",
        "name",
        "date",
        "enterpriseName",
        "use",
        "money",
        "address",
        "Abstract",
      ],
      tableBtnShow: false,
      isDownload: false,
    };
  },
  //实际操作如下，在请求数据接口调用成功后,在$nextTick里执行一下该方法就可以了
  //<el-table ref='table'> </el-table>
  //axios.post('...')
  // .then(function (response) {
  //     this.$nextTick(() => {
  //         this.$refs.table.doLayout()
  //     })
  // })
  watch: {
    colOptions(valArr) {
      console.log("valArr===", valArr);
      localStorage.setItem("tableHeader", JSON.stringify(valArr));
      var arr = this.colSelect.filter((i) => valArr.indexOf(i) < 0); //未选中
      this.colData.filter((i) => {
        if (arr.indexOf(i.title) != -1) {
          i.istrue = false;
          //重新布局table
          this.$nextTick(() => {
            this.$refs.tableDataRef.doLayout();
          });
        } else {
          i.istrue = true;
        }
      });
      //  start -----
      this.columns = columns
        .filter((item) => item.istrue)
        .filter((item) => valArr.includes(item.prop));
      //  end ----
      let width = document.body.clientWidth;
      console.dir(width);
      this.tableBtnShow = width > 1000 ? valArr.length > 10 : valArr.length > 8;
      //重新布局table
      this.$nextTick(() => {
        this.$refs.tableDataRef.doLayout();
      });
    },
  },
  mounted() {
    this.rowDrop();
  },
  created() {
    // start -----
    let tableHeader = localStorage.getItem("tableHeader");
    tableHeader =
      typeof tableHeader === "string" ? JSON.parse(tableHeader) : [];
    this.columns = columns
      .filter((item) => item.istrue)
      .filter((item) => tableHeader.includes(item.prop));
    this.colOptions = [...tableHeader];
    this.colSelect = this.colData.filter((item) => item.istrue);
  },
  methods: {
    /**
     * 增加多列排序
     */
    handleHeadAddClass({ column }) {
      if (this.sortPropList[column.property]) {
        column.order = this.sortPropList[column.property];
      }
    },
    // eslint-disable-next-line no-unused-vars
    tableSortChange({ column, prop, order }) {
      // eslint-disable-next-line no-unused-vars
      let sortType = undefined;
      switch (order) {
        case "ascending":
          sortType = "1";
          break;
        case "descending":
          sortType = "2";
          break;
        default:
          break;
      }
      this.sortPropList[prop] = order;
    },
    //重置
    resetForm() {
      this.$refs["tableDataRef"].resetFields();
    },
    //查询
    getData() {
      this.listLoading = true;
    },
    //导出
    async handleDownload() {
      this.downloadLoading = await true;
      this.isDownload = await true;
      await setTimeout(() => {
        exportExcel({
          id: "#fullScreenTable",
          filename: "myexport",
        }).then((res) => {
          if (res) {
            console.log(res);
            this.isDownload = false;
            this.downloadLoading = false;
          }
        });
      }, 300);
    },
    //导出函数
    //行拖拽
    rowDrop() {
      //获取容器
      const wrapperColumn = document.querySelector(
        ".el-table__header-wrapper tr"
      );
      // 第二步，给列容器指定对应拖拽规则
      this.sortable = Sortable.create(wrapperColumn, {
        animation: 500,
        delay: 0,
        onEnd: (event) => {
          console.log(
            "拖拽完成以后发现表头数据并没有改变，所以需要我们手动更新表头数据",
            this.columns
          );
          console.log(
            "根据旧索引和新索引去更新，其实就是交换位置",
            event.oldIndex,
            event.newIndex
          );

          // 接下来做索引的交换
          let tempHableHeader = [...this.columns]; // 先存一份临时变量表头数据
          let temp; // 临时变量用于交换
          temp = tempHableHeader[event.oldIndex - 2]; // 注意这里-2是因为，我在表格的前面加了两列（勾选框列，和序号列）
          tempHableHeader[event.oldIndex - 2] =
            tempHableHeader[event.newIndex - 2]; // 如果没有这两列，序号就是正常对应的，就不用减2
          tempHableHeader[event.newIndex - 2] = temp;

          // 重要的事情说三遍！！！
          // 这里一定要先把表头数据清空，然后再下一轮中去赋值，否则会渲染错误
          this.columns = []; // 大家可以注掉试试哦
          this.$nextTick(() => {
            //表头
            this.columns = tempHableHeader;
          });
        },
      });
    },
    //合计
    getSummaries(param) {
      const { columns, data } = param;
      const sums = [];
      columns.forEach((column, index) => {
        if (index === 0) {
          sums[index] = "总价";
          return;
        }
        const values = data.map((item) => Number(item[column.property]));
        if (!values.every((value) => isNaN(value))) {
          sums[index] = values.reduce((prev, curr) => {
            const value = Number(curr);
            if (!isNaN(value)) {
              return prev + curr;
            } else {
              return prev;
            }
          }, 0);
          sums[index] += " 元";
        } else {
          sums[index] = "";
        }
      });

      return sums;
    },
    //删除
    deleteRow(index, rows) {
      rows.splice(index, 1);
    },
    filterHandler(value, row, column) {
      const property = column["property"];
      return row[property] === value;
    },
    searchFn1(params) {
      // 这里调用接口
      console.log(params);
    },
  },
};
</script>
<style scoped>
.home {
  width: auto;
}
body {
  height: 100%;
}
</style>
