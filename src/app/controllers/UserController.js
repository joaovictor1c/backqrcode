import * as Yup from "yup";
import User from "../models/User";

class UserController {

  async index(req, res) {
    const { page = 1 } = req.query;
    const users = await User.findAll({
      limit: 20,
      offset: (page - 1) * 20,
      attributes: ["id", "name", "email"],
    });
    return res.json(users);
  }

  async show(req, res) {
    const {id} = req.params;
    const users = await User.findOne({
      where: { id: id},
    });
    return res.json(users);
  }

  async update(req, res) {
    const schema = Yup.object().shape({
      name: Yup.string(),
      email: Yup.string().email(),
      oldPassword: Yup.string().min(6),
      password: Yup.string()
        .min(6)
        .when("oldPassword", (oldPassword, field) =>
          oldPassword ? field.required() : field
        ),
      confirmPassword: Yup.string().when("password", (password, field) =>
        password ? field.required().oneOf([Yup.ref("password")]) : field
      )
    });
    if (!(await schema.isValid(req.body))) {
      return res.status(400).json({ error: "Validations fails" });
    }

    const { email, oldPassword } = req.body;

    const user = await User.findByPk(req.params.id);

    if (email !== user.email) {
      const userExists = await User.findOne({
        where: { email }
      });
      if (userExists) {
        return res.status(400).json({ error: "user already exists" });
      }
    }
    if (oldPassword && !(await user.checkPassword(oldPassword))) {
      return res.status(401).json({ error: "Password does not match" });
    }

    const { id, name, admin } = await user.update(req.body);

    return res.json({ id, name, email, admin });
  }

  async store(req, res) {
    const schema = Yup.object().shape({
      name: Yup.string().required(),
      email: Yup.string()
        .email()
        .required(),
      password: Yup.string()
        .required()
        .min(6)
    });

    if (!(await schema.isValid(req.body))) {
      return res.status(400).json({ error: "Validations fails" });
    }

    const userExists = await User.findOne({ where: { email: req.body.email } });

    if (userExists) {
      return res.status(400).json({ error: "User already exists" });
    }

    const { id, email, provider, name } = await User.create(req.body);
    return res.json({ id, name, email, provider });
  }

  async delete(req, res) {
    const destroy = await User.destroy({
      where: {
        id: req.params.id
      }
    });

    return res.json({ success: "User successfully deleted", destroy });
  }

}

export default new UserController();
