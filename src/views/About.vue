<template>
  <Row>
    <Col span="20" offset="2">
      <div class="wrapper-content ivu-article">
        <article>
          <h1>ACM introduction</h1>
          <img src="@/assets/acm_logo.png" width="40%" />
          <div class="content">
            <p align="left">
              ACM International Collegiate Programming Competition (English: ACM International Collegiate
              Programming Contest,
              ICPC) is an annual competition sponsored by the Association for Computing Machinery (ACM)
              that aims to demonstrate college students' innovation ability, teamwork and ability to
              write programs, analyze and solve problems under pressure.
              After more than 30 years of development, the ACM International College Student Programming
              Competition has developed into the most influential computer competition for college students.
              The competition is currently sponsored by IBM.
            </p>
          </div>
          <!-- Friends who use this program, please do not delete the "open source" part -->
          <h1>Open source</h1>
          <div class="content">
            <p align="left">
              <b>Thanks:</b>This project is sponsored by
              <a href="https://github.com/QingdaoU/OnlineJudge"
              >QingdaoU/OnlineJudge</a
              >Thanks for the work done on this project
            </p>
            <p align="left" class="qd-link">
              <a href="https://github.com/QingdaoU/OnlineJudge" target="_blank"
              >GitHub</a
              >
              <a
                  href="https://github.com/QingdaoU/OnlineJudge/issues"
                  target="_blank"
              >Feedback</a
              >
              <a
                  href="https://github.com/QingdaoU/OnlineJudge/wiki/dev-team"
                  target="_blank"
              >Development Team</a
              >
            </p>
          </div>
          <!-- end -->
        </article>
      </div>
    </Col>
  </Row>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator'

@Component
export default class About extends Vue {}
</script>

<style lang="less" scoped>
.wrapper-content {
  padding: 20px 25px;
  position: relative;
}

.content {
  padding: 20px 0 40px 0;
}

.qd-link > a {
  margin-right: 10px;
}
</style>
