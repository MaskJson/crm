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
            width: 100,
            align: 'center',
            key: 'customerName'
          },
          {
            title: '联系人',
            width: 80,
            align: 'center',
            key: 'contactName'
          },
          {
            title: '沟通方式',
            width: 80,
            align: 'center',
            render: (h, params) => {
              const v = params.row.type;
              return h('span', v == 1 ? '电话沟通' : v == 3 ? '客户上门' : '拜访客户')
            }
          },
          {
            title: '上次沟通记录',
            align: 'center',
            // width: 360,
            render: (h, params) => {
              const arr = [];
              const remind = params.row.prev || {};
              arr.push(`跟踪状态：${getCustomerType(false, remind.status) || '列名未联系'}`);
              if (remind.type == 1 || remind.type == 3) {
                arr.push(`沟通内容：${remind.remark}`)
              } else {
                arr.push(`拜访时间：${getDateTime(remind.meetTime)}`, `拜访地点：${remind.meetAddress}`, `拜访记录：${remind.meetNotice}`)
              }
              if (params.row.status == 5) {
                arr.push(`合同期：${getDateTime2(remind.contactTimeStart) || ''}-${getDateTime2(remind.contactTimeEnd) || ''}`)
              }
              // return getRenderList(h, JSON.stringify(arr), true);
              return h('span',{domProps:{title: (remind.meetNotice || remind.remark) || ''}}, (remind.meetNotice || remind.remark) || '');
            }
          },
          {
            title: '本次沟通记录',
            align: 'center',
            // width: 360,
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
              // return getRenderList(h, JSON.stringify(arr), true);
              return h('span',{domProps:{title: (params.row.meetNotice || params.row.remark) || ''}}, (params.row.meetNotice || params.row.remark) || '');
            }
          },
          {
            title: '时间',
            width: 135,
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
