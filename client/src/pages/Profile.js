import React, { useState, useEffect } from 'react';
import { Container, Table, Button } from 'react-bootstrap';
import { getUserViolationReports,  } from '../http/violationReportAPI';
import CreateViolationReport from '../components/modals/CreateViolationReport';


const Profile = () => {
    const [userViolationReports, setUserViolationReports] = useState([]);
    const [showModal, setShowModal] = useState(false);

    const handleShowModal = () => {
        setShowModal(true);
    };

    const handleCloseModal = () => {
        setShowModal(false);
    };

    useEffect(() => {
        const fetchData = async () => {
            try {
                const data = await getUserViolationReports();
                setUserViolationReports(data);
            } catch (error) {
                console.error('Ошибка при загрузке нарушений:', error);
            }
        };

        fetchData();
    }, []);

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
            <h2>Мои заявления</h2>
            <Table striped bordered hover>
                <thead>
                    <tr>
                        <th>Описание</th>
                        <th>Номер автомобиля</th>
                        <th>Статус</th>
                    </tr>
                </thead>
                <tbody>
                    {userViolationReports.map((report, index) => (
                        <tr key={report.id}>
                            <td>{report.description}</td>
                            <td>{report.carNumber}</td>
                            <td>{getStatusLabel(report.status)}</td>
                        </tr>
                    ))}
                </tbody>
            </Table>
            <div>
            <Button variant="primary" onClick={handleShowModal}>
                Добавить
            </Button>
            <CreateViolationReport show={showModal} onHide={handleCloseModal} />
        </div>
        </Container>
    );
};

export default Profile;
