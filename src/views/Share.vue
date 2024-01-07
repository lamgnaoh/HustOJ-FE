<template>
  <Row>
    <Col span="10" offset="3">
      <div v-if="$store.state.role !== 'ROLE_USER'" class="top">
        <Button type="primary" @click="rejudge">Rejudge</Button>
      </div>
    </Col>
    <Col span="18" offset="3">
      <div class="container">
        <h2>
          Code shared from：
          <RouterLink :to="'/problems/' + commit.problemId"
          >{{ title }}
          </RouterLink>
        </h2>
        <div v-highlightjs="sourceCode">
          <pre>
            <code class="cpp"></code>
          </pre>
        </div>
        <h2>Result：{{ errMsg.result }}</h2>
        <div v-if="errMsg.result === 'COMPILE_ERROR'">
          <h4>Run：</h4>
          <div class="error">{{ errMsg.message }}</div>
        </div>
        <div
            v-if="
            errMsg.result !== 'COMPILE_ERROR' &&
              errMsg.result !== 'SYSTEM_ERROR'
          "
        >
          <table>
            <tr>
              <th>Debug information:</th>
            </tr>
            <tr>
              <td>Memory:</td>
              <td>{{ (errMsg.memory / (1024*1024)).toFixed(0) + ' mb' }} <span v-if="commit.result === 'ACCEPTED' && commit.memoryPercentile != null "> , Beat <Tag color="success">{{commit.memoryPercentile.toFixed(2)}}</Tag>  %</span> </td>
            </tr>
            <tr>
              <td>Duration:</td>
              <td>{{ errMsg.realTime }} ms<span v-if="commit.result === 'ACCEPTED' && commit.durationPercentile != null ">, Beat <Tag color="primary" >{{commit.durationPercentile.toFixed(2)}}</Tag>  %</span> </td>
            </tr>
            <tr>
              <td>CPU Time Limit Exceeded:</td>
              <td>{{ errMsg.cpuTimeLimitExceededCount }}</td>
            </tr>

            <tr>
              <td>Memory Limit Exceeded:</td>
              <td>{{ errMsg.memoryLimitExceededCount }}</td>
            </tr>

            <tr>
              <td>Time Limit Exceeded:</td>
              <td>{{ errMsg.timeLimitExceededCount }}</td>
            </tr>
            <tr>
              <td>Wrong Answer:</td>
              <td>{{ errMsg.wrongAnswerCount }}</td>
            </tr>
            <tr>
              <td>AC count/Total count</td>
              <td>{{ errMsg.passedCount }} / {{ errMsg.totalCount }}</td>
            </tr>
          </table>
        </div>
      </div>
    </Col>
  </Row>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator'
import api from '../api/api'

@Component
export default class Share extends Vue {
  commit: any = {}
  sourceCode: string = ''
  title: string = ''
  errMsg: any = {}
  select: string = 'ACCEPTED'
  submitList: Array<string> = [
    'ACCEPTED',
    'RUNTIME_ERROR',
    'CPU_TIME_LIMIT_EXCEEDED',
    'TIME_LIMIT_EXCEEDED',
    'MEMORY_LIMIT_EXCEEDED',
    'COMPILE_ERROR',
    'WRONG_ANSWER',
  ]

  rejudge() {
    const params = this.$route.params
    api
    .rejudge({
      id: params.id,
    })
    .then(res => {
      console.log(res.data)
      this.getCommit()
    })
    .catch((err: any) => {
      ;(this as any).$Message.error(err.data.message)
    })
  }

  judge(result: string) {
    const params = this.$route.params
    api
    .resetJudge({
      id: params.id,
      result: result,
    })
    .then(res => {
      this.getCommit()
    })
    .catch((err: any) => {
      ;(this as any).$Message.error(err.data.message)
    })
  }

  getCommit() {
    const params = this.$route.params
    api
    .getCommit({ id: params.id })
    .then((res: any) => {
      console.log(res.data)
      this.commit = res.data
      this.sourceCode = res.data.code.replace(/\\n/g, '\n')
      this.title = res.data.problemTitle
      this.errMsg = JSON.parse(res.data.resultDetail)
    })
    .catch((err: any) => {
      ;(this as any).$Message.error(err.data.message)
    })

  }

  mounted() {
    this.getCommit()
  }
}
</script>

<style lang="less" scoped>
.top {
  text-align: left;
  padding-top: 20px;
}
h2 {
  font-weight: 500;
  font-size: 36px;
  text-align: left;
  margin: 12px auto 18px 0;
}
h4 {
  margin: 10px auto 10px 0;
}
.container {
  padding-top: 24px;
  text-align: left;
}
.error {
  white-space: pre-line;
  padding: 20px;
  border: 1px solid rgba(0, 0, 0, 0.08);
  border-radius: 6px;
  background-color: rgba(0, 0, 0, 0.05);
}
td {
  padding-right: 15px;
}
</style>
