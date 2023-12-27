<template>
  <Row>
    <Col span="8" offset="8">
      <div class="user">
        <Card dis-hover>
          <div slot="title">
            <Row>
              <Col span="11" offset="1">
                <p style="font-weight: normal;font-size: 20px">
                  <Icon type="md-person"></Icon>
                  {{ user.username }}
                </p>
              </Col>
              <Col span="10" offset="2">
                <p style="  font-weight: normal;font-size: 14px">
                  <Icon type="md-body" /><span style="padding-left: 10px">{{
                    user.name
                  }}</span>
                </p>
                <p style="font-weight: normal;font-size: 14px">
                  <Icon type="md-mail" /><span style="padding-left: 10px">{{
                    user.email
                  }}</span>
                </p>
              </Col>
            </Row>
          </div>
          <Row style="text-align: center;">
            <Col span="6" style="border-right:1px solid #dfdfdf">
              <p>Solved</p>
              <p>{{ user.acCount }}</p>
            </Col>
            <Col span="6" style="border-right:1px solid #dfdfdf">
              <p>Submission</p>
              <p>{{ user.submitCount }}</p>
            </Col>
            <Col span="6" style="border-right:1px solid #dfdfdf">
              <p>Rate</p>
              <p>{{ (user.acRate * 100).toFixed(1) }} %</p>
            </Col>
            <Col span="6">
              <p>Score</p>
              <p>{{ user.totalScore }}</p>
            </Col>
          </Row>
        </Card>
      </div>
    </Col>
  </Row>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator'
import api from '../api/api'

@Component
export default class Personal extends Vue {
  user: any = {}

  get userInfo() {
    return this.$store.state.userInfo
  }

  getUserInfo() {
    const params = this.$route.params
    console.log(this.userInfo)
    if (params.id != this.userInfo.id) {
      api.user
      .getUserInfo({
        id: params.id,
      })
      .then((res: any) => {
        console.log(res.data)
        this.user = res.data
      })
      .catch((err: any) => {
        ;(this as any).$Message.error(err.data.message)
      })
    } else {
      this.user = this.userInfo
    }
  }

  mounted() {
    this.getUserInfo()
  }
}
</script>

<style lang="less" scoped>
.user {
  margin-top: 80px;
  text-align: left;
}
.operate {
  text-align: right;
  padding-top: 10px;
}
.charts {
  margin-top: 80px;
  text-align: left;
}
#positive {
  width: 100%;
  height: 400px;
}
#negative {
  width: 100%;
  height: 400px;
}
</style>
