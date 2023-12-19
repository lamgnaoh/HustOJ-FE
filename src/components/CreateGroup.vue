<template>
  <div class="container">
    <Form :model="groupData" ref="groupForm" :rules="ruleValidate">
      <FormItem prop="name">
        <h3>Group name</h3>
        <Input v-model="groupData.name" />
      </FormItem>
      <!--
      <FormItem prop="des">
        <h3>描述</h3>
        <Input v-model="groupData.des" type="textarea" :rows="4"/>
      </FormItem>
      <FormItem>
        <h3>加入小组设置</h3>
        <div style="text-align: left">
          <RadioGroup v-model="groupData.setting">
            <Radio label="any">允许任何人加入</Radio>
            <Radio label="check">提交请求后管理员审核</Radio>
            <Radio label="nobody">不允许任何人加入</Radio>
          </RadioGroup>
        </div>
      </FormItem>
      -->
      <Button
          type="primary"
          @click.once="handleSubmit('groupForm')"
          v-if="typeProp === 1"
      >Create a group</Button
      >
      <Button
          type="primary"
          @click="handleSubmit('groupForm')"
          v-if="typeProp === 2"
      >Modify group</Button
      >
    </Form>
  </div>
</template>

<script lang="ts">
import { Component, Vue, Prop, Watch } from 'vue-property-decorator'
import api from '@/api/api.ts'

@Component
export default class GroupForm extends Vue {
  groupData: any = {
    name: '',
    id: '',
    // des: '',
    // setting: 'any'
  }
  @Prop({}) dataProp: any
  @Prop({ default: 1 }) typeProp: number
  // 1 create 2 modify
  ruleValidate: any = {
    name: [
      { required: true, message: 'Please fill in the name', trigger: 'blur' },
      { type: 'string', max: 20, message: 'The name cannot exceed 20 characters', trigger: 'blur' },
    ],
  }

  @Watch('dataProp')
  handleChange() {
    if (this.dataProp) {
      this.groupData = this.dataProp
    }
  }

  handleSubmit(name: string) {
    ;(this.$refs[name] as any).validate((valid: boolean) => {
      if (valid) {
        if (this.typeProp === 1) {
          api
          .createGroup({ name: this.groupData.name })
          .then((res: any) => {
            ;(this as any).$Message.success('Created successful')
          })
          .catch(() => {
            ;(this as any).$Message.error('Created failed!')
          })
        }
        if (this.typeProp === 2) {
          if (this.groupData.name === this.dataProp.name) {
            ;(this as any).$Message.error('Two names cannot be the same')
          } else {
            api
            .modifyGroup({ id: this.dataProp.id, name: this.groupData.name })
            .then((res: any) => {
              ;(this as any).$Message.success('Modify successful')
            })
            .catch(() => {
              ;(this as any).$Message.error('Modify failed')
            })
          }
        }
      } else {
        ;(this as any).$Message.error('Verification failed')
      }
    })
  }

  mounted() {
    if (this.dataProp) {
      this.groupData.name = this.dataProp.name
    }
  }
}
</script>

<style lang="less" scoped>
h2 {
  font-weight: 500;
  font-size: 36px;
  text-align: left;
  margin: 12px auto 18px 0;
}

h3 {
  text-align: left;
  font-weight: 700;
  font-size: 16px;
}

.container {
  text-align: left;
  margin-top: 24px;
}
</style>
