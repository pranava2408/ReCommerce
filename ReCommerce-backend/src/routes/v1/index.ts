import express from 'express';
import authRoute from './auth.route';
import userRoute from './user.route';
import docsRoute from './docs.route';
import itemRoute from './item.route';
import locationRoute from './location.route';
import categoryRoute from './category.route';
import modelRoute from './mlModel.route';
import marketPlaceRoute from './marketplace.route';
import ordersRoute from './order.route';
import config from '../../config/config';

const router = express.Router();

const defaultRoutes = [
  {
    path: '/auth',
    route: authRoute
  },
  {
    path: '/users',
    route: userRoute
  },
  {
    path: '/items',
    route: itemRoute
  },
  {
    path: '/location',
    route: locationRoute
  },
  {
    path: '/category',
    route: categoryRoute
  },
  {
    path: '/model',
    route: modelRoute
  },
  {
    path: '/marketplace',
    route: marketPlaceRoute
  },
  {
    path: '/orders',
    route: ordersRoute
  }
];

const devRoutes = [
  // routes available only in development mode
  {
    path: '/docs',
    route: docsRoute
  }
];

defaultRoutes.forEach((route) => {
  router.use(route.path, route.route);
});

/* istanbul ignore next */
if (config.env === 'development') {
  devRoutes.forEach((route) => {
    router.use(route.path, route.route);
  });
}

export default router;
