import models from "../models/index.js";

const { Users } = models;

export default {
  async index(_req, res) {
    const users = await Users.findAll({ order: [["id", "ASC"]] });
    res.json(users);
  },

  async show(req, res) {
    const { id } = req.params;
    const user = await Users.findByPk(id);
    if (!user)
      return res.status(404).json({ message: "Usuário não encontrado" });
    res.json(user);
  },

  async create(req, res) {
    const { name, idade, email, telefone, endereco, cidade, senha } = req.body;
    if (!name) return res.status(400).json({ message: "Nome é obrigatório" });
    if (!idade) return res.status(400).json({ message: "Idade é obrigatório" });
    if (!email) return res.status(400).json({ message: "Email é obrigatório" });
    if (!telefone)
      return res.status(400).json({ message: "Telefone é obrigatório" });
    if (!senha) return res.status(400).json({ message: "Senha é obrigatório" });
    const user = await Users.create({
      name,
      idade,
      email,
      telefone,
      endereco,
      cidade,
      senha,
    });
    res.status(201).json(user);
  },

  async update(req, res) {
    const { id } = req.params;
    if (!id) return res.status(400).json({ message: "ID é obrigatório" });
    const user = await Users.findByPk(id);
    if (!user)
      return res.status(404).json({ message: "Usuário não encontrado" });
    await user.update({
      name: req.body.name ?? user.name,
      idade: req.body.idade ?? user.idade,
      email: req.body.email ?? user.email,
      telefone: req.body.telefone ?? user.telefone,
      endereco: req.body.endereco ?? user.endereco,
      cidade: req.body.cidade ?? user.cidade,
      senha: req.body.senha ?? user.senha,
    });
    res.json(user);
  },

  async destroy(req, res) {
    const { id } = req.params;
    const user = await Users.findByPk(id);
    if (!user)
      return res.status(404).json({ message: "Usuário não encontrado" });
    await user.destroy();
    res.status(204).send();
  },
};
