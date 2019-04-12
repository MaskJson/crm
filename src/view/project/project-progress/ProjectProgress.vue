<template>
  <Card>
    <Tabs :animated="false">
      <TabPane label="人才推荐审核" name="0">
        <ManagerView class="talent-manager" ref="manager" :del="false" :save="null" :columns="columns" :searchData="searchData"/>
      </TabPane>
      <TabPane label="项目诊断报告" name="1">
        <ManagerView ref="report" search="getReports" :del="false" :save="null" :columns="reportColumns" :searchData="searchData"></ManagerView>
      </TabPane>
    </Tabs>
  </Card>
</template>

<script>
  import { getDateTime, getUserId, getStatusRender } from "../../../libs/tools";
  import { getReports, getRecommends} from "../../../api/count";
  import { reviewTalent } from "../../../api/project";

  export default {
    name: "ProjectProgress",
    data() {
      return {
        searchData: {
          userId: getUserId(),
        },
        columns: [
          {
            title: '项目名称',
            key: 'projectName',
            align: 'center',
            render: (h, params) => {
              return h('Button', {
                props: {
                  type: 'text',
                  size: 'small'
                },
                class: {
                  'cl-primary': true
                },
                on: {
                  click: () => {
                    this.$router.push({ path: '/project/project-detail', query: {id: params.row.projectId}});
                  }
                }
              }, params.row.projectName);
            }
          },
          {
            title: '人才名称',
            key: 'talentName',
            align: 'center',
            render: (h, params) => {
              return h('Button', {
                props: {
                  type: 'text',
                  size: 'small'
                },
                class: {
                  'cl-primary': true,
                  talent: !!params.row.followUserId
                },
                on: {
                  click: () => {
                    this.$router.push({ path: '/talent/talent-detail', query: {id: params.row.talentId}});
                  }
                }
              }, params.row.talentName);
            }
          },
          {
            title: '人才状态',
            key: 'talentStatus',
            align: 'center',
            render: (h, params) => {
              return getStatusRender(h, params.row.talentStatus);
            }
          },
          {
            title: '推荐人',
            key: 'createUser',
            align: 'center'
          },
          {
            title: '推荐时间',
            key: 'createTime',
            align: 'center',
            render: (h, params) => {
              return h('span', getDateTime(params.row.createTime))
            }
          },
          {
            title: '操作',
            align: 'center',
            render: (h, params) => {
              return h('div', [
                h('Button', {
                  props: {
                    type: 'success',
                    size: 'small'
                  },
                  class: {
                    'cr-5': true
                  },
                  on: {
                    click: () => {
                      this.$Modal.confirm({
                        title: '确认推荐',
                        content: `您确认推荐人才-${params.row.talentName}吗?`,
                        onOk: () => {
                          this.review(params.row.projectTalentId, params.row.id, true);
                        }
                      })
                    }
                  }
                }, '通过'),
                h('Button', {
                  props: {
                    type: 'error',
                    size: 'small'
                  },
                  class: {
                    'ml-5': true
                  },
                  on: {
                    click: () => {
                      this.$Modal.confirm({
                        title: '确认拒绝',
                        content: `您确认拒绝并淘汰人才-${params.row.talentName}吗?`,
                        onOk: () => {
                          this.review(params.row.projectTalentId, params.row.id, false);
                        }
                      })
                    }
                  }
                }, '拒绝（淘汰）'),
              ]);
            }
          },
        ],
        reportColumns: [
          {
            title: '项目名称',
            key: 'projectName',
            align: 'center',
            render: (h, params) => {
              return h('Button', {
                props: {
                  type: 'text',
                  size: 'small'
                },
                class: {
                  'cl-primary': true
                },
                on: {
                  click: () => {
                    this.$router.push({ path: '/project/project-detail', query: {id: params.row.projectId}});
                  }
                }
              }, params.row.projectName);
            }
          },
          {
            title: '创建者',
            key: 'createUser',
            align: 'center'
          },
          {
            title: '角色',
            key: 'roleName',
            align: 'center'
          },
          {
            title: '人才总数',
            key: 'allCount',
            align: 'center'
          },
          {
            title: '推荐人数',
            key: 'recommendCount',
            align: 'center'
          },
          {
            title: '面试人数',
            key: 'interviewCount',
            align: 'center'
          },
          {
            title: 'offer人数',
            key: 'offerCount',
            align: 'center'
          },
          {
            title: '入职人数',
            key: 'workingCount',
            align: 'center'
          },
          {
            title: '保证期人数',
            key: 'qualityCount',
            align: 'center'
          },
          {
            title: '通过保证期人数',
            key: 'qualityPassCount',
            align: 'center'
          },
        ]
      }
    },
    methods: {
      review(projectTalentId, projectRemindId, flag) {
        this.$refs['manager'].emitManagerHandler('review', {
          params: {
            projectTalentId,
            projectRemindId,
            flag,
            userId: getUserId()
          },
        })
      }
    },
    provide() {
      return {
        handlers: {
          search: getRecommends,
          review: reviewTalent,
          getReports: getReports
        }
      }
    }
  }
</script>

<style scoped>

</style>
