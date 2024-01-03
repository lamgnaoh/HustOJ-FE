<template>
  <div class="problem-form">
    <Panel :title="title">
      <Form :model="problemData" ref="problemForm" :rules="ruleValidate" label-position="top">
        <Row :gutter="20">
          <Col :span="6">
            <FormItem label="Code" prop="problemCode">
              <Input v-model="problemData.problemCode"/>
            </FormItem>
          </Col>

          <Col span="18">
            <FormItem label="Title" prop="title">
              <Input v-model="problemData.title"/>
            </FormItem>
          </Col>
        </Row>
        <Row :gutter="20">
          <Col span="24">
            <FormItem label="Description" prop="description" required>
              <Simditor id="editor1" v-model="problemData.description"></Simditor>
            </FormItem>
          </Col>
        </Row>
        <Row :gutter="20">
          <Col span="24">
            <FormItem label="Input description" prop="input_description" required>
              <Simditor id="editor2" v-model="problemData.inputDescription"></Simditor>
            </FormItem>
          </Col>
          <Col span="24">
            <FormItem label="Output Description" prop="output_description" required>
              <Simditor id="editor3" v-model="problemData.outputDescription"></Simditor>
            </FormItem>
          </Col>
        </Row>
        <Row :gutter="20">
          <Col span="12">
            <FormItem label="Time Limit(ms, range 1-10000ms)" required>
              <Input type="number" v-model="timeLimit"/>
            </FormItem>
          </Col>
          <Col span="12">
            <FormItem label="Memory Limit (MB, lowest 16M, Java cannot be lower than 32M)" required>
              <Input type="number" v-model="ramLimit"/>
            </FormItem>
          </Col>
        </Row>

        <Row :gutter="20">
          <Col span="4">
            <FormItem label="Difficulty" required prop="difficulty">
              <Select v-model="problemData.difficulty" style="width: 100px;">
                <Option value="LOW">Low</Option>
                <Option value="MEDIUM">Medium</Option>
                <Option value="HIGH">High</Option>
              </Select>
            </FormItem>
          </Col>
          <Col span="4">
            <FormItem label="Visible">
              <i-switch v-model="problemData.visible" size="large">
                <span slot="open">ON</span>
                <span slot="close">OFF</span>
              </i-switch>
            </FormItem>
          </Col>
          <Col span="4">
            <FormItem label="Rule Type">
              <el-radio-group v-model="problemData.ruleType" :disabled="disableRuleType">
                <el-radio label="ACM">
                  <span>ACM</span>
                </el-radio>
                <el-radio label="OI">
                  <span>OI</span>
                </el-radio>
              </el-radio-group>
            </FormItem>
          </Col>
          <Col span="12">
            <FormItem label="Tag">
              <div style="display: flex" class="tags">
                <Tag
                    type="dot"
                    closable
                    color="primary"
                    v-for="item in problemData.tagList"
                    :key="item.name"
                    :name="item.name"
                    @on-close="deleteTag(event , item.name)"
                    style="margin-right: 18px"
                >{{ item.name }}
                </Tag>
              </div>
              <div>
                <Input
                    @on-enter="addTag"
                    @on-focus="dropFocus"
                    v-model="tag"
                    style="width: 78px;"
                />
                <div class="ivu-select-dropdown my-dropdown" v-if="myDropdown">
                  <span
                      v-for="item in allTags"
                      :key="item.id"
                      class="my-item"
                      @click.stop="chooseItem(item)"
                  >
                  <div style="margin-left: 8px">{{ item.name }}</div>
                </span>
                </div>
              </div>
            </FormItem>
          </Col>
        </Row>

        <div>
          <FormItem v-for="(sample, index) in sampleList"
                    :key="index + 1">
            <Accordion :title="'Sample' + (index + 1)">
              <Button type="warning" size="small" icon="md-trash" slot="header"
                      @click="deleteSample(index)">
                Delete
              </Button>
              <Row :gutter="20">
                <Col :span="12">
                  <FormItem label="Input Sample" required>
                    <Input
                        :rows="5"
                        type="textarea"
                        placeholder="Input Sample"
                        v-model="sample.input">
                    </Input>
                  </FormItem>
                </Col>
                <Col :span="12">
                  <FormItem label="Output sample" required>
                    <Input
                        :rows="5"
                        type="textarea"
                        placeholder="Output sample"
                        v-model="sample.output">
                    </Input>
                  </FormItem>
                </Col>
              </Row>
            </Accordion>
          </FormItem>
        </div>
        <div class="add-sample-btn">
          <Button type="dashed" class="add-samples" @click="addSample()">Add Sample
          </Button>
        </div>
        <Row style="margin-top: 20px">
          <Col span="24">
            <FormItem label="Testcase" required :error="error.testcase">
              <Alert type="warning"
              >Please package all test cases in a zip file and upload it.
                All files must be in the root directory of the compressed package, and the input and
                output
                file names must be identified by consecutive numbers starting from 1 and must
                correspond to,
                for example:
                1.in 1.out 2.in 2.out
                <a
                    href="https://github.com/QingdaoU/OnlineJudge/wiki/%E6%B5%8B%E8%AF%95%E7%94%A8%E4%BE%8B%E4%B8%8A%E4%BC%A0"
                >
                  Help</a
                ></Alert>
              <Upload
                  :headers="header"
                  :action="baseURL + '/api/v1/upload/testcase'"
                  style="cursor: pointer"
                  :on-success="uploadSucc"
                  :on-error="uploadErr"
              >
                <Button size="default" type="primary">Choose File</Button>
              </Upload>
            </FormItem>
          </Col>
        </Row>
        <Row style="margin-top: 20px">
          <Col span="24">
            <el-table
                :data="problemData.testcaseInfos"
                style="width: 100%">
              <el-table-column
                  prop="input_name"
                  label="Input">
              </el-table-column>
              <el-table-column
                  prop="output_name"
                  label="Output">
              </el-table-column>
              <el-table-column
                  prop="score"
                  label="Score">
                <template slot-scope="scope">
                  <el-input
                      size="small"
                      placeholder="Score"
                      v-model="scope.row.score"
                      :disabled="problemData.ruleType !== 'OI'">
                  </el-input>
                </template>
              </el-table-column>
            </el-table>
          </Col>
        </Row>
        <Row :gutter="20" style="margin-top: 20px">
          <Col span="24">
            <FormItem label="Hint">
              <Simditor v-model="problemData.hint"></Simditor>
            </FormItem>
          </Col>
        </Row>
        <Row :gutter="20">
          <Col span="24">
            <FormItem label="Source">
              <Input
                  v-model="problemData.source"
              />
            </FormItem>
          </Col>
        </Row>

        <Button type="primary" @click="handleSubmit()">Submit</Button>
      </Form>
    </Panel>
  </div>
</template>

<script lang="ts">
import {Component, Prop, Vue, Watch} from 'vue-property-decorator'
import CodeMirror from '@/components/CodeMirror.vue'
import api from '@/api/api'
import Simditor from "./Simditor.vue";
import Accordion from "@/components/Accordion.vue";
import Panel from "@/components/Panel.vue";

@Component({
  components: {
    CodeMirror,
    Simditor,
    Accordion,
    Panel
  },
})
export default class ProblemForm extends Vue {
  problemData: any = {
    authorId: '',
    problemCode: '',
    title: '',
    description: '',
    timeLimit: 0,
    ramLimit: 0,
    difficulty: '',
    tagList: [],
    inputDescription: '',
    outputDescription: '',
    sampleIO: '',
    testCaseId: '',
    testcaseInfos: [],
    hint: '',
    source: '',
    specialJudged: false,
    ruleType: 'ACM',
  }
  timeLimit: number = 1000
  ramLimit: number = 256
  baseURL: any = 'http://localhost:8081'
  sampleList: { input: string, output: string }[] = [{
    input: '',
    output: ''
  }]
  disableRuleType = false
  @Prop({}) dataProp: any
  tag: string = ''
  allTags: any = []
  myDropdown: boolean = false
  text: any = ''
  input: string = ''
  output: string = ''
  title: string = ''
  mode: string = ''
  testCaseUploaded = false
  routeName: string | undefined = ''

  ruleValidate: any = {
    problemCode: {
      required: true, message: 'Problem code cannot be empty', trigger: 'blur'
    },
    title: {
      required: true, message: 'Title is required', trigger: 'blur'
    },
    description: {
      required: true, message: 'Description is required', trigger: 'blur'
    },
    input_description: {
      required: true, message: 'Input Description is required', trigger: 'blur'
    },
    output_description: {
      required: true, message: 'Output Description is required', trigger: 'blur'
    },
    time_limit: {
      required: true, message: 'Time is required', trigger: 'blur'
    },
    difficulty: {
      required: true, message: 'Difficulty is required', trigger: 'blur'
    }
  }
  error: any = {
    testcase: ''
  }

  @Watch('dataProp')
  handleData() {
    if (this.dataProp) {
      const tagTemp = this.dataProp.tagList
      const tags: any[] = []
      tagTemp.forEach((item: any) => {
        tags.push(item)
      })
      this.problemData = this.dataProp
      this.timeLimit = Number(this.problemData.timeLimit)
      this.ramLimit = Number(this.problemData.ramLimit)
      if (this.dataProp.sampleIO) {
        this.sampleList = JSON.parse(this.dataProp.sampleIO)
      }
      this.problemData.tagList = tags
      this.testCaseUploaded = true
    }
  }

  get header() {
    return {
      Authorization: 'Bearer ' + window.localStorage.getItem('token'),
    }
  }

  addTag() {
    if (this.tag) {
      // new tag
      this.problemData.tagList.push({
        name: this.tag,
      })
      this.tag = ''
      this.myDropdown = false
    }
  }

  dropFocus() {
    this.myDropdown = true
  }

  chooseItem(item: any) {
    this.myDropdown = false
    this.problemData.tagList.push(item)
  }

  deleteTag(event: any, name: string) {
    const temp: any = []
    this.problemData.tagList.forEach((item: any) => {
      if (item.name !== name) {
        temp.push(item)
      }
    })
    this.problemData.tagList = temp
  }

  addSample() {
    this.sampleList.push({
      input: this.input,
      output: this.output,
    })
    this.problemData.sampleIOList = this.sampleList
  }

  uploadSucc(response: any, file: any) {
    this.problemData.testCaseId = response.data.id
    let fileList = response.data.info
    for (const file of fileList) {
      file.score = (100 / fileList.length).toFixed(0)
      if (!file.output_name && this.problemData.specialJudged) {
        file.output_name = '-'
      }
    }
    this.problemData.testcaseInfos = fileList
    this.testCaseUploaded = true
    ;(this as any).$Message.success('Upload successful')
  }

  uploadErr() {
    ;(this as any).$Message.error('Upload failed')
  }

  deleteSample(index: number) {
    this.problemData.sampleIOList = this.sampleList.splice(index, 1)
  }

  handleSubmit() {
    const temp: any = []
    if (!this.testCaseUploaded) {
      this.error.testCase = 'Test case is not uploaded yet'
      this.$Message.error(this.error.testCase)
      return
    }

    if (!this.problemData.tagList.length) {
      this.$Message.error("Please add at least one tag")
      return
    }

    if (this.problemData.difficulty == '') {
      this.$Message.error("Please select difficulty of the problem")
      return
    }

    this.problemData.tagList.forEach((item: any) => {
      if (item.id) {
        temp.push(item)
      } else {
        temp.push({
          name: item.name,
        })
      }
    })
    if (!this.sampleList.length) {
      this.$Message.error("Sample is required")
      return
    }
    for (let sample of this.sampleList) {
      if (!sample.input || !sample.output) {
        this.$Message.error('Sample input and output is required')
        return
      }
    }
    if (this.problemData.ruleType === "OI") {
      for (let item of this.problemData.testcaseInfos) {
        try {
          if (parseInt(item.score) <= 0) {
            this.$Message.error('Invalid test case score')
            return
          }
        } catch (e) {
          this.$Message.error('Test case score must be an integer')
          return
        }
      }
    }

    if (this.sampleList) {
      this.problemData.sampleIO = JSON.stringify(this.sampleList)
      this.problemData.sampleIOList = this.sampleList
    }
    this.problemData.timeLimit = this.timeLimit
    this.problemData.ramLimit = this.ramLimit
    this.$emit('problem-data', this.problemData)
  }

  getTags() {
    api
    .getTags()
    .then((res: any) => {
      this.allTags = res.data
    })
    .catch((err: any) => {
      ;(this as any).$Message.error(err.data.message)
    })
  }

  mounted() {
    this.getTags()
    this.routeName = this.$route.name
    let contestId = this.$route.params.contestId;
    if (contestId) {
      this.disableRuleType = true;
    }
    if (this.routeName === "create-problem") {
      this.title = 'Create new problem';
    }
    if (this.routeName === "create-contest-problem") {
      this.title = 'Create new contest problem'
      api.adminGetContestDetail({
        id: contestId
      }).then((res: any) => {
        this.problemData.ruleType = res.data.contestRuleType
      }).catch((err: any) => {
        this.$router.push({
          name: 'contest-problems',
        })
        this.$Message.error(err.data.message);
      })
    }
    if (this.routeName === "edit-contest-problem") {
      this.title = 'Edit contest problem'
      api.getContestProblemsDetail({
        cid: this.$route.params.contestId,
        pid: this.$route.params.problemId
      })
      .then((res: any) => {
        this.problemData = res.data;
        if (this.problemData.sampleIO) {
          this.sampleList = JSON.parse(this.problemData.sampleIO)
        } else {
          this.sampleList = []
        }
        this.testCaseUploaded = true;
      }).catch((err: any) => {
        this.$Message.error(err.data.message);
      })
    }
    if (this.routeName === 'edit-problem') {
      this.title = 'Edit problem'
      api
      .adminGetProblemsDetail({id: this.$route.params.problemId})
      .then((res: any) => {
        this.problemData = res.data
        if (this.problemData.sampleIO) {
          this.sampleList = JSON.parse(this.problemData.sampleIO)
        } else {
          this.sampleList = []
        }
        this.testCaseUploaded = true;
      }).catch((err: any) => {
        this.$router.push({
          name: 'problems-list',
        })
        this.$Message.error(err.data.message);
      })
    }

  }
}
</script>

<style lang="less" scoped>
.problem-form {
  text-align: left !important;

  .add-sample-btn {
    margin-bottom: 10px;
  }

  .add-samples {
    width: 100%;
    background-color: #fff;
    border: 1px dashed #aaa;
    outline: none;
    cursor: pointer;
    color: #666;
    height: 35px;
    font-size: 14px;

    &:hover {
      background-color: #f9fafc;
    }

    i {
      margin-right: 10px;
    }
  }
}

h2 {
  text-align: left;
  font-weight: 700;
  font-size: 16px;
}

.form-horizontal {
  display: flex;
}

.my-dropdown {
  width: 200px;
}

.my-item {
  cursor: pointer;

  &:hover {
    background: #f3f3f3;
  }
}
</style>
