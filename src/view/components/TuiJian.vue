<template>
  <!--  推荐到项目  -->
  <ModalUtil ref="project" title="推荐项目" @reset="resetProjectTalent" @on-ok="addProjectTalent" :loading="show">
    <Form ref="projectTalent" :model="projectTalent" :rules="projectTalentRule" :label-width="100">
      <FormItem label="人才：">
        {{ talentName }}
      </FormItem>
      <FormItem label="推荐项目：" prop="projectId">
        <Select v-model="projectTalent.projectId" placeholder="请选择项目" clearable>
          <Option :disabled="talentProjects.indexOf(item.id) > -1" v-for="(item, index) of projects" :value="item.id" :key="'project' + index">
            {{ item.name }}{{`（${item.customerName}）`}}
            <span v-show="talentProjects.indexOf(item.id) > -1">{{`（已处于该项目进展中）`}}</span>
          </Option>
        </Select>
      </FormItem>
      <FormItem label="推荐理由：" prop="remark">
        <Input placeholder="推荐理由" type="textarea" v-model="projectTalent.remark" :rows="3"/>
      </FormItem>
    </Form>
  </ModalUtil>
</template>

<script>
  import {toggleShow, getUserId, getUserInfoByKey} from "../../libs/tools";
  import {addProjectTalent, openByUserId} from "../../api/project";

  export default {
    name: "TuiJian",
    props: {
      talentProjects: {
        type: Array,
        default: []
      },
      projectTalentIndex: {
        type: Number
      },
      talentId: {
        type: Number
      },
      talentName: {
        type: String
      }
    },
    data() {
      return {
        show: false,
        projects: [],
        projectTalent: {
          createUserId: getUserId(),
          talentId: null,
          projectId: null,
          status: 0,
          type: 1,
          remark: null,
          roleId: getUserInfoByKey('roleId'),
        },
        projectTalentRule: {
          projectId: [
            { required: true, type: 'number', message: '请选择项目', trigger: 'change' }
          ],
          remark: [
            { required: true, type: 'string', message: '请填写推荐理由', trigger: 'blur' }
          ],
        },
      }
    },
    methods: {
      resetProjectTalent() {
        this.projectTalent = {
          createUserId: getUserId(),
          talentId: null,
          projectId: null,
          status: 0,
          type: 1,
          remark: null,
          roleId: getUserInfoByKey('roleId'),
        };
        this.$refs['projectTalent'].resetFields();
      },
      addProjectTalent() {
        this.$refs['projectTalent'].validate(valid => {
          if (valid) {
            this.show = true;
            this.projectTalent.createUserId = getUserId();
            this.projectTalent.talentId = this.talentId;
            addProjectTalent(this.projectTalent).then(data => {
              this.$emit('on-ok');
              this.show = false;
              toggleShow(this, 'project', false);
            }).catch(data => {this.show = false});
          }
        })
      },
      toggleShow(flag) {
        toggleShow(this, 'project', flag);
      }
    },
    created() {
      this.userId = getUserId();
      openByUserId({ userId: getUserId(), roleId: getUserInfoByKey('roleId') }).then(data => {
        this.projects = data || [];
      }).catch(data => {});
    }
  }
</script>

<style scoped>

</style>
