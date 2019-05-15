<template>
  <div class="mt-10">
    <Table border :columns="columns" :data="list"></Table>
  </div>
</template>

<script>
  import {getDateTime, getRenderList} from "../../libs/tools";

  export default {
    name: "TalentRemind",
    props: ['list'],
    data() {
      return {
        columns: [
          {
            title: '人选',
            key: 'talentName',
            align: 'center',
            render: (h, params) => {
              const name = params.row.name || params.row.talentName;
              return h('div', {
              }, [
                h('Button', {
                  props: {
                    type: 'text',
                    size: 'small'
                  },
                  class: {
                    'cl-primary': true,
                  },
                  on: {
                    click: () => {
                      this.$router.push('/talent/talent-detail?id=' + params.row.talentId);
                    }
                  }
                }, name)
              ]);
            }
          },
          {
            title: '岗位',
            align: 'center',
            render: (h, params) => {
              return h('span', (params.row.info || {}).position)
            }
          },
          {
            title: '公司',
            align: 'center',
            render: (h, params) => {
              return h('span', (params.row.info || {}).customerName)
            }
          },
          {
            title: '沟通方式',
            align: 'center',
            render: (h, params) => {
              const v = params.row.type;
              return h('span', v == 1 ? '电话沟通' : v == 2 ? '顾问面试内' : '顾问面试外');
            }
          },
          {
            title: '沟通记录',
            align: 'center',
            render: (h, params) => {
              const remind = params.row;
              if (remind && remind.type){
                let arr = [];
                switch (remind.type) {
                  case 1:
                    arr = [ `跟踪记录：${remind.remark}`];
                    break;
                  case 2:
                    arr = [ `人才基本情况：${remind.situation}`, `离职原因：${remind.cause}`, `薪资架构：${remind.salary}`];
                    break;
                  case 3:
                    arr = [ `面试时间：${getDateTime(remind.meetTime)}`, `面试地点：${remind.meetAddress}`, `人才基本情况：${remind.situation}`, `离职原因：${remind.cause}`, `薪资架构：${remind.salary}`];
                    break;
                }
                return getRenderList(h, JSON.stringify(arr));
              } else {
                return h('span', '');
              }
            }
          },
          {
            title: '时间',
            align: 'center',
            render: (h, params) => {
              return h('span', getDateTime(params.row.createTime))
            }
          },
        ],
      }
    }
  }
</script>

<style scoped>

</style>
