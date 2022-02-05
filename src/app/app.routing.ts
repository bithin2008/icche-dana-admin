import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

// Import Containers
import { DefaultLayoutComponent } from './containers';

import { P404Component } from './views/error/404.component';
import { P500Component } from './views/error/500.component';
import { LoginComponent } from './views/login/login.component';
import { RegisterComponent } from './views/register/register.component';
import { UsersComponent } from './views/users/users.component';

export const routes: Routes = [
  {
    path: '',
    redirectTo: 'login',
    pathMatch: 'full',
  },
  {
    path: '404',
    component: P404Component,
    data: {
      title: 'Page 404'
    }
  },
  {
    path: '500',
    component: P500Component,
    data: {
      title: 'Page 500'
    }
  },
  {
    path: 'login',
    component: LoginComponent,
    data: {
      title: 'Login Page'
    }
  },
  {
    path: 'register',
    component: RegisterComponent,
    data: {
      title: 'Register Page'
    }
  },
  {
    path: '',
    component: DefaultLayoutComponent,
    data: {
      title: 'Home'
    },
    children: [
      {
        path: "users",
        loadChildren: () =>
          import("./views/users/users.module").then(
            (m) => m.UsersModule
          ),
      }, {
        path: "category",
        loadChildren: () =>
          import("./views/category/category.module").then(
            (m) => m.CategoryModule
          ),
      },
      {
        path: "sub-category",
        loadChildren: () =>
          import("./views/sub-category/sub-category.module").then(
            (m) => m.SubCategoryModule
          ),
      },
      {
        path: "language",
        loadChildren: () =>
          import("./views/language/language.module").then(
            (m) => m.LanguageModule
          ),
      },
      {
        path: "genre",
        loadChildren: () =>
          import("./views/genre/genre.module").then(
            (m) => m.GenreModule
          ),
      },
      {
        path: "item",
        loadChildren: () =>
          import("./views/item/item.module").then(
            (m) => m.ItemModule
          ),
      },
      {
        path: "item-details/:itemid",
        loadChildren: () =>
          import("./views/item-details/item-details.module").then(
            (m) => m.ItemDetailsModule
          ),
      },
      {
        path: "review",
        loadChildren: () =>
          import("./views/customer-review/customer-review.module").then(
            (m) => m.CustomerReviewModule
          ),
      },
      {
        path: 'base',
        loadChildren: () => import('./views/base/base.module').then(m => m.BaseModule)
      },
      {
        path: 'buttons',
        loadChildren: () => import('./views/buttons/buttons.module').then(m => m.ButtonsModule)
      },
      {
        path: 'charts',
        loadChildren: () => import('./views/chartjs/chartjs.module').then(m => m.ChartJSModule)
      },
      {
        path: 'dashboard',
        loadChildren: () => import('./views/dashboard/dashboard.module').then(m => m.DashboardModule)
      },
      {
        path: 'icons',
        loadChildren: () => import('./views/icons/icons.module').then(m => m.IconsModule)
      },
      {
        path: 'notifications',
        loadChildren: () => import('./views/notifications/notifications.module').then(m => m.NotificationsModule)
      },
      {
        path: 'theme',
        loadChildren: () => import('./views/theme/theme.module').then(m => m.ThemeModule)
      },
      {
        path: 'widgets',
        loadChildren: () => import('./views/widgets/widgets.module').then(m => m.WidgetsModule)
      }
    ]
  },
  { path: '**', component: P404Component }
];

@NgModule({
  imports: [RouterModule.forRoot(routes, { relativeLinkResolution: 'legacy' })],
  exports: [RouterModule]
})
export class AppRoutingModule { }
