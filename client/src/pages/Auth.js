import React, { useContext, useState } from 'react';
import { NavLink, useLocation, useHistory } from "react-router-dom";
import { LOGIN_ROUTE, REGISTRATION_ROUTE, HOME_ROUTE } from "../utils/consts";
import { login_user, registration } from "../http/userAPI";
import { observer } from "mobx-react-lite";
import { Context } from "../index";

import { Container, Card, Col, Row, Form, Button } from 'react-bootstrap';
import { Label, FormGroup, Input } from 'reactstrap'

import "../App.css"

const Auth = observer(() => {
    const { user } = useContext(Context)
    const location = useLocation()
    const history = useHistory()
    const isLogin = location.pathname === LOGIN_ROUTE

    const [name, setName] = useState("");
    const [surname, setSurname] = useState("");
    const [patronymic, setPatronymic] = useState("");
    const [login, setLogin] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [phone, setPhone] = useState("");


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
    }

    const validateRegister = () => {

        const errors = {};

        if (!name.trim()) {
            errors.name = "Заполните это поле";
        } else if (!/^[а-яА-Я\s-]+$/.test(name)) {
            errors.name = "Допустимые символы: А-я, пробел, -"
        }

        if (!surname.trim()) {
            errors.surname = "Заполните это поле";
        } else if (!/^[а-яА-Я\s-]+$/.test(surname)) {
            errors.surname = "Допустимые символы: А-я, пробел, -"
        }

        if (patronymic.trim() === '') {
        } else if (!/^[а-яА-Я\s-]+$/.test(patronymic)) {
            errors.patronymic = "Допустимые символы: А-я, пробел, -";
        }

        if (!login.trim()) {
            errors.login = "Заполните это поле";
        } else if (!/^[a-zA-Z0-9\s-]+$/.test(login)) {
            errors.login = "Допустимые символы: A-z, 0-9, -";
        }
        if (!phone.trim()) {
            errors.phone = "Заполните это поле";
        } else if (!/^\d+$/.test(phone)) {
            errors.phone = "Номер телефона должен содержать только цифры";
        }
        if (!email.trim()) {
            errors.email = "Заполните это поле";
        } else if (!/^[a-zA-Z0-9_\-.]+@([a-zA-Z0-9_\-]+\.)+(com|org|edu|nz|au|ru)+$/.test(email)) {
            errors.email = "Проверьте правильность написания";
        }

        if (!password.trim()) {
            errors.password = "Заполните это поле";
        } else if (password.length < 6) {
            errors.password = "Пароль должен содержать не менее 6-ти символов";
        }
        setErrors(errors);
        return Object.keys(errors).length === 0;
    };

    const Register = async () => {
        if (validateRegister()) {
            try {
                let data;
                data = await registration(name, surname, patronymic, login, email, phone, password);
                user.setUser(user)
                user.setIsAuth(true)
                history.push(HOME_ROUTE)
            } catch (e) {
                alert(e.response.data.message)
            }
        }
    }

    const Login = async () => {
        if (validateLogin()) {
            try {
                let data;
                data = await login_user(login, password);
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
    const [showPassword, setShowPassword] = useState(false);

    const togglePasswordVisibility = () => {
        setShowPassword(!showPassword);
    };

    const handleChange = (e) => {
        setPassword(e.target.value);
    };

    const formstyle = {
        fontSize: '0.8rem',
        width: '100%',
        height: '8%',
        marginBottom: '-0.1rem',
    }

    const handleKeyPress = (event) => {
        if (event.key === 'Enter') {
            event.preventDefault();
            isLogin ? Login() : Register();
        }
    };

    return (
        <>
            <helmet>
                <meta name="description" content="Страница входа на портал сознательных граждан 'Нарушениям.Нет'" />
                <meta name="keywords" content="Вход, логин, пароль, авторизация, портал, нарушения, ГАИ" />
            </helmet>
            <Container className='forfont' style={{ position: 'relative' }}>
                <Button href='/home' variant='outline-primary' style={{ position: 'absolute', top: '10px', left: '10px', textDecoration: 'none' }}>
                    На главную
                </Button>
                {isLogin ?
                    <Container className="d-flex justify-content-center align-items-center" style={{ height: window.innerHeight - 54 }}>
                        <Card style={{ maxWidth: 500, width: 500, margin: 'auto', border: 'none', fontSize: '0.8rem', boxShadow: '30px 25px 15px 0px rgba(0, 0, 0, 0.1)' }} className="p-3">
                            <h2 className="m-auto " style={{ fontSize: '1.5rem', marginTop: '6rem', marginBottom: '2rem' }}>Авторизация</h2>
                            <Form onKeyPress={handleKeyPress}>
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
                                        type={showPassword ? 'text' : 'password'}
                                        placeholder="Введите ваш пароль"
                                        id="password"
                                        value={password}
                                        onChange={handleChange}
                                    />
                                    <Button variant='outline-primary' type="button" style={{ marginTop: 5, fontSize: 15 }} onClick={togglePasswordVisibility}>
                                        {showPassword ? 'Скрыть пароль' : 'Показать пароль'}
                                    </Button>
                                    {errors.password && <div style={{ color: 'red' }}>{errors.password}</div>}
                                </FormGroup>
                            </Form>
                            <a className='' style={{ textDecoration: 'none', color: 'black' }}>Нет аккаунта?
                                <a href={REGISTRATION_ROUTE} className="subtext" style={{ textDecoration: 'none' }}> Зарегистрируйтесь </a>
                            </a>
                            <br />
                            <Button onClick={Login} type="submit" variant='outline-primary'> Войти </Button>
                            <br />


                        </Card>
                    </Container>
                    :
                    <Container className="d-flex justify-content-center align-items-center mb-5 mt-1" style={{ height: window.innerHeight - 54 }}>
                        <Card style={{ maxWidth: 500, width: 500, margin: 'auto', border: 'none', fontSize: '0.8rem', boxShadow: '30px 25px 15px 0px rgba(0, 0, 0, 0.1)' }} className="p-3">
                            <h2 className="m-auto " style={{ fontSize: '1.5rem', marginTop: '6rem' }}>Регистрация</h2>

                            <Form className="d-flex flex-column" onKeyPress={handleKeyPress}>

                                <Form.Control
                                    className="mt-2"
                                    style={formstyle}
                                    placeholder="Введите имя*"
                                    value={name}
                                    id="name"
                                    onChange={(e) => setName(e.target.value)}
                                />
                                {errors.name && <div style={{ color: 'red' }} className="error-message">{errors.name}</div>}

                                <Form.Control
                                    className="mt-3"
                                    style={formstyle}
                                    placeholder="Введите фамилию*"
                                    value={surname}
                                    id="surname"
                                    onChange={(e) => setSurname(e.target.value)}
                                />
                                {errors.surname && <div style={{ color: 'red' }} className="error-message">{errors.surname}</div>}

                                <Form.Control
                                    className="mt-3"
                                    style={formstyle}
                                    placeholder="Введите отчество"
                                    id="patronymic"
                                    value={patronymic}
                                    onChange={(e) => setPatronymic(e.target.value)}
                                />
                                {errors.patronymic && <div style={{ color: 'red' }} className="error-message">{errors.patronymic}</div>}

                                <Form.Control
                                    className="mt-3"
                                    style={formstyle}
                                    placeholder="Придумайте логин*"
                                    id="login"
                                    value={login}
                                    onChange={(e) => setLogin(e.target.value)}
                                />
                                {errors.login && <div style={{ color: 'red' }} className="error-message">{errors.login}</div>}

                                <Form.Control
                                    className="mt-3"
                                    style={formstyle}
                                    placeholder="Введите email*"
                                    id="email"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                />
                                {errors.email && <div style={{ color: 'red' }} className="error-message">{errors.email}</div>}
                                <Form.Control
                                    className="mt-3"
                                    style={formstyle}
                                    placeholder="Введите телефон*"
                                    id="phone"
                                    value={phone}
                                    onChange={(e) => setPhone(e.target.value)}
                                />
                                {errors.phone && <div style={{ color: 'red' }} className="error-message">{errors.phone}</div>}

                                <Form.Control
                                    className="mt-3"
                                    placeholder="Придумайте пароль*"
                                    id="password"
                                    style={formstyle}
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    type={showPassword ? 'text' : 'password'}
                                />

                                {errors.password && <div style={{ color: 'red' }} className="error-message">{errors.password}</div>}
                                <p />
                                <div style={{ marginTop: '0.5rem', marginBottom: '0.5rem', textDecoration: 'none' }}>
                                    Есть аккаунт? <NavLink style={{ textDecoration: 'none' }} to={LOGIN_ROUTE}>Войдите</NavLink>
                                </div>

                            </Form>
                            <Button variant={'outline-primary'} onClick={() => Register()}>
                                Регистрация
                            </Button>


                        </Card>
                    </Container >
                }

            </Container >
        </>
    );
});

export default Auth;