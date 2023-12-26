<template>
  <Row>
    <Col span="6" offset="9">
      <Form
          ref="loginForm"
          :model="userLogin"
          :rules="loginRule"
          class="login-form"
      >
        <h1>Login</h1>
        <FormItem prop="username">
          <Input
              type="text"
              v-model="userLogin.username"
              placeholder="Username"
          >
            <Icon type="ios-person-outline" slot="prepend"></Icon>
          </Input>
        </FormItem>
        <FormItem prop="password">
          <Input
              type="password"
              v-model="userLogin.password"
              placeholder="Password"
              @on-enter="handleSubmit('loginForm')"
          >
            <Icon type="ios-lock-outline" slot="prepend"></Icon>
          </Input>
        </FormItem>
        <FormItem>
          <Button
              type="primary"
              @click="handleSubmit('loginForm')"
              style="width:100%"
          >Login</Button
          >
          <div class="forget-register">
            <p>
              Haven't registered yet ?
              <router-link to="/register">Register</router-link>
            </p>
            <p>
              <router-link to="/forget">Forgot password ?</router-link>
            </p>
          </div>
        </FormItem>
      </Form>
    </Col>
  </Row>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator'
import api from "@/api/api";

@Component
export default class Login extends Vue {
  userLogin: any = {
    username: '',
    password: '',
    role: '',
  }
  loginRule: any = {
    username: [{ required: true, message: 'Username can not be empty', trigger: 'blur' }],
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
        this.$store
        .dispatch('login', {
          // dispatch toLogin action in store.ts
          username: this.userLogin.username,
          password: this.userLogin.password,
        })
        .then(() => {
          ;(this as any).$Message.success('Login successful')
          api.user
          .getMyInfo()
          .then((res: any) => {
            const role = res.data.authorities[0].authority
            this.$store.commit('setUserInfo', res.data)
            this.$store.commit('setRole', role)
          })
          .catch((err: any) => {
            ;(this as any).$Message.error(err.data.message)
          })
          if (Object.getOwnPropertyNames(this.$route.query).length === 0) {
            this.$router.push({
              path: '/problems',
            })
          } else {
            this.$router.replace('/problems')
          }
        })
        .catch((err: any) => {
          ;(this as any).$Message.error(err.data.message)
        })
      }
    })
  }
}
</script>

<style lang="less" scoped>
.login-form {
  margin-top: 150px;
  margin-bottom: 200px;
}

.forget-register {
  display: flex;
  justify-content: space-between;
}

h1 {
  font-weight: 400;
  margin-bottom: 30px;
}
</style>
