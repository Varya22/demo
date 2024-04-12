import React, { useContext } from 'react';
import { Switch, Route, Redirect } from 'react-router-dom';
import { authRoutes, publicRoutes } from "../routes";
import { SHOP_ROUTE, HOME_ROUTE, ADMIN_ROUTE } from "../utils/consts";
import { Context } from "../index";
import { observer } from "mobx-react-lite";

const AppRouter = observer(() => {
    const { user } = useContext(Context);

    console.log(user);
    return (
        <Switch>
            {user.isAuth && authRoutes.map(({ path, Component }) =>
                <Route key={path} path={path} component={Component} exact/>
            )}
            {publicRoutes.map(({ path, Component }) =>
                <Route key={path} path={path} component={Component} exact/>
            )}

            {user.isAuth && user.login === 'admin' && (
                <Route key={ADMIN_ROUTE} path={ADMIN_ROUTE} component={authRoutes.find(route => route.path === ADMIN_ROUTE).Component} exact/>
            )}

            <Redirect to={HOME_ROUTE}/>
        </Switch>
    );
});

export default AppRouter;
