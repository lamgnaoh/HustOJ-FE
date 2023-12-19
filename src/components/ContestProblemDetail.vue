<template>
  <Row style="padding-top: 40px;">
    <Col span="20" offset="2" align="left">
      <Button icon="ios-undo" @click="toContest">Back</Button>
    </Col>
    <Col span="20" offset="2">
      <Tabs
          value="problem"
          style="padding-top: 40px;"
          v-on:on-click="getSubmission"
      >
        <TabPane label="Problem" name="problem">
          <Row :gutter="20">
            <Col span="20">
              <h1>{{ problem.title }}</h1>
              <div>
                <div class="problem-section">
                  <h3 class="title">Description</h3>
                  <p v-html="problem.description"></p>
                </div>
                <div class="problem-section">
                  <h3 class="title">Input Description</h3>
                  <p v-html="problem.inputDescription"></p>
                </div>
                <div class="problem-section">
                  <h3 class="title">Output description</h3>
                  <p v-html="problem.outputDescription"></p>
                </div>
                <div
                    class="problem-section"
                    v-for="(example, index) in problem.sampleIOList"
                    :key="index"
                >
                  <Row :gutter="20">
                    <Col span="12">
                      <h3 class="title">Sample input{{ index + 1 }}</h3>
                      <pre>{{ example.input }}</pre>
                    </Col>
                    <Col span="12">
                      <h3 class="title">Sample output{{ index + 1 }}</h3>
                      <pre>{{ example.output }}</pre>
                    </Col>
                  </Row>
                </div>

                <div style="display: flex;justify-content: left;">
                  <Button type="info" @click="hideInfo" v-if="!hide"
                  >View hidden information
                  </Button
                  >
                </div>
                <div class="problem-section" v-if="hide" style="clear: both">
                  <h3 class="title">Tag</h3>
                  <p>
                    <Tag
                        type="dot"
                        v-for="(tag, index) in problem.tagList"
                        :key="index"
                        color="success"
                    >{{ tag.name }}
                    </Tag
                    >
                  </p>
                </div>
              </div>
              <code-mirror
                  @codeSubmit="getCode"
                  logined="logined"
                  :myloading="codeLoading"
              ></code-mirror>
              <Card v-if="codeStatus" class="pro-status">
                Run Code Status:
                <span :style="{ color: codeColor }">{{ codeStatus }}</span
                >&nbsp;&nbsp;
                <router-link :to="shareRoute" target="_blank"
                >Check details
                </router-link
                >
              </Card>
            </Col>
            <Col span="4">
              <Card id="info">
                <div slot="title" class="header">
                  <Icon type="md-information-circle"/>
                  <span class="card-title">Information</span>
                </div>
                <ul>
                  <li>
                    <p>Time Limit</p>
                    <p>{{ problem.timeLimit }}MS</p></li>
                  <li>
                    <p>Memory Limit</p>
                    <p>{{ problem.ramLimit }}MB</p></li>
                  <li>
                    <p>Author</p>
                    <p>{{ problem.authorName }}</p></li>
                  <li v-if="problem.difficulty">
                    <p>Difficulty</p>
                    <p>{{ problem.difficulty }}</p></li>
                  <!--                  Todo-->
                  <!--                  <li v-if="problem.total_score">-->
                  <!--                    <p>{{$t('m.Score')}}</p>-->
                  <!--                    <p>{{problem.total_score}}</p>-->
                  <!--                  </li>-->
                  <li>
                    <p>Tags</p>
                    <p>
                      <Poptip trigger="hover" placement="left-end">
                        <a>Show</a>
                        <div slot="content">
                          <Tag v-for="(tag, index) in problem.tagList" :key="index">{{ tag.name }}</Tag>
                        </div>
                      </Poptip>
                    </p>
                  </li>
                </ul>
              </Card>
            </Col>
          </Row>
        </TabPane>
        <TabPane label="My Submission" name="submission">
          <Table :columns="title" :data="submission" border></Table>
        </TabPane>
      </Tabs>
    </Col>
  </Row>
</template>

<script lang="ts">
import { Component, Vue, Watch } from 'vue-property-decorator'
import api from '../api/api'
import CodeMirror from '@/components/CodeMirror.vue'

@Component({
  components: {
    CodeMirror,
  },
})
export default class ContestProblemDetail extends Vue {
  problem: any = {}
  submission: any = []
  hide: boolean = false
  codeLoading: boolean = false
  codeStatus: string = ''
  title: any = [
    {
      title: '#',
      key: 'index',
      width: 80,
    },
    {
      title: 'Submission time',
      key: 'createDate',
      render: (h: any, obj: any) => {
        return h(obj.row.createDate)
      },
    },
    {
      title: 'Language',
      key: 'language',
    },
    {
      title: 'Duration',
      key: 'duration',
      render: (h: any, obj: any) => {
        return h('span', (obj.row.duration || 0) + 'ms')
      },
    },
    {
      title: 'Result',
      key: 'result',
    },
  ]
  submissionId: string = ''

  get logined() {
    return window.localStorage.getItem('token')
  }

  get codeColor() {
    if (this.codeStatus === 'ACCEPTED') {
      return 'green'
    } else {
      return 'red'
    }
  }

  @Watch('$route')
  handleRoute() {
    // There is no change when directly inputting the route.
    this.getProblemDetail()
    this.hide = false
  }

  hideInfo() {
    this.hide = true
  }

  getCode(code: any) {
    if (code.code) {
      this.codeLoading = true
      const params = this.$route.params
      api
      .contestCommit({
        contestId: params.contestId,
        problemId: params.problemId,
        language: code.language,
        code: code.code,
      })
      .then((res: any) => {
        this.codeLoading = false
        this.codeStatus = res.data.result
        this.submissionId = res.data.id
      })
      .catch((err: any) => {
        // error data code need to change
        if (err.data.code === -6) {
          ;(this as any).$Message.info('Not in the entry list, trying to join the competition')
          api
          .sendPassword({
            id: params.contestId,
            password: '',
          })
          .then(res => {
            ;(this as any).$Message.success('Joined successfully, please resubmit')
          })
          .catch(() => {
            ;(this as any).$Message.error('Failed to join, please try again')
          })
        }
        ;(this as any).$Message.error(err.data.message)
        this.codeLoading = false
      })
    } else {
      ;(this as any).$Message.error('Code cannot be empty')
    }
  }

  getSubmission(name: string) {
    if (name === 'submission') {
      const params = this.$route.params
      api
      .getContestSubmission({
        contestId: params.contestId,
        problemId: params.problemId,
      })
      .then((res: any) => {
        let index = 0
        this.submission = res.data.map((item: any) => {
          index = index + 1
          item.index = index
          if (item.result === 'ACCEPTED') {
            return {
              ...item,
              cellClassName: {
                result: 'accept-class',
              },
            }
          } else {
            return {
              ...item,
              cellClassName: {
                result: 'err-class',
              },
            }
          }
        })
      })
      .catch(() => {
        console.log('err')
      })
    }
  }

  get shareRoute() {
    return this.toShare(this.submissionId);
  }

  toShare(id: string) {
    const routeData = this.$router.resolve({
      name: 'share',
      params: { id: id },
    })
    window.open(routeData.href, '_blank')
  }

  toContest() {
    const params = this.$route.params
    this.$router.push({
      path: `/contests/${params.contestId}`,
    })
  }

  getProblemDetail() {
    this.codeLoading = false
    const params = this.$route.params
    api
    .getContestProblemsDetail({
      cid: params.contestId,
      pid: params.problemId,
    })
    .then((res: any) => {
      this.problem = res.data
    })
    .catch(() => {
      ;(this as any).$Message.error('Failed to get problem details')
    })
  }

  mounted() {
    this.getProblemDetail()
  }
}
</script>

<style lang="less" scoped>
.pro-status {
  text-align: left;
  margin-top: 32px;
}

h1 {
  font-size: 30px;
  font-weight: 500;
  margin-top: 20px;
  margin-bottom: 10px;
}

h3 {
  text-align: left;
  font-size: 16px;
  font-weight: 700;
}

.problem-description {
  color: #777;
  font-size: 13px;
  line-height: 1.4;
  margin: 10px 0;
}

.problem-section {
  padding: 5px 0;
  p {
    text-align: left;
    font-size: 15px;
    color: rgb(51, 51, 51);
    margin-bottom: 10px;
  }
  pre {
    background-color: white;
    white-space: pre-wrap;
    word-wrap: break-word;
    padding: 9px;
    margin: 2px 0 9px;
    font-size: 12px;
    line-height: 1.4;
    border-radius: 0;
    border: 1px solid #ccc;
    text-align: left;
  }
}

.ivu-table .accept-class {
  color: rgb(60, 118, 61) !important;
  background-color: rgb(223, 240, 216) !important;
}

.ivu-table .err-class {
  color: #a94442 !important;
  background-color: rgb(242, 222, 222) !important;
}

#info {
  margin-bottom: 20px;
  margin-top: 20px;
  text-align: left;
  .card-title {
    margin-left: 8px;
  }

  ul {
    list-style-type: none;

    li {
      border-bottom: 1px dotted #e9eaec;
      margin-bottom: 10px;

      p {
        display: inline-block;
      }

      p:first-child {
        width: 90px;
      }

      p:last-child {
        float: right;
      }
    }
  }
}
</style>
