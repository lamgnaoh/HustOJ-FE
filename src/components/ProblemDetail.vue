<template>
  <Row>
    <Col span="18" offset="3">
      <div class="container">
        <Tabs @on-click="getSubmission">
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
                      v-for="(example, index) in sampleList"
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
                    :myStatus="myStatus"
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
                    <li>
                      <p>Rule</p>
                      <p>{{ problem.ruleType }}</p></li>
                    <li v-if="problem.totalScore">
                      <p>Score</p>
                      <p>{{problem.totalScore}}</p>
                    </li>
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
          <TabPane label="Submission" name="submission">
            <Table :columns="title" :data="submission" border></Table>
          </TabPane>
        </Tabs>
      </div>
    </Col>
  </Row>
</template>

<script lang="ts">
import {Component, Vue, Watch} from 'vue-property-decorator'
import api from '@/api/api'
import CodeMirror from '@/components/CodeMirror.vue'

@Component({
  components: {
    CodeMirror,
  },
})
export default class ProblemDetail extends Vue {
  problem: any = {}
  submission: any = []
  hide: boolean = false
  codeLoading: boolean = false
  codeStatus: string = ''
  submissionId: string = '1'
  sampleList: Array<any> = []
  myStatus: string = ''
  title: any = [
    {
      title: '#',
      key: 'id',
      width: 78,
      className: 'pointer-class',
      render: (h: any, obj: any) => {
        return h(
            'span',
            {
              on: {
                click: () => {
                  this.toShare(obj.row.shareId)
                },
              },
            },
            obj.row.id
        )
      },
    },
    {
      title: 'Submission time',
      key: 'createDate',
    },
    {
      title: 'Language',
      key: 'language',
    },
    {
      title: 'Duration',
      key: 'duration',
    },
    {
      title: 'Result',
      key: 'result',
    },
  ]

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

  get shareRoute() {
    return '/share/' + this.submissionId
  }

  @Watch('$route')
  handleRoute() {
    this.getProblemDetail()
    this.hide = false
  }

  hideInfo() {
    this.hide = true
  }

  toShare(id: string) {
    const routeData = this.$router.resolve({
      name: 'share',
      params: {id: id},
    })
    window.open(routeData.href, '_blank')
  }

  getCode(code: any) {
    if (code.code) {
      this.codeLoading = true
      const params = this.$route.params
      api
      .createCommit({
        id: params.id,
        language: code.language,
        code: code.code,
      })
      .then((res: any) => {
        this.codeLoading = false
        this.codeStatus = res.data.result
        this.submissionId = res.data.id
      })
      .catch((err: any) => {
        ;(this as any).$Message.error(err.data.message)
        this.codeLoading = false
        // this.codeStatus = 'ACCEPTED';
      })
    } else {
      ;(this as any).$Message.error('Code cannot be empty')
    }
  }

  getSubmission(name: string) {
    if (name === 'submission') {
      const params = this.$route.params
      api
      .getSpecificCommit({id: params.id})
      .then((res: any) => {
        let id = 0
        this.submission = res.data.map((item: any) => {
          item.shareId = item.id
          id = id + 1
          item.id = id
          const duration = item.duration || 0
          item.duration = duration + 'ms'
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
      .catch((err) => {
        console.log(err)
      })
    }
  }

  getProblemDetail() {
    this.codeLoading = false
    const params = this.$route.params
    api
    .getProblemsDetail({id: params.id})
    .then((res: any) => {
      this.problem = res.data
      this.myStatus = this.problem.myStatus
      if (this.problem.sampleIO) {
        this.sampleList = JSON.parse(this.problem.sampleIO)
      } else {
        this.sampleList = []
      }
    })
    .catch((err: any) => {
      console.log(err, 'err')
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

.container {
  padding-top: 24px;
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
  .title {
    font-size: 20px;
    font-weight: 400;
    margin: 25px 0 8px 0;
    color: #3091f2;
  }
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
