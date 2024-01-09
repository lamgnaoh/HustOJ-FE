<template>
  <div class="register">
    <h1>User registration</h1>
    <el-form
        ref="registerForm"
        :model="register"
        :rules="registerRule"
        label-width="160px"
    >
      <el-form-item label="Username" prop="username">
        <el-input
            v-model="register.username"
            placeholder="Please enter username"
        ></el-input>
      </el-form-item>
      <el-form-item label="Email" prop="mail">
        <el-input
            type="email"
            v-model="register.mail"
            placeholder="Please enter your email"
        ></el-input>
      </el-form-item>
      <el-form-item label="Password" prop="password">
        <el-input
            type="password"
            v-model="register.password"
            placeholder="Please enter your password"
        ></el-input>
      </el-form-item>
      <el-form-item label="Enter password again" prop="passwdCheck">
        <el-input
            type="password"
            v-model="register.passwdCheck"
            placeholder="Please enter password again"
        ></el-input>
      </el-form-item>
      <el-form-item label="Lastname" prop="lastname">
        <el-input v-model="register.lastname" placeholder="Please enter lastname"></el-input>
      </el-form-item>
      <el-form-item label="Firstname" prop="firstname">
        <el-input
            v-model="register.firstname"
            placeholder="Please enter firstname"
        ></el-input>
      </el-form-item>
      <el-form-item>
        <div class="footer-between">
          <el-button @click="handleReset()">Reset</el-button>
          <el-button type="primary" @click="handleSubmit('registerForm')">Register</el-button>
        </div>
      </el-form-item>
    </el-form>
  </div>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator'
import api from '../api/api'
import md5 from 'js-md5'

@Component
export default class About extends Vue {
  register: any = {
    username: '',
    mail: '',
    password: '',
    passwdCheck: '',
    firstname: '',
    lastname: '',
  }

  validatePassCheck = (rule: any, value: string, callback: any) => {
    if (value === '') {
      callback(new Error('Please enter password again'))
    } else if (value !== this.register.password) {
      callback(new Error('The passwords do not match. Check again'))
    } else {
      callback()
    }
  }

  registerRule: any = {
    username: [
      { required: true, message: 'Username can not be empty', trigger: 'blur' },
      {
        type: 'string',
        min: 4,
        message: 'The minimum username cannot be less than 4 characters',
        trigger: 'blur',
      },
    ],
    firstname: [{ required: true, message: 'Firstname can not be empty', trigger: 'blur' }],
    lastname: [{ required: true, message: 'Lastname can not be empty', trigger: 'blur' }],
    mail: [
      { required: true, message: 'Email can not be empty', trigger: 'blur' },
      { type: 'email', message: 'Incorrect format', trigger: 'blur' },
    ],
    passwdCheck: [{ validator: this.validatePassCheck, trigger: 'blur' }],
    password: [
      { required: true, message: 'Password can not be blank', trigger: 'blur' },
      {
        type: 'string',
        min: 6,
        message: 'The minimum password must not be less than 6 characters',
        trigger: 'blur',
      },
    ],
  }

  handleSubmit(name: string) {
    ;(this.$refs[name] as HTMLFormElement).validate((valid: any) => {
      if (valid === true) {
        api.user
        .register({
          username: this.register.username,
          password: this.register.password,
          email: this.register.mail,
          firstname: this.register.firstname,
          lastname: this.register.lastname,
          name: this.register.lastname + this.register.firstname,
        })
        .then((res: any) => {
          ;(this as any).$Message.success('Registration success. Please check email to complete registration')
          this.$router.push('login')
          // this.handleReset()
        })
        .catch((err: any) => {
          ;(this as any).$Message.error(err.data.message)
        })
      }
    })
  }

  handleReset() {
    this.register = {
      username: '',
      mail: '',
      password: '',
      passwdCheck: '',
      firstname: '',
      lastname: '',
    }
  }
}
</script>

<style lang="less" scoped>
.register {
  margin: 100px auto;
  width: 800px;
}

h1 {
  font-weight: 700;
  margin-bottom: 30px;
}

.footer-between {
  float: left;
}
</style>
