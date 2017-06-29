const models = require('../models');
const helper = require('../helpers/verify');

const methods = {};

methods.create = (req, res, next) => {
  if (!req.headers.token) {
    res.json({ msg: 'butuh jwt token untuk membuat todo', ok: false });
  } else {
    const decoded = helper.decode(req.headers.token);
    const name = req.body.name;
    const base = req.body.base;
    const stretch = req.body.stretch;
    const description = req.body.description;
    const categoryId = req.body.categoryId;
    if (!req.body.name) {
      res.json({ msg: 'nama item harus diisi', ok: false });
    } else if (!req.body.base) {
      res.json({ msg: 'data base harus diisi', ok: false });
    } else if (!req.body.stretch) {
      res.json({ msg: 'data stretch harus diisi', ok: false });
    } else {
      models.Item.create({
        name,
        base,
        stretch,
        description,
        categoryId,
      })
      .then((item) => {
        if (!item) {
          res.json({ msg: 'gagal membuat item baru', ok: false });
        } else {
          res.json({ item, ok: true, msg: 'item baru berhasil dibuat' });
        }
      });
    }
  }
};

module.exports = methods;
