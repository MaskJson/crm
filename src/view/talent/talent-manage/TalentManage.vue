<template>
  <Card>
    <div>
      <SearchItem>
        <Cascader placeholder="城市" v-model="searchData.city" :data="cityList" class="w200"></Cascader>
      </SearchItem>
      <SearchItem>
        <Input placeholder="姓名" class="w200" v-model="searchData.name"/>
      </SearchItem>
      <SearchItem>
        <Input placeholder="行业" class="w200" v-model="searchData.industry"/>
      </SearchItem>
      <SearchItem>
        <Input placeholder="职能" class="w200" v-model="searchData.aptness"/>
      </SearchItem>
      <SearchItem>
        <Select placeholder="收藏夹" class="w200" v-model="searchData.folderId">
          <Option v-for="(item, index) of folders" :value="item.id" :key="index">{{`${item.name}(${item.remark})`}}</Option>
        </Select>
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
    <ManagerView class="talent-manager" ref="manager" :del="false" :save="{save: true}" route="/talent/talent-edit" :columns="columns" :searchData="searchParams"/>
    <Drawer :width="360" title="人才收藏夹管理" :closable="false" v-model="showFavoriteSetting">
      <favorite-setting :type="2" @on-change="setFolders"/>
    </Drawer>
  </Card>
</template>

<script>
  import { jsonArray, getCity, globalSearch, getStatusRender, getUserId } from "../../../libs/tools";
  import { list, toggleFollow, toggleType } from "../../../api/talent";
  import cityList from '../../../libs/cityList';
  import FavoriteSetting from '../../components/favorite-setting';
  import talentLogo from '@/assets/images/talent.png'

  export default {
    name: "TalentManage",
    components: {
      FavoriteSetting
    },
    computed: {
      searchParams() {
        const { name, industry, aptness, folderId, city, follow } = this.searchData;
        return {
          aptness,
          name,
          industry,
          folderId,
          city: city.length ? JSON.stringify(city) : null,
          follow: follow == 0 ? null : follow == 1
        }
      },
    },
    data() {
      return {
        userId: null,
        showFavoriteSetting: false,
        cityList: cityList,
        folders: [],
        searchData: {
          aptness: null,
          name: null,
          folderId: null,
          industry: null,
          city: [],
          follow: 0
        },
        columns: [
          {
            type: 'selection',
            width: 60,
            align: 'center'
          },
          {
            title: '姓名',
            key: 'name',
            align: 'center',
            render: (h, params) => {
              return h('div', {
                class: {
                  talent: params.row.followUserId
                }
              }, params.row.name)
            }
          },
          {
            title: '职能',
            align: 'center',
            key: 'aptness',
            render: (h, params) => {
              const aptness = jsonArray(params.row.aptness);
              return h('span', aptness ? aptness.join('、'): '--')
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
            title: '城市',
            align: 'center',
            key: 'city',
            render: (h, params) => {
              return getCity(h, params.row.city);
            }
          },
          {
            title: '年薪',
            align: 'center',
            key: 'salary'
          },
          {
            title: '手机号',
            align: 'center',
            key: 'phone'
          },
          {
            title: '标签',
            align: 'center',
            key: 'tag'
          },
          {
            title: '状态',
            align: 'center',
            render: (h, params) => {
              return getStatusRender(h, params.row.status);
            }
          },
          {
            title: '操作',
            align: 'center',
            width: 300,
            render: (h, params) => {
              const { followUserId } = params.row;
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
                      this.$router.push({ path: '/talent/talent-detail', query: {id: params.row.id}});
                    }
                  }
                }, '查看详情'),
              ];
              if (!followUserId || followUserId == this.userId) {
                btn.push(
                  h('Button', {
                    class: {
                      'mr-5': true
                    },
                    props: {
                      type: 'primary',
                      size: 'small'
                    },
                    on: {
                      click: () => {
                        this.$router.push({ path: '/talent/talent-edit', query: {id: params.row.id}});
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
                  }, params.row.follow ? '取消关注' : '关注'),
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
                        this.$refs['manager'].emitManagerHandler('toggleType', {
                          params: {
                            id: params.row.id,
                            userId: this.userId,
                            flag: true
                          }
                        });
                      }
                    }
                  }, '设为专属')
                )
              }
              if (followUserId == this.userId) {
                btn.push(
                  h('Button', {
                    props: {
                      type: 'warning',
                      size: 'small'
                    },
                    on: {
                      click: () => {
                        this.$refs['manager'].emitManagerHandler('toggleType', {
                          params: {
                            id: params.row.id,
                            userId: this.userId,
                            flag: false
                          }
                        });
                      }
                    }
                  }, '取消专属')
                )
              }
              return h('div', btn);
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
          aptness: null,
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
          toggleType: toggleType
        }
      }
    },
    created() {
      this.userId = getUserId();
    }
  }
</script>

<style scoped>

</style>
