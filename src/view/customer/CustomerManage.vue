<template>
  <Card>
    <div>
      <SearchItem>
        <InputNumber clearable placeholder="客户id" class="w200" :min="1" :parser="value = value => (value ? Math.floor(value) : value).toString()" v-model="searchData.id"/>
      </SearchItem>
      <SearchItem>
        <Input placeholder="客户名称" class="w200" v-model="searchData.name" clearable/>
      </SearchItem>
      <SearchItem>
        <Input placeholder="行业" class="w200" v-model="searchData.industry" clearable/>
      </SearchItem>
      <SearchItem>
        <Select placeholder="收藏夹" class="w200" v-model="searchData.folderId" clearable>
          <Option v-for="(item, index) of folders" :value="item.id" :key="index">{{`${item.name}(${item.remark})`}}</Option>
        </Select>
      </SearchItem>
      <SearchItem>
        <Cascader clearable placeholder="请选择城市" v-model="searchData.city" :data="cityList" class="w200"></Cascader>
      </SearchItem>
      <!--<SearchItem>-->
        <!--关注状态：-->
        <!--<RadioGroup v-model="searchData.follow">-->
          <!--<Radio :label="0">全部</Radio>-->
          <!--<Radio :label="1">已关注</Radio>-->
          <!--<Radio :label="2">未关注</Radio>-->
        <!--</RadioGroup>-->
      <!--</SearchItem>-->
      <SearchItem>
        <Button type="primary" @click="search">查询</Button>
      </SearchItem>
      <SearchItem>
        <Button type="primary" @click="resetSearch">重置查询条件</Button>
      </SearchItem>
      <SearchItem>
        <Button type="primary" @click="showFavoriteSetting = true">客户收藏夹管理</Button>
      </SearchItem>
    </div>
    <ManagerView ref="manager" :del="false" :save="{save: true}" route="/customer/customer-edit" :columns="columns" :searchData="searchParams"/>
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
        <FormItem label="联系人：" prop="contactId">
          <Select v-model="remind.contactId" placeholder="选择联系人">
            <Option v-for="(item, index) of contacts" :key="'contact' + index" :value="item.id">{{item.name}}</Option>
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
    <Drawer :width="360" title="客户收藏夹管理" :closable="false" v-model="showFavoriteSetting">
      <favorite-setting ref="favorite" @on-change="setFolders" :type="1"/>
    </Drawer>
    <SpinUtil :show="show"/>
  </Card>
</template>

<script>
  import { jsonArray, getCity, globalSearch, getUserId, getCustomerType, getUserInfoByKey, toggleShow } from "../../libs/tools";
  import { list, toggleFollow, toggleBindFollowUser, addRemind, getCustomerContact } from "../../api/customer";
  import cityList from '../../libs/cityList';
  import FavoriteSetting from '../components/favorite-setting';
  import { customerTypes } from "../../libs/constant";

  export default {
    name: "CustomerManage",
    props: {
      userId: {
        type: Number,
        default: null
      },
      searchType: {
        type: Number,
        default: null
      }
    },
    components: {
      FavoriteSetting
    },
    computed: {
      searchParams() {
        const { id, name, industry, folderId, city, follow } = this.searchData;
        return {
          id,
          name,
          industry,
          folderId,
          city: JSON.stringify(city),
          follow: follow == 0 ? null : follow == 1,
          type: this.searchType,
          userId: this.userId,
          roleId: getUserInfoByKey('roleId')
        }
      },
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
      },
    },
    data() {
      return {
        customerTypes: customerTypes,
        show: false,
        showFavoriteSetting: false,
        cityList: cityList,
        folders: [],
        customerType: null,
        customerId: null,
        remindIndex: null,
        searchData: {
          id: null,
          name: null,
          folderId: null,
          industry: null,
          city: [],
          follow: 0,
          type: null,
        },
        remind: {
          type: 1,
          contactId: null,
          status: null,
          remark: null,
          meetTime: null,
          meetAddress: null,
          meetNotice: null,
          nextType: null,
          nextRemindTime: null,
          contactTimeStart: null,
          contactTimeEnd: null,
        },
        contacts: [],
        remindRule: {
          type: [
            { required: true, type: 'number', message: '请选择跟踪类别', trigger: 'blur' }
          ],
          status: [
            { required: true, type: 'number', message: '请选择客户状态', trigger: 'blur' }
          ],
          contactId: [
            { required: true, type: 'number', message: '请选择联系人', trigger: 'change' }
          ]
        },
        columns: [
          {
            title: '公司名称',
            align: 'center',
            key: 'name'
          },
          {
            title: '城市',
            align: 'center',
            key: 'city',
            render: (h, params) => {
              return getCity(h, params.row.city);
            }
          },
          {
            title: '行业',
            align: 'center',
            key: 'industry',
            render: (h, params) => {
              const industry = jsonArray(params.row.industry);
              return h('span', industry ? industry.join('、'): '--')
            }
          },
          {
            title: '类型',
            align: 'center',
            key: 'type',
            render: (h, params) => {
              const type = params.row.type;
              return h('span', type == 0 ? '普通公司' : type == 6 ? '客户' : '拓展中')
            }
          },
          {
            title: '关联项目',
            align: 'center',
            key: 'projectCount'
          },
          {
            title: '操作',
            align: 'center',
            width: 320,
            render: (h, params) => {
              const userId = getUserId();
              const {followUserId, type} = params.row;
              const btn = [
                h('Button', {
                  class: {
                    'mr-5': true
                  },
                  props: {
                    size: 'small'
                  },
                  on: {
                    click: () => {
                      this.$router.push({ path: '/customer/customer-detail', query: {id: params.row.id}});
                    }
                  }
                }, '查看详情'),
              ];
              if (!followUserId || followUserId == userId || getUserInfoByKey('roleId' == 3)) {
                btn.push(h('Button', {
                    class: {
                      'mr-5': true
                    },
                    props: {
                      type: 'primary',
                      size: 'small'
                    },
                    on: {
                      click: () => {
                        this.$router.push({ path: '/customer/customer-edit', query: {id: params.row.id}});
                      }
                    }
                  }, '编辑'),
                  // h('Button', {
                  //   class: {
                  //     'mr-5': true
                  //   },
                  //   props: {
                  //     type: 'warning',
                  //     size: 'small'
                  //   },
                  //   on: {
                  //     click: () => {
                  //       this.$refs['manager'].emitManagerHandler('toggle', {
                  //         params: {
                  //           id: params.row.id,
                  //           follow: !params.row.follow
                  //         }
                  //       });
                  //     }
                  //   }
                  // }, params.row.follow ? '取消关注' : '关注')
                )
              }
              if (!followUserId) {
                btn.push(
                  h('Button', {
                    props: {
                      type: 'warning',
                      size: 'small'
                    },
                    on: {
                      click: () => {
                        this.$refs['manager'].emitManagerHandler('toggleBind', {
                          params: {
                            customerId: params.row.id,
                            userId: userId,
                            status: true
                          }
                        });
                      }
                    }
                  }, '列名')
                )
              }
              if (!!followUserId && followUserId == userId && params.row.type != 6) {
                btn.push(
                  h('Button', {
                    props: {
                      type: 'warning',
                      size: 'small'
                    },
                    on: {
                      click: () => {
                        this.$refs['manager'].emitManagerHandler('toggleBind', {
                          params: {
                            customerId: params.row.id,
                            userId: userId,
                            status: false
                          }
                        });
                      }
                    }
                  }, '取消列名')
                )
              }
              if (!followUserId || followUserId == userId) {
                btn.push(
                  h('Button', {
                    props: {
                      type: 'primary',
                      size: 'small'
                    },
                    class: {
                      'ml-5': true
                    },
                    on: {
                      click: () => {
                        getCustomerContact({id: params.row.id}).then(data => {
                          this.show = false;
                          this.contacts = data || [];
                          if (this.contacts.length == 0) {
                            this.$Message.error('暂无联系人，请前往详情页添加');
                            return false;
                          }
                          this.remindIndex = params.row._index;
                          this.customerId = params.row.id;
                          this.customerType = params.row.type;
                          toggleShow(this, 'remind');
                        }).catch(data => {this.show = false;})
                      }
                    }
                  }, '添加跟踪')
                )
              }
              return h('div', btn)
            }
          }
        ]
      }
    },
    methods: {
      timeChange(start, end) {
        this.remind.contactTimeStart = start;
        this.remind.contactTimeEnd = end;
      },
      setFolders(list) {
        this.folders = list;
      },
      resetSearch() {
        this.searchData = {
          id: null,
          name: null,
          folderId: null,
          industry: null,
          city: [],
          follow: 0
        }
      },
      search() {
        globalSearch(this);
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
          contactId: null,
          contactTime: null,
        };
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
            if (remind.status == 5 && (!remind.contactTimeStart || !remind.contactTimeEnd)) {
              this.$Message.warning('签约状态下，请选择合同时间');
              return false;
            }
            remind.createUserId = getUserId();
            remind.customerId = this.customerId;
            this.show = true;
            addRemind(remind).then(data => {
              this.show = false;
              toggleShow(this, 'remind', false);
              this.$refs['manager'].list[this.remindIndex].type = remind.status;
            }).catch(data => {this.show = false;})
          }
        });
      },
    },
    created() {
      this.columns.splice(5, 0, {
        // title: !this.type ? '负责人' : this.type == 6 ? '签约人' : '列名人',
        title: '顾问',
        align: 'center',
        render: (h, params) => {
          const user = params.row.user || {};
          return h('span', user.nickName);
        }
      })
    },
    provide() {
      return {
        handlers: {
          search: list,
          toggle: toggleFollow,
          toggleBind: toggleBindFollowUser
        }
      }
    }
  }
</script>

<style scoped>

</style>
