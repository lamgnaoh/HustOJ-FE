<template>
  <Row>
    <Col span="22" offset="1" style="padding-top: 40px;text-align: left">
      <h1>Judgment server</h1>
      <Card class="card">
        <p slot="title">
          <Icon type="ios-film-outline"></Icon>
          Details
        </p>
        <div class="content">
          <Row v-if="loading">
            <Col span="24">
              <Spin fix>
                <Icon
                  type="ios-loading"
                  size="32"
                  class="demo-spin-icon-load"
                ></Icon>
                <div>Loading</div>
              </Spin>
            </Col>
          </Row>
          <Row v-else>
            <Col span="8">
              <p>Action:</p>
              <p>CPU:</p>
              <p>CPU Cores:</p>
              <p>host:</p>
              <p>Memory:</p>
              <p>Judge machine version:</p>
              <p>Number of tasks running：</p>
              <p>Server address：</p>
            </Col>
            <Col span="16">
              <p>{{ status.action }}</p>
              <p>{{ status.cpu }}</p>
              <p>{{ status.cpu_core }}</p>
              <p>{{ status.hostname }}</p>
              <p>{{ status.memory }}</p>
              <p>{{ status.judger_version }}</p>
              <p>
                {{
                  status.running_task_number ? status.running_task_number : 0
                }}
              </p>
              <p>{{ status.service_url }}</p>
            </Col>
          </Row>
        </div>
      </Card>
    </Col>
  </Row>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator'
import api from '@/api/api'

@Component
export default class JudgeServer extends Vue {
  loading: boolean = true
  status: any = {}
  getJudgeServer() {
    api
    .getJudgeServer({})
    .then((res: any) => {
      this.loading = false
      this.status = res.data[0]
    })
    .catch((err: any) => {
      ;(this as any).$Message.error(err.data.message)
    })
  }

  mounted() {
    this.getJudgeServer()
  }
}
</script>

<style lang="less" scoped>
.card {
  width: 80%;
  margin-top: 40px;
}

.demo-spin-icon-load {
  animation: ani-demo-spin 1s linear infinite;
}

@keyframes ani-demo-spin {
  from {
    transform: rotate(0deg);
  }
  50% {
    transform: rotate(180deg);
  }
  to {
    transform: rotate(360deg);
  }
}

.content {
  padding: 20px 40px;
  font-size: 16px;
}

p {
  padding: 4px 0;
}
</style>
