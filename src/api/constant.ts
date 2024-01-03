// @ts-ignore
import * as process from "process";

const VUE_APP_BASE_URL = process.env.VUE_APP_BASE_URL ? process.env.VUE_APP_BASE_URL : 'http://localhost:8081'
export { VUE_APP_BASE_URL }

export const JUDGE_STATUS =  {
//   WRONG_ANSWER -1 (judger module will never return this value, it's used for awswer checker)
// SUCCESS = 0 (this only means the process exited normally)
// CPU_TIME_LIMIT_EXCEEDED = 1
// REAL_TIME_LIMIT_EXCEEDED = 2
// MEMORY_LIMIT_EXCEEDED = 3
// RUNTIME_ERROR = 4
// SYSTEM_ERROR = 5
  '-1': {
    name:'Wrong Answer',
    short:'WA',
    color:'red'
  },
  '0':{
    name:'Accepted',
    short:'AC',
    color:'green'
  },
  '1':{
    name:'CPU Time Limit Exceeded',
    short:'TLE',
    color:'red'
  },
  '2':{
    name:'Real-time Limit Exceeded',
    short:'TLE',
    color:'red'
  },
  '3':{
    name:'Memory Limit Exceeded',
    short:'MLE',
    color:'red'
  },
  '4':{
    name:'Runtime error',
    short:'RE',
    color:'red'
  },
  '5': {
    name: 'System Error',
    short: 'SE',
    color: 'red'
  }

}
