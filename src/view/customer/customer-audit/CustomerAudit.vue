<template>
  <Card>
    <ManagerView ref="manager" :del="false" :save="null" :columns="columns" :searchData="searchData">
      <Button type="success" @click="pass" >批量通过</Button>
      <!--<Button type="error" @click="refuse" class="ml-10">批量拒绝</Button>-->
    </ManagerView>
    <ModalUtil ref="modal" title="修改客户名称" @on-ok="changeName" :loading="loading" @reset="entity.replaceId = null">
      <div class="pd-10 relative">
        <Input v-model="entity.name" @on-focus="show = true" @input="checkName" class="zzz"/>
        <!--<p class="cl-error" v-if="had">该项目名已存在</p>-->
        <div class="bgfff borderB nameList" v-show="show">
          <li class="border bgfff company-item" v-if="customers && customers.length == 0">暂无数据</li>
          <li class="border bgfff company-item cursor line" :title="c.name" v-for="(c, index) of customers" :key="'customer' + index" @click="setEntity(c)">
            {{c.name}}
          </li>
        </div>
      </div>
    </ModalUtil>
  </Card>
</template>

<script>
  import {getUserId, getUserInfoByKey, toggleShow} from "../../../libs/tools";
  import {auditList, auditPass, auditRefuse, changeCustomerName, checkCustomerName} from "../../../api/customer";

  export default {
    name: "CustomerAudit",
    data() {
      return {
        had: false,
        loading: false,
        show: false,
        customers: [],
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
              // if (type == 0) {
              //   btn.push(
              //     h('Button', {
              //       props: {
              //         type: 'error',
              //         size: 'small'
              //       },
              //       class: {
              //         'ml-10': true
              //       },
              //       on: {
              //         click: () => {
              //           this.$Modal.confirm({
              //             title: '拒绝确认',
              //             content: `确定拒绝公司-${params.row.name}的审核吗？`,
              //             onOk: () => {
              //               this.$refs['manager'].emitManagerHandler('refuse', {
              //                 params: [params.row.id]
              //               })
              //             }
              //           })
              //         }
              //       }
              //     }, '拒绝')
              //   )
              // }
              btn.push(
                h('Button', {
                  props: {
                    type: 'primary',
                    size: 'small'
                  },
                  class: {
                    'ml-10': true
                  },
                  on: {
                    click: () => {
                      Object.assign(this.entity, params.row);
                      toggleShow(this, 'modal');
                    }
                  }
                }, '修改名称')
              );
              return h('div', btn);
            }
          }
        ],
        searchData: {
          userId: getUserId(),
          roleId: getUserInfoByKey('roleId')
        },
        entity: {
          id: null,
          name: null,
          replaceId: null
        },
        timeout: null
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
      },
      setEntity(customer) {
        this.entity.name = customer.name;
        this.entity.replaceId = customer.id;
      },
      checkName() {
        this.entity.replaceId = null;
        if (!this.entity.name) {
          return ;
        }
        !!this.timeout && clearTimeout(this.timeout);
        if (this.entity.name) {
          this.timeout = setTimeout(() => {
            checkCustomerName(this.entity).then(data => {
              data = data || [];
              this.customers = data;
            }).catch(data => {})
          }, 500);
        }
      },
      changeName() {
        if (!this.entity.name) {
          this.$Message.warning('请填写客户名称');
          return false;
        }
        this.loading = true;
        changeCustomerName(this.entity).then(data => {
          this.loading = false;
          toggleShow(this, 'modal', false);
          this.$refs['manager'].emitManagerHandler(3, {
            unFresh: true
          })
        }).catch(data => {
          this.loading = false;
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
    },
    mounted() {
      document.addEventListener('click', (event) => {
        const e = event || window.event;
        if (e.srcElement.parentElement.className.indexOf('zzz') < 0) {
          setTimeout(() => {
            this.show = false;
          }, 100);
        }
      });
    },
  }
</script>

<style scoped>
  .nameList {
    position: absolute;
    left: 10px;
    top: 42px;
    width: 300px;
    max-height: 300px;
    border-radius: 4px;
    overflow-x: hidden;
    overflow-y: auto;
    z-index: 10;
    border: solid 1px #9ea7b4 !important;
  }
  .company-item {
    list-style: none;
    border-bottom: none;
    padding: 3px 6px;
    font-size: 12px;
  }
  .company-item:hover {
    background: #f2f2f2;
  }
</style>
