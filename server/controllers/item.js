const models = require('../models');
const helper = require('../helpers/verify');

const methods = {};

methods.create = (req, res, next) => {
  if (!req.headers.token) {
    res.json({ msg: 'butuh jwt token untuk membuat item baru', ok: false });
  } else {
    const decoded = helper.decode(req.headers.token);
    const name = req.body.name;
    const description = req.body.description;
    const value = req.body.value;
    const createdBy = decoded.name;
    const freq = req.body.freq;
    if (!req.body.name) {
      res.json({ msg: 'nama item harus diisi', ok: false });
    } else if (!req.body.freq) {
      res.json({ msg: 'data freq harus diisi', ok: false });
    } else {
      models.Item.findOne({
        where: { name },
      })
      .then((foundItem) => {
        if (!foundItem) {
          models.Item.create({
            name,
            description,
            createdBy,
            freq,
          })
      .then((item) => {
        if (!item) {
          res.json({ msg: 'gagal membuat item baru', ok: false });
        } else {
          models.Bobot.create({
            value,
            ItemId: item.id,
            WorkerId: decoded.id,
          })
          .then((bobotRef) => {
            models.WorkerItem.create({
              itemId: item.id,
              workerId: decoded.id,
            })
          .then((workerItemRef) => {
            models.Info.create({
              ItemId: item.id,
              WorkerId: decoded.id,
            })
            .then((infoRef) => {
              models.Unit.create({
                ItemId: item.id,
              })
              .then((unitRef) => {
                if (item.freq === '3') {
                  for (let i = 3; i <= 12; i += 3) {
                    models.Target.create({
                      period: i.toString(),
                    })
                    .then((target) => {
                      models.TargetItem.create({
                        itemId: item.id,
                        targetId: target.id,
                      });
                      models.Progress.create({
                        period: i.toString(),
                      })
                      .then((progress) => {
                        models.ProgressItem.create({
                          progressId: progress.id,
                          itemId: item.id,
                        });
                      });
                    });
                  }
                } else if (item.freq === '1') {
                  for (let i = 1; i <= 12; i += 1) {
                    models.Target.create({
                      period: i.toString(),
                    })
                    .then((target) => {
                      models.TargetItem.create({
                        itemId: item.id,
                        targetId: target.id,
                      });
                      models.Progress.create({
                        period: i.toString(),
                      })
                      .then((progress) => {
                        models.ProgressItem.create({
                          progressId: progress.id,
                          itemId: item.id,
                        });
                      });
                    });
                  }
                } else {
                  models.Target.create({
                    period: '12',
                  })
                  .then((target) => {
                    models.TargetItem.create({
                      itemId: item.id,
                      targetId: target.id,
                    });
                    models.Progress.create({
                      period: '12',
                    })
                    .then((progress) => {
                      models.ProgressItem.create({
                        progressId: progress.id,
                        itemId: item.id,
                      });
                    });
                  });
                }
                res.json({ unitRef, infoRef, bobotRef, workerItemRef, item, ok: true, msg: 'item baru berhasil dibuat' });
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
          model: models.Info,
        },
        {
          model: models.Unit,
        },
        {
          model: models.Target,
        },
        {
          model: models.Progress,
        },
        {
          model: models.Performance,
        },
        {
          model: models.Status,
        },
        {
          model: models.Category,
          include: [{
            model: models.TopCategory,
          }],
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
                        models.Info.create({
                          ItemId: req.body.itemId,
                          WorkerId: req.body.workerId,
                          delegateBy: decoded.name,
                          delegateTo: worker.name,
                        })
                        .then((infoRef) => {
                          res.json({ infoRef, bobotRef, delegatedItem, msg: `berhasil mendelegasikan item ${itemRef.name} kepada ${worker.role} ${worker.name}. Didelegasikan oleh: ${decoded.name}`, ok: true });
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
                            models.Info.create({
                              ItemId: req.body.itemId,
                              WorkerId: req.body.workerId,
                              delegateBy: decoded.name,
                              delegateTo: worker.name,
                            })
                            .then((infoRef) => {
                              res.json({ infoRef, bobotRef, delegatedItem, msg: `berhasil mendelegasikan item ${itemRef2.name} kepada ${worker.role} ${worker.name}. Didelegasikan oleh: ${decoded.name}`, ok: true });
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
                        models.Info.create({
                          ItemId: req.body.itemId,
                          WorkerId: req.body.workerId,
                          delegateBy: decoded.name,
                          delegateTo: worker.name,
                        })
                        .then((infoRef) => {
                          res.json({ infoRef, bobotRef, delegatedItem, msg: `berhasil mendelegasikan item ${itemRef.name} kepada ${worker.role} ${worker.name}. Didelegasikan oleh: ${decoded.name}`, ok: true });
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
                            models.Info.create({
                              ItemId: req.body.itemId,
                              WorkerId: req.body.workerId,
                              delegateBy: decoded.name,
                              delegateTo: worker.name,
                            })
                            .then((infoRef) => {
                              res.json({ ref: '459', infoRef, bobotRef, delegatedItem, msg: `berhasil mendelegasikan item ${itemRef2.name} kepada ${worker.role} ${worker.name}. Didelegasikan oleh: ${decoded.name}`, ok: true });
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
                        models.Info.create({
                          ItemId: req.body.itemId,
                          WorkerId: req.body.workerId,
                          delegateBy: decoded.name,
                          delegateTo: worker.name,
                        })
                        .then((infoRef) => {
                          res.json({ ref: '486', infoRef, bobotRef, delegatedItem, msg: `berhasil mendelegasikan item ${itemRef.name} kepada ${worker.role} ${worker.name}. Didelegasikan oleh: ${decoded.name}`, ok: true });
                        });
                      });
                    });
                  });
                }
              });
            } else if (worker.role === 'staff') {
              // delegation logic for manager to staff
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
                  res.json({ ref: '548', msg: 'item ini bukan milik Anda', ok: false });
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
                        models.Info.create({
                          ItemId: req.body.itemId,
                          WorkerId: req.body.workerId,
                          delegateBy: decoded.name,
                          delegateTo: worker.name,
                        })
                        .then((infoRef) => {
                          res.json({ ref: '486', infoRef, bobotRef, delegatedItem, msg: `berhasil mendelegasikan item ${itemRef.name} kepada ${worker.role} ${worker.name}. Didelegasikan oleh: ${decoded.name}`, ok: true });
                        });
                      });
                    });
                  });
                }
              });
            } else if (worker.role === 'manager') {
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
                        models.Info.create({
                          ItemId: req.body.itemId,
                          WorkerId: req.body.workerId,
                          delegateBy: decoded.name,
                          delegateTo: worker.name,
                        })
                        .then((infoRef) => {
                          res.json({ infoRef, bobotRef, delegatedItem, msg: `berhasil mendelegasikan item ${itemRef.name} kepada ${worker.role} ${worker.name}. Didelegasikan oleh: ${decoded.name}`, ok: true });
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
                            models.Info.create({
                              ItemId: req.body.itemId,
                              WorkerId: req.body.workerId,
                              delegateBy: decoded.name,
                              delegateTo: worker.name,
                            })
                            .then((infoRef) => {
                              res.json({ infoRef, bobotRef, delegatedItem, msg: `berhasil mendelegasikan item ${itemRef2.name} kepada ${worker.role} ${worker.name}. Didelegasikan oleh: ${decoded.name}`, ok: true });
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
// yang bisa update target hanya yang punya item dan admin
methods.updateTargetScore = (req, res, next) => {
  const decoded = helper.decode(req.headers.token);
  if (!req.headers.token) {
    res.json({ msg: 'butuh jwt token untuk mengupdate item', ok: false });
  } else {
    models.Worker.findOne({
      where: decoded.id,
      include: [{
        model: models.Item,
      }],
    })
    .then((worker) => {
      const filteredItem = worker.Items.filter(
        item => item.WorkerItem.itemId === Number.parseInt(req.body.itemId, 10) &&
        item.WorkerItem.workerId === decoded.id);
      models.Item.findOne({
        where: { id: req.body.itemId },
      })
      .then((item) => {
        if (decoded.role === 'admin') {
          if (item === null) {
            res.json({ ref: 881, msg: `tidak ditemukan item dengan id ${req.body.itemId}`, ok: false });
          } else {
            item.getTargets()
            .then((targetRef) => {
              const targets = targetRef.map(target => target);
              const filteredTargets = targets.filter(target => target.period === req.body.period);
              if (filteredTargets.length < 1) {
                res.json({ ref: 888, msg: `tidak ditemukan period ${req.body.period} pada item ini`, ok: false });
              } else {
                filteredTargets[0].update({
                  base: req.body.base,
                  stretch: req.body.stretch,
                })
                .then((updatedTarget) => {
                  res.json({ ref: 895, msg: 'berhasil update target', updatedTarget, ok: true });
                });
              }
            });
          }
        } else if (item === null && decoded.role !== 'admin') {
          res.json({ ref: 901, msg: `tidak ditemukan item dengan id ${req.body.itemId}`, ok: false });
        } else if (filteredItem.length < 1 && decoded.role !== 'admin') {
          res.json({ ref: 903, msg: `${decoded.role} ${decoded.name} tidak punya akses terhadap item ini`, item, ok: false });
        } else if (filteredItem[0].createdBy === decoded.name && decoded.role !== 'admin') {
          if (!req.body.base && !req.body.stretch) {
            res.json({ ref: 906, msg: 'data base dan stretch tidak boleh kosong', ok: false });
          } else {
            item.getTargets()
            .then((itemWithTarget) => {
              const filteredTarget = itemWithTarget.filter(each => each.period === req.body.period);
              if (filteredTarget.length < 1) {
                res.json({ ref: 912, msg: `tidak ditemukan period ${req.body.period} pada item ini`, ok: false });
              } else {
                filteredTarget[0].update({
                  base: req.body.base,
                  stretch: req.body.stretch,
                })
                .then((updatedTarget) => {
                  res.json({ ref: 919, msg: 'berhasil update target', updatedTarget, ok: true });
                });
              }
            });
          }
        } else if (filteredItem[0].WorkerItem.workerId === worker.id) {
          res.json({ ref: 925, msg: 'Anda sudah didelegasikan item ini, namun harus izin dulu pada yang punya item untuk mengupdate base dan value', ok: false });
        }
      });
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
          value: Number.parseInt(req.body.value, 10),
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
    res.json({ msg: 'butuh jwt token untuk mengupdate nama unit', ok: false });
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

methods.addNewProgress = (req, res, next) => {
  const decoded = helper.decode(req.headers.token);
  if (!req.headers.token) {
    res.json({ msg: 'butuh jwt token untuk mengupdate nama unit', ok: false });
  } else {
    models.Item.findOne({
      where: {
        id: req.body.itemId,
      },
    })
    .then((item) => {
      if (item === null) {
        res.json({ msg: `tidak ditemukan item dengan id ${req.body.itemId}` });
      } else if (req.body.itemId && req.body.period && req.body.value && item !== null) {
        item.getTargets()
        .then((targetRef) => {
          const targets = targetRef.map(target => target);
          const filteredTargets = targets.filter(target => target.period === req.body.period);
          if (filteredTargets.length < 1) {
            res.json({ ref: 1038, msg: `tidak ada period ${req.body.period} untuk item dengan id ${req.body.itemId}`, ok: false });
          } else {
            item.getProgresses()
            .then((progressRef) => {
              const filteredProgress = progressRef.filter(
                progress => progress.period === req.body.period);
              filteredProgress[0].update({
                value: req.body.value,
              })
              .then((updatedProgress) => {
                // update status di sini
                let value = 0;
                let stats = '';
                const processStatsValue = (progress, base, stretch) => {
                  let result = 0;
                  if (base > stretch) {
                    if (progress > base) {
                      result = (1 - (progress - base) / base) * 100;
                      stats = 'red';
                    } else if (progress === base) {
                      result = (1 + (progress - base) / base) * 100;
                      stats = 'green';
                    } else if (progress < base && progress > stretch) {
                      result = (120 / (100 - ((progress - stretch) * (120 - 100) / (stretch - base)))) * 100;
                      stats = 'green';
                    } else if (progress <= stretch) {
                      result = 120;
                      stats = 'star';
                    }
                    return result;
                  } else if (base < stretch) {
                    if (progress === base) {
                      result = (1 + (progress - base) / base) * 100;
                      stats = 'green';
                    } else if (progress > base && progress < stretch) {
                      result = (105 / (100 + ((progress - stretch) * (105 - 100) / (base - stretch)))) * 100;
                      stats = 'green';
                    } else if (progress < base) {
                      result = (1 + (progress - base) / base) * 100;
                      stats = 'red';
                    } else if (progress > base) {
                      stats = 'star';
                      result = (105 / (100 + ((progress - stretch) * (105 - 100) / (base - stretch)))) * 100;
                    }
                    if (result < 0) result = 105;
                    return result;
                  }
                };
                if (filteredTargets[0].base === null && filteredTargets[0].stretch === null) {
                  res.json({ msg: `tidak bisa update progress. pastikan data base dan/atau stretch untuk period ${req.body.period} pada item dengan id ${item.id} diisi dulu`, ok: false });
                } else {
                  const progress = Number.parseInt(updatedProgress.value, 10);
                  const base = Number.parseInt(filteredTargets[0].base, 10);
                  const stretch = Number.parseInt(filteredTargets[0].stretch, 10);
                  value = processStatsValue(progress, base, stretch);
                }
                // create dulu kalau belum ada, kalau ada update
                item.getStatuses()
                .then((val) => {
                  item.getPerformances()
                  .then((perf) => {
                    item.getBobots()
                    .then((bots) => {
                      const filteredBobots = bots.filter(bobot => bobot.WorkerId === decoded.id);
                      const statuses = val.map(each => each);
                      const filteredStatuses =
                      statuses.filter(each => each.period === req.body.period);
                      if (filteredStatuses.length < 1) {
                        models.Status.create({
                          period: req.body.period,
                          value,
                          stats,
                        })
                        .then((status) => {
                          models.StatusItem.create({
                            statusId: status.id,
                            itemId: item.id,
                          })
                          .then((statusItemRef) => {
                            if (perf.length < 1) {
                              value = (filteredBobots[0].value / 100) * (status.value / 100) * 100;
                              models.Performance.create({
                                period: req.body.period,
                                value,
                              })
                              .then((performanceRef) => {
                                models.PerformanceItem.create({
                                  performanceId: performanceRef.id,
                                  itemId: item.id,
                                });
                                res.json({ ref: 1137, msg: 'berhasil update progress value', filteredProgress, updatedProgress, filteredTargets, statusItemRef, status, performanceRef, ok: true });
                              });
                            } else {
                              res.json({ ref: 1157, msg: 'update performance di sini' });
                            }
                          });
                        });
                      } else {
                        filteredStatuses[0].update({
                          value,
                          stats,
                        })
                        .then((updatedStats) => {
                          value =
                          (filteredBobots[0].value / 100) * (updatedStats.value / 100) * 100;
                          perf[0].update({
                            value,
                          })
                          .then((updatedPerf) => {
                            res.json({ ref: 1146, msg: 'berhasil update progress value', filteredProgress, updatedProgress, filteredTargets, updatedStats, stats, updatedPerf, ok: true });
                          });
                        });
                      }
                    });
                  });
                });
              });
            });
          }
        });
      } else {
        res.json({ msg: 'pastikan data req.bodyitemId , period dan value di isi semua', ok: false });
      }
    });
  }
};

module.exports = methods;
