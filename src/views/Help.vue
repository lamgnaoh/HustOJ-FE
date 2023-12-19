<template>
  <Row>
    <Col span="20" offset="2">
      <div class="wrapper-content ivu-article">
        <article>
          <h1>Judge server</h1>
          <div class="ivu-anchor">
            <h2 align="left">Result</h2>
          </div>
          <div class="content">
            <ul>
              <li>Accepted: Your answer meets the criteria for judging the problem</li>
              <li>
                Runtime Error:
                An error occurs when your program is running (Out of bounds, stack overflow,
                unhandled exception, main function return value is non-zero, etc.)
              </li>
              <li>Time Limit Exceeded: The execution time of your program exceeds the problem requirements</li>
              <li>Memory Limit Exceeded: Your program's memory usage exceeds the problem requirements</li>
              <li>Compile Error: An error occurred during compilation (including linking) of your program</li>
              <li>Wrong Answer: The answer output by your program does not meet the criteria for judging the problem</li>
              <li>System Error: The problem judging system has failed, please wait for re-judgement.</li>
              <li>Waiting: Your submission is pending</li>
            </ul>
          </div>
          <div class="ivu-anchor">
            <h2 align="left">Compile parameters</h2>
          </div>
          <div class="content">
            <ul id="code">
              <li>
                C（GCC 4.8）
                <pre>
gcc -DONLINE_JUDGE -O2 -w -std=c99 {src_path} -lm -o {exe_path}main</pre
                >
              </li>
              <li>
                C++（G++ 4.3）
                <pre>
g++ -DONLINE_JUDGE -O2 -w -std=c++11 {src_path} -lm -o {exe_path}main</pre
                >
              </li>
              <li>
                Java（Oracle JDK 1.7）
                <pre>//compile<br>javac {src_path} -d {exe_path}<br>//Run<br>java -cp {exe_path} Main</pre>
              </li>
            </ul>
          </div>
          <div class="ivu-anchor">
            <h2 align="left">Common problem</h2>
          </div>
          <div class="content">
            <ul>
              <li>If there are no special instructions, please use standard input and output.</li>
              <li>
                Java code needs to be used Main as main class name。C/C++Code usage<code
              >int main()</code
              >，and need<code>return 0;</code>.
              </li>
              <li>
                C/C++ 64bit ，please use <code>long long</code> use
                <code>cin/cout</code> on <code>%lld</code> input output.
                use<code>__int64</code>will cause compilation errors.
              </li>
              <li>
                Program execution time refers to CPU time, and memory usage is calculated based on
                the peak memory consumption during execution.
                When there are multiple sets of test data, the maximum time and memory consumption shall prevail.
              </li>
              <li>
                When judging the problem, the last line break and space in your output will be removed,
                and then compared with the answer with the last line break and space removed. If they are inconsistent, it is
                Wrong Answer.
                Do not remove the remaining spaces and blank lines at the end of the line.
                Please read the requirements of the question clearly. There are no formatting errors.
              </li>
            </ul>
          </div>
        </article>
      </div>
    </Col>
  </Row>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator'

@Component
export default class Help extends Vue {}
</script>

<style lang="less" scoped>
.wrapper-content {
  padding: 20px 25px;
  position: relative;
}

.content {
  padding: 20px 0 40px 0;
}

#code > li > pre {
  padding: 5px 10px;
  white-space: pre-wrap;
  margin-top: 15px;
  margin-bottom: 15px;
  background: #f8f8f9;
  border: 1px dashed #e9eaec;
}

code {
  font-family: Consolas, Menlo, Courier, monospace;
  font-size: 1em;
  display: inline-block;
  background: #f7f7f7;
  margin: 0 3px;
  padding: 1px 5px;
  border-radius: 3px;
  color: #666;
  border: 1px solid #eee;
}

ul {
  text-align: left;
  list-style: disc !important;
}

li {
  list-style: disc !important;
}
</style>
