
<template>
  <div class="setting-main">
    <h1 class="section-title">Change password</h1>
    <el-form ref="formPassword" :model="formPassword" :rules="rulePassword" class="setting-content">
      <el-form-item label="New Password" prop="newPassword">
        <el-input v-model="formPassword.newPassword" type="password"/>
      </el-form-item>
      <el-form-item label="Confirm New Password" prop="confirmPassword">
        <el-input v-model="formPassword.confirmPassword" type="password"/>
      </el-form-item>
      <Button type="primary" @click="resetPassword">Reset password</Button>
    </el-form>
  </div>
</template>

<script lang="ts">
import {Vue, Component} from 'vue-property-decorator';
import api from "@/api/api";

@Component({})
export default class ResetPassword extends Vue {
  formPassword: any = {
    newPassword: '',
    confirmPassword: ''
  }
  token: string = ''

  CheckAgainPassword: any = (rule: any, value: any, callback: any) => {
    if (value !== this.formPassword.newPassword) {
      callback(new Error('password does not match'))
    }
    callback()
  }
  rulePassword: any = {
    newPassword: [
      {required: true, trigger: 'blur', min: 6, max: 20}
    ],
    confirmPassword: [
      {required: true, validator: this.CheckAgainPassword, trigger: 'change'}
    ]
  }
  resetPassword() {
    this.validateForm('formPassword').then(valid => {
      let data = {...this.formPassword, token: this.token }
      api.resetPassword(data).then((res: any )=> {
        this.$Message.success("Reset password successfully")
        this.$router.push('/login')
      }).catch((err: any) => {
        this.$Message.error(err.data.message)
      })
    })
  }


  validateForm(formName: any) {
    return new Promise((resolve, reject) => {
      // @ts-ignore
      this.$refs[formName].validate((valid:any) => {
        if (!valid) {
          this.$Message.error('please validate the error fields')
        } else {
          resolve(valid)
        }
      })
    })
  }

  mounted() {
    this.token = this.$route.params.token
  }

}
</script>


<style scoped lang="less">

.setting-main {
  width: 35%;
  margin: 50px auto;
}

</style>