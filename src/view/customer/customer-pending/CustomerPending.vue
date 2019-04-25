<template>
  <Card>
    <div>
      <SearchItem>
        <Select placeholder="请选择跟踪类型" v-model="searchData.type" class="w200" clearable>
          <Option :value="1">电话沟通</Option>
          <Option :value="2">拜访客户</Option>
          <Option :value="3">客户上门</Option>
        </Select>
      </SearchItem>
      <SearchItem>
        <Button @click="search" type="primary">查询</Button>
      </SearchItem>
    </div>
    <ManagerView class="talent-manager" ref="manager" :del="false" :save="null" :columns="columns" :searchData="searchData" @on-success="successHandler" @on-error="errorHandler">
      <Button type="primary" @click="finishRemind(1)">批量结束跟踪</Button>
    </ManagerView>
    <!--  添加跟踪  -->
    <ModalUtil ref="remind" title="添加客户跟踪" @reset="resetRemind" :loading="show" @on-ok="addRemind">
      <Form ref="addRemind" :model="remind" :rules="remindRule" :label-width="100" >
        <FormItem label="本次跟踪类别" prop="type">
          <Select v-model="remind.type" placeholder="请选择">
            <Option :value="1">电话</Option>
            <Option :value="2">拜访客户</Option>
            <Option :value="3">客户上门</Option>
          </Select>
        </FormItem>
        <FormItem label="沟通记录" class="ivu-form-item-required" v-if="remind.type == 1 || remind.type == 3">
          <Input type="textarea" placeholder="沟通了解情况" :rows="3" v-model="remind.remark"/>
        </FormItem>
        <FormItem label="拜访时间" class="ivu-form-item-required" v-if="remind.type == '2'">
          <DatePicker type="datetime" placeholder="拜访日期" v-model="remind.meetTime"></DatePicker>
        </FormItem>
        <FormItem label="拜访地点" class="ivu-form-item-required" v-if="remind.type == '2'">
          <Input v-model="remind.meetAddress"/>
        </FormItem>
        <FormItem label="拜访记录" class="ivu-form-item-required" v-if="remind.type == '2'">
          <Input type="textarea" :rows="3" v-model="remind.meetNotice"/>
        </FormItem>
        <FormItem label="状态" prop="status" class="ivu-form-item-required">
          <Select placeholder="请选择" v-model="remind.status">
            <Option v-for="(item, index) of typeFilter" :key="'type' + index" :value="item.value">{{ item.label }}</Option>
          </Select>
        </FormItem>
        <FormItem label="合同期：" v-if="remind.status == 5">
          <DateUtil :start="remind.contactTimeStart" :end="remind.contactTimeEnd" @change="timeChange"></DateUtil>
        </FormItem>
        <FormItem label="下次跟踪类别">
          <Select v-model="remind.nextType" placeholder="请选择">
            <Option :value="1">电话</Option>
            <Option :value="2">拜访客户</Option>
            <Option :value="3">客户上门</Option>
          </Select>
        </FormItem>
        <FormItem label="下次联系时间">
          <DatePicker type="datetime" placeholder="下次跟踪时间" v-model="remind.nextRemindTime"></DatePicker>
        </FormItem>
      </Form>
    </ModalUtil>
  </Card>
</template>

<script>
  import { getUserId, getDateTime, globalSearch, toggleShow,getCustomerType, getRenderList } from "../../../libs/tools";
  import { customerPendingList } from "../../../api/count";
  import { addRemind, finishRemind } from "../../../api/customer";
  import { customerTypes } from "../../../libs/constant";

  export default {
    name: "CustomerPending",
    data() {
      return {
        show: false,
        searchData: {
          userId: getUserId(),
          type: null
        },
        columns: [
          {
            type: 'selection',
            width: 60,
            align: 'center',
          },
          {
            title: '公司名称',
            align: 'center',
            key: 'name'
          },
          {
            title: '跟踪类型',
            align: 'center',
            render: (h, params) => {
              const v = params.row.type;
              return h('span', v == 1 ? '电话沟通' : v == 3 ? '客户上门' : '拜访客户');
            }
          },
          {
            title: '跟踪状态',
            align: 'center',
            render: (h, params) => {
              const type = params.row.status;
              return h('span',type == 0 ? '普通公司' : type == 6 ? '客户' : '拓展中' + `(${getCustomerType(h, type)})`);
            }
          },
          {
            title: '跟踪时间',
            align: 'center',
            render: (h, params) => {
              return h('span', getDateTime(params.row.createTime));
            }
          },
          {
            title: '跟踪内容',
            align: 'center',
            render: (h, params) => {
              switch (params.row.type) {
                case 1:
                case 3:
                  return h('span', `跟踪内容：${params.row.remark}`);break;
                case 2:
                  const data = [`见面时间：${getDateTime(params.row.meetTime)}`, `见面地点：${params.row.meetAddress}`, `见面内容：${params.row.meetNotice}`]
                  return getRenderList(h, JSON.stringify(data));
              }
            }
          },
          {
            title: '公司状态',
            align: 'center',
            key: 'type',
            render: (h, params) => {
              const type = params.row.customerType;
              return h('span',type == 0 ? '普通公司' : type == 6 ? '客户' : '拓展中' + `(${getCustomerType(h, type)})`);
            }
          },
          {
            title: '操作',
            align: 'center',
            width: 150,
            render: (h, params) => {
              const followUserId = params.row.followUserId;
              return h('div', [
                h('Button', {
                  class: {
                    'mr-5': true
                  },
                  props: {
                    type: 'primary',
                    size: 'small',
                    disabled: followUserId && followUserId != this.searchData.userId
                  },
                  on: {
                    click: () => {
                      this.customerType = params.row.customerType;
                      this.showRemindModal(params.row.customerId, params.row.id);
                    }
                  }
                }, '跟进'),
                h('Button', {
                  props: {
                    type: 'warning',
                    size: 'small'
                  },
                  on: {
                    click: () => {
                      this.finishId = params.row.id;
                      this.finishRemind(2);
                    }
                  }
                }, '结束跟进')
              ]);
            }
          }
        ],
        remind: {
          type: 1,
          customerId: null,
          status: null,
          remark: null,
          meetTime: null,
          meetAddress: null,
          meetNotice: null,
          nextType: null,
          nextRemindTime: null,
          followRemindId: null
          contactTimeStart: null,
          contactTimeEnd: null,
        },
        remindRule: {
          type: [
            { required: true, type: 'number', message: '请选择跟踪类别', trigger: 'blur' }
          ],
          status: [
            { required: true, type: 'number', message: '请选择客户状态', trigger: 'blur' }
          ]
        },
        finishId: null,
        customerType: null, // 跟进的客户类型
      }
    },
    computed: {
      typeFilter() {
        const type = this.customerType;
        if (!type) {
          return customerTypes.slice(0, 1);
        } else if (type == 6) {
          return [customerTypes[5]];
        } else {
          if (type == 1 || type == 2) {
            return customerTypes.slice(1, 3);
          } else if (type == 3) {
            return customerTypes.slice(2, 5);
          } else if (type == 4) {
            return customerTypes.slice(3, 5);
          }
        }
      }
    },
    methods: {
      timeChange(start, end) {
        this.remind.contactTimeStart = start;
        this.remind.contactTimeEnd = end;
      },
      finishRemind(flag) {
        this.$Modal.confirm({
          title: '结束跟进确认',
          content: '您确认要结束跟进选择的跟踪记录吗?',
          onOk: () => {
            this.$refs['manager'].emitManagerHandler('finish', {
              params: flag == 1 ? null : [this.finishId],
              isBatch: flag == 1
            })
          }
        })
      },
      // 重置跟踪
      resetRemind() {
        this.remind = {
          type: 1,
          status: null,
          remark: null,
          meetTime: null,
          meetAddress: null,
          meetNotice: null,
          nextType: null,
          nextRemindTime: null,
        };
      },
      showRemindModal(customerId, id) {
        this.remind.customerId = customerId;
        this.remind.followRemindId = id;
        toggleShow(this, 'remind');
      },
      addRemind() {
        this.$refs['addRemind'].validate(valid => {
          if (valid) {
            const remind = {...this.remind};
            if ((remind.type == 1 || remind.type == 3) && !remind.remark) {
              this.$Message.warning('电话沟通和面谈必须填写沟通记录');
              return false;
            }
            if (remind.type == 2 && (!remind.meetTime || !remind.meetAddress || !remind.meetNotice)) {
              this.$Message.warning('拜访客户必须填拜访信息');
              return false;
            }
            if ((remind.nextRemindTime || remind.nextType) && (!remind.nextRemindTime || !remind.nextType)) {
              this.$Message.warning('设置下次跟踪，类别和时间需填写完整');
              return false;
            }
            if (remind.status == 6 && (!remind.contactTimeStart || !remind.contactTimeEnd)) {
              this.$Message.warning('签约状态下，请选择合同时间');
              return false;
            }
            remind.createUserId = getUserId();
            this.show = true;
            this.$refs['manager'].emitManagerHandler('addRemind', {
              params: remind
            });
          }
        });
      },
      search() {
        globalSearch(this);
      },
      successHandler() {
        this.show = false;
        toggleShow(this, 'remind', false);
      },
      errorHandler() {
        this.show = false;
      }
    },
    provide() {
      return {
        handlers: {
          search: customerPendingList,
          finish: finishRemind,
          addRemind: addRemind
        }
      }
    },
    created() {
      const {type} = this.$route.query;
      if (!!type) {
        this.searchData.type = Number(type);
      }
    },
  }
</script>

<style scoped>

</style>
