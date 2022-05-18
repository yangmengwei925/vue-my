<template>
  <div>
    <el-popover
      placement="bottom-start"
      title=""
      :width="width"
      trigger="click"
    >
      <div class="content">
        <el-date-picker
          v-if="inputType === 'date'"
          v-model="dateVal"
          type="date"
          size="mini"
          placeholder="选择日期"
        >
        </el-date-picker>
        <el-input
          v-else
          size="mini"
          :type="inputType"
          v-model="searchVal"
        ></el-input>
        <div style="margin-top: 10px">
          <el-button size="mini" type="primary" @click="handleSearch"
            >搜索</el-button
          >
          <el-button size="mini" type="primary" plain @click="resetSearchVal"
            >重置</el-button
          >
        </div>
      </div>
      <div slot="reference">
        <span>{{ thName }}</span>
        <i class="el-icon-caret-bottom" style="cursor: pointer"></i>
      </div>
    </el-popover>
  </div>
</template>

<script>

export default {
  name: 'TableHeaderInput',
  props: {
    inputType: {
      default: 'text'
    },
    searchFn: {
      default: () => { },
      required: true
    },
    thName: {
      required: true
    },
    width: {
      default: 80
    }
  },
  data() {
    return {
      searchVal: '',
      dateVal: ''
    }
  },
  methods: {
    resetSearchVal() {
      if (this.inputType === 'date') {
        this.dateVal = ''
      } else {
        this.searchVal = ''
      }
    },
    handleSearch() {
      let params = this.inputType === 'date' ? this.dateVal : this.searchVal
      this.searchFn(params)
    }
  }
}
</script>
