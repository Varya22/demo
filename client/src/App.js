import React, { useContext, useEffect, useState } from 'react';
import { BrowserRouter, useLocation } from 'react-router-dom';
import AppRouter from './components/AppRouter';
import NavBar from './components/NavBar';
import { observer } from 'mobx-react-lite';
import { Context } from './index';
import { check } from './http/userAPI';
import { Spinner } from 'react-bootstrap';
// import Footer from './components/Footer';

const App = observer(() => {
    const { user } = useContext(Context);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        check().then(data => {
            user.setUser(true);
            user.setIsAuth(true);
        }).catch(error => {
            console.error('Ошибка при проверке пользователя:', error);
            user.setUser(null);
            user.setIsAuth(false);
        }).finally(() => setLoading(false));
    }, []);

    if (loading) {
        return <Spinner animation={'grow'} />;
    }

    return (
        <BrowserRouter>
            <helmet>
                <meta name="description" content="`Портал сознательных граждан 'Нарушениям.Нет'" />
                <meta name="keywords" content="`Портал, нарушения, ГАИ" />
            </helmet>
            <AppContent />
        </BrowserRouter>
    );
});

const AppContent = () => {
    const { user } = useContext(Context);
    const location = useLocation();
    const isLoginPage = location.pathname === '/login';
    const isRegistrationPage = location.pathname === '/registration';

    return (
        <div className='forfont'>
            {!isLoginPage && !isRegistrationPage && <NavBar />}
            <AppRouter />
            {/* {!isLoginPage && !isRegistrationPage && <Footer />} */}
        </div>
    );
};

export default App;
