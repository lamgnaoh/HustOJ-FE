<template>
  <div class="status">
    <Row justify="center" class="contain-padding">
      <Col offset="16" style="margin-bottom: 10px">
        <ul class="filter">
          <li>
            <i-switch size="large" v-model="isPersonal" @on-change="handleQueryChange">
              <span slot="open">Mine</span>
              <span slot="close">All</span>
            </i-switch>
          </li>

          <li>
            <Input
                search
                placeholder="Search author"
                v-model="formFilter.username"
                icon="md-search"
                @on-enter="handleQueryChange"
            />
          </li>
          <li>
            <Button type="info" @click="getSubmissions" >
              <Icon type="md-refresh" />
              Refresh
            </Button>
          </li>
        </ul>
      </Col>
      <Col span="20" offset="2">
        <Table :columns="title" :data="status"></Table>
      </Col>
      <Col style="padding-top: 30px;">
        <Page
            :total="total"
            show-sizer
            @on-change="pageChange"
            @on-page-size-change="pageSizeChange"
        />
      </Col>
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
export default class Status extends Vue {
  total: number = 10
  pageSize: number = 10
  page: number = 0
  findAll: boolean = true
  isPersonal: boolean = false
  title: any = [
    {
      title: '#',
      key: 'id',
      width: 78,
      className: 'pointer-class'
    },
    {
      title: 'Author',
      key: 'authorName',
      className: 'pointer-class',
      render: (h: any, obj: any) => {
        return h(
            'span',
            {
              on: {
                click: () => {
                  this.toPerson(obj.row.authorId)
                },
              },
            },
            obj.row.authorName
        )
      },
    },
    {
      title: 'Problem',
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
          label: 'JAVASCRIPT',
          value: 4,
        },
        {
          label: 'PYTHON',
          value: 5,
        }
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
          return row.language === 'JAVASCRIPT'
        } else if (value === 5) {
          return row.language === 'PYTHON'
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
      // render: (h: any, obj: any) => {
      //   return h(
      //       'span',
      //       {
      //         on: {
      //           click: () => {
      //             this.toShare(obj.row.shareId)
      //           },
      //         },
      //       },
      //       obj.row.result
      //   )
      // },
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
  formFilter: any= {
    result: '',
    username: '',
    isPersonal: false
  }

  handleQueryChange() {
    this.getStatus()
  }

  getSubmissions(){
    this.isPersonal = false;
    this.formFilter.username = '';
    this.getStatus();
  }


  toProblem(id: any) {
    this.$router.push({
      name: 'problem',
      params: { id: id },
    })
  }

  // toShare(id: string) {
  //   const routeData = this.$router.resolve({
  //     name: 'share',
  //     params: { id: id },
  //   })
  //   window.open(routeData.href, '_blank')
  // }

  toPerson(id: string) {
    this.$router.push({
      name: 'personal',
      params: { id: id },
      query: {
        others: 'true',
      },
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
      isPractice: true,
      isPersonal: this.isPersonal,
      username: this.formFilter.username == '' ? null : this.formFilter.username
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
        } else if (
            item.result === 'WRONG_ANSWER' ||
            item.result === 'TIME_LIMIT_EXCEEDED'||
            item.result === 'CPU_TIME_LIMIT_EXCEEDED' ||
            item.result === 'MEMORY_LIMIT_EXCEEDED' ||
            item.result === 'SYSTEM_ERROR' ||
            item.result === 'RUNTIME_ERROR'){
          return {
            ...item,
            cellClassName: {
              result: 'err-class',
            },
          }
        } else if (item.result === 'COMPILE_ERROR'){
          return {
            ...item,
            cellClassName: {
              result: 'warn-class',
            }
          }
        }
      })
      console.log(this.status)
      this.total = res.data.total
    })
    .catch((err: any) => {
      console.log(err, 'err')
      this.status=[]
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

ul.filter {
  > li {
    display: inline-block;
    padding: 0 10px;
    line-height:50%
  }
}
</style>
