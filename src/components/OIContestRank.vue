<template>
  <div>
    <Row style="margin-bottom: 10px">
      <Col span="8">
              <span style="font-weight: 500;margin: 0 10px 0 10px;"
              >Auto Refresh：</span
              >
        <i-switch :disabled="refreshDisabled" @on-change="refreshAuto" />
      </Col>
    </Row>
    <div class="echarts">
      <ECharts :options="options" ref="chart" auto-resize style="width: 100%"></ECharts>
    </div>
    <Table ref="tableRank" :columns="columns" :data="dataRank" disabled-hover height="600"></Table>
    <Page :total="total"
          align="center"
          @on-change="pageChange"
          @on-page-size-change="pageSizeChange"
          show-sizer></Page>
  </div>

</template>
<script lang="ts">

import {Vue, Component} from 'vue-property-decorator';
import axios from "axios";
import api from "@/api/api";
import {breakLongWords} from "@/util/util";
@Component({})
export default class OIContestRank extends Vue {

  total: number = 0
  page: number = 1
  pageSize:number = 10
  contestID: string = ''
  contest: any = {}
  contestProblems: any = []
  dataRank: any = []
  columns: any = [
    {
      align: 'center',
      width: 50,
      fixed: 'left',
      render: (h: any, params: any) => {
        return h('span', {}, params.index + (this.page - 1) * this.pageSize + 1)
      }
    },
    {
      title: 'User',
      align: 'center',
      fixed: 'left',
      width: 150,
      render: (h: any, params: any) => {
        return h('a', {
          style: {
            display: 'inline-block',
            'max-width': '150px'
          },
          on: {
            // Todo
            // click: () => {
            //   this.$router.push(
            //       {
            //         name: 'user-home',
            //         query: {username: params.row.user.username}
            //       })
            // }
          }
        }, params.row.userName)
      }
    },
    {
      title: 'Total Score',
      align: 'center',
      render: (h: any , params: any ) => {
        return h('span', {}, params.row.score)
      }
    }

  ]
  options: any={
    title: {
      text: 'Top 10',
      left: 'center'
    },
    tooltip: {
      trigger: 'axis'
    },
    toolbox: {
      show: true,
      feature: {
        dataView: {show: true, readOnly: true , title: "Data View"},
        magicType: {show: true, type: ['line', 'bar'] , title: {
            line: "Line",
            bar: "Bar"
        }},
        saveAsImage: {show: true , title: "Save as Image"}
      },
      right: '10%',
      calculable: true
    },
    xAxis: [
      {
        type: 'category',
        data: ['root'],
        boundaryGap: true,
        axisLabel: {
          interval: 0,
          showMinLabel: true,
          showMaxLabel: true,
          align: 'center',
          formatter: (value:any , index:any) => {
            return breakLongWords(value, 14)
          }
        },
        axisTick: {
          alignWithLabel: true
        }
      }
    ],
    yAxis: [
      {
        type: 'value'
      }
    ],
    series: [
      {
        name: 'Score',
        type: 'bar',
        barMaxWidth: '80',
        data: [0],
        markPoint: {
          data: [
            {type: 'max', name: 'max'}
          ]
        }
      }
    ]
  }
  interval : any = null
  get refreshDisabled() {
    console.log(this.contest.status)
    return this.contest.status === 'ENDED'
  }

  refreshAuto(status: any) {
    if (status === true) {
      ;(this as any).$Message.success('Auto refresh')
      this.interval = setInterval(() => {
        this.page = 1
        this.getContestRankData(1, this.pageSize)
      }, 10000);
    } else {
      clearInterval(this.interval)
      ;(this as any).$Message.success('Auto refresh off')
    }
  }

  exportRank() {
    const params = this.$route.params
    const id: string = params.id
    axios({
      url: `/api/v1/contests/${id}/ranking/export`,
      method: 'get',
      responseType: 'arraybuffer'
    }).then(res => {
      this.download(res.data)
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

  getContestRankData(page: number, pageSize: number) {
    const params = this.$route.params
    const contestId: string = params.id
    api
    .getRanking(contestId)
    .then((res:any) => {
      if (page === 1) {
        this.applyToChart(res.data.rankingUserDTOs.slice(0, 10))
      }
      let dataRank = JSON.parse(JSON.stringify(res.data.rankingUserDTOs))
      dataRank.forEach((rank: any , i:any) => {
        let info = JSON.parse(rank.submissionInfo)
        Object.keys(info).forEach(problemID => {
          dataRank[i][problemID] = info[problemID]
        })
        this.dataRank = dataRank
      })
    }).catch((err: any) => {
      console.log(err)
      ;(this as any).$Message.error(err.data.message)
    })
  }
  addTableColumns(problems: any) {
    problems.forEach((problem: any) => {
      this.columns.push({
        align: 'center',
        key: problem.id,
        width: problems.length > 15 ? 80 : null,
        renderHeader: (h: any, params : any) => {
          return h('a', {
            'class': {
              'emphasis': true
            },
            on: {
              click: () => {
                this.toContestProblem(problem.id)
              },
            },
          }, problem.problemCode)
        },
        render: (h:any, params: any) => {
          return h('span', params.row[problem.id].score)
        }
      })
    })
  }
  toContestProblem(problemId: string) {
    const params = this.$route.params
    const id: string = params.id
    this.$router.push({
      path: `/contests/${id}/problems/${problemId}`,
    })
  }
  applyToChart (rankData: any) {
    let usernames : any = []
    let scores : any = []
    rankData.forEach((ele: any) => {
      usernames.push(ele.userName)
      scores.push(ele.score)
    })
    console.log(this.options)
    this.options.xAxis[0].data = usernames
    this.options.series[0].data = scores
  }

  pageChange(pages: number) {
    this.page = pages - 1
    this.getContestRankData(this.page, this.pageSize)
  }

  pageSizeChange(pageSize: number) {
    this.pageSize = pageSize
    this.getContestRankData(this.page, this.pageSize)
  }

  mounted(){
    this.contestID = this.$route.params.id
    api.getContestDetail({id: this.contestID}).then((res: any) => {
      this.contest = res.data
    }).catch((err: any) => {
      this.$Message.error(err.data.message)
    })
    this.getContestRankData(this.page, this.pageSize)
    api
    .getAllProblemsFromASpecificContest({ id: this.contestID }).then((res:any) => {
      res.data.list.sort((a:any, b:any) => {
        if (a.problemCode === b.problemCode) {
          return 0
        } else if (a.problemCode > b.problemCode) {
          return 1
        }
        return -1
      })
      this.contestProblems = res.data.list
      this.addTableColumns(this.contestProblems)
    })
  }


}
</script>


<style scoped lang="less">
  .echarts {
    margin: 20px auto;
    height: 400px;
    width: 100%;
  }

</style>