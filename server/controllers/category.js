const models = require('../models');

const methods = {};

methods.create = (req, res, next) => {
  if (!req.headers.token) {
    res.json({ msg: 'butuh jwt token untuk mendaftarkan kategori baru pada item', ok: false });
  } else if (!req.body.name) {
    res.json({ msg: 'nama kategori tidak boleh kosong', ok: false });
  } else {
    const name = req.body.name;
    models.Category.create({
      name,
    })
    .then((category) => {
      models.Item.findAll({
        where: { id: req.body.itemId },
      })
      .then((item) => {
        // item[0].CategoryId = category.id;
        // item[0].save().then((itemWithCategory) => {
        //   res.json({ itemWithCategory, msg: `sukses menambah kategori baru di item ${item.name}`, ok: true });
        // });
        item[0].update({
          CategoryId: category.id,
        })
        .then((itemWithCategory) => {
          res.json({ itemWithCategory, msg: `sukses menambah kategori baru di item ${item[0].name}`, ok: true });
        });
      });
    });
  }
};

module.exports = methods;
