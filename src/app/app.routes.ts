import { ActivatedRouteSnapshot, ResolveFn, RouterStateSnapshot, Routes } from '@angular/router';

//import { appGuard } from './app.guard';
import { App2Guard } from './app2.guard';
//import { AppComponent } from './app.component';
import { EntityComponent } from './entity/entity.component';
import { DetailComponent } from './entity/detail/detail.component';
import { CreateComponent } from './entity/create/create.component';
import { UpdateComponent } from './entity/update/update.component';

const resolvedUpdateTitle: ResolveFn<string> = (a:ActivatedRouteSnapshot,b:RouterStateSnapshot) => Promise.resolve(`Actualizar Entidad ${a.params['id']}`);
const resolvedDetailTitle: ResolveFn<string> = (a:ActivatedRouteSnapshot,b:RouterStateSnapshot) => Promise.resolve(`Detalle Entidad ${a.params['id']}`);

export const routes: Routes = [
  /*{
    path: '**',
    title: 'Home',
    component: AppComponent,
  },*/
  {
    path: 'entity',
    //title: 'Entidades',
    //component: EntityComponent,
    //canActivate: [],//TBI
    children: [
      {
        path: '',
        title: 'Entidades',
        component: EntityComponent,
        //canActivate: [],//TBI
      },
      {
        path: 'create',
        title: 'Crear Entidad',
        component: CreateComponent,
        //canActivate: [appGuard],
        canActivate: [App2Guard],
        data: {
          requiredRole: 'entity-create',
        },
      },
      //dynamic routes after
      {
        path: 'update/:id',
        //title: 'Actualizar Entidad :id',
        title: resolvedUpdateTitle,
        component: UpdateComponent,
        //canActivate: [],//TBI
      },
      {
        path: ':id',
        //title: 'Detalle Entidad :id',
        title: resolvedDetailTitle,
        component: DetailComponent,
        //canActivate: [],//TBI
      },
    ],
  },
];
