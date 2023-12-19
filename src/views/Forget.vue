<template>
  <Row>
    <Col span="4" offset="10" style="padding-top: 80px">
      <div v-if="revise">
        <Input
            v-model="password"
            type="password"
            placeholder="Enter password"
            style="margin-bottom: 20px"
        />
        <Button type="info" @click="revisePassword">Reset password</Button>
      </div>
      <div v-else>
        <div v-if="reset" style="text-align: left;">
          <div style="margin-bottom: 20px">
            Question：{{ this.question.question }}
            <Input v-model="answer" placeholder="Enter answer" />
          </div>
          <Button type="info" @click="check">Verify answer</Button>
        </div>
        <div v-else>
          <Input
              v-model="username"
              placeholder="Please enter user name"
              style="margin-bottom: 30px;"
          />
          <Button type="info" @click="resetPwd">Answer security questions</Button>
        </div>
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
  reset: boolean = false
  username: string = ''
  question: any = ''
  answer: any = ''
  revise: boolean = false
  password: string = ''

  resetPwd() {
    if (this.username) {
      this.reset = true
      const username = this.username
      api
      .getOwnQuestion({ username })
      .then((res: any) => {
        this.question = res.data
      })
      .catch((err: any) => {
        ;(this as any).$Message.error(err.data.message)
      })
    } else {
      ;(this as any).$Message.warning('Username can not be empty')
    }
  }

  check() {
    api
    .checkAnswer({
      username: this.username,
      id: this.question.id,
      answer: this.answer,
    })
    .then((res: any) => {
      this.reset = false
      this.revise = true
      window.localStorage.setItem('token', res.data.token)
    })
    .catch((err: any) => {
      ;(this as any).$Message.error(err.data.message)
    })
  }

  revisePassword() {
    const password = md5(this.password)
    api
    .forgetPassword({ password })
    .then((res: any) => {
      ;(this as any).$Message.success('Success')
      this.$router.push({
        path: `/login`,
      })
    })
    .catch((err: any) => {
      ;(this as any).$Message.error(err.data.message)
    })
  }
}
</script>
