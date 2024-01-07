<template>
  <div class="view">
    <Panel :title="title">
      <Form ref="contestForm" label-position="top" :rules="ruleValidate">
        <Row :gutter="20">
          <Col span="24">
            <FormItem label="Contest Name" required prop="name">
              <Input v-model="name" style="width: 100%" />
            </FormItem>
          </Col>
          <Col span="24">
            <FormItem label="Contest Description" required prop="description">
              <Simditor id="editor1" v-model="description"></Simditor>
            </FormItem>
          </Col>

          <Col span="8">
            <FormItem label="Start time" required>
              <DatePicker
                  type="datetime"
                  placeholder="Select time"
                  v-model="startDate"
              ></DatePicker>
            </FormItem>
          </Col>

          <Col span="8">
            <FormItem label="End time" required>
              <DatePicker
                  type="datetime"
                  placeholder="Select time"
                  v-model="endDate"
              ></DatePicker>
            </FormItem>
          </Col>

          <Col span="8">
            <FormItem label="Rule type">
              <RadioGroup v-model="contestRuleType">
                <Radio label="ACM" :disabled="disableRuleType">ACM</Radio>
                <Radio label="OI" :disabled="disableRuleType" >OI</Radio>
              </RadioGroup>
            </FormItem>
          </Col>

          <Row :gutter="20" style="width: 100%; padding: 10px">
            <Col span="8">
              <FormItem label="Contest type">
                <RadioGroup v-model="contestType">
                  <Radio label="PUBLIC">Public</Radio>
                  <Radio label="SECRET_WITH_PASSWORD">Private (Join with password) </Radio>
                </RadioGroup>
              </FormItem>
            </Col>

            <Col v-if="contestType === 'SECRET_WITH_PASSWORD'" span="12" offset="2">
              <FormItem label="Enter password">
                <Input
                    v-model="password"
                    placeholder="Please enter the password"
                    style="width: 100%"
                />
              </FormItem>
            </Col>
          </Row>

          <Col span="8">
            <FormItem label="Visible">
              <RadioGroup v-model="visual">
                <Radio label="visible">Visible</Radio>
                <Radio label="invisible">Not visible</Radio>
              </RadioGroup>
            </FormItem>
          </Col>
          <Row style="width: 100%; padding: 10px">
            <Col span="2">
              <Button type="primary" @click="saveContest">Save</Button>
            </Col>
          </Row>
        </Row>
      </Form>
    </Panel>

  </div>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator'
import api from '../../api/api'
import Simditor from "@/components/Simditor.vue";
import Panel from "@/components/Panel.vue";


@Component({
  components: {
    Simditor,Panel
  }
})
export default class CreateContest extends Vue {
  // text editor configuration
  title='Create contest'
  // contest parameter
  name: any = ''
  description: any = ''
  contestType: string = 'PUBLIC'
  contestRuleType: string = 'ACM'
  enable: any = false
  visual: string = 'visible'
  startDate: any = ''
  endDate: any = ''
  password: any = ''
  disableRuleType: boolean = false
  ruleValidate: any = {
    name: [
      { required: true, message: 'Please enter the contest name', trigger: 'blur' },
    ],
    description: [
      { required: true, message: 'Please enter the contest description', trigger: 'blur' },
    ] ,
    startDate: [
      { required: true, message: 'Please select the start time', trigger: 'blur' },
    ],
    endDate: [
      { required: true, message: 'Please select the end time', trigger: 'blur' },
    ],
  }

  computeDate(date: string) {
    const start = new Date(date)
    const year = start.getFullYear()
    const mon = start.getMonth() + 1
    const month = () => {
      if (mon < 10) {
        return '0' + mon
      } else {
        return mon
      }
    }
    const day = () => {
      if (start.getDate() < 10) {
        return '0' + start.getDate()
      } else {
        return start.getDate()
      }
    }
    const hour = () => {
      if (start.getHours() < 10) {
        return '0' + start.getHours()
      } else {
        return start.getHours()
      }
    }
    const min = () => {
      if (start.getMinutes() < 10) {
        return '0' + start.getMinutes()
      } else {
        return start.getMinutes()
      }
    }
    const second = () => {
      if (start.getSeconds() < 10) {
        return '0' + start.getSeconds()
      } else {
        return start.getSeconds()
      }
    }
    return (
        year +
        '-' +
        month() +
        '-' +
        day() +
        ' ' +
        hour() +
        ':' +
        min() +
        ':' +
        second()
    )
  }

  saveContest() {
    // @ts-ignore
    // this.$refs.contestForm.validate((valid: any) => {
    //   if (!valid) {
    //    return this.$Message.error('Please fill in the required fields')
    //   }
    // });
    if (this.startDate > this.endDate) {
      return this.$Message.error('The start time cannot be greater than the end time')
    }

    if (this.startDate == '' || this.endDate == '') {
      return this.$Message.error('Please select the start time and end time')
    }
    if (this.startDate < new Date()) {
      return this.$Message.error('The start time cannot be less than the current time')
    }
    if (this.endDate < new Date()) {
      return this.$Message.error('The end time cannot be less than the current time')
    }
    if (this.contestType === 'SECRET_WITH_PASSWORD' && this.password === '') {
      return this.$Message.error('Please enter the password')
    }
    const start = this.computeDate(this.startDate)
    const end = this.computeDate(this.endDate)
    const pwd =
        this.contestType === 'SECRET_WITH_PASSWORD' ? this.password : ''
    if(this.$route.name === 'edit-contest'){
      const that = this
      const start = this.computeDate(that.startDate)
      const end = this.computeDate(that.endDate)
      console.log(that.contestType)
      api
      .updateContest({
        contestId:  this.$route.params.contestId,
        contest: {
          name: that.name,
          description: that.description,
          contestType: that.contestType,
          visible: that.visual == 'visible',
          startDate: start,
          endDate: end,
          password: that.password,
        },
      })
      .then((res: any) => {
        ;(this as any).$Message.success('Update successful')
        that.$router.push({
          path: `/admin/contests-list`,
        })
      })
      .catch(() => {
        ;(this as any).$Message.error('Update failed')
      })
    } else {
      api
      .createContest({
        contestType: this.contestType,
        description: this.description,
        startDate: start,
        endDate: end,
        name: this.name,
        contestRuleType: this.contestRuleType,
        password: pwd,
        visible: this.visual === 'visible',
      })
      .then((res: any) => {
        ;(this as any).$Message.success('Created successful')
        console.log(res)
        this.$router.push({
          path: `/admin/contests-list`,
        })
      })
      .catch((err: any) => {
        ;(this as any).$Message.error(err.data.message)
      })
    }
  }
  mounted(){
    if (this.$route.name === 'edit-contest') {
      this.title = 'Edit Contest'
      this.disableRuleType = true
      api.adminGetContestDetail({id: this.$route.params.contestId}).then(res => {
        let data = res.data
        this.name = data.name;
        this.description= data.description;
        this.startDate= data.startDate;
        this.endDate= data.endDate;
        this.contestType = data.contestType;
        this.visual = data.visible ? 'visible' : 'invisible'
      }).catch((err) => {
        this.$router.push({name: "contests-list"})
        this.$Message.error(err.data.message);
      })
    }
  }
}
</script>

<style scoped>
.view{
  text-align: left !important;

}
</style>
