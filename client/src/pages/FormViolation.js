import React, { useState, useEffect } from 'react';
import { Button, Form, Container } from "react-bootstrap";
import { createViolationReport } from "../http/violationReportAPI";
import jwt_decode from 'jwt-decode';

const FormViolation = ({ show, onHide }) => {
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
        <Container className=" justify-content-center align-items-center" style={{ maxWidth: 500, width: 500, marginTop: '200px', border: 'none', fontSize: '0.8rem' }}>
            <h2>Оставить заявление</h2>
                <Form style={{width: 500}}>
                    <Form.Control
                        value={description}
                        onChange={(e) => setDescription(e.target.value)}
                        placeholder={"Описание нарушения"}
                        className='mb-2'
                    />
                    <Form.Control
                        value={carNumber}
                        onChange={(e) => setCarNumber(e.target.value)}
                        placeholder={"Номер автомобиля"}
                        className='mb-2'
                    />
                </Form>
                <Button variant="outline-success" onClick={handleCreateReport}>Добавить</Button>
        </Container >
    );
};

export default FormViolation;
