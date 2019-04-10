<template>
  <div>
    <div class="mt10">
      <Button v-if="del" class="mr10" type="error" icon="md-trash" @click="removeSelected">批量删除</Button>
      <Button v-if="save && save.save" type="primary" icon="md-add" class="mr10" @click="saveEmit">添加</Button>
      <slot></slot>
    </div>
    <Table ref="table" class="mt10" border :data="list" :columns="columns"  @on-selection-change="selectChange" @on-sort-change="sortChange"></Table>
    <div class="t-right mt20" v-if="!unPage">
      <Page :current="page.current" :total="page.total" :page-size="page.pageSize"
            @on-change="pageChange" @on-page-size-change="pageSizeChange" :page-size-opts="[10,20,50]"
            size="small" show-total show-elevator show-sizer></Page>
    </div>
    <Spin fix v-if="showSpin">
      <Icon type="ios-loading" size=18 class="spin-icon-load"></Icon>
      <div>Loading</div>
    </Spin>
  </div>
</template>

<script>
  export default {
    name: "ManagerView",
    props: {
      // 是否有删除操作
      del: {
        type: Boolean,
        default: true
      },
      // 是否有添加操作
      save: {
        type: Object,
        default() {
          return {
            save: true,
            modal: true
          }
        }
      },
      // 表格列
      columns: {
        type: Array,
        default() {
          return []
        }
      },
      // 不需要分页
      unPage: {
        type: Boolean,
        default: false
      },
      // query params
      searchData: {
        type: Object,
        default() {
          return {}
        }
      },
      // pageSize 默认为10条
      pageSize: {
        type: Number,
        default: 10
      },
      // 添加操作跳转页面时的路由
      route: {
        type: String,
        default: ''
      },
      // 是否初始化搜索
      init: {
        type: Boolean,
        default: true
      },
      // 单页多表格，指定search
      search: {
        type: String,
        default: null
      }
    },
    data() {
      return {
        showSpin: false,
        page: {
          current: 1,
          total: 0,
          pageSize: 10
        },
        list: [],
        selected: []
      }
    },
    methods: {
      // 添加按钮操作
      saveEmit() {
        if (this.save.modal) {
          this.$emit('on-save');
        } else {
          // this.handlers.saveHandler();
          this.$router.push(this.route);
        }
      },
      // 页码改变刷新数据
      pageChange(current) {
        this.page.current = current;
        this.emitManagerHandler(3, {
          unFresh: true
        })
      },
      // 每页显示数改变刷新数据
      pageSizeChange(size) {
        this.page.pageSize = size;
        this.emitManagerHandler(3, {
          unFresh: true
        })
      },
      // table批量选择
      selectChange(val) {
        this.selected = val;
      },
      // 删除
      removeSelected() {
        if (this.selected.length) {
          this.emitManagerHandler(2, {});
        } else {
          this.$Message.warning('请选择删除项');
        }
      },
      // 批量删除ids
      removeChecked() {
        return this.selected.map(item => {
          return item.id;
        })
      },
      // 获取查询条件
      getSearchData() {
        const params = Object.assign({}, this.searchData);
        if (!this.unPage) {
          params.page = this.page.current - 1;
          params.size = this.page.pageSize;
        }
        return params;
      },
      // 导出数据
      exportTable() {
        this.$emit('export', this.$refs['table'], this.list);
      },
      // 最终执行managerHandler事件
      managerHandler(handler, handlerData, type, params, isAsync, unFresh) {
        if (handler) {
          if (!isAsync) {
            this.showSpin = true;
            handler(handlerData).then(data => {
              this.showSpin = false;
              if (type == 3) {
                if (!this.unPage) {
                  this.list = data.content || [];
                  this.page.total = data.totalElements;
                } else {
                  this.list = data;
                }
              }
              this.$emit('on-success', type, data || {}); // 响应组件请求成功监听，特殊处理
              if (!unFresh) { // 需要刷新数据
                this.emitManagerHandler(3, {
                  unFresh: true
                });
              }
              this.showSpin = false;
            }).catch(res => {
              this.showSpin = false;
              this.$emit('on-error', type);
            })
          } else {
            handler(handlerData);
          }
        }
      },
      // emitManagerHandler, 响应事件触发
      emitManagerHandler(type, data) {
        let [handler, handlerData, isAsync, unFresh, params, isBatch] = [null, null, data.isAsync, data.unFresh, data.params || {}, data.isBatch]; // 方法、是否同步、参数、是否批量操作
        if (isBatch && this.removeChecked().length == 0 || type == 2 && this.removeChecked().length == 0) {
          this.$Message.warning('请选择操作项');
          return;
        }
        const {del, search} = this.handlers;
        switch (type) {
          case 3: handler = search; if(this.search) handler = this.handlers[this.search]; handlerData = this.getSearchData();break; // 查
          case 1: handler = del;handlerData = [params.id];break; // 根据id 删
          case 2: // 批量删
            handlerData = this.removeChecked();
            handler = del;
            break;
          default:
            handler = this.handlers[type];
            handlerData = params;
            if (isBatch) handlerData = this.removeChecked();
            break; // 直接传方法名
        }
        this.managerHandler(handler, handlerData, type, data, isAsync, unFresh);
      },
      // 列表远程排序
      sortChange(value) {
        this.$emit('on-sort-change',value);
      }
    },
    inject: ['handlers'],
    created() {
      this.page.pageSize = this.pageSize;
    },
    mounted() {
      if (!this.init) {
        return ;
      }
      this.emitManagerHandler(3, {
        unFresh: true
      })
    },
    watch: {
      list() {
        this.selected = [];
      }
    }
  }
</script>

<style scoped>
  .spin-icon-load{
    animation: spin 1s linear infinite;
  }
  @keyframes spin {
    from { transform: rotate(0deg);}
    50%  { transform: rotate(180deg);}
    to   { transform: rotate(360deg);}
  }
</style>
