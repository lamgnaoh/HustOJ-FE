<template>
  <Row>
    <Col offset="5" span="14"  style="padding-top: 80px ; text-align: center">
      <div>
        <h1>Recovery password</h1>
        <el-form
            ref="recoveryForm"
            :model="recover"
            label-width="160px"
            style="margin-top: 10px"
        >
          <el-form-item label="Your email" >
            <el-input
                v-model="recover.email"
                placeholder="Please enter your email address"
            >
            </el-input>
          </el-form-item>
          <Button type="info" @click="resetPwd">Send email recovery</Button>
        </el-form>
      </div>
    </Col>
  </Row>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator'
import api from '../api/api'
import md5 from 'js-md5'

@Component
export default class Forget extends Vue {
  password: string = ''
  email: string = ''

  recover: any={
    email: ''
  }

  resetPwd() {
    api.forgetPassword({
      email: this.recover.email
    }).then((res: any) => {
      ;(this as any).$Message.success('Email recovery send success. Please check your email')
    }).catch((err: any) => {
      ;(this as any).$Message.error(err.data.message)
    })
  }
}
</script>
