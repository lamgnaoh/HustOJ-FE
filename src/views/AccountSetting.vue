<template>
  <div class="setting-main">
    <h1 class="section-title">Change password</h1>
    <el-form ref="formPassword" :model="formPassword" :rules="rulePassword" class="setting-content">
      <el-form-item label="Old Password" prop="old_password">
        <el-input v-model="formPassword.old_password" type="password"/>
      </el-form-item>
      <el-form-item label="New Password" prop="new_password">
        <el-input v-model="formPassword.new_password" type="password"/>
      </el-form-item>
      <el-form-item label="Confirm New Password" prop="again_password">
        <el-input v-model="formPassword.again_password" type="password"/>
      </el-form-item>
      <el-form-item v-if="visible.passwordAlert">
        <Alert type="success">You will need to login again after 5 seconds..</Alert>
      </el-form-item>
      <Button type="primary" @click="changePassword">Update password</Button>
    </el-form>
  </div>
</template>
<script lang="ts">

import {Component, Vue} from "vue-property-decorator";
import api from "@/api/api";

@Component
export default class AccountSetting extends Vue {

  oldPasswordCheck : any = (rule: any, value: any, callback: any) => {
    if (this.formPassword.old_password !== '') {
      if (this.formPassword.old_password === this.formPassword.new_password) {
        callback(new Error('The new password doesn\'t change'))
      } else {
        // @ts-ignore
        this.$refs.formPassword.validateField('again_password')
      }
    }
    callback()
  }

  CheckNewPassword: any = (rule: any, value: any, callback: any) => {
    if (this.formPassword.old_password !== '') {
      if (this.formPassword.old_password === this.formPassword.new_password) {
        callback(new Error('The new password doesn\'t change'))
      } else {
        // 对第二个密码框再次验证
        // @ts-ignore
        this.$refs.formPassword.validateField('again_password')
      }
    }
    callback()
  }

  CheckAgainPassword: any = (rule: any, value: any, callback: any) => {
    if (value !== this.formPassword.new_password) {
      callback(new Error('password does not match'))
    }
    callback()
  }

  loading: any = {
    btnPassword: false,
    btnEmail: false
  }

  visible: any = {
    passwordAlert: false,
    emailAlert: false,
    tfaRequired: false
  }
  formPassword: any = {
    old_password: '',
    new_password: '',
    again_password: ''
  }

  formEmail: any = {
    password: '',
    old_email: '',
    new_email: ''
  }
  rulePassword: any = {
    old_password: this.oldPasswordCheck,
    new_password: [
      {required: true, trigger: 'blur', min: 6, max: 20},
      {validator: this.CheckNewPassword, trigger: 'blur'}
    ],
    again_password: [
      {required: true, validator: this.CheckAgainPassword, trigger: 'change'}
    ]
  }

  ruleEmail: any = {
    password: this.oldPasswordCheck,
    new_email: [{required: true, type: 'email', trigger: 'change'}],
  }



  changePassword() {
    this.validateForm('formPassword').then(valid => {
      this.loading.btnPassword = true
      let data = {...this.formPassword}
      delete data.again_password
      api.changePassword(data).then((res: any )=> {
        this.loading.btnPassword = false
        this.visible.passwordAlert = true
        this.$Message.success('Update password successfully')
        // need to log out after change password
        setTimeout(() => {
          this.visible.passwordAlert = false
          this.$router.push({name: 'logout'})
        }, 5000)
      }, (res: any)  => {
        this.loading.btnPassword = false
      })
    })
  }

  changeEmail() {
    this.validateForm('formEmail').then(valid => {
      this.loading.btnEmail = true
      let data = {...this.formEmail}
      api.changeEmail(data).then((res: any) => {
        this.loading.btnEmail = false
        this.visible.emailAlert = true
        this.$message.success('Change email successfully')
        // @ts-ignore
        this.$refs.formEmail.resetFields()
      }, )
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
    this.formEmail.old_email = this.$store.state.userInfo.email || ''
  }
}
</script>


<style scoped lang="less">
.setting-main {
  width: 35%;
  margin: 50px auto;
}

</style>