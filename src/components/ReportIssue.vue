<script lang="ts">
import Vue from 'vue'
import {Component, Prop} from "vue-property-decorator";
import api from "@/api/api";

@Component({})
export default class ReportIssue extends Vue {
  @Prop({
    type: String,
    required: true
  })
  problemId: string

  @Prop({
    type: String,
    required: false,
    default: ''
  })
  name: string

  @Prop({
    type: String,
    required: false,
    default: ''
  })
  description: string

  @Prop({
    type: Boolean,
    required: false,
    default: false
  })
  isDetail: boolean

  issue: any = {
    name: this.name,
    description: this.description,
    problemId: this.problemId
  }

  ruleValidate: any = {
    name: {
      required: true, message: 'Issue name cannot be empty', trigger: 'blur'
    },
    description: {
      required: true, message: 'Issue description is required', trigger: 'blur'
    }
  }

  clear() {
    this.issue = {
      name: '',
      description: ''
    }
    this.$emit('back');
  }

  saveIssue() {
    api
        .saveIssue(this.issue)
        .then((res: any) => {
          let response = res.data
          if (response.id) {
            this.clear();
            (this as any).$Message.success("Success!")
          } else {
            (this as any).$Message.error("Fail! Try again later!")
          }
        })
        .catch((err: any) => {
          ;(this as any).$Message.error(err.data.message)
        })
  }
}
</script>

<template>
  <div class="issue-content">
    <el-form ref="reportIssueForm" :model="issue" :rules="ruleValidate">
      <el-form-item label="Name issue" prop="name">
        <el-input v-model="issue.name" placeholder="Please input issue name"></el-input>
      </el-form-item>
      <el-form-item label="Description issue" prop="description">
        <el-input
            v-model="issue.description"
            :rows="10"
            placeholder="Please input description for this issue"
            type="textarea">
        </el-input>
      </el-form-item>
      <el-form-item>
        <el-button @click="clear">Clear</el-button>
        <el-button v-if="!isDetail" type="primary" @click="saveIssue">Summit</el-button>
      </el-form-item>
    </el-form>
  </div>
</template>

<style lang="less" scoped>

</style>