<template>
  <Row>
    <Col span="22" offset="1">
      <Modal
          v-model="modalPassword"
          title="Password validation"
          @on-ok="sendPassword"
          @on-cancel="cancel"
      >
        <p style="padding-bottom: 10px;font-size: 18px">To join, please enter your password :</p>
        <Input
            v-model="password"
            type="password"
            placeholder="Enter contest password"
            style="width: 200px"
        />
      </Modal>
      <Modal
          v-model="modal"
          :title="modalTitle"
          @on-ok="cancel"
          @on-cancel="cancel"
      >
        <p>{{ modalContent }}</p>
      </Modal>
      <div class="timeInterval" v-if="contestStatus === 'Processing'">
        Left: {{ interval }} competition is over
      </div>
      <Tabs
          value="detail"
          style="padding-top: 40px;"
          v-on:on-click="onTabChange"
      >
        <TabPane label="Contest details" name="detail" class="pane-padding">
          <h1>{{ contest.name }}</h1>
          <h3 style="text-align: left;font-weight: 600;">Description:</h3>
          <p class="description" v-html="contest.description"></p>
          <Table stripe :columns="columns" :data="data">
          </Table>
        </TabPane>
        <TabPane label="Problem list" name="problem" class="pane-padding">
          <Table :columns="title" :data="problems"></Table>
        </TabPane>
        <TabPane
            label="Ranking"
            name="rank"
            style="text-align: left"
            class="pane-padding"
        >
          <Row>
            <Col span="8">
              <span style="font-weight: 500;margin: 0 10px 0 10px;"
              >Auto Refresh：</span
              >
              <i-switch v-model="autoRefresh" @on-change="refreshAuto" />
            </Col>
            <Col span="4">
              <Button type="primary" @click="exportRank">Export</Button>
            </Col>
          </Row>
          <table style="margin-top: 20px;">
            <tbody>
            <tr class="first-title">
              <td style="width:30px;">#</td>
              <td style="width:100px;">Username</td>
              <td style="width:100px;">AC/Total Submit</td>
              <td
                  style="width:100px;"
                  v-if="contest.judgeType === 'IMMEDIATELY'"
              >
                Time cost + Penalty time
              </td>
              <td style="width:100px;" v-else>Total score</td>
              <td
                  v-for="item in problemKey"
                  :key="item"
                  style="width: 100px;"
              >
                {{ item }}
              </td>
            </tr>
            <tr
                class="second-title"
                v-for="(user, index) in ranking"
                :key="index"
            >
              <td>{{ index + 1 }}</td>
              <td>{{ user.userName }}</td>
              <td>{{ user.acceptCount }}/{{ user.submitCount }}</td>
              <td v-if="contest.judgeType === 'IMMEDIATELY'">
                <p v-html="timetrans(user.time)"></p>
                <p v-if="user.errorCount !== 0">(-{{ user.errorCount }})</p>
              </td>
              <td v-else>
                <p>{{ user.score }}</p>
              </td>
              <!--<template v-for="key in problemKey">-->
              <template v-for="(problem, key) in user.timeList">
                <template v-if="contest.judgeType === 'IMMEDIATELY'">
                  <template v-if="problem.submitted === true">
                    <td
                        v-if="problem.passed === true"
                        :class="choose(problem.firstPassed)"
                    >
                      <div>{{ timetrans(problem.totalTime) }}</div>
                      <div v-if="problem.errorCount !== 0">
                        (-{{ problem.errorCount }})
                      </div>
                    </td>
                    <td v-else class="red">
                      <p v-html="timetrans(problem.totalTime)"></p>
                      <p v-if="problem.errorCount !== 0">
                        (-{{ problem.errorCount }})
                      </p>
                    </td>
                  </template>
                  <td v-else class="not-submitted"></td>
                </template>
                <template v-else>
                  <td :class="problem.submitted ? 'green' : 'red'">
                    <p>{{ problem.score }}</p>
                  </td>
                </template>
              </template>
            </tr>
            </tbody>
          </table>
        </TabPane>
        <TabPane
            label="Submission"
            name="submit"
            v-if="showContestSubmission()"
            style="text-align: left"
            class="pane-padding"
        >
          <Row></Row>
          <Table :columns="titleSubmission" :data="status"></Table>
          <div style="text-align: center;padding-top: 30px;">
            <Page
                :total="total"
                show-sizer
                @on-change="pageChange"
                @on-page-size-change="pageSizeChange"
            />
          </div>
        </TabPane>
      </Tabs>
    </Col>
  </Row>
</template>

<script lang="ts">
import { Vue, Component, Watch } from 'vue-property-decorator'
import api from '@/api/api'
import { UserRole } from '../types/user'
import { RankingQuery } from '../types/ranking'
import axios from 'axios'
import { countInterval } from '@/util/util'
@Component
export default class ContestDetail extends Vue {
  show: boolean = false
  modalPassword: boolean = false
  modal: boolean = false
  modalTitle: string = ''
  modalContent: string = ''
  password: string = ''
  problemKey: Array<String> = []
  index = 0
  contest: any = {}
  columns: any = [
    {
      title: 'Start time',
      key: 'start',
    },
    {
      title: 'End time',
      key: 'end',
    },
    {
      title: 'Status',
      key: 'status',
    },
    {
      title: 'Contest type',
      key: 'type',
    },
    {
      title: 'Rule',
      key: 'contestRuleType',
    },
    {
      title: 'Author',
      key: 'name',
    },
  ]
  contestStatus: string = 'Processing'
  data: any = []
  title: any = [
    {
      key: 'myStatus',
      render: (h: any, obj: any) => {
        if (obj.row.myStatus === 'ACCEPTED') {
          return h('Icon', {
            props: {
              type: 'md-checkmark',
              size: 20,
              color: '#19be6b',
            },
          })
        }
      } ,
      width: 80
    },
    {
      title: 'ID',
      key: 'index',
      render: (h: any, obj: any) => {
        return h('span', obj.row.index)
      },
      width: 80,
    },
    {
      title: 'Problem title',
      key: 'title',
      className: 'pointer-class',
      render: (h: any, obj: any) => {
        return h(
            'span',
            {
              on: {
                click: () => {
                  this.toContestProblem(obj.row.id)
                },
              },
            },
            obj.row.title
        )
      },
    },
    {
      title: 'AC rate',
      key: 'authorName',
      className: 'pointer-class',
      render: (h: any, obj: any) => {
        return h(
            'span',
            Math.floor(obj.row.acceptRate * 100) +
            '%(' +
            String(obj.row.acceptCount) +
            ' / ' +
            String(obj.row.submitCount) +
            ')'
        )
      },
    },
  ]
  problems: any = []
  autoRefresh: any = false
  ranking: Array<any> = []

  name: string = ''
  author: string = ''
  groupSearch: Array<any> = []
  authorSearch: Array<any> = []
  groupSelect: string = ''
  authorSelect: string = ''

  page: number = 0
  pageSize: number = 10
  total: number = 0
  endDate: number = 0
  interval: string = ''

  titleSubmission: any = [
    {
      title: 'Author',
      key: 'authorName',
      width: 150,
      className: 'pointer-class',
    },
    {
      title: 'Problem title',
      key: 'problemTitle',
      className: 'pointer-class',
      render: (h: any, obj: any) => {
        return h(
            'span',
            {
              on: {
                click: () => {
                  this.toContestProblemSubmission(obj.row.id)
                },
              },
            },
            obj.row.problemTitle
        )
      },
    },
    {
      title: 'Submisstion time',
      key: 'createDate',
    },
    {
      title: 'Language',
      key: 'language',
      filters: [
        {
          label: 'C',
          value: 1,
        },
        {
          label: 'CPP',
          value: 2,
        },
        {
          label: 'JAVA',
          value: 3,
        },
      ],
      filterMultiple: false,
      filterMethod(value: any, row: any) {
        if (value === 1) {
          return row.language === 'C'
        } else if (value === 2) {
          return row.language === 'CPP'
        } else if (value === 3) {
          return row.language === 'JAVA'
        }
      },
    },
    {
      title: 'Duration',
      key: 'duration',
      render: (h: any, obj: any) => {
        return h('span', (obj.row.duration || 0) + ' ms')
      },
    },
    {
      title: 'Memory',
      key: 'memory',
      render: (h: any, obj: any) => {
        return h('span', obj.row.memory !=null ? (obj.row.memory / (1024*1024)).toFixed(0) + ' mb' : '--')
      },
    },
    {
      title: 'Result',
      key: 'result',
      width: 350,
      align: 'center',
      filters: [
        {
          label: 'Accepted',
          value: 1,
        },
        {
          label: 'Wrong Answer',
          value: 2,
        },
        {
          label: 'Runtime Error',
          value: 3,
        },
        {
          label: 'Time Limit Exceeded',
          value: 4,
        },
        {
          label: 'Memory Limit Exceeded',
          value: 5,
        },
        {
          label: 'Compile Error',
          value: 6,
        },
        {
          label: 'Format Error',
          value: 7,
        },
      ],
      filterMultiple: false,
      filterMethod(value: any, row: any) {
        if (value === 1) {
          return row.result === 'Accepted'
        } else if (value === 2) {
          return row.result === 'Wrong Answer'
        } else if (value === 3) {
          return row.result === 'Runtime Error'
        } else if (value === 4) {
          return row.result === 'Time Limit Exceeded'
        } else if (value === 5) {
          return row.result === 'Memory Limit Exceeded'
        } else if (value === 6) {
          return row.result === 'Compile Error'
        } else if (value === 7) {
          return row.result === 'Format Error'
        }
      },
    },
  ]
  status: any = []

  @Watch('name')
  handleName(name: string) {
    if (name === '' && this.author === '') {
      this.getContestRanking()
    }
  }
  @Watch('author')
  handleAuthor(name: string) {
    if (name === '' && this.name === '') {
      this.getContestRanking()
    }
  }
  showContestSubmission(){
    return (this.role != "ROLE_USER" &&
        this.$store.state.currentContest.authorId == this.$store.getters.getUserId ) ||
        this.$store.getters.isSuperAdmin
  }

  get role() {
    return this.$store.state.userInfo.authorities[0].authority
  }

  getGroupsByName(name: string) {
    this.authorSelect = ''
    this.author = ''
    api
    .getGroups({ name })
    .then(res => {
      this.groupSearch = res.data.list
    })
    .catch((err: any) => {
      ;(this as any).$Message.error(err.data.message)
    })
  }

  selectedGroup(id: any) {
    this.groupSelect = id
    this.getContestRanking({
      groupId: this.groupSelect,
      // teacherId: this.authorSelect,
    })
  }

  getAuthorByName() {
    api
    .getUser({
      role: UserRole.ADMIN,
    })
    .then(res => {
      this.authorSearch = res.data.list
    })
    .catch((err: any) => {
      ;(this as any).$Message.error(err.data.message)
    })
  }

  selectedAuthor(id: any) {
    this.authorSelect = id
    this.getContestRanking({
      // groupId: this.groupSelect,
      teacherId: this.authorSelect,
    })
  }

  timetrans(time: string) {
    const date = new Date(time)
    const h =
        date.getHours() - 8 < 10
            ? '0' + (date.getHours() - 8)
            : date.getHours() - 8
    const m =
        date.getMinutes() < 10 ? '0' + date.getMinutes() : date.getMinutes()
    const s =
        date.getSeconds() < 10 ? '0' + date.getSeconds() : date.getSeconds()
    return h + ':' + m + ':' + s
  }

  onTabChange(name: any) {
    switch (name) {
      case 'rank':
        this.getContestRanking()
        break
      case 'problem':
        this.getContestProblems()
        break
      case 'submit':
        this.getAllSubmissionOfContest()
      default:
        break
    }
  }

  pageChange(pages: number) {
    this.page = pages - 1
    this.getAllSubmissionOfContest(pages - 1, this.pageSize)
  }

  pageSizeChange(size: number) {
    this.getAllSubmissionOfContest(this.page, size)
    this.pageSize = size
  }

  toContestProblemSubmission(id: string) {
    this.$router.push({
      path: `/share/${id}`,
    })
  }

  getAllSubmissionOfContest(page: number = 0, pageSize: number = 10) {
    const params = this.$route.params
    const id: string = params.id
    api
    .getAllSubmissionOfContest({
      contestId: id,
      page: page,
      size: pageSize,
    })
    .then(res => {
      this.total = res.data.total
      this.status = res.data.list
    }).catch(err => {
      this.$Message.error(err.data.message)
    })
  }

  choose(status: boolean) {
    if (status) {
      return 'deepGreen'
    } else {
      return 'green'
    }
  }

  refreshAuto(status: any) {
    if (status === true) {
      ;(this as any).$Message.success('Auto refresh')
    } else {
      ;(this as any).$Message.success('Auto refresh off')
    }
  }

  findStatus(value: any) {
    let status = ''
    if (value === 'NOT_STARTED') {
      status = 'Has not started'
    } else if (value === 'PROCESSING') {
      status = 'Processing'
    } else {
      status = 'Has Ended'
    }
    return status
  }

  findType(t: string) {
    let type = ''
    if (t === 'PUBLIC') {
      type = 'Public'
    } else if (t === 'SECRET_WITH_PASSWORD') {
      type = 'Private'
    }
    return type
  }

  getContestDetail() {
    const params = this.$route.params
    const id: any = params.id
    api
    .getContestDetail({ id })
    .then((res: any) => {
      this.$store.state.currentContest = res.data
      this.contest = res.data
      this.contestStatus = this.findStatus(res.data.status)
      const t = res.data.contestType
      const type = this.findType(t)
      this.endDate = res.data.endDate
      this.data.push({
        start: res.data.startDate,
        end: res.data.endDate,
        status: this.contestStatus,
        type: type,
        contestRuleType: res.data.contestRuleType,
        name: res.data.authorName,
      })
      const ed = new Date(Date.parse(res.data.endDate.replace(/-/g, '/'))) // end date
      setInterval(() => {
        const now = new Date()
        this.interval = countInterval(now, ed)
      }, 1000)
    })
    .catch((err: any) => {
      ;(this as any).$Message.error(err.data.message)
      if (err.status === 400) {
        switch (err.data.code) {
            // Contest has not started
          case "025":
            this.modal = true
            this.modalTitle = 'Contest has not started'
            this.modalContent = 'Contest has not started yet and you do not have the right to view contest information.'
            break
            // There is no such contest
          case "016":
            this.modal = true
            this.modalTitle = 'No such contest'
            this.modalContent = 'You have entered unknown contest！'
            break
            // Password required
          case "034":
            this.modalPassword = true
            break
          default:
            break
        }
      }
    })
  }

  getContestProblems() {
    this.problems = []
    const params = this.$route.params
    const id: string = params.id
    const that = this
    api
    .getAllProblemsFromASpecificContest({ id })
    .then((res: any) => {
      let index = 0
      res.data.list.forEach((item: any) => {
        index = index + 1
        item.index = index
        that.problems.push({
          ... item
        })
      })
      console.log(that.problems)
    })
    .catch((error: any) => {
      console.log(error)
    })
  }

  toContestProblem(problemId: string) {
    const params = this.$route.params
    const id: string = params.id
    this.$router.push({
      path: `/contests/${id}/problems/${problemId}`,
    })
  }

  sendPassword() {
    const pwd = this.password
    const params = this.$route.params
    const contestId: string = params.id // contestId
    api
    .sendPassword({
      id: contestId,
      password: pwd,
    })
    .then((res: any) => {
      this.$Message.success("Join successfully")
      this.getContestDetail();
    })
    .catch((err: any) => {
      ;(this as any).$Message.error(err.data.message)
      this.cancel()
    })
  }

  cancel() {
    this.$router.push({
      path: '/contests',
    })
  }

  download(data: any) {
    if (!data) {
      return
    }
    let url = window.URL.createObjectURL(
        new Blob([data], {
          type: 'application/octet-stream',
        })
    )
    let link = document.createElement('a')
    link.style.display = 'none'
    link.href = url
    link.setAttribute('download', 'ranking.xlsx')
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
  }

  exportRank() {
    const params = this.$route.params
    const id: string = params.id
    const rankParams = {
      groupId: this.groupSelect,
      teacherId: this.authorSelect,
    }
    axios({
      url: `/api/v1/contests/${id}/ranking/export`,
      method: 'get',
      responseType: 'arraybuffer',
      params: rankParams,
    }).then(res => {
      this.download(res.data)
    })
  }

  getContestRanking(query?: RankingQuery) {
    const params = this.$route.params
    const id: string = params.id
    api
    .getRanking(id, query)
    .then((res: any) => {
      if (res.data.rankingUserList.length > 0) {
        this.problemKey = Object.keys(res.data.rankingUserList[0].timeList)
        this.ranking = res.data.rankingUserList
      } else {
        this.problemKey = []
        this.ranking = []
      }
    })
    .catch((err: any) => {
      ;(this as any).$Message.error(err.data.message)
    })
  }

  mounted() {
    this.getContestDetail()
    setTimeout(() => {
      this.show = true
    }, 1)
  }
}
</script>

<style lang="less" scoped>
.pane-padding {
  padding-top: 30px;
}

h1 {
  font-size: 30px;
  font-weight: 400;
  margin-bottom: 20px;
}

.description {
  text-align: left;
  padding: 20px 0 40px 0;
}

.red {
  color: #a94442;
  background-color: #f2dede;
}

.deepGreen {
  background-color: #3c9;
  color: #3c763d;
}

.green {
  color: #3c763d;
  background-color: #dff0d8;
}

.list {
  margin-top: 40px;
  text-align: left;
  color: #17233d;
  font-weight: 600;
  border-bottom: 1px solid #e8eaec;
  padding-bottom: 10px;
}

.item {
  text-align: left;
  border-bottom: 1px solid #e8eaec;
  padding-top: 10px;
  padding-bottom: 10px;
}

table {
  border-collapse: collapse;
}

td,
tr {
  text-align: center !important;
}

.first-title {
  width: 100%;
  height: 40px;
  white-space: nowrap;
  overflow: hidden;
  background-color: #f8f8f9;
  td {
    min-width: 0;
    height: 48px;
    box-sizing: border-box;
    text-overflow: ellipsis;
    vertical-align: middle;
    border: 1px solid #e8eaec;
  }
}

.second-title {
  width: 100%;
  height: 40px;
  white-space: nowrap;
  overflow: hidden;
  td {
    min-width: 0;
    height: 48px;
    box-sizing: border-box;
    text-align: left;
    text-overflow: ellipsis;
    vertical-align: middle;
    border: 1px solid #e8eaec;
  }
}

.timeInterval {
  padding-top: 30px;
  font-size: 16px;
}
</style>
