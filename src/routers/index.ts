import { Router } from 'express';
import authRoute from './auth.route';
import emailRoute from './email.route';
import newsRoute from './news.route';
import jobsRoute from './job.route';
import userRoute from './user.route';
import chatRoute from './chat.route';
import alumnusRouter from './alumnus.route';
import postRoute from './post.route';
import educationalRoute from './educational.route';
import professionalRoute from './professional.route';
import batchRoute from './batch.route';
import collegeRoute from './college.route';
import eventRoute from './event.route';
import dashBoardRoute from './adminDashboard.route';

const router = Router();
interface IRoute{
    path: string;
    route: Router;
}

const proRoute: IRoute[] = [
  {
    path: '/auth',
    route: authRoute,
  },
  {
    path: '/email',
    route: emailRoute,
  },
  {
    path: '/news',
    route: newsRoute,
  },
  {
    path: '/jobs',
    route: jobsRoute,
  },
  {
    path: '/user',
    route: userRoute,
  },
  {
    path: '/chat',
    route: chatRoute,
  },
  {
    path: '/alumnus',
    route: alumnusRouter,
  },

  {
    path: '/posts',
    route: postRoute,
  },
  {
    path: '/batch',
    route: batchRoute,
  },
  {
    path: '/user',
    route: userRoute,
  },
  {
    path: '/user',
    route: educationalRoute,
  },
  {
    path: '/user',
    route: professionalRoute,
  },
  {
    path: '/college',
    route: collegeRoute,
  },
  {
    path: '/event',
    route: eventRoute,
  },
  {
    path:'/dashboard',
    route:dashBoardRoute
  }
];


proRoute.forEach((route) => {
  //console.log(route.path, route.route);
  router.use(route.path, route.route);
});

export default router;