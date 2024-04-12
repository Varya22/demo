import React, { useState, useEffect } from 'react';
import { Container, Table, Button, Modal, Form } from 'react-bootstrap';
import { getAllViolationReports, updateViolationReportStatus } from '../http/violationReportAPI'; 

const Admin = () => {
    const [isAdminAuthenticated, setIsAdminAuthenticated] = useState(false);
    const [violationReports, setViolationReports] = useState([]);
    const [showModal, setShowModal] = useState(false);
    const [login, setLogin] = useState('');
    const [password, setPassword] = useState('');

    useEffect(() => {
        const fetchData = async () => {
            try {
                const data = await getAllViolationReports();
                setViolationReports(data);
            } catch (error) {
                console.error('Ошибка при загрузке нарушений:', error);
            }
        };

        fetchData();
    }, []);

    const handleAdminLogin = () => {
        setShowModal(true);
    };

    const handleCloseModal = () => {
        setShowModal(false);
    };

    const handleLogin = () => {
        if (login === 'copp' && password === 'password') {
            setIsAdminAuthenticated(true);
            setShowModal(false);
        } else {
            alert('Неправильный логин или пароль');
        }
    };

    const handleStatusUpdate = async (id, newStatus) => {
        try {
            await updateViolationReportStatus(id, newStatus);
            const updatedReports = await getAllViolationReports();
            setViolationReports(updatedReports);
        } catch (error) {
            console.error('Ошибка при обновлении статуса:', error);
        }
    };

    const getStatusLabel = (status) => {
        switch (status) {
            case 'new':
                return 'Новый';
            case 'confirmed':
                return 'Подтвержден';
            case 'rejected':
                return 'Отклонен';
            default:
                return '';
        }
    };

    return (
        <Container>
            {isAdminAuthenticated ? (
                <div>
                    <h2>Список нарушений</h2>
                    <Table striped bordered hover>
                        <thead>
                            <tr>
                                <th>Описание</th>
                                <th>Номер автомобиля</th>
                                <th>Имя</th>
                                <th>Фамилия</th>
                                <th>Отчество</th>
                                <th>Статус</th>
                                <th>Действия</th>
                            </tr>
                        </thead>
                        <tbody>
                            {violationReports.map((report, index) => (
                                <tr key={report.id}>
                                    <td>{report.description}</td>
                                    <td>{report.carNumber}</td>
                                    <td>{report.userName}</td>
                                    <td>{report.userSurname}</td>
                                    <td>{report.userPatronymic}</td>
                                    <td>{getStatusLabel(report.status)}</td>
                                    <td>
                                        {(report.status !== 'confirmed' && report.status !== 'rejected') && (
                                            <>
                                                <Button
                                                    variant="success"
                                                    onClick={() => handleStatusUpdate(report.id, 'confirmed')}
                                                >
                                                    Подтвердить
                                                </Button>{' '}
                                                <Button
                                                    variant="danger"
                                                    onClick={() => handleStatusUpdate(report.id, 'rejected')}
                                                >
                                                    Отменить
                                                </Button>
                                            </>
                                        )}
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </Table>
                </div>
            ) : (
                <div>
                    <h2>Вход только для администратора</h2>
                    <Button onClick={handleAdminLogin}>Войти</Button>

                    <Modal show={showModal} onHide={handleCloseModal}>
                        <Modal.Header closeButton>
                            <Modal.Title>Вход в систему</Modal.Title>
                        </Modal.Header>
                        <Modal.Body>
                            <Form>
                                <Form.Group controlId="formBasicLogin">
                                    <Form.Label>Логин</Form.Label>
                                    <Form.Control type="text" placeholder="Введите логин" value={login} onChange={(e) => setLogin(e.target.value)} />
                                </Form.Group>

                                <Form.Group controlId="formBasicPassword">
                                    <Form.Label>Пароль</Form.Label>
                                    <Form.Control type="password" placeholder="Введите пароль" value={password} onChange={(e) => setPassword(e.target.value)} />
                                </Form.Group>
                            </Form>
                        </Modal.Body>
                        <Modal.Footer>
                            <Button variant="secondary" onClick={handleCloseModal}>
                                Закрыть
                            </Button>
                            <Button variant="primary" onClick={handleLogin}>
                                Войти
                            </Button>
                        </Modal.Footer>
                    </Modal>
                </div>
            )}
        </Container>
    );
};

export default Admin;
