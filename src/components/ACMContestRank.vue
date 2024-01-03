<template>
  <div>
    <Row style="margin-bottom: 10px">
      <Col span="8">
              <span style="font-weight: 500;margin: 0 10px 0 10px;"
              >Auto Refresh：</span
              >
        <i-switch v-model="autoRefresh" @on-change="refreshAuto" />
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
// @ts-ignore
import moment from 'moment'
import api from "@/api/api";
import {breakLongWords} from "@/util/util";
import axios from "axios";

@Component({
})
export default class ACMContestRank extends Vue {
  page: number = 1
  pageSize:number = 10
  total: number = 0
  contestID: string = ''
  contest: any = {}
  contestProblems: any = []
  autoRefresh: boolean = false
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
      title: 'AC/Total',
      align: 'center',
      width: 100,
      render: (h: any, params: any) => {
        return h('span', {}, [
          h('span', {}, params.row.acceptCount + ' / ' + params.row.submitCount)
        ])
      }
    },
    {
      title: 'Total Time',
      align: 'center',
      width: 150,
      render: (h: any, params: any) => {
        return h('span', this.parseTotalTime(params.row.time))
      }
    }
  ]

  options: any = {
    title: {
      text: 'Top 10',
      left: 'center'
    },
    dataZoom: [
      {
        type: 'inside',
        filterMode: 'none',
        xAxisIndex: [0],
        start: 0,
        end: 100
      }
    ],
    toolbox: {
      show: true,
      feature: {
        saveAsImage: {show: true, title: 'Save as image'}
      },
      right: '5%'
    },
    tooltip: {
      trigger: 'axis',
      axisPointer: {
        type: 'cross',
        axis: 'x'
      }
    },
    legend: {
      orient: 'vertical',
      y: 'center',
      right: 0,
      data: [],
      formatter: (value:any) => {
        return breakLongWords(value, 16)
      },
      textStyle: {
        fontSize: 12
      }
    },
    grid: {
      x: 80,
      x2: 200
    },
    xAxis: [{
      type: 'time',
      splitLine: false,
      axisPointer: {
        show: true,
        snap: true
      }
    }],
    yAxis: [
      {
        type: 'category',
        boundaryGap: false,
        data: [0]
      }],
    series: []
  }

  interval : any = null
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


  parseTotalTime(totalTime: string) {
    let m = moment.duration(totalTime, 'ms')
    return [Math.floor(m.asHours()), m.minutes(), m.seconds()].join(':')
  }

  getContestRankData(page: number, pageSize: number) {
    // @ts-ignore
    const params = this.$route.params
    const contestId: string = params.id
    api
    .getRanking(contestId)
    .then((res: any) => {
      if (page === 1) {
        this.applyToChart(res.data.rankingUserDTOs.slice(0, 10))
      }

      let dataRank = JSON.parse(JSON.stringify(res.data.rankingUserDTOs))
      dataRank.forEach((rank: any , i:any) => {
        let info = JSON.parse(rank.submissionInfo)
        let cellClass : any = {}
        Object.keys(info).forEach(problemID => {
          dataRank[i][problemID] = info[problemID]
          dataRank[i][problemID].acTime = this.parseTotalTime(dataRank[i][problemID].acTime)
          let status = info[problemID]
          if (status.isFirstAc) {
            cellClass[problemID] = 'first-ac'
          } else if (status.isAc) {
            cellClass[problemID] = 'ac'
          } else {
            cellClass[problemID] = 'wa'
          }
        })
        dataRank[i].cellClassName = cellClass
      })
      this.dataRank = dataRank

    })
    .catch((err: any) => {
      ;(this as any).$Message.error(err.data.message)
    })
  }

  applyToChart(rankData: any) {
    let users : any = []
    let seriesData : any = []
    rankData.forEach((rank: any) => {
      users.push(rank.userName)
      let info = JSON.parse(rank.submissionInfo)
      let timeData : any = []
      Object.keys(info).forEach(problemID => {
        if (info[problemID].isAc) {
          timeData.push(info[problemID].acTime)
        }
      })
      timeData.sort((a: any, b : any) => {
        return a - b
      })
      let data = []
      data.push([this.contest.startDate, 0])
      for (let [index, value] of timeData.entries()) {
        let realTime = moment(this.contest.startDate).add(value, 'milliseconds').format()
        data.push([realTime, index + 1])
      }
      seriesData.push({
        name: rank.userName,
        type: 'line',
        data
      })
    })
    this.options.series = seriesData
    this.options.legend.data = users
  }


  pageChange(pages: number) {
    this.page = pages - 1
    this.getContestRankData(this.page, this.pageSize)
  }

  pageSizeChange(pageSize: number) {
    this.pageSize = pageSize
    this.getContestRankData(this.page, this.pageSize)
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
          if (params.row[problem.id]) {
            let status = params.row[problem.id]
            let acTime, errorNumber
            if (status.isAc) {
              acTime = h('span', status.acTime)
            }
            if (status.errorNumber !== 0) {
              errorNumber = h('p', '(-' + status.errorNumber + ')')
            }
            return h('div', [acTime, errorNumber])
          }
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
  addChartCategory (contestProblems: any) {
    let category = []
    for (let i = 0; i <= contestProblems.length; ++i) {
      category.push(i)
    }
    this.options.yAxis[0].data = category
  }

  mounted() {
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
      this.addChartCategory(this.contestProblems)
    })
  }
}

</script>

<style lang="less">

.echarts {
  margin: 20px auto;
  height: 400px;
  width: 100%;
}

.ivu-table .first-ac {
  background-color: #33CC99;
  color: #3c763d;
}

.ivu-table .ac {
  background-color: #dff0d8;;
  color: #3c763d;
}

.ivu-table .wa {
  color: #a94442;
  background-color: #f2dede;
}
</style>