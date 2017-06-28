const models = require('../models');
const bcrypt = require('bcrypt');
const helper = require('../helpers/verify');

const methods = {};

methods.create = (req, res, next) => {
  if (!req.body.password && !req.body.email && !req.body.name && !req.body.role) {
    res.json({ msg: 'email, password, name, role tidak boleh kosong', ok: false });
  } else if (!req.body.email) {
    res.json({ msg: 'email tidak boleh kosong', ok: false });
  } else if (!req.body.name) {
    res.json({ msg: 'name tidak boleh kosong', ok: false });
  } else if (!req.body.role) {
    res.json({ msg: 'role tidak boleh kosong', ok: false });
  } else if (!req.body.password) {
    res.json({ msg: 'password tidak boleh kosong', ok: false });
  } else {
    models.Worker.findOne({
      where: { email: req.body.email },
    })
    .then((user) => {
      if (!user) {
        if (req.body.password.length < 6) {
          res.json({ msg: 'password tidak boleh kurang dari enam karakter', ok: false });
        } else if (req.body.role !== 'staff' && req.body.role !== 'asmen' && req.body.role !== 'manager' && req.body.role !== 'admin') {
          res.json({ msg: `pekerja tidak bisa memiliki role ${req.body.role}`, ok: false });
        } else {
          const salt = bcrypt.genSaltSync(10);
          const email = req.body.email;
          const name = req.body.name;
          const role = req.body.role;
          const password = bcrypt.hashSync(req.body.password, salt);
          models.Worker.create({
            name,
            role,
            email,
            password,
          })
        .then((registerdUser) => {
          res.json({ registerdUser, msg: 'berhasil register user baru dengan email unik', ok: true });
        });
        }
      } else {
        res.json({ msg: 'gagal registrasi user baru karena email sudah dipakai', ok: false });
      }
    });
  }
};

module.exports = methods;
