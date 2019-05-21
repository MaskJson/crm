<template>
  <Card>
    <ManagerView ref="manager" :del="false" :save="null" :columns="columns" :searchData="searchData">
      <Button type="success" @click="pass" >批量通过</Button>
      <Button type="error" @click="refuse" class="ml-10">批量拒绝</Button>
    </ManagerView>
  </Card>
</template>

<script>
  import {getUserId, getUserInfoByKey} from "../../../libs/tools";
  import {auditList, auditPass, auditRefuse} from "../../../api/customer";

  export default {
    name: "CustomerAudit",
    data() {
      return {
        columns: [
          {
            type: 'selection',
            width: 60,
            align: 'center'
          },
          {
            title: 'id',
            align: 'center',
            key: 'id'
          },
          {
            title: '公司名称',
            align: 'center',
            key: 'name'
          },
          {
            title: '创建人',
            align: 'center',
            key: 'createUser'
          },
          {
            title: '状态',
            align: 'center',
            render: (h, params) => {
              const type = params.row.auditType;
              if (type == 0) {
                return h('span', '待审核');
              } else if (type == 1) {
                return h('span', '已拒绝');
              }
            }
          },
          {
            title: '操作',
            align: 'center',
            render: (h, params) => {
              const type = params.row.auditType;
              const btn = [
                h('Button', {
                  props: {
                    type: 'success',
                    size: 'small'
                  },
                  on: {
                    click: () => {
                      this.$Modal.confirm({
                        title: '通过确认',
                        content: `确定通过公司-${params.row.name}的审核吗？`,
                        onOk: () => {
                          this.$refs['manager'].emitManagerHandler('pass', {
                            params: [params.row.id]
                          })
                        }
                      })
                    }
                  }
                }, '通过')
              ];
              if (type == 0) {
                btn.push(
                  h('Button', {
                    props: {
                      type: 'error',
                      size: 'small'
                    },
                    class: {
                      'ml-10': true
                    },
                    on: {
                      click: () => {
                        this.$Modal.confirm({
                          title: '拒绝确认',
                          content: `确定拒绝公司-${params.row.name}的审核吗？`,
                          onOk: () => {
                            this.$refs['manager'].emitManagerHandler('refuse', {
                              params: [params.row.id]
                            })
                          }
                        })
                      }
                    }
                  }, '拒绝')
                )
              }
              return h('div', btn);
            }
          }
        ],
        searchData: {
          userId: getUserId(),
          roleId: getUserInfoByKey('roleId')
        }
      }
    },
    methods: {
      pass() {
        this.$refs['manager'].emitManagerHandler('pass', {
          isBatch: true
        })
      },
      refuse() {
        this.$refs['manager'].emitManagerHandler('refuse', {
          isBatch: true
        })
      }
    },
    provide() {
      return {
        handlers: {
          search: auditList,
          pass: auditPass,
          refuse: auditRefuse
        }
      }
    }
  }
</script>

<style scoped>

</style>
