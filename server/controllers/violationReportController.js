const { User, ViolationReport } = require('../models/models');
const ApiError = require('../error/ApiError');

class ViolationReportController {
    async createViolationReport(req, res, next) {
        try {
            const { description, carNumber, userId, } = req.body;
            if (!description || !carNumber) {
                return next(ApiError.badRequest('Отсутствуют обязательные поля'));
            }

            const violationReport = await ViolationReport.create({ description, carNumber, userId, });
            return res.status(201).json(violationReport);
        } catch (error) {
            return next(ApiError.internal('Внутренняя ошибка сервера'));
        }
    }

    async getAllViolationReports(req, res, next) {
        try {
            const violationReports = await ViolationReport.findAll({
                include: [
                    {
                        model: User,
                        attributes: ['id', 'name', 'surname', 'patronymic', 'email']
                    }
                ]
            });
            const formattedReports = await Promise.all(violationReports.map(async ViolationReport => {
                const user = ViolationReport.user || {};
                const userName = user.name || 'Нет данных';
                const userSurname = user.surname || 'Нет данных';
                const userPatronymic = user.patronymic || 'Нет данных';
                return {
                    ...ViolationReport.toJSON(),
                    userName, userSurname, userPatronymic
                };
            }));
            return res.json(formattedReports);
        } catch (error) {
            return next(ApiError.internal('Внутренняя ошибка сервера'));
        }
    }

    async getViolationReportById(req, res, next) {
        try {
            const { id } = req.params;
            const violationReport = await ViolationReport.findByPk(id);

            if (!violationReport) {
                return res.status(404).json({ message: 'Нарушение не найдено' });
            }

            return res.json(violationReport);
        } catch (error) {
            return next(ApiError.internal('Внутренняя ошибка сервера'));
        }
    }

    async deleteViolationReport(req, res, next) {
        try {
            const { id } = req.params;
            const violationReport = await ViolationReport.findByPk(id);

            if (!violationReport) {
                return next(ApiError.notFound(`Нарушение с id ${id} не найдено`));
            }

            await ViolationReport.destroy({ where: { id } });
            return res.json({ message: `Нарушение с id ${id} удалено` });
        } catch (error) {
            return next(ApiError.internal('Внутренняя ошибка сервера'));
        }
    }
    async updateViolationReportStatus(req, res, next) {
        try {
            const { id } = req.params;
            const { status } = req.body;
            if (!status) {
                return next(ApiError.badRequest('Необходимо предоставить статус для обновления'));
            }
            const violationReport = await ViolationReport.findByPk(id);
            if (!violationReport) {
                return next(ApiError.notFound(`Нарушение с id ${id} не найдено`));
            }
            await ViolationReport.update({ status }, { where: { id } });
            const updatedViolationReport = await ViolationReport.findByPk(id);

            return res.json(updatedViolationReport);
        } catch (error) {
            return next(ApiError.internal('Внутренняя ошибка сервера'));
        }
    }
    async getUserViolationReports(req, res) {
        try {
            const userId = req.user.id; 
            const userViolationReports = await ViolationReport.findAll({ where: { userId } });

            return res.json(userViolationReports);
        } catch (error) {
            console.error('Нарушение не найдено', error);
            return res.status(500).json({ message: 'Internal server error' });
        }
    }
}

module.exports = new ViolationReportController();
