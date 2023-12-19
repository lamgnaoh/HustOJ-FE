<template>
  <div>
    <Row>
      <Col span="20" offset="2">
        <Row>
          <Col class="card-margin" offset="16">
            <ul class="filter">
              <li>
                <Dropdown @on-click="onRuleTypeChanged">
              <span>{{query.rule_type === '' ? 'Rule' : query.rule_type }}
                <Icon type="md-arrow-dropdown"></Icon>
              </span>
                  <Dropdown-menu slot="list">
                    <Dropdown-item name="">All</Dropdown-item>
                    <Dropdown-item name="OI">OI</Dropdown-item>
                    <Dropdown-item name="ACM">ACM</Dropdown-item>
                  </Dropdown-menu>
                </Dropdown>
              </li>
<!--              <li>-->
<!--                <Dropdown @on-click="onTypeChanged">-->
<!--              <span>{{query.type === '' ? 'Type' : query.type }}-->
<!--                <Icon type="md-arrow-dropdown"></Icon>-->
<!--              </span>-->
<!--                  <Dropdown-menu slot="list">-->
<!--                    <Dropdown-item name="">All</Dropdown-item>-->
<!--                    <Dropdown-item name="SECRET_WITH_PASSWORD">Private</Dropdown-item>-->
<!--                    <Dropdown-item name="PUBLIC">Public</Dropdown-item>-->
<!--                  </Dropdown-menu>-->
<!--                </Dropdown>-->
<!--              </li>-->
              <li>
                <Dropdown @on-click="onStatusChanged">
                  <span>{{query.status === '' ? 'Status' : query.status }}
                    <Icon type="md-arrow-dropdown"></Icon>
                  </span>
                      <Dropdown-menu slot="list">
                        <Dropdown-item name="">All</Dropdown-item>
                        <Dropdown-item name="PROCESSING">Processing</Dropdown-item>
                        <Dropdown-item name="NOT_STARTED">Not Started</Dropdown-item>
                        <Dropdown-item name="ENDED">Ended</Dropdown-item>
                      </Dropdown-menu>
                </Dropdown>
              </li>
              <li>
                <Input id="keyword"
                       @on-enter="keywordSearch(query.keyword)"
                       @on-change="keywordEmpty()"
                       v-model="query.keyword"
                       icon="md-search" placeholder="Keyword"/>
              </li>
            </ul>
          </Col>
        </Row>
      </Col>
    </Row>
    <Row>
      <Col span="20" offset="2">
        <p id="no-contest" v-if="contests.length == 0">No contest</p>
        <a
            @click="contestDetail(item.id)"
            v-for="item in contests"
            :key="item.id"
        >
          <Row class="list">
            <Col span="2">
              <img
                  src="../assets/contest.png"
                  style="width:40px;margin-top:10px;height:40px;"
                  alt="Trophy icon"
              />
            </Col>
            <Col span="8">
              <div class="list-title">
                <p>{{ item.name }}</p>
              </div>
              <ul class="list-subtitle">
                <li>
                  <Icon type="md-calendar" color="#3091f2" />{{
                    item.startDate
                  }}
                </li>
                <li>
                  <Icon type="md-time" color="#3091f2" />{{
                    item.interval
                  }}
                </li>
                <li>
                  <Button size="small" shape="circle">
                    {{item.contestRuleType}}
                  </Button>
                </li>
              </ul>
            </Col>
            <Col span="4" offset="2">
              <div class="type">
                <span v-if="item.contestType === 'SECRET_WITH_PASSWORD'"
                ><Icon type="ios-lock-outline" color="#3091f2" size="20" /></span>
                <span v-else-if="item.contestType === 'PUBLIC'"
                ><Icon
                    type="ios-unlock-outline"
                    color="#3091f2"
                    size="20"
                /></span>
              </div>
            </Col>
            <Col span="4" offset="4">
              <div class="status">
                <Tag type="dot" color="success" v-if="item.status === 'PROCESSING'">Processing</Tag>
                <Tag type="dot" color="error" v-if="item.status === 'ENDED'">Ended</Tag>
                <Tag type="dot" color="warning" v-if="item.status === 'NOT_STARTED'">Not started</Tag>
              </div>
            </Col>
          </Row>
        </a>
      </Col>
      <Col span="20" offset="2" style="padding-top: 30px;">
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
import { countInterval } from '@/util/util'

@Component
export default class Contests extends Vue {
  total: number = 0
  // type: any = ''
  query: any = {
    status: '',
    keyword: '',
    rule_type: '',
    type: '',
  }
  // status: any = ''
  // keyword: string = ''
  contests: any = []

  pageSize: number = 10
  page: number = 0

  pageChange(pages: number) {
    this.page = pages - 1
    this.getContests(
        pages - 1,
        this.pageSize,
        this.query.status,
        this.query.type,
        this.query.keyword,
        this.query.rule_type
    )
  }

  pageSizeChange(size: number) {
    this.getContests(this.page, size, this.query.status, this.query.type, this.query.keyword, this.query.rule_type)
    this.pageSize = size
  }

  onTypeChanged(type: any) {
    this.query.type = type
    this.getContests(this.page, this.pageSize, this.query.status, type, this.query.keyword , this.query.rule_type)
  }

  onStatusChanged(status: any) {
    this.query.status = status
    this.getContests(this.page, this.pageSize, status, this.query.type, this.query.keyword , this.query.rule_type)
  }
  onRuleTypeChanged(ruleType: any) {
    this.query.rule_type = ruleType
    this.getContests(this.page, this.pageSize, status, this.query.type, this.query.keyword , ruleType)
}
  getContests(
      page: number = 0,
      pageSize: number = 10,
      status: any = '',
      type: any = '',
      keyword: any = '',
      ruleType: any = ''
  ) {
    api
    .getContests({
      page: page,
      size: pageSize,
      status: status,
      type: type,
      name: keyword,
      ruleType: ruleType
    })
    .then((res: any) => {
      this.contests = []
      const that = this
      const list = res.data.list
      this.total = res.data.total
      list.forEach(function(item: any) {
        const sd = new Date(Date.parse(item.startDate.replace(/-/g, '/'))) // start date
        const ed = new Date(Date.parse(item.endDate.replace(/-/g, '/'))) // end date
        const rest = new Date()
        const interval = countInterval(sd, ed)
        that.contests.push({
          authorId: item.authorId,
          authorName: item.authorName,
          contestType: item.contestType,
          createDate: item.createDate,
          endDate: item.endDate,
          startDate: item.startDate,
          interval: interval,
          description: item.description,
          enable: item.enable,
          id: item.id,
          contestRuleType: item.contestRuleType,
          name: item.name,
          rest: rest,
          status: item.status,
        })
      })
    })
    .catch((err: any) => {
      console.log(err, 'err')
    })
  }

  keywordSearch(keyword: any) {
    this.getContests(this.page, this.pageSize, this.query.status, this.query.type, keyword , this.query.rule_type)
  }

  keywordEmpty() {
    if (this.query.keyword === '') {
      this.getContests(
          this.page,
          this.pageSize,
          this.query.status,
          this.query.type,
          this.query.keyword,
          this.query.rule_type
      )
    }
  }

  contestDetail(id: number) {
    this.$router.push({
      path: `/contests/${id}`,
    })
  }

  mounted() {
    this.getContests()
  }
}
</script>

<style lang="less" scoped>
@import '../style/index.less';

ul.filter {
  > li {
    display: inline-block;
    padding: 0 10px;
    line-height:50%
  }
}
#no-contest {
  text-align: center;
  font-size: 16px;
  padding: 20px;
}

.card-margin {
  margin-top: 40px;
  margin-bottom: 40px;
  text-align: left;
}

.idx {
  font-size: 24px;
  color: #666;
  font-weight: 700;
}

.tag-padding {
  padding-top: 10px;
}

.list {
  cursor: pointer;
  border-bottom: 1px solid #ddd;
  font-weight: 400;
  padding: 20px 0 20px 0;
  box-sizing: border-box;
  .list-title {
    text-align: left;
    font-size: 24px;
    color: rgba(0, 0, 0, 0.7);
  }
  .list-subtitle {
    text-align: left;
    color: rgba(0, 0, 0, 0.5);
    li{
      display: inline-block;
      padding: 10px 0 0 10px;
      &:first-child {
        padding: 10px 0 0 0;
      }
    }
  }
}

.status {
  vertical-align: middle;
  line-height: 54px;
}

.type {
  height: 30px;
  line-height: 54px;
  vertical-align: middle;
  text-align: left;
}
.selection {
  color: @primary-color;
  padding: 4px 8px 0 0;
}
</style>
