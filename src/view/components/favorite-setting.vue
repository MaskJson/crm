<template>
  <div class="favorite-setting">
    <Row>
      <Button type="default" @click="showAddFolder = true">新建收藏夹</Button>
    </Row>
    <Row class="drawer-container">
      <Col v-for="(folder, index) in list" :key="index" class="pd-10 borderB">
        <span class="folder">{{folder.name}}</span>
        <Button type="primary" size="small" ghost @click="update(folder)" class="mL10">修改</Button>
        <Button type="error" size="small" ghost @click="remove(folder.id)" class="ml5">删除</Button>
        <Button type="info" size="small" ghost @click="toggleStatus(folder)" class="ml5">{{folder.status ? '禁用' : '启用'}}</Button>
      </Col>
    </Row>
    <Modal :title="entity.id ? '修改收藏夹':'添加收藏夹'" :maskClosable="false" v-model="showAddFolder" @on-visible-change="resetSaveData">
      <Form :label-width="100" :rules="rules" ref="form" :model="entity">
        <FormItem label="名称" prop="name">
          <Input v-model="entity.name"/>
        </FormItem>
        <FormItem label="备注" prop="remark">
          <Input v-model="entity.remark"/>
        </FormItem>
        <FormItem label="启用" prop="status">
          <Checkbox v-model="entity.status"></Checkbox>
        </FormItem>
      </Form>
      <div slot="footer">
        <Button type="primary" class="w120" :loading="loading" @click="save">保存</Button>
      </div>
    </Modal>
    <SpinUtil :show="show"/>
  </div>
</template>

<script>
  import { save, list, remove, toggle } from "../../api/folder";

  export default {
  name: 'favorite-setting',
  props: {
    type: {
      type: Number
    }
  },
  data () {
    return {
      show: false,
      loading: false,
      showAddFolder: false, //是否显示添加收藏夹
      entity: {
        name: '',
        remark: '',
        status: true
      },
      rules: {
        name: [
          { required: true, type: 'string', message: '请输入名称', trigger: 'blur' }
        ],
        remark: [
          { required: true, type: 'string', message: '请输入备注', trigger: 'blur' }
        ]
      },
      list: [],
    }
  },
  methods: {
    resetSaveData(val) {
      if (!val) {
        this.entity = {
          name: '',
          remark: '',
          status: true
        }
      }
    },
    update(folder) {
      this.entity = folder;
      this.showAddFolder = true;
    },
    remove(id) {
      this.show = true;
      remove({id}).then(data => {
        this.init();
      }).catch(data => { this.show = false; })
    },
    toggleStatus(folder) {
      const params = { id: folder.id, status: !folder.status };
      this.show = true;
      toggle(params).then(data => {
        this.init();
      }).catch(data => { this.show = false; })
    },
    save () {
      this.$refs['form'].validate(valid => {
        if (valid) {
          this.loading = true;
          save({
            type: this.type,
            ...this.entity
          }).then(data => {
            this.loading = false;
            this.showAddFolder = false;
            this.init();
          }).catch(data => { this.loading = false; })
        }
      });
    },
    init() {
      this.show = true;
      list({ type: this.type }).then(data => {
        this.show = false;
        this.list = data;
      }).catch(data => { this.show = false; })
    }
  },
  created () { this.init(); },
  mounted () {}
}
</script>

<style lang="less" scoped>
  .folder {
    display: inline-block;
    width: 180px;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
    position: relative;
    top: 8px;
  }
  .drawer-container {
    position: absolute;
    top: 60px;
    bottom: 30px;
    overflow-x: hidden;
    overflow-y: auto;
  }
</style>
