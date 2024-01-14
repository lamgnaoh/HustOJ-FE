<template>
  <div class="status">
    <Row justify="center" class="contain-padding">
      <h1 style="margin-bottom: 20px;">My Submission</h1>
      <Col span="20" offset="2">
        <Table :columns="title" :data="status"></Table>
      </Col>
    </Row>
    <Row justify="center" style="margin-top: 36px">
      <Page
          :total="total"
          show-sizer
          @on-change="pageChange"
          @on-page-size-change="pageSizeChange"
      />
    </Row>
  </div>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator'
import api from '../api/api'
import {JUDGE_STATUS} from "@/api/constant";

@Component({
  computed: {
    JUDGE_STATUS() {
      return JUDGE_STATUS
    }
  }
})
export default class Submission extends Vue {
  total: number = 10
  pageSize: number = 10
  page: number = 0
  title: any = [
    {
      title: '#',
      key: 'id',
      width: 78,
    },
    {
      title: 'Author',
      key: 'authorName',
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
                  this.toProblem(obj.row.problemId)
                },
              },
            },
            obj.row.problemTitle
        )
      },
    },
    {
      title: 'Submission Date',
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
        {
          label: 'PYTHON2',
          value: 4,
        },
        {
          label: 'PYTHON3',
          value: 5,
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
        } else if (value === 4) {
          return row.language === 'PYTHON2'
        } else if (value === 5) {
          return row.language === 'PYTHON3'
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
      title: 'Result',
      key: 'result',
      width: 350,
      align: 'center',
      filters: [
        {
          label: 'Wrong Answer',
          value: -1,
        },
        {
          label: 'Accepted',
          value: 0,
        },
        {
          label: 'CPU Time Limit Exceeded',
          value: 1,
        },
        {
          label: 'Time Limit Exceeded',
          value: 2,
        },
        {
          label: 'Memory Limit Exceeded',
          value: 3,
        },
        {
          label: 'Runtime Error',
          value: 4,
        },
        {
          label: 'System Error',
          value: 5,
        },
        {
          label: 'Compile Error',
          value: 6,
        },
      ],
      filterMultiple: false,
      filterMethod(value: any, row: any) {
        if (value === 0) {
          return row.result === 'ACCEPTED'
        } else if (value === -1) {
          return row.result === 'WRONG_ANSWER'
        } else if (value === 1) {
          return row.result === 'CPU_TIME_LIMIT_EXCEEDED'
        } else if (value === 2) {
          return row.result === 'TIME_LIMIT_EXCEEDED'
        } else if (value === 3) {
          return row.result === 'MEMORY_LIMIT_EXCEEDED'
        } else if (value === 4) {
          return row.result === 'RUNTIME_ERROR'
        } else if (value === 5) {
          return row.result === 'SYSTEM_ERROR'
        } else if (value === 6) {
          return row.result === 'COMPILE_ERROR'
        }
      },
    },
  ]
  status: any = []

  toProblem(id: any) {
    this.$router.push({
      name: 'problem',
      params: { id: id },
    })
  }

  pageChange(pages: number) {
    this.page = pages - 1
    this.getStatus(pages - 1, this.pageSize)
  }

  pageSizeChange(size: number) {
    this.getStatus(this.page, size)
    this.pageSize = size
  }

  getStatus(page: number = 0, pageSize: number = 10) {
    api
    .getStatus({
      page: page,
      size: pageSize,
      username: this.$store.state.userInfo.username,
    })
    .then((res: any) => {
      this.status = []
      let id = 0
      this.status = res.data.list.map((item: any) => {
        id += 1
        item.id = id
        if (item.result === 'ACCEPTED') {
          return {
            ...item,
            cellClassName: {
              result: 'accept-class',
            },
          }
        }  else if (item.result === 'COMPILE_ERROR') {
          return {
            ...item,
            cellClassName: {
              result: 'warn-class',
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
      this.total = res.data.total
    })
    .catch((err: any) => {
      console.log(err, 'err')
    })
  }

  mounted() {
    this.getStatus()
  }
}
</script>

<style lang="less">
.contain-padding {
  padding-top: 60px;
}

.pointer-class {
  cursor: pointer;
  &:hover {
    color: #15c;
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
.ivu-table .warn-class {
  color: #e5a455 !important;
  background-color: rgb(242, 222, 222) !important;
}
</style>
