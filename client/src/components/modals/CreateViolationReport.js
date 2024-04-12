import React, { useState, useEffect } from 'react';
import Modal from "react-bootstrap/Modal";
import { Button, Form } from "react-bootstrap";
import { createViolationReport } from "../../http/violationReportAPI";
import jwt_decode from 'jwt-decode';

const CreateViolationReport = ({ show, onHide }) => {
    const [description, setDescription] = useState('');
    const [carNumber, setCarNumber] = useState('');
    const [userId, setUserId] = useState('');

    useEffect(() => {
        const userToken = localStorage.getItem('token');
        if (userToken) {
            try {
                const decoded = jwt_decode(userToken);
                console.log('Decoded user:', decoded);
                setUserId(decoded.id);
            } catch (error) {
                console.error('Error decoding token:', error);
            }
        } else {
            console.error('Token is missing');
        }
    }, []);

    const handleCreateReport = async () => {
        try {
            const report = {
                userId: userId,
                description: description,
                carNumber: carNumber
            };
            await createViolationReport(report);
            onHide();
        } catch (error) {
            console.error('Error creating record:', error);
        }
    };

    return (
        <Modal
            show={show}
            onHide={onHide}
            centered
        >
            <Modal.Header closeButton>
                <Modal.Title id="contained-modal-title-vcenter">
                    Добавить нарушение
                </Modal.Title>
            </Modal.Header>
            <Modal.Body>
                <Form>
                    <Form.Control
                        value={description}
                        onChange={(e) => setDescription(e.target.value)}
                        placeholder={"Описание нарушения"}
                    />
                    <Form.Control
                        value={carNumber}
                        onChange={(e) => setCarNumber(e.target.value)}
                        placeholder={"Номер автомобиля"}
                    />
                </Form>
            </Modal.Body>
            <Modal.Footer>
                <Button variant="outline-danger" onClick={onHide}>Закрыть</Button>
                <Button variant="outline-success" onClick={handleCreateReport}>Добавить</Button>
            </Modal.Footer>
        </Modal>
    );
};

export default CreateViolationReport;
