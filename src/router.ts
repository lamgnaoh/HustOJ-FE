import Vue from 'vue'
import Router from 'vue-router'
import problems from '@/views/Problems.vue'
import status from '@/views/Status.vue'
import contests from '@/views/Contests.vue'
import home from '@/views/Home.vue'
import login from '@/views/Login.vue'
import register from '@/views/Register.vue'
import forget from '@/views/Forget.vue'
import help from '@/views/Help.vue'
import about from '@/views/About.vue'
import rank from '@/views/Rank.vue'
import personal from '@/views/Personal.vue'
import submission from '@/views/Submission.vue'
import share from '@/views/Share.vue'
import setting from '@/views/setting/Setting.vue'

import problemDetail from '@/components/ProblemDetail.vue'
import contestDetail from '@/components/ContestDetail.vue'
import announcement from '@/components/Announcement.vue'
import contestProblemDetail from '@/components/ContestProblemDetail.vue'

import adminIndex from '@/admin/adminIndex.vue'
import accountSetting from "@/views/AccountSetting.vue";
import issuePage from '@/admin/issues/IssuePage.vue'
import VerifyToken from "@/views/VerifyToken.vue";
import ResetPassword from "@/views/ResetPassword.vue";

Vue.use(Router)
const routerPush = Router.prototype.push
Router.prototype.push = function push(location: any): Promise<any> {
  // @ts-ignore
  return routerPush.call(this, location).catch((error: any) => error)
}
// @ts-ignore
const router = new Router({
  mode: 'history',
  routes: [
    {
      path: '/',
      name: 'index',
      component: home,
    },
    {
      path: '/problems',
      name: 'problems',
      component: problems,
    },
    {
      path: '/problems/:id',
      name: 'problem',
      component: problemDetail,
    },
    {
      path: '/share/:id',
      name: 'share',
      component: share,
    },
    {
      path: '/status',
      name: 'status',
      component: status,
    },
    {
      path: '/contests',
      name: 'contests',
      component: contests,
    },
    {
      path: '/contests/:id',
      name: 'contest',
      component: contestDetail,
    },
    {
      path: '/contests/:contestId/problems/:problemId',
      name: 'contest-problem',
      component: contestProblemDetail,
    },
    {
      path: '/announcement/:id',
      name: 'announcement',
      component: announcement,
    },
    {
      path: '/submission/:id',
      name: 'submission',
      component: submission,
    },
    {
      path: '/login',
      name: 'login',
      component: login,
    },
    {
      path: '/register',
      name: 'register',
      component: register,
    },
    {
      path: '/forget',
      name: 'forget',
      component: forget,
    },
    {
      path: '/reset-password/:token',
      name: 'reset-password',
      component: ResetPassword,
    },
    {
      path: '/rank',
      name: 'rank',
      component: rank,
    },
    {
      path: '/help',
      name: 'help',
      component: help,
    },
    {
      path: '/about',
      name: 'about',
      component: about,
    },
    {
      path: '/personal/:id',
      name: 'personal',
      component: personal,
    },
    {
      path: '/setting/:id',
      name: 'setting',
      component: accountSetting,
    },
    {
      path: '/verify/:token',
      name: 'verify',
      component: VerifyToken,
    },
    {
      path: '/admin',
      name: 'adminIndex',
      component: adminIndex,
      redirect: '/admin/index',
      meta: {
        requireAuth: true,
      },
      children: [
        {
          path: 'judge-server',
          name: 'judge-server',
          component: () =>
              import(
                  /* webpackChunkName: 'async-admin' */ '@/admin/index/JudgeServer.vue'
                  ),
        },
        {
          path: 'issues',
          name: 'issues',
          component: issuePage
        },
        {
          path: 'index',
          name: 'admin-index',
          component: () =>
              import(
                  /* webpackChunkName: 'async-admin' */ '@/admin/index/index.vue'
                  ),
        },
        {
          path: 'admin-announcement',
          name: 'admin-announcement',
          component: () =>
              import(
                  /* webpackChunkName: 'async-admin' */ '@/admin/announcement/Announcement.vue'
                  ),
        },
        {
          path: 'problems-list',
          name: 'problems-list',
          component: () =>
              import(
                  /* webpackChunkName: 'async-admin' */ '@/admin/problems/ProblemList.vue'
                  ),
        },
        {
          path: 'create-problem',
          name: 'create-problem',
          component: () =>
              import(
                  /* webpackChunkName: 'async-admin' */ '@/admin/problems/CreateProblem.vue'
                  ),
        },
        {
          path: 'edit-problem/:problemId',
          name: 'edit-problem',
          component: () =>
              import(
                  /* webpackChunkName: 'async-admin' */ '@/admin/problems/CreateProblem.vue'
                  ),
        },
        {
          path: 'create-contest',
          name: 'create-contest',
          component: () =>
              import(
                  /* webpackChunkName: 'async-admin' */ '@/admin/contests/CreateContest.vue'
                  ),
        },
        {
          path: 'contest/:contestId/edit',
          name: 'edit-contest',
          component: () =>
              import(
                  /* webpackChunkName: 'async-admin' */ '@/admin/contests/CreateContest.vue'
                  ),
        },
        {
          path: 'contests-list',
          name: 'contests-list',
          component: () =>
              import(
                  /* webpackChunkName: 'async-admin' */ '@/admin/contests/ContestsList.vue'
                  ),
        },
        {
          path: 'contest-problems/:contestId',
          name: 'contest-problems',
          component: () =>
            import(
              /* webpackChunkName: 'async-admin' */ '@/admin/contests/ContestProblems.vue'
            ),
        },
        {
          path: 'contest-problems/:contestId/problem/create',
          name: 'create-contest-problem',
          component: () =>
              import(
                  /* webpackChunkName: 'async-admin' */ '@/admin/problems/CreateProblem.vue'
                  ),
        },
        {
          path: 'contest-problems/:contestId/problem/:problemId',
          name: 'edit-contest-problem',
          component: () =>
              import(
                  /* webpackChunkName: 'async-admin' */ '@/admin/problems/CreateProblem.vue'
                  ),
        },
        {
          path: 'contest-member/:id',
          name: 'contest-member',
          component: () =>
              import(
                  /* webpackChunkName: 'async-admin' */ '@/admin/contests/ContestMember.vue'
                  ),
        },
        {
          path: 'user-manager',
          name: 'user-manager',
          component: () =>
              import(
                  /* webpackChunkName: 'async-admin' */ '@/admin/users/UserManager.vue'
                  ),
        },
        {
          path: 'logs',
          name: 'logs',
          component: () =>
              import(
                  /* webpackChunkName: 'async-admin' */ '@/admin/users/Logs.vue'
                  ),
        },
      ],
    },
  ],
})

router.beforeEach((to, from, next) => {
  if (to.matched.some(res => res.meta.requireAuth)) { // to route need to authentication
    // @ts-ignore
    const role: any = window.localStorage.getItem('role')
    if (role.indexOf('USER') === -1) {
      next()
    } else {
      next({
        path: '/',
        query: { redirect: to.fullPath },
      })
    }
  } else {
    next()
  }
})
export default router
