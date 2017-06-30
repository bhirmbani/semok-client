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
      models.Item.findOne({
        where: { name },
      })
      .then((foundItem) => {
        if (!foundItem) {
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
          .then((workerItemRef) => {
            res.json({ workerItemRef, item, ok: true, msg: 'item baru berhasil dibuat' });
          });
        }
      });
        } else {
          res.json({ msg: `gagal membuat item karena item ${name} sudah ada.`, ok: false });
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
        where: { id: req.params.categoryId },
      }],
    })
    .then((itemByCategory) => {
      res.json({ itemByCategory, msg: 'berhasil', ok: true });
    });
  }
};

methods.getItemByWorkerName = (req, res, next) => {
  if (!req.headers.token) {
    res.json({ msg: 'butuh jwt token untuk mengambil data item', ok: false });
  } else {
    models.Worker.findAll({
      where: { id: req.params.workerId },
    })
    .then((workers) => {
      if (workers.length < 1) {
        res.json({ msg: 'tidak ada item untuk pekerja ini', ok: false });
      } else {
        workers.forEach((worker) => {
          worker.getItems()
        .then((items) => {
          res.json({ worker, items, msg: 'ambil data item berdasarkan pekerja berhasil', ok: true });
        });
        });
      }
    });
  }
};

methods.delegateItem = (req, res, next) => {
  const decoded = helper.decode(req.headers.token);
  if (!req.headers.token) {
    res.json({ msg: 'butuh jwt token untuk mendelegasikan item', ok: false });
  } else if (decoded.role === 'manager' || decoded.role === 'asmen') {
    models.WorkerItem.findOne({
      where: { itemId: req.body.itemId, workerId: req.body.workerId },
    })
    .then((duplicateDelegateItem) => {
      if (duplicateDelegateItem !== null) {
        models.Worker.findOne({
          where: { id: req.body.workerId },
        })
        .then((worker) => {
          res.json({ duplicateDelegateItem, msg: `tidak bisa mendelegasikan item ini kepada ${worker.role} ${worker.name} karena user tersebut sudah menerima delegasi untuk item ini`, ok: false });
        });
      } else {
        models.Worker.findOne({
          where: { id: req.body.workerId },
        })
        .then((worker) => {
          const itemId = req.body.itemId;
          const workerId = req.body.workerId;
          models.WorkerItem.create({
            itemId,
            workerId,
          })
          .then((delegatedItem) => {
            res.json({ delegatedItem, msg: `berhasil mendelegasikan item ini kepada ${worker.role} ${worker.name}. Didelegasikan oleh: ${decoded.name}`, ok: true });
          });
        });
      }
    });
  } else {
    res.json({ msg: 'hanya manajer dan asmen yang bisa mendelegasikan item', ok: false });
  }
};

methods.description = (req, res, next) => {
  if (!req.headers.token) {
    res.json({ msg: 'butuh jwt token untuk membuat deskripsi item', ok: false });
  } else {
    models.Item.findOne({
      where: { id: req.body.itemId },
    })
    .then((item) => {
      item.update({
        description: req.body.description,
      })
      .then((itemWithDescription) => {
        res.json({ itemWithDescription, msg: 'sukses menambahkan deskripsi', ok: true });
      });
    });
  }
};

module.exports = methods;
