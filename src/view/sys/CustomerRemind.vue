<template>
  <div class="mt-10">
    <Table border :columns="columns" :data="list"></Table>
  </div>
</template>

<script>
  import {getDateTime, getDateTime2, getRenderList, getCustomerType} from "../../libs/tools";

  export default {
    name: "CustomerRemind",
    props: ['list'],
    data() {
      return {
        columns: [
          {
            title: '公司',
            align: 'center',
            key: 'customerName'
          },
          {
            title: '联系人',
            align: 'center',
            key: 'contactName'
          },
          {
            title: '沟通方式',
            align: 'center',
            render: (h, params) => {
              const v = params.row.type;
              return h('span', v == 1 ? '电话沟通' : v == 3 ? '客户上门' : '拜访客户')
            }
          },
          {
            title: '沟通记录',
            align: 'center',
            render: (h, params) => {
              const arr = [];
              arr.push(`跟踪状态：${getCustomerType(false, params.row.status) || '列名未联系'}`);
              if (params.row.type == 1 || params.row.type == 3) {
                arr.push(`沟通内容：${params.row.remark}`)
              } else {
                arr.push(`拜访时间：${getDateTime(params.row.meetTime)}`, `拜访地点：${params.row.meetAddress}`, `拜访记录：${params.row.meetNotice}`)
              }
              if (params.row.status == 5) {
                arr.push(`合同期：${getDateTime2(params.row.contactTimeStart) || ''}-${getDateTime2(params.row.contactTimeEnd) || ''}`)
              }
              return getRenderList(h, JSON.stringify(arr));
            }
          },
          {
            title: '时间',
            align: 'center',
            render: (h, params) => {
              return h('span', getDateTime(params.row.createTime));
            }
          },
        ]
      }
    }
  }
</script>

<style scoped>

</style>
