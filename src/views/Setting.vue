<!--remove-->
<template>
  <Row>
    <Col span="16" offset="4" style="padding-top: 50px">
      <h1>Set security question</h1>
    </Col>
    <Col span="8" offset="4" style="padding-top: 50px">
      Question 1：
      <Select v-model="model1" style="width:300px" @on-change="select1">
        <Option
            v-for="item in questions"
            :value="item.question"
            :key="item.id"
        >{{ item.question }}</Option
        >
      </Select>
    </Col>
    <Col span="8" style="padding-top: 50px">
      Answer：
      <Input
          v-model="value1"
          placeholder="Enter something..."
          style="width: 300px"
      />
    </Col>
    <Col span="8" offset="4" style="padding-top: 50px">
      Question 2：
      <Select v-model="model2" style="width:300px" @on-change="select2">
        <Option
            v-for="item in questions"
            :value="item.question"
            :key="item.id"
        >{{ item.question }}</Option
        >
      </Select>
    </Col>
    <Col span="8" style="padding-top: 50px">
      Answer：
      <Input
          v-model="value2"
          placeholder="Enter something..."
          style="width: 300px"
      />
    </Col>
    <Col span="8" offset="4" style="padding-top: 50px">
      Question 3：
      <Select v-model="model3" style="width:300px" @on-change="select3">
        <Option
            v-for="item in questions"
            :value="item.question"
            :key="item.id"
        >{{ item.question }}</Option
        >
      </Select>
    </Col>
    <Col span="8" style="padding-top: 50px">
      Answer：
      <Input
          v-model="value3"
          placeholder="Enter something..."
          style="width: 300px"
      />
    </Col>
    <Col span="24" style="padding-top: 50px;">
      <Button type="info" @click="deleteAnswer()">Reset set answers</Button>
      <span style="padding:0 10px;"></span>
      <Button type="success" @click="submitAnswer">Submit a security question</Button>
    </Col>
  </Row>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator'
import api from '../api/api'

@Component
export default class Setting extends Vue {
  questions: any = ''
  model1: any = ''
  value1: any = ''
  model2: any = ''
  value2: any = ''
  model3: any = ''
  value3: any = ''
  id1: any = ''
  id2: any = ''
  id3: any = ''

  select1(value: any) {
    if (value) {
      this.id1 = this.questions.filter(
          (item: any) => item.question === value
      )[0].id
    }
  }

  select2(value: any) {
    if (value) {
      this.id2 = this.questions.filter(
          (item: any) => item.question === value
      )[0].id
    }
  }

  select3(value: any) {
    if (value) {
      this.id3 = this.questions.filter(
          (item: any) => item.question === value
      )[0].id
    }
  }

  getAll() {
    api
    .getAllQuestions()
    .then((res: any) => {
      this.questions = res.data
    })
    .catch((err: any) => {
      ;(this as any).$Message.error(err.data.message)
    })
  }

  submitAnswer() {
    api
    .setAnswers([
      {
        id: this.id1,
        answer: this.value1,
      },
      {
        id: this.id2,
        answer: this.value2,
      },
      {
        id: this.id3,
        answer: this.value3,
      },
    ])
    .then((res: any) => {
      res = res.data
      if (res.message === 'Saved successfully') {
        ;(this as any).$Message.success('Setup successful')
        this.reset()
      }
      if (res.message === 'There are security issues') {
        ;(this as any).$Message.error('There are security issues')
        this.reset()
      }
    })
    .catch((err: any) => {
      ;(this as any).$Message.error(err.data.message)
    })
  }

  reset() {
    this.model1 = ''
    this.value1 = ''
    this.model2 = ''
    this.value2 = ''
    this.model3 = ''
    this.value3 = ''
  }

  deleteAnswer() {
    api
    .deleteAnswers({})
    .then((res: any) => {
      ;(this as any).$Message.success('Reset successful')
    })
    .catch((err: any) => {
      ;(this as any).$Message.error(err.data.message)
    })
  }

  mounted() {
    this.getAll()
  }
}
</script>

<style lang="less" scoped></style>
