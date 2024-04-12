import React, { useContext, useEffect, useState } from 'react';
import { Context } from "../index";
import Navbar from "react-bootstrap/Navbar";
import Nav from "react-bootstrap/Nav";
import { LOGIN_ROUTE, } from "../utils/consts";
import { observer } from "mobx-react-lite";
import Container from "react-bootstrap/Container";
import { useHistory } from 'react-router-dom';
import jwt_decode from 'jwt-decode'
import { Button } from 'react-bootstrap';
const NavBar = observer(() => {
    const { user } = useContext(Context);
    const history = useHistory();

    const logOut = () => {
        localStorage.removeItem("token");
        user.setIsAuth(false);
        history.push('/');
    };
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const [decodedUser, setDecodedUser] = useState(null);


    useEffect(() => {
        const userToken = localStorage.getItem('token');
        if (userToken) {
            try {
                const decoded = jwt_decode(userToken);
                setDecodedUser(decoded);
                setIsLoggedIn(true);
            } catch (error) {
                console.error('Ошибка при декодировании токена:', error);
            }
        } else {
            console.error('Токен отсутствует');
        }
    }, []);

    return (
        <Navbar expand="lg" className="bg-body-tertiary">
            <Container>
                <Navbar.Brand href="/Home">Нарушениям.Нет</Navbar.Brand>
                <Navbar.Toggle aria-controls="basic-navbar-nav" />
                <Navbar.Collapse id="basic-navbar-nav">
                    <Nav className="me-auto">

                        {user.isAuth && (
                            <>
                                <Nav.Link href="/ViolationReports">Формирование заявления</Nav.Link>
                                <Nav.Link href="/profile">Мои заявления</Nav.Link>
                                {decodedUser && decodedUser.login === 'copp' && (
                                    <Nav.Link href="/admin">Админ-панель</Nav.Link>
                                )} 
                            </>
                        )}
                    </Nav>
                    <Nav>
                        {user.isAuth ? (
                            <>
                                
                                <Button onClick={() => logOut()} className="ml-2">Выйти</Button>
                            </>
                        ) : (
                            <Button onClick={() => history.push(LOGIN_ROUTE)}>Войти</Button>
                        )}
                    </Nav>
                </Navbar.Collapse>
            </Container>
        </Navbar>

    );
});

export default NavBar;
