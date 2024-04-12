const ApiError = require('../error/ApiError');
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')
const { User } = require('../models/models')

const generateJwt = (id, name, surname, patronymic, login, email, password, phone, role) => {
    return jwt.sign(
        { id, name, surname, patronymic, login, email, password, phone, role },
        process.env.SECRET_KEY,
        { expiresIn: '24h' }
    )
}

class UserController {
    async registration(req, res, next) {
        try {
            const { name, surname, patronymic, login, email, password, phone } = req.body;
            if (!name || !surname || !patronymic || !login || !email || !password || !phone) {
                return next(ApiError.badRequest('Отсутствуют обязательные поля'));
            }
            const candidateLogin = await User.findOne({ where: { login } });
            const candidateEmail = await User.findOne({ where: { email } });
    
            if (candidateLogin) {
                return next(ApiError.badRequest('Пользователь с таким логином уже существует'));
            }
            if (candidateEmail) {
                return next(ApiError.badRequest('Пользователь с таким email уже существует'));
            }
    
            const hashPassword = await bcrypt.hash(password, 5);
            const user = await User.create({ name, surname, patronymic, login, email, password: hashPassword, phone });
            const token = generateJwt(user.id, user.name, user.surname, user.patronymic, user.login, user.email, hashPassword, user.phone, user.role);
            
            return res.json({ token });
        } catch (error) {
            return next(ApiError.internal('Внутренняя ошибка сервера'));
        }
    }
    

    async login_user(req, res, next) {
        const { login, password } = req.body;
        const user = await User.findOne({ where: { login } });

        if (!user) {
            return next(ApiError.internal('Пользователь не найден'));
        }

        let comparePassword = bcrypt.compareSync(password, user.password);

        if (!comparePassword) {
            return next(ApiError.internal('Указан неверный пароль'));
        }

        const token = generateJwt(user.id, user.name, user.surname, user.patronymic, user.login, user.email, user.password, user.phone, user.role);

        return res.json({ userId: user.id, token });
    }


    async check(req, res, next) {
        const token = generateJwt(req.user.id, req.user.name, req.user.surname, req.user.patronymic, req.user.login, req.user.email, req.user.password, req.user.phone, req.user.role)
        return res.json({ token })
    }
    async getAll(req, res) {
        const users = await User.findAll()
        return res.json(users)
    }

    async getOne(req, res) {
        try {
            const { id } = req.params;
            const user = await getUser(id);

            if (!user) {
                return res.status(404).json({ message: 'Пользователь не найден' });
            }

            return res.json(user);
        } catch (error) {
            console.error(error);
            return res.status(500).json({ message: 'Внутренняя ошибка сервера' });
        }
    }


    async delete(req, res, next) {
        try {
            const { id } = req.params;
            const user = await User.findByPk(id);

            if (!user) {
                return next(ApiError.notFound(`User with id ${id} not found`));
            }
            const { name } = user;
            await User.destroy({
                where: {
                    id
                }
            });
            return res.json({ message: `Пользователь ${name} удален` });
        } catch (e) {
            next(ApiError.badRequest(e.message));
        }
    }
}


module.exports = new UserController()