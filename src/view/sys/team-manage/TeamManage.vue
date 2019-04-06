<template>
  <Card>
    <div>
      <SearchItem>
        <Input v-model="searchParams.name" :clearable="true" class="w200"/>
      </SearchItem>
      <SearchItem>
        <Button type="primary" @click="search">搜索</Button>
      </SearchItem>
    </div>
    <ManagerView ref="manager" :del="false" :save="null" :searchData="searchParams" :columns="columns" @on-success="successHandler"/>
  </Card>
</template>

<script>
  import { globalSearch, toggleShow } from "../../../libs/tools";
  import { getTeamList, getTeamManagerUsers, getTeamMembers, save } from "../../../api/team";

  export default {
    name: "TeamManage",
    data() {
      return {
        searchParams: {
          name: ''
        },
        // 所需用户数据列表
        pmList: [], // 项目经理
        iplList: [], // 高级顾问
        mplList: [], // 中级顾问
        ptList: [], // 兼职
        // 编辑提交使用列表
        pms: [],
        iPls: [],
        mPls: [],
        pts: [],
        entity: {
          id: null, // teamId,
          userId: null // userId
        },
        columns: [
          {
            title: '用户ID',
            align: 'center',
            key: 'id'
          },
          {
            title: '团队总监',
            align: 'center',
            key: 'nickName'
          },
          {
            title: '团队人数',
            align: 'center',
            render: (h, params) => {
              const count = params.row.count;
              return h('span', count ? count : '暂无团队');
            }
          },
          {
            title: '操作',
            align: 'center',
            render: (h, params) => {
              if (params.row.teamId) {
                return h('div', [
                  h('Button', {
                    props: {
                      size: 'small'
                    },
                    class: {
                      'mr-5': true
                    },
                    on: {
                      click: () => {

                      }
                    }
                  }, '查看团队详情'),
                  h('Button', {
                    props: {
                      size: 'small',
                      type: 'primary'
                    },
                    on: {
                      click: () => {

                      }
                    }
                  }, '查看团队详情'),
                ])
              } else {
                return h('Button', {
                  props: {
                    type: 'primary',
                    size: 'small'
                  },
                  on: {
                    click: () => {

                    }
                  }
                }, '创建团队');
              }
            }
          }
        ]
      }
    },
    methods: {
      search() {
        globalSearch(this);
      },
      successHandler(type, data) {
        if (type == 'getInfo') {

        }
      }
    },
    provide() {
      return {
        handlers: {
          search: getTeamList,
          getInfo: getTeamMembers,
          users: getTeamManagerUsers,
          save: save
        }
      }
    }
  }
</script>

<style scoped>

</style>
