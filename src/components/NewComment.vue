<script lang="ts">
import {Component, Vue} from 'vue-property-decorator';

@Component({})
export default class NewComment extends Vue {
  newComment: string = ''

  saveComment() {
    this.$emit("saveComment", this.newComment)
    this.newComment = ''
  }

  getCurrentUserName() {
    return this.$store.state.username.slice(0, 2).toUpperCase()
  }

}
</script>

<template>
  <Row style="margin: 6px 0;">
    <Col :span="1">
      <div class="avatar-circle">{{ getCurrentUserName() }}</div>
    </Col>
    <Col :span="23">
      <el-input v-model="newComment"
                class="new-comment"
                @keyup.native.enter="saveComment">
        <i slot="suffix" class="el-input__icon el-icon-s-promotion" @click="saveComment"></i>
      </el-input>
    </Col>
  </Row>
</template>

<style lang="less" scoped>
.avatar-circle {
  background-color: #f2dede;
  border-radius: 50%;
  height: 40px;
  width: 40px;
  line-height: 40px;
}
</style>