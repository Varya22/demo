import React, { useContext, useState } from 'react';
import { NavLink, useLocation, useHistory } from "react-router-dom";
import { LOGIN_ROUTE, HOME_ROUTE } from "../utils/consts";
import { login_user } from "../http/userAPI";
import { observer } from "mobx-react-lite";
import { Context } from "../index";
import { Container, Card, Form, Button } from 'react-bootstrap';
import { FormGroup, Input } from 'reactstrap';

const Login = observer(() => {
    const { user } = useContext(Context);
    const location = useLocation();
    const history = useHistory();
    const [login, setLogin] = useState("");
    const [password, setPassword] = useState("");
    const [errors, setErrors] = useState({});

    const validateLogin = () => {
        const errors = {};

        if (!login.trim()) {
            errors.login = "Заполните это поле";
        }

        if (!password.trim()) {
            errors.password = "Заполните это поле";
        }
        setErrors(errors);
        return Object.keys(errors).length === 0;
    };

    const Login = async () => {
        if (validateLogin()) {
            try {
                const data = await login_user(login, password);
                user.setUser(data);
                user.setIsAuth(true);
                localStorage.setItem('userLogin', data.login);
                localStorage.setItem('userName', data.name);
                history.push({
                    pathname: HOME_ROUTE,
                    state: { user: data }
                });
            } catch (e) {
                alert(e.response.data.message);
            }
        }
    };

    return (
        <Container className='forfont' style={{ position: 'relative' }}>
            <Button href='/home' variant='outline-primary' style={{ position: 'absolute', top: '10px', left: '10px', textDecoration: 'none' }}>
                На главную
            </Button>
            <Container className="d-flex justify-content-center align-items-center" style={{ height: window.innerHeight - 54 }}>
                <Card style={{ maxWidth: 500, width: 500, margin: 'auto', border: 'none', fontSize: '0.8rem', boxShadow: '30px 25px 15px 0px rgba(0, 0, 0, 0.1)' }} className="p-3">
                    <h2 className="m-auto " style={{ fontSize: '1.5rem', marginTop: '6rem', marginBottom: '2rem' }}>Авторизация</h2>
                    <Form>
                        <FormGroup>
                            <Input
                                style={{ marginTop: '1rem' }}
                                type='text'
                                placeholder="Введите ваш логин"
                                id="login"
                                value={login}
                                onChange={e => setLogin(e.target.value)}
                            />
                            {errors.login && <div style={{ color: 'red' }}>{errors.login}</div>}
                        </FormGroup>
                        <FormGroup>
                            <Input
                                type='password'
                                placeholder="Введите ваш пароль"
                                id="password"
                                value={password}
                                onChange={e => setPassword(e.target.value)}
                            />
                            {errors.password && <div style={{ color: 'red' }}>{errors.password}</div>}
                        </FormGroup>
                    </Form>
                    <Button onClick={Login} type="submit" variant='outline-primary'> Войти </Button>
                </Card>
            </Container>
        </Container>
    );
});

export default Login;
