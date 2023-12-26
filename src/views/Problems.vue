<template>
  <Row :gutter="16">
    <Col span="16" offset="1" class="card-margin">
      <Row>
        <Col span="24" offset="8">
          <ul class="filter">
            <li>
              <Dropdown @on-click="filterByDifficulty" >
              <span>{{difficulty === '' ? 'Difficulty' : this.difficulty}}
                <Icon type="md-arrow-dropdown" />
              </span>
                <Dropdown-menu slot="list">
                  <Dropdown-item name="">All</Dropdown-item>
                  <Dropdown-item name="Low">Low</Dropdown-item>
                  <Dropdown-item name="Medium" >Medium</Dropdown-item>
                  <Dropdown-item name="High">High</Dropdown-item>
                </Dropdown-menu>
              </Dropdown>
            </li>
            <li>
              <Input
                  search
                  v-model="keyword"
                  @on-enter="search(keyword)"
                  @click.native="search(keyword)"
                  placeholder="keyword"
                  icon="md-search"
              />
            </li>
            <li>
              <Button type="info" @click="onReset" >
                <Icon type="md-refresh" />
                Reset
              </Button>
            </li>
          </ul>
        </Col>
        <Col span="24" class="card-margin">
          <ul style="font-weight: 700" class="pro-table">
            <li style="margin-right: 30px"></li>
            <li class="code">Problem Code</li>
            <li class="title">Problem</li>
            <li class="diff" style="color: #2c3e50">Difficulty</li>
            <li>AC Rate</li>
          </ul>
          <ul
              v-for="(problem, index) in problems"
              :key="problem.id"
              class="pro-table"
              :class="[index % 2 === 0 ? 'bg' : '']"
          >
            <li style="margin-right: 30px;text-align: center">
              <Icon type="md-checkmark" color="green" size="20" v-if="problem.myStatus == 'ACCEPTED'" ></Icon>
            </li>
            <li class="code" @click="problemDetail(problem)">
              {{ problem.code }}
            </li>

            <li class="title" @click="problemDetail(problem)">
              {{ problem.title }}
            </li>
            <li class="diff">
              <span :class="problem.level">
                {{ level(problem.level) }}
              </span>
            </li>
            <li>{{ problem.rate }}</li>
          </ul>
        </Col>
        <Col span="24" class="card-margin">
          <Page
              :total="total"
              show-sizer
              @on-change="pageChange"
              @on-page-size-change="pageSizeChange"
          />
        </Col>
      </Row>
    </Col>
    <Col span="6" class="card-margin">
      <Card dis-hover align="left" style="margin-top: 20px">
        <p slot="title">Tags</p>
        <Button
            shape="circle"
            v-for="(tag, index) in tags"
            :key="index"
            @click="addTag(tag.id)"
        >
          {{ tag.name }}
        </Button>
      </Card>
    </Col>
  </Row>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator'
import api from '../api/api'

@Component
export default class Problems extends Vue {
  announcements: any = []
  keyword: string = ''
  problems: any = []
  searchProblems: any = []
  pageSize: number = 10
  page: number = 0
  tags: any = []
  total: any = 0
  addTags: Array<number> = []
  difficulty: string= ''

  level(level: string) {
    switch (level) {
      case 'LOW':
        return 'Low'
      case 'MEDIUM':
        return 'Medium'
      case 'HIGH':
        return 'High'
    }
  }

  filterByDifficulty(difficulty: string){
    this.difficulty = difficulty
    this.problems = []
    api
    .getProblems({
      page: this.page,
      size: this.pageSize,
      title: this.keyword ,
      visible: true,
      difficulty: difficulty.toUpperCase()
    })
    .then((res: any) => {
      this.total = res.data.total
      const that = this
      res.data.list.forEach(function(item: any) {
        that.problems.push({
          code: item.problemCode,
          title: item.title,
          id: item.id,
          level: item.difficulty,
          rate:
              Math.floor(item.acceptRate * 100) +
              '%(' +
              String(item.acceptCount) +
              ' / ' +
              String(item.submitCount) +
              ')',
        })
      })
      that.searchProblems = that.problems
    })
    .catch((err: any) => {
      console.log(err, 'err')
    })
  }

  onReset(){
    this.keyword=''
    this.difficulty=''
    this.getProblems(this.page,this.pageSize,this.addTags)
  }

  pageChange(pages: number) {
    this.page = pages - 1
    this.getProblems(pages - 1, this.pageSize, this.addTags)
  }

  pageSizeChange(size: number) {
    this.getProblems(this.page, size, this.addTags)
    this.pageSize = size
  }

  getProblems(
      page: number = 0,
      pageSize: number = 10,
      tags: Array<number> = []
  ) {
    // Clear original data
    const tagIds = tags[0]
    this.problems = []
    api
    .getProblems({
      page: page,
      size: pageSize,
      tags: tagIds,
      visible: true,
    })
    .then((res: any) => {
      this.total = res.data.total
      const that = this
      res.data.list.forEach(function(item: any) {
        that.problems.push({
          code: item.problemCode,
          title: item.title,
          id: item.id,
          level: item.difficulty,
          rate:
              Math.floor(item.acceptRate * 100) +
              '%(' +
              String(item.acceptCount) +
              ' / ' +
              String(item.submitCount) +
              ')',
          myStatus: item.myStatus
        },
        )
      })
      that.searchProblems = that.problems
    })
    .catch((err: any) => {
      console.log(err, 'err')
    })
  }

  search(keyword: string) {
    this.keyword = keyword
    api
    .getProblemsIdByTitle(
        {
          title: keyword ,
          visible: true,
          difficulty: this.difficulty == '' ? null : this.difficulty.toUpperCase()
        }
    )
    .then((res: any) => {
      const that = this
      const temp: any = []
      this.total = res.data.total
      res.data.list.forEach(function(item: any) {
        temp.push({
          index: item.id,
          code: item.problemCode,
          title: item.title,
          level: item.difficulty,
          rate:
              Math.floor(item.acceptRate * 100) +
              '%(' +
              String(item.acceptCount) +
              ' / ' +
              String(item.submitCount) +
              ')',
        })
      })
      that.problems = temp
    })
    .catch((err: any) => {
      ;(this as any).$Message.error(err.data.message)
    })
  }

  problemDetail(data: any) {
    this.$router.push({
      path: `/problems/${data.id}`,
    })
  }

  getAllTags() {
    api
    .getAllTags({})
    .then((res: any) => {
      this.tags = res.data
    })
    .catch((err: any) => {
      console.log(err, 'err')
    })
  }

  addTag(id: number) {
    this.addTags = []
    this.addTags.push(id)
    this.getProblems(0, this.pageSize, this.addTags)
  }

  mounted() {
    this.getProblems()
    this.getAllTags()
  }
}
</script>

<style lang="less" scoped>
@import '../style/index.less';
.LOW {
  background-color: #74b567;
  padding: 6px 10px;
  border-radius: 10px;
}

.MEDIUM {
  background-color: #e7af5f;
  padding: 6px 10px;
  border-radius: 10px;
}

.HIGH {
  background-color: #ca5c55;
  padding: 6px 10px;
  border-radius: 10px;
}

.card-margin {
  margin-top: 20px;
  button {
    margin-right: 2px;
    padding: 3px 7px 3px;
  }
}

.colored {
  border-radius: 50px;
  background-color: @primary-color;
  color: white;
  padding: 4px 8px 4px 8px;
}

button {
  margin-bottom: 4px;
}

.problem-title {
  list-style: none;
  display: flex;
  justify-content: space-between;
}

.pro-table {
  list-style: none;
  display: flex;
  justify-content: space-between;
  height: 48px;
  line-height: 48px;
  text-align: left;
  border-bottom: rgb(221, 221, 221) solid 1px;
  .id {
    width: 35px;
    cursor: pointer;
    &:hover {
      color: rgb(17, 85, 204);
    }
  }
  .code {
    width: 150px;
    cursor: pointer;
    &:hover {
      color: rgb(17, 85, 204);
    }

  }
  .title {
    flex-grow: 1;
    cursor: pointer;
    &:hover {
      color: rgb(17, 85, 204);
    }
  }
  .diff {
    width: 130px;
    color: white;
    text-align: center;
  }
}

ul.filter {
  > li {
    display: inline-block;
    padding: 0 10px;
    line-height:50%
  }
}

.pro-table > :first-child {
  width: 30px;
}

.pro-table > :last-child {
  width: 150px;
}

.bg {
  background-color: rgb(249, 249, 249);
}
</style>
