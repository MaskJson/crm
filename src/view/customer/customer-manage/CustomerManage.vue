<template>
  <Card>
    <div>
      <SearchItem>
        <InputNumber placeholder="客户id" class="w200" :min="1" :parser="value = value => (value ? Math.floor(value) : value).toString()" v-model="searchData.id"/>
      </SearchItem>
      <SearchItem>
        <Input placeholder="客户名称" class="w200" v-model="searchData.name"/>
      </SearchItem>
      <SearchItem>
        <Input placeholder="行业" class="w200" v-model="searchData.industry"/>
      </SearchItem>
      <SearchItem>
        <Select placeholder="收藏夹" class="w200" v-model="searchData.folderId">
          <Option v-for="(item, index) of folders" :value="item.id" :key="index">{{`${item.name}(${item.remark})`}}</Option>
        </Select>
      </SearchItem>
      <SearchItem>
        <Cascader placeholder="请选择城市" v-model="searchData.city" :data="cityList" class="w200"></Cascader>
      </SearchItem>
      <SearchItem>
        关注状态：
        <RadioGroup v-model="searchData.follow">
          <Radio :label="0">全部</Radio>
          <Radio :label="1">已关注</Radio>
          <Radio :label="2">未关注</Radio>
        </RadioGroup>
      </SearchItem>
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
    <Drawer :width="360" title="客户收藏夹管理" :closable="false" v-model="showFavoriteSetting">
      <favorite-setting ref="favorite" @on-change="setFolders" :type="1"/>
    </Drawer>
  </Card>
</template>

<script>
  import { jsonArray, getCity, globalSearch, getUserId, getCustomerType } from "../../../libs/tools";
  import { list, toggleFollow, toggleBindFollowUser } from "../../../api/customer";
  import cityList from '../../../libs/cityList';
  import FavoriteSetting from '../../components/favorite-setting';

  export default {
    name: "CustomerManage",
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
        }
      },
    },
    data() {
      return {
        showFavoriteSetting: false,
        cityList: cityList,
        folders: [],
        searchData: {
          id: null,
          name: null,
          folderId: null,
          industry: null,
          city: [],
          follow: 0
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
            width: 240,
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
              if (!followUserId || followUserId == userId) {
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
                  h('Button', {
                    class: {
                      'mr-5': true
                    },
                    props: {
                      type: 'warning',
                      size: 'small'
                    },
                    on: {
                      click: () => {
                        this.$refs['manager'].emitManagerHandler('toggle', {
                          params: {
                            id: params.row.id,
                            follow: !params.row.follow
                          }
                        });
                      }
                    }
                  }, params.row.follow ? '取消关注' : '关注'))
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
              if (!!followUserId && followUserId == userId) {
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
                  }, '列名')
                )
              }
              return h('div', btn)
            }
          }
        ]
      }
    },
    methods: {
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
      }
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
