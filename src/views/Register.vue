<template>
  <Row>
    <Col span="6" offset="9">
      <div class="register">
        <h1>User registration</h1>
        <Form
            ref="registerForm"
            :model="register"
            :rules="registerRule"
            :label-width="80"
        >
          <FormItem label="Username" prop="username">
            <Input
                v-model="register.username"
                placeholder="Please enter username"
            ></Input>
          </FormItem>
          <FormItem label="Email" prop="mail">
            <Input
                type="email"
                v-model="register.mail"
                placeholder="Please enter your email"
            ></Input>
          </FormItem>
          <FormItem label="Password" prop="password">
            <Input
                type="password"
                v-model="register.password"
                placeholder="Please enter your password"
            ></Input>
          </FormItem>
          <FormItem label="Enter password again" prop="passwdCheck">
            <Input
                type="password"
                v-model="register.passwdCheck"
                placeholder="Please enter password again"
            ></Input>
          </FormItem>
          <FormItem label="Lastname" prop="lastname">
            <Input v-model="register.lastname" placeholder="Please enter lastname"></Input>
          </FormItem>
          <FormItem label="Firstname" prop="firstname">
            <Input
                v-model="register.firstname"
                placeholder="Please enter firstname"
            ></Input>
          </FormItem>
          <FormItem>
            <div class="footer-between">
              <Button type="primary" @click="handleSubmit('registerForm')"
              >Register</Button
              >
              <Button @click="handleReset()">Reset</Button>
            </div>
          </FormItem>
        </Form>
      </div>
    </Col>
  </Row>
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
          ;(this as any).$Message.success('Registration success')
          this.handleReset()
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
  margin-top: 50px;
  margin-bottom: 100px;
}

.input-form {
  padding-top: 20px;
  padding-bottom: 5px;
  text-align: left;
}

h1 {
  font-weight: 400;
  margin-bottom: 30px;
}

.footer-between {
  display: flex;
  justify-content: space-around;
  margin-left: -50px;
}
</style>
