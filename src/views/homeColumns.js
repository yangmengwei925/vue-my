function formatter(row) {
  return row.address
}

function filterTag(value, row) {
  return row.tag === value
}

const columns = [
  {
    prop: 'enterpriseName',
    sortable: true,
    label: '企业名称',
    istrue: true,
    filterType: 'enterpriseName',
    width: 200,
    filterMethod: filterTag,
    filterPlacement: 'bottom-end',
  },
  {
    prop: 'name',
    sortable: false,
    label: '申请编号',
    istrue: true,
    filterType: 'text',
    width: 200,
    filterMethod: filterTag,
    filterPlacement: 'bottom-end',
  },
  {
    prop: 'amount1',
    sortable: true,
    label: '流水号',
    istrue: true,
    filterType: 'number',
    width: 200,
    filterPlacement: 'bottom-end',
  },
  {
    prop: 'address',
    sortable: false,
    label: '账户类型',
    istrue: true,
    filterType: 'text',
    width: 200,
    formatter: formatter,
  },
  {
    prop: 'tag',
    sortable: false,
    label: '类型',
    istrue: true,
    width: 140,
    filterType: 'text',
    filterPlacement: 'bottom-end',
  },
  {
    prop: 'use',
    sortable: false,
    label: '用途',
    istrue: true,
    width: 150,
    filterType: 'text',
    filterPlacement: 'bottom-end',
  },
  {
    prop: 'money',
    sortable: false,
    label: '金额(元)',
    istrue: true,
    width: 180,
    filterType: 'text',
    filterPlacement: 'bottom-end',
  },
  {
    prop: 'date',
    sortable: false,
    label: '交易时间',
    istrue: true,
    width: 180,
    filterType: 'text',
    filterPlacement: 'bottom-end',
  },
  {
    prop: 'Abstract',
    sortable: false,
    label: '摘要',
    istrue: true,
    width: 180,
    filterType: 'text',
    filterPlacement: 'bottom-end',
  },
]

export default columns
