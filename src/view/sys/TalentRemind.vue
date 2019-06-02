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
            width: 80,
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
            width: 80,
            render: (h, params) => {
              return h('span', (params.row.info || {}).position)
            }
          },
          {
            title: '公司',
            align: 'center',
            width: 100,
            render: (h, params) => {
              return h('span', (params.row.info || {}).customerName)
            }
          },
          {
            title: '沟通方式',
            align: 'center',
            width: 80,
            render: (h, params) => {
              const v = params.row.type;
              return h('span', v == 1 ? '电话沟通' : v == 2 ? '顾问面试内' : '顾问面试外');
            }
          },
          {
            title: '上次沟通记录',
            align: 'center',
            render: (h, params) => {
              const remind = params.row.prev || {};
              if (remind && remind.type){
                let str = '';
                switch (remind.type) {
                  case 1:
                    str = `${remind.remark}--${remind.createUser}`;
                    break;
                  case 2:
                    str = `${remind.situation}--${remind.cause}--${remind.salary}--${remind.createUser}`;
                    break;
                  case 3:
                    str = `${getDateTime(remind.meetTime)}--${remind.meetAddress}--${remind.situation}--${remind.cause}${remind.salary}--${remind.createUser}`;
                    break;
                }
                return h('span', str);
              } else {
                return h('span', '');
              }
            }
          },
          {
            title: '本次沟通记录',
            align: 'center',
            render: (h, params) => {
              const remind = params.row;
              if (remind && remind.type){
                let str = '';
                switch (remind.type) {
                  case 1:
                    str = `${remind.remark}--${remind.createUser}`;
                    break;
                  case 2:
                    str = `${remind.situation}--${remind.cause}--${remind.salary}--${remind.createUser}`;
                    break;
                  case 3:
                    str = `${getDateTime(remind.meetTime)}--${remind.meetAddress}--${remind.situation}--${remind.cause}${remind.salary}--${remind.createUser}`;
                    break;
                }
                return h('span', str);
              } else {
                return h('span', '');
              }
            }
          },
          {
            title: '时间',
            align: 'center',
            width: 135,
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
