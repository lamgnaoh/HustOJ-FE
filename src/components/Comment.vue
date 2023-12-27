<script lang="ts">
import {Component, Prop, Vue} from "vue-property-decorator";

@Component
export default class Comment extends Vue {
  @Prop({
    type: String,
    required: true
  })
  author: string

  @Prop({
    type: String,
    required: true
  })
  content: string

  @Prop({
    type: String,
    required: true
  })
  createDate: string

  @Prop({
    type: Boolean,
    required: false,
    default: false
  })
  subComment: boolean

  @Prop({
    type: Boolean,
    required: false,
    default: false
  })
  isShowSubComment: boolean;

  displayDate() {
    let datetime = Date.parse(this.createDate)
    let current = new Date().getTime()
    // time in seconds
    let diff = (current - datetime) / 1000;
    if (diff < 60) {
      return "Recently";
    } else if (diff < 60 * 2) {
      return "1 minute";
    } else if (diff < 60 * 60) {
      return Math.floor(diff / 60) + " minutes";
    } else if (diff < 60 * 60 * 2) {
      return "1 hour"
    } else if (diff < 60 * 60 * 60) {
      return Math.floor(diff / 3600) + " hours"
    } else {
      return new Date(datetime)
    }
  }

  reply() {
    this.$emit("reply")
  }

  showSubComment() {
    this.$emit("showSubComment")
  }
}
</script>

<template>
  <Row>
    <Col :span="1">
      <div class="avatar-circle">{{ author.slice(0, 2).toUpperCase() }}</div>
    </Col>
    <Col :span="23">
      <div class="comment">
        <Row>
          <div class="author">{{ author }}</div>
        </Row>
        <Row>
          <div class="content">{{ content }}</div>
        </Row>
      </div>
      <Row>
        <Col class="time">{{ displayDate() }}</Col>
        <Col class="reply">
          <div @click="reply()">Reply</div>
        </Col>
        <Col v-show="!subComment" class="reply">
          <div @click="showSubComment()">{{ isShowSubComment ? "Hide all" : "Show more" }}</div>
        </Col>
      </Row>
    </Col>
  </Row>
</template>

<style lang="less" scoped>
.avatar-circle {
  margin: 6px 0;
  background-color: #f2dede;
  border-radius: 50%;
  height: 40px;
  width: 40px;
  line-height: 40px;
}
.comment {
  padding: 8px 12px;
  border-radius: 12px;
  background-color: #f0f2f5;
  margin: 6px 0;
  font-size: 12px;
}

.author {
  font-size: .8125rem;
  font-weight: 700;
}

.content {
  text-align: start;
  font-size: .9375rem;
  font-weight: 400;
}

.time {
  margin-left: 15px;
  font-weight: 400;
}

.reply {
  margin-left: 15px;
  font-weight: 700;
}
</style>