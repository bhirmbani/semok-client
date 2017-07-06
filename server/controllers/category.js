const models = require('../models');

const methods = {};

methods.create = (req, res, next) => {
  if (!req.headers.token) {
    res.json({ msg: 'butuh jwt token untuk mendaftarkan kategori baru pada item', ok: false });
  } else if (!req.body.name) {
    res.json({ msg: 'nama kategori tidak boleh kosong', ok: false });
  } else {
    const name = req.body.name;
    models.Category.findOne({
      where: { name },
    })
    .then((category) => {
      if (!category) {
        models.Category.create({
          name,
        })
        .then((uniqueCategory) => {
          if (!uniqueCategory) {
            res.json({ msg: 'gagal membuat kategori unik', ok: false });
          } else {
            res.json({ uniqueCategory, msg: `berhasil menambah kategori baru dengan nama: ${uniqueCategory.name}`, ok: true });
          }
        });
      } else {
        res.json({ msg: 'gagal membuat kategori karena kategori ini sudah ada', ok: false });
      }
    });
  }
};

methods.assignCategoryToItem = (req, res, next) => {
  if (!req.headers.token) {
    res.json({ msg: 'butuh jwt token untuk menambah kategori pada item', ok: false });
  } else {
    models.Item.findOne({
      where: { id: req.body.itemId },
    })
    .then((item) => {
      if (item === null) {
        res.json({ msg: `tidak ditemukan item dengan id ${req.body.itemId}`, ok: false });
      } else {
        models.Category.findOne({
          where: { id: req.body.categoryId },
        })
        .then((category) => {
          if (category === null) {
            res.json({ msg: `tidak ditemukan category dengan id ${req.body.categoryId}`, ok: false });
          } else {
            item.update({
              CategoryId: parseInt(req.body.categoryId, 10),
            })
            .then((itemWithCategory) => {
              res.json({ itemWithCategory, msg: `berhasil menambah/mengubah kategori baru untuk item ${item.name}`, ok: true });
            });
          }
        });
      }
    });
  }
};

methods.gets = (req, res, next) => {
  if (!req.headers.token) {
    res.json({ msg: 'butuh jwt token untuk menambah kategori pada item', ok: false });
  } else {
    models.Category.findAll({
      include: [{
        model: models.Item,
      }],
    })
    .then((categories) => {
      res.json({ categories, msg: 'testing' });
    });
  }
};

module.exports = methods;
