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
    const bobot = req.body.bobot;
    const createdBy = decoded.name;
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
            createdBy,
          })
      .then((item) => {
        if (!item) {
          res.json({ msg: 'gagal membuat item baru', ok: false });
        } else {
          models.Bobot.create({
            point: bobot,
            ItemId: item.id,
            WorkerId: decoded.id,
          })
          .then((bobotItemRef) => {
            models.WorkerItem.create({
              itemId: item.id,
              workerId: decoded.id,
            })
          .then((workerItemRef) => {
            models.Status.create({
              content: 'red',
              ItemId: item.id,
              WorkerId: decoded.id,
            })
            .then((statusRef) => {
              models.Info.create({
                ItemId: item.id,
                WorkerId: decoded.id,
              })
              .then((infoRef) => {
                models.Unit.create({
                  ItemId: item.id,
                })
                .then((unitRef) => {
                  res.json({ unitRef, infoRef, statusRef, bobotItemRef, workerItemRef, item, ok: true, msg: 'item baru berhasil dibuat' });
                });
              });
            });
          });
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
    models.Item.findAll({
      include:
      [
        {
          model: models.Bobot,
        },
        {
          model: models.Worker,
        },
        {
          model: models.Status,
        },
        {
          model: models.Info,
        },
        {
          model: models.Unit,
        },
      ],
    })
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
      if (itemByCategory.length < 1) {
        res.json({ msg: 'tidak ada item untuk kategori ini', ok: false });
      }
      res.json({ itemByCategory, msg: 'berhasil mendapatkan item berdasarkan kategori', ok: true });
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
        res.json({ msg: `tidak ditemukan pekerja dengan id ${req.params.workerId}`, ok: false });
      } else {
        workers.forEach((worker) => {
          worker.getItems({
            include:
            [
              {
                model: models.Bobot,
                where: { WorkerId: req.params.workerId },
              },
              // {
              //   model: models.Status,
              //   where: { WorkerId: req.params.workerId },
              // },
              {
                model: models.Info,
                where: { WorkerId: req.params.workerId },
              },
              {
                model: models.Unit,
              },
            ],
          })
        .then((items) => {
          if (items.length < 1) {
            res.json({ msg: `${worker.role} ${worker.name} tidak punya item. silakan tambah atau delegasikan`, ok: false });
          }
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
          models.Item.findOne({
            where: { id: req.body.itemId },
          })
          .then((item) => {
            res.json({ duplicateDelegateItem, msg: `tidak bisa mendelegasikan item ${item.name} kepada ${worker.role} ${worker.name} karena user tersebut sudah menerima delegasi untuk item ini`, ok: false });
          });
        });
      } else {
        models.Worker.findOne({
          where: { id: req.body.workerId },
        })
        .then((worker) => {
          if (decoded.role === 'asmen') {
            if (worker.role === 'manager') {
              res.json({ msg: 'asmen tidak bisa mendelegasikan item kepada manager', ok: false });
            } else if (worker.role === 'asmen') {
              // delegation logic for asmen
              models.Item.findOne({
                where: { id: req.body.itemId },
                include:
                [
                  {
                    model: models.Info,
                    where: { WorkerId: decoded.id },
                  },
                ],
              })
              .then((item) => {
                if (item === null) {
                  models.Worker.findOne({
                    where: { id: req.body.workerId },
                  })
                  .then((workerRef) => {
                    models.Item.findOne({
                      where: { id: req.body.itemId },
                    })
                    .then((itemRef) => {
                      res.json({ msg: `tidak bisa mendelegasikan item ${itemRef.name} kepada ${workerRef.role} ${workerRef.name} karena bukan milik ${decoded.role} ${decoded.name}`, ok: false });
                    });
                  });
                } else if (decoded.name === item.createdBy) {
                  const itemId = req.body.itemId;
                  const workerId = req.body.workerId;
                  models.WorkerItem.create({
                    itemId,
                    workerId,
                  })
                  .then((delegatedItem) => {
                    models.Item.findOne({
                      where: { id: req.body.itemId },
                    })
                    .then((itemRef) => {
                      models.Bobot.create({
                        ItemId: req.body.itemId,
                        WorkerId: req.body.workerId,
                      })
                      .then((bobotRef) => {
                        models.Status.create({
                          content: 'red',
                          ItemId: req.body.itemId,
                          WorkerId: req.body.workerId,
                        })
                        .then((statusRef) => {
                          models.Info.create({
                            ItemId: req.body.itemId,
                            WorkerId: req.body.workerId,
                            delegateBy: decoded.name,
                            delegateTo: worker.name,
                          })
                          .then((infoRef) => {
                            res.json({ statusRef, infoRef, bobotRef, delegatedItem, msg: `berhasil mendelegasikan item ${itemRef.name} kepada ${worker.role} ${worker.name}. Didelegasikan oleh: ${decoded.name}`, ok: true });
                          });
                        });
                      });
                    });
                  });
                } else {
                  models.Item.findOne({
                    where: { id: req.body.itemId },
                    include: [{
                      model: models.Worker,
                    }],
                  })
                  .then((itemRef) => {
                    const filteredItems = itemRef.Workers.filter(
                      workerItem => workerItem.id === decoded.id);
                    if (filteredItems.length < 1) {
                      res.json({ msg: `gagal karena item ini belum didelegasikan kepada ${decoded.role} ${decoded.name}`, ok: false });
                    } else if (filteredItems[0].name === decoded.name) {
                      const itemId = req.body.itemId;
                      const workerId = req.body.workerId;
                      models.WorkerItem.create({
                        itemId,
                        workerId,
                      })
                      .then((delegatedItem) => {
                        models.Item.findOne({
                          where: { id: req.body.itemId },
                        })
                        .then((itemRef2) => {
                          models.Bobot.create({
                            ItemId: req.body.itemId,
                            WorkerId: req.body.workerId,
                          })
                        .then((bobotRef) => {
                          models.Status.create({
                            content: 'red',
                            ItemId: req.body.itemId,
                            WorkerId: req.body.workerId,
                          })
                        .then((statusRef) => {
                          models.Info.create({
                            ItemId: req.body.itemId,
                            WorkerId: req.body.workerId,
                            delegateBy: decoded.name,
                            delegateTo: worker.name,
                          })
                          .then((infoRef) => {
                            res.json({ statusRef, infoRef, bobotRef, delegatedItem, msg: `berhasil mendelegasikan item ${itemRef2.name} kepada ${worker.role} ${worker.name}. Didelegasikan oleh: ${decoded.name}`, ok: true });
                          });
                        });
                        });
                        });
                      });
                    }
                  });
                }
              });
            } else if (worker.role === 'staff') {
              // delegation logic for asmen to staff
              models.Item.findOne({
                where: { id: req.body.itemId },
                include:
                [
                  {
                    model: models.Info,
                    where: { WorkerId: decoded.id },
                  },
                ],
              })
              .then((item) => {
                if (item === null) {
                  models.Worker.findOne({
                    where: { id: req.body.workerId },
                  })
                  .then((workerRef) => {
                    models.Item.findOne({
                      where: { id: req.body.itemId },
                    })
                    .then((itemRef) => {
                      res.json({ ref: '370', msg: `tidak bisa mendelegasikan item ${itemRef.name} kepada ${workerRef.role} ${workerRef.name} karena bukan milik ${decoded.role} ${decoded.name}`, ok: false });
                    });
                  });
                } else if (decoded.name === item.createdBy) {
                  // ini buat asmen yang menjadi
                  // pemilik item dan ingin
                  // mendelegasikan item itu ke staff
                  // tested work on 5th july 11:23
                  const itemId = req.body.itemId;
                  const workerId = req.body.workerId;
                  models.WorkerItem.create({
                    itemId,
                    workerId,
                  })
                  .then((delegatedItem) => {
                    models.Item.findOne({
                      where: { id: req.body.itemId },
                    })
                    .then((itemRef) => {
                      models.Bobot.create({
                        ItemId: req.body.itemId,
                        WorkerId: req.body.workerId,
                      })
                      .then((bobotRef) => {
                        models.Status.create({
                          content: 'red',
                          ItemId: req.body.itemId,
                          WorkerId: req.body.workerId,
                        })
                        .then((statusRef) => {
                          models.Info.create({
                            ItemId: req.body.itemId,
                            WorkerId: req.body.workerId,
                            delegateBy: decoded.name,
                            delegateTo: worker.name,
                          })
                          .then((infoRef) => {
                            res.json({ statusRef, infoRef, bobotRef, delegatedItem, msg: `berhasil mendelegasikan item ${itemRef.name} kepada ${worker.role} ${worker.name}. Didelegasikan oleh: ${decoded.name}`, ok: true });
                          });
                        });
                      });
                    });
                  });
                } else {
                  // ini buat asmen yang
                  // sudah punya item karena sudah
                  // didelegasikan dan ingin
                  // mendelegasikan item itu ke staff
                  // tested works on 5th july 11:32
                  models.Item.findOne({
                    where: { id: req.body.itemId },
                    include: [{
                      model: models.Worker,
                    }],
                  })
                  .then((itemRef) => {
                    const filteredItems = itemRef.Workers.filter(
                      workerItem => workerItem.id === decoded.id);
                    if (filteredItems.length < 1) {
                      res.json({ ref: '428', msg: `gagal karena item ini belum didelegasikan kepada ${decoded.role} ${decoded.name}`, ok: false });
                    } else if (filteredItems[0].name === decoded.name) {
                      const itemId = req.body.itemId;
                      const workerId = req.body.workerId;
                      models.WorkerItem.create({
                        itemId,
                        workerId,
                      })
                      .then((delegatedItem) => {
                        models.Item.findOne({
                          where: { id: req.body.itemId },
                        })
                        .then((itemRef2) => {
                          models.Bobot.create({
                            ItemId: req.body.itemId,
                            WorkerId: req.body.workerId,
                          })
                        .then((bobotRef) => {
                          models.Status.create({
                            content: 'red',
                            ItemId: req.body.itemId,
                            WorkerId: req.body.workerId,
                          })
                        .then((statusRef) => {
                          models.Info.create({
                            ItemId: req.body.itemId,
                            WorkerId: req.body.workerId,
                            delegateBy: decoded.name,
                            delegateTo: worker.name,
                          })
                          .then((infoRef) => {
                            res.json({ ref: '459', statusRef, infoRef, bobotRef, delegatedItem, msg: `berhasil mendelegasikan item ${itemRef2.name} kepada ${worker.role} ${worker.name}. Didelegasikan oleh: ${decoded.name}`, ok: true });
                          });
                        });
                        });
                        });
                      });
                    }
                  });
                }
              });
            } else {
              res.json({ ref: '471', msg: 'tidak ada fitur untuk mendelegasikan item kepada admin', ok: false });
            }
          } else if (decoded.role === 'manager') {
            if (worker.role === 'admin') {
              res.json({ ref: '439', msg: 'tidak ada fitur untuk mendelegasikan item kepada admin', ok: false });
            } else if (worker.role === 'asmen') {
              // delegation logic for manager to asmen but not staff
              models.Item.findOne({
                where: { id: req.body.itemId },
                include:
                [
                  {
                    model: models.Info,
                    where: { WorkerId: decoded.id },
                  },
                ],
              })
              .then((item) => {
                if (item === null) {
                  res.json({ ref: '454', msg: 'item ini bukan milik Anda', ok: false });
                } else {
                  // item milik yang login
                  const itemId = req.body.itemId;
                  const workerId = req.body.workerId;
                  models.WorkerItem.create({
                    itemId,
                    workerId,
                  })
                  .then((delegatedItem) => {
                    models.Item.findOne({
                      where: { id: req.body.itemId },
                    })
                    .then((itemRef) => {
                      models.Bobot.create({
                        ItemId: req.body.itemId,
                        WorkerId: req.body.workerId,
                      })
                      .then((bobotRef) => {
                        models.Status.create({
                          content: 'red',
                          ItemId: req.body.itemId,
                          WorkerId: req.body.workerId,
                        })
                        .then((statusRef) => {
                          models.Info.create({
                            ItemId: req.body.itemId,
                            WorkerId: req.body.workerId,
                            delegateBy: decoded.name,
                            delegateTo: worker.name,
                          })
                          .then((infoRef) => {
                            res.json({ ref: '486', statusRef, infoRef, bobotRef, delegatedItem, msg: `berhasil mendelegasikan item ${itemRef.name} kepada ${worker.role} ${worker.name}. Didelegasikan oleh: ${decoded.name}`, ok: true });
                          });
                        });
                      });
                    });
                  });
                }
              });
            } else if (worker.role === 'manager' || worker.role === 'staff') {
              res.json({ msg: worker.role === 'manager' ? 'tidak bisa mendelegasikan item dari manager ke sesama manager' : 'tidak bisa mendelegasikan item dari manager ke staff', ok: false });
            } else {
              res.json({ ref: '464', msg: 'tidak ada fitur pendelegasian kepada admin', ok: false });
            }
          }
        });
      }
    });
  } else if (decoded.role === 'staff') {
    models.WorkerItem.findOne({
      where: { itemId: req.body.itemId, workerId: req.body.workerId },
    })
    .then((duplicateDelegateItem) => {
      if (duplicateDelegateItem !== null) {
        models.Worker.findOne({
          where: { id: req.body.workerId },
        })
        .then((worker) => {
          models.Item.findOne({
            where: { id: req.body.itemId },
          })
          .then((item) => {
            res.json({ duplicateDelegateItem, msg: `tidak bisa mendelegasikan item ${item.name} kepada ${worker.role} ${worker.name} karena user tersebut sudah menerima delegasi untuk item ini`, ok: false });
          });
        });
      } else {
        models.Worker.findOne({
          where: { id: req.body.workerId },
        })
        .then((worker) => {
          if (decoded.role === 'staff') {
            if (worker.role === 'asmen' || worker.role === 'manager') {
              models.Item.findOne({
                where: { id: req.body.itemId },
              })
              .then((itemRef) => {
                res.json({ msg: `${decoded.role} tidak bisa mendelagasikan item ${itemRef.name} kepada ${worker.role} ${worker.name}. ${decoded.role} hanya bisa mendelegasikan item kepada ${decoded.role}`, ok: false });
              });
            } else if (worker.role === 'staff') {
              // delegation logic for staff
              models.Item.findOne({
                where: { id: req.body.itemId },
                include:
                [
                  {
                    model: models.Info,
                    where: { WorkerId: decoded.id },
                  },
                ],
              })
              .then((item) => {
                if (item === null) {
                  models.Worker.findOne({
                    where: { id: req.body.workerId },
                  })
                  .then((workerRef) => {
                    models.Item.findOne({
                      where: { id: req.body.itemId },
                    })
                    .then((itemRef) => {
                      res.json({ ref: '478', msg: `tidak bisa mendelegasikan item ${itemRef.name} kepada ${workerRef.role} ${workerRef.name} karena bukan milik ${decoded.role} ${decoded.name}`, ok: false });
                    });
                  });
                } else if (decoded.name === item.createdBy) {
                  const itemId = req.body.itemId;
                  const workerId = req.body.workerId;
                  models.WorkerItem.create({
                    itemId,
                    workerId,
                  })
                  .then((delegatedItem) => {
                    models.Item.findOne({
                      where: { id: req.body.itemId },
                    })
                    .then((itemRef) => {
                      models.Bobot.create({
                        ItemId: req.body.itemId,
                        WorkerId: req.body.workerId,
                      })
                      .then((bobotRef) => {
                        models.Status.create({
                          content: 'red',
                          ItemId: req.body.itemId,
                          WorkerId: req.body.workerId,
                        })
                        .then((statusRef) => {
                          models.Info.create({
                            ItemId: req.body.itemId,
                            WorkerId: req.body.workerId,
                            delegateBy: decoded.name,
                            delegateTo: worker.name,
                          })
                          .then((infoRef) => {
                            res.json({ statusRef, infoRef, bobotRef, delegatedItem, msg: `berhasil mendelegasikan item ${itemRef.name} kepada ${worker.role} ${worker.name}. Didelegasikan oleh: ${decoded.name}`, ok: true });
                          });
                        });
                      });
                    });
                  });
                } else {
                  models.Item.findOne({
                    where: { id: req.body.itemId },
                    include: [{
                      model: models.Worker,
                    }],
                  })
                  .then((itemRef) => {
                    const filteredItems = itemRef.Workers.filter(
                      workerItem => workerItem.id === decoded.id);
                    if (filteredItems.length < 1) {
                      res.json({ ref: '500', msg: `gagal karena item ini belum didelegasikan kepada ${decoded.role} ${decoded.name}`, ok: false });
                    } else if (filteredItems[0].name === decoded.name) {
                      const itemId = req.body.itemId;
                      const workerId = req.body.workerId;
                      models.WorkerItem.create({
                        itemId,
                        workerId,
                      })
                      .then((delegatedItem) => {
                        models.Item.findOne({
                          where: { id: req.body.itemId },
                        })
                        .then((itemRef2) => {
                          models.Bobot.create({
                            ItemId: req.body.itemId,
                            WorkerId: req.body.workerId,
                          })
                        .then((bobotRef) => {
                          models.Status.create({
                            content: 'red',
                            ItemId: req.body.itemId,
                            WorkerId: req.body.workerId,
                          })
                        .then((statusRef) => {
                          models.Info.create({
                            ItemId: req.body.itemId,
                            WorkerId: req.body.workerId,
                            delegateBy: decoded.name,
                            delegateTo: worker.name,
                          })
                          .then((infoRef) => {
                            res.json({ statusRef, infoRef, bobotRef, delegatedItem, msg: `berhasil mendelegasikan item ${itemRef2.name} kepada ${worker.role} ${worker.name}. Didelegasikan oleh: ${decoded.name}`, ok: true });
                          });
                        });
                        });
                        });
                      });
                    }
                  });
                }
              });
            } else {
              res.json({ msg: 'tidak ada fitur untuk mendelegasikan item kepada admin', ok: false });
            }
          }
        });
      }
    });
  } else {
    res.json({ msg: 'ini admin' });
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

methods.getItemById = (req, res, next) => {
  if (!req.headers.token) {
    res.json({ msg: 'butuh jwt token untuk mengambil data item', ok: false });
  } else {
    models.Item.findAll({
      where: { id: req.params.itemId },
      include:
      [
        {
          model: models.Bobot,
        },
        {
          model: models.Worker,
        },
        {
          model: models.Status,
        },
        {
          model: models.Info,
        },
      ],
    })
    .then((items) => {
      if (items.length < 1) {
        res.json({ msg: `tidak ditemukan item untuk id ${req.params.itemId}`, ok: false });
      }
      res.json({ items, msg: 'berhasil ambil item berdasarkan id', ok: true });
    });
  }
};

methods.updateProgress = (req, res, next) => {
  const decoded = helper.decode(req.headers.token);
  if (!req.headers.token) {
    res.json({ msg: 'butuh jwt token untuk mengupdate progress item', ok: false });
  } else {
    models.Item.findOne({
      where: { id: req.body.itemId },
      include:
      [
        {
          model: models.Info,
        },
        {
          model: models.Worker,
        },
      ],
    })
    .then((item) => {
      if (item === null) {
        res.json({ msg: `tidak ditemukan item dengan id ${req.body.itemId}`, ok: false });
      } else if (item.createdBy === decoded.name) {
        const beforeUpdate = {
          value: item.currentVal,
          status: item.status,
        };
        item.update({
          currentVal: req.body.currentVal,
        })
        .then((itemRef) => {
          models.Worker.findOne({
            where: { id: decoded.id },
          })
          .then((workerRef) => {
            if (itemRef.currentVal >= itemRef.base && itemRef.currentVal < itemRef.stretch) {
              models.Item.findOne({
                where: { id: req.body.itemId },
              })
              .then((updatedItem) => {
                updatedItem.update({
                  status: 'green',
                });
                res.json({ ref: '748', msg: `${workerRef.role} ${workerRef.name} sukses mengupdate nilai progress item ${updatedItem.name} menjadi ${updatedItem.currentVal}`, ok: true, updatedItem, beforeUpdate });
              });
            } else if (itemRef.currentVal < itemRef.base) {
              models.Item.findOne({
                where: { id: req.body.itemId },
              })
              .then((updatedItem) => {
                updatedItem.update({
                  status: 'red',
                });
                res.json({ ref: '758', msg: `${workerRef.role} ${workerRef.name} sukses mengupdate nilai progress item ${updatedItem.name} menjadi ${updatedItem.currentVal}`, ok: true, updatedItem, beforeUpdate });
              });
            } else if (itemRef.currentVal >= itemRef.stretch) {
              models.Item.findOne({
                where: { id: req.body.itemId },
              })
              .then((updatedItem) => {
                updatedItem.update({
                  status: 'star',
                });
                res.json({ ref: '768', msg: `${workerRef.role} ${workerRef.name} sukses mengupdate nilai progress item ${updatedItem.name} menjadi ${updatedItem.currentVal}`, ok: true, updatedItem, beforeUpdate });
              });
            }
          });
        });
      } else {
        const filteredItems = item.Infos.filter(info => info.delegateTo === decoded.name);
        if (filteredItems.length < 1) {
          res.json({ ref: '776', msg: `${decoded.name} tidak bisa mengupdate progress item ini karena item belum jadi miliknya`, ok: false, item });
        }
        if (filteredItems[0].delegateTo === decoded.name) {
          item.update({
            currentVal: req.body.currentVal,
          })
          .then(() => {
            // tambah logic update status seperti di atas
            const beforeUpdate = {
              value: item.currentVal,
              status: item.status,
            };
            item.update({
              currentVal: req.body.currentVal,
            })
            .then((itemRef2) => {
              models.Worker.findOne({
                where: { id: decoded.id },
              })
              .then((workerRef) => {
                if (itemRef2.currentVal >= itemRef2.base &&
                itemRef2.currentVal < itemRef2.stretch) {
                  models.Item.findOne({
                    where: { id: req.body.itemId },
                  })
                  .then((updatedItem) => {
                    updatedItem.update({
                      status: 'green',
                    });
                    res.json({ ref: '805', msg: `${workerRef.role} ${workerRef.name} sukses mengupdate nilai progress item ${updatedItem.name} menjadi ${updatedItem.currentVal}`, ok: true, updatedItem, beforeUpdate });
                  });
                } else if (itemRef2.currentVal < itemRef2.base) {
                  models.Item.findOne({
                    where: { id: req.body.itemId },
                  })
                  .then((updatedItem) => {
                    updatedItem.update({
                      status: 'red',
                    });
                    res.json({ ref: '815', msg: `${workerRef.role} ${workerRef.name} sukses mengupdate nilai progress item ${updatedItem.name} menjadi ${updatedItem.currentVal}`, ok: true, updatedItem, beforeUpdate });
                  });
                } else if (itemRef2.currentVal >= itemRef2.stretch) {
                  models.Item.findOne({
                    where: { id: req.body.itemId },
                  })
                  .then((updatedItem) => {
                    updatedItem.update({
                      status: 'star',
                    });
                    res.json({ ref: '825', msg: `${workerRef.role} ${workerRef.name} sukses mengupdate nilai progress item ${updatedItem.name} menjadi ${updatedItem.currentVal}`, ok: true, updatedItem, beforeUpdate });
                  });
                }
              });
            });
          });
        }
      }
    });
  }
};

methods.getItemWithInfo = (req, res, next) => {
  if (!req.headers.token) {
    res.json({ msg: 'butuh jwt token untuk mendapatkan data item', ok: false });
  } else {
    models.Item.findAll({
      include: [{
        model: models.Info,
        where: {
          delegateTo: {
            $ne: null,
          },
        },
        include: [{
          model: models.Worker,
        }],
      }],
    })
    .then((items) => {
      // const result = items.map((item) => {
      //   return item.Infos.filter((withInfo) => {
      //     return item.createdBy === withInfo.Worker.name;
      //   })
      // })
      res.json({ items, ok: true });
    });
  }
};

methods.updateItemScore = (req, res, next) => {
  const decoded = helper.decode(req.headers.token);
  if (!req.headers.token) {
    res.json({ msg: 'butuh jwt token untuk mengupdate item', ok: false });
  } else {
    models.Item.findOne({
      where: { id: req.body.itemId },
    })
    .then((item) => {
      if (item === null) {
        res.json({ msg: `tidak ditemukan item dengan id ${req.body.itemId}`, ok: false });
      } else if (decoded.role === 'admin' || decoded.role === 'manager') {
        if (!req.body.base && !req.body.stretch) {
          res.json({ msg: 'data base dan stretch tidak boleh kosong', ok: false });
        } else {
          item.update({
            base: req.body.base || item.base,
            stretch: req.body.stretch || item.stretch,
          })
        .then((updatedItem) => {
          res.json({ updatedItem, msg: 'berhasil mengupdate item', ok: true });
        });
        }
      } else {
        res.json({ msg: 'hanya  manager dan admin yang bisa update base dan stretch', ok: false });
      }
    });
  }
};

methods.updateBobot = (req, res, next) => {
  const decoded = helper.decode(req.headers.token);
  if (!req.headers.token) {
    res.json({ msg: 'butuh jwt token untuk mengupdate bobot', ok: false });
  } else {
    models.Item.findOne({
      where: { id: req.body.itemId },
      include:
      [
        {
          model: models.Bobot,
          where: { WorkerId: decoded.id },
        },
      ],
    })
    .then((item) => {
      if (item === null) {
        res.json({ ref: '912', msg: `${decoded.role} ${decoded.name} tidak punya akses terhadap item ini karena belum didelegasikan`, ok: false });
      } else {
        item.Bobots[0].update({
          point: Number.parseInt(req.body.point, 10),
        })
        .then((updatedItem) => {
          res.json({ updatedItem });
        });
      }
    });
  }
};

methods.updateUnitName = (req, res, next) => {
  const name = req.body.name;
  const ItemId = req.body.itemId;
  const decoded = helper.decode(req.headers.token);
  if (!req.headers.token) {
    res.json({ msg: 'butuh jwt token untuk mengupdate bobot', ok: false });
  } else {
    models.Item.findOne({
      where: { id: ItemId },
      include:
      [
        {
          model: models.Unit,
          where: { ItemId },
          include: [{
            model: models.Item,
            include: [{
              model: models.Info,
              where: { WorkerId: decoded.id },
            }],
          }],
        },
      ],
    })
    .then((item) => {
      if (item === null) {
        res.json({ msg: `tidak ada item dengan id ${ItemId}` });
      } else if (item && decoded.name === item.createdBy) {
        models.Unit.update({
          name,
        }, {
          where: {
            ItemId,
          },
        })
        .then(() => {
          res.json({ ref: '972', msg: `sukses mengupdate unit di item dengan id ${ItemId}`, item });
        });
      } else if (item.Units[0].Item === null) {
        // yg login dan yg buat tidak sama & item belum didelegasikan kepada yang login
        res.json({ ref: '976', msg: `tidak bisa mengupdate nama unit karena item ini belum didelegasikan kepada ${decoded.role} ${decoded.name}`, ok: false });
      } else {
        // yg login dan yg buat tidak sama tapi item sudah didelegasikan kepada yang login
        models.Unit.update({
          name,
        }, {
          where: {
            ItemId,
          },
        })
        .then(() => {
          res.json({ ref: '987', msg: `sukses mengupdate unit di item dengan id ${ItemId}`, item });
        });
      }
    });
  }
};

module.exports = methods;
