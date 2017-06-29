const models = require('../models');
const helper = require('../helpers/verify');

const methods = {};

methods.create = (req, res, next) => {
  if (!req.headers.token) {
    res.json({ msg: 'butuh jwt token untuk membuat item baru', ok: false });
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
          models.WorkerItem.create({
            itemId: item.id,
            workerId: decoded.id,
          })
          .then((done) => {
            res.json({ done, item, ok: true, msg: 'item baru berhasil dibuat' });
          });
        }
      });
    }
  }
};

methods.gets = (req, res, next) => {
  if (!req.headers.token) {
    res.json({ msg: 'butuh jwt token untuk mengambil data item', ok: false });
  } else {
    models.Item.findAll()
    .then((items) => {
      if (!items) {
        res.json({ msg: 'gagal mendapatkan data item', ok: false });
      } else {
        res.json({ items, ok: true });
      }
    });
  }
};

methods.getItemByCategoryName = (req, res, next) => {
  if (!req.headers.token) {
    res.json({ msg: 'butuh jwt token untuk mengambil data item', ok: false });
  } else {
    models.Item.findAll({
      include: [{
        model: models.Category,
        where: { id: req.body.categoryId },
      }],
    }).then((itemByCategory) => {
      res.json({ itemByCategory, msg: 'berhasil', ok: true });
    });
  }
};

module.exports = methods;
