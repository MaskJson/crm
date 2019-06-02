<template>
  <div class="mt-10">
    <Table v-if="flag != 1" border :columns="columns" :data="list"></Table>
    <div v-if="flag == 1">{{list && list.length>0 ? (list[0].children && list[0].children.length>0 ? list[0].children[0].content : '' ) : ''}}</div>
  </div>
</template>

<script>
  import {getDateTime} from "../../../../libs/tools";

  export default {
    name: "Report",
    props: ['list', 'flag'],
    data() {
      return {
        columns: [
          {
            title: '用户昵称',
            align: 'center',
            key: 'nickName',
            width: 120
          },
          {
            title: '内容',
            align: 'center',
            render: (h, params) => {
              const report = params.row.children && params.row.children.length > 0 ? params.row.children[0].content : '未填写';
              return h('span', report);
            }
          },
          {
            title: '时间',
            align: 'center',
            render: (h, params) => {
              const time = params.row.children && params.row.children.length > 0 ? params.row.children[0].createTime : null;
              return h('span', getDateTime(time));
            },
            width: 150
          }
        ]
      }
    }
  }
</script>

<style scoped>

</style>
