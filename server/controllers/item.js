const models = require('../models');
const helper = require('../helpers/verify');
const utility = require('../helpers/utilities');

const methods = {};

const processStatsValue = (progress, base, stretch) => {
  const result = {
    value: null,
    stats: null,
  };
  if (base > stretch) {
    if (progress > base) {
      result.value = (1 - (progress - base) / base) * 100;
      result.stats = 'red';
    } else if (progress === base) {
      result.value = (1 + (progress - base) / base) * 100;
      result.stats = 'green';
    } else if (progress < base && progress > stretch) {
      result.value = (120 / (100 - ((progress - stretch) * (120 - 100) / (stretch - base)))) * 100;
      result.stats = 'green';
    } else if (progress <= stretch) {
      result.value = 120;
      result.stats = 'star';
    }
    return result;
  } else if (base < stretch) {
    if (progress === base) {
      result.value = (1 + (progress - base) / base) * 100;
      result.stats = 'green';
    } else if (progress > base && progress < stretch) {
      result.value = (105 / (100 + ((progress - stretch) * (105 - 100) / (base - stretch)))) * 100;
      result.stats = 'green';
    } else if (progress < base) {
      result.value = (1 + (progress - base) / base) * 100;
      result.stats = 'red';
    } else if (progress > base) {
      result.stats = 'star';
      result.value = (105 / (100 + ((progress - stretch) * (105 - 100) / (base - stretch)))) * 100;
    }
    if (result.value < 0) result.value = 105;
    return result;
  }
};

methods.create = (req, res, next) => {
  if (!req.headers.token) {
    res.json({ msg: 'butuh jwt token untuk membuat item baru', ok: false });
  } else {
    const decoded = helper.decode(req.headers.token);
    const name = req.body.name.trim();
    const formattedName = name.toLowerCase();
    const description = req.body.description.trim();
    const value = req.body.value.trim();
    const createdBy = decoded.name;
    const freq = req.body.freq;
    const number = new RegExp('^(?=.*[0-9])');
    if (!req.body.name) {
      res.json({ msg: { context: 'Gagal buat item', content: 'nama item harus diisi' }, ok: false });
    } else if (!req.body.freq) {
      res.json({ msg: { context: 'Gagal buat item', content: 'frekuensi pelaporan item harus diisi' }, ok: false });
    } else if (!number.test(value)) {
      res.json({ msg: { context: 'Gagal buat item', content: 'Bobot harus berupa angka dan tidak ada huruf' }, ok: false });
    } else {
      models.Item.findOne({
        where: { name },
      })
      .then((foundItem) =>  {
        if (!foundItem) {
          models.Item.findAll({
            attributes: [['name', 'name']],
          })
          .then((allItem) => {
            const sameName = allItem.filter(each => each.name.toLowerCase() === formattedName);
            if (sameName.length < 1) {
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
                          models.Item.findOne({
                            where: { id: item.id },
                            include: [{
                              model: models.Worker,
                            },
                            {
                              model: models.Category,
                              include: [{
                                model: models.TopCategory,
                              }],
                            },
                            ],
                          })
                          .then((createdItem) => {
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
                            res.json({ createdItem, infoRef, bobotRef, item, ok: true, msg: { context: 'Terimakasih', content: `Item baru dengan nama ${createdItem.name} berhasil dibuat` } });
                          });
                        });
                      });
                    });
                  });
                }
              });
            } else {
              res.json({ ref: 222, msg: { context: 'Apa Anda tidak Salah Input?', content: `Soalnya item dengan nama ${sameName[0].name} sudah ada.` }, ok: false });
            }
          });
        } else {
          res.json({ ref: 226, msg: { context: 'Gagal buat item', content: `item dengan nama ${name} sudah ada.` }, ok: false });
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
      order: [
        ['name', 'ASC'],
        [models.Target, 'period', 'ASC'],
        [models.Progress, 'period', 'ASC'],
        [models.Status, 'period', 'ASC'],
        [models.Performance, 'period', 'ASC'],
      ],
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
                  models.Item.findOne({
                    where: { id: req.body.itemId },
                  })
                  .then((itemName) => {
                    models.Worker.findOne({
                      where: { id: req.body.workerId },
                    })
                    .then((workerName) => {
                      res.json({ ref: '454', msg: `Anda harus login dulu sebagai ${itemName.createdBy} untuk bisa mendelegasikan item ${itemName.name} kepada ${workerName.name}`, ok: false });
                    });
                  });
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
                  models.Item.findOne({
                    where: { id: req.body.itemId },
                  })
                  .then((itemName) => {
                    models.Worker.findOne({
                      where: { id: req.body.workerId },
                    })
                    .then((workerName) => {
                      res.json({ ref: '548', msg: `Anda harus login dulu sebagai ${itemName.createdBy} untuk bisa mendelegasikan item ${itemName.name} kepada ${workerName.name}`, ok: false });
                    });
                  });
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
      order: [
        [models.Target, 'period', 'ASC'],
        [models.Progress, 'period', 'ASC'],
        [models.Status, 'period', 'ASC'],
        [models.Performance, 'period', 'ASC'],
      ],
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
          model: models.Category,
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
            res.json({ ref: 906, msg: 'nilai base atau stretch tidak boleh kosong', ok: false });
          } else if (req.body.base === req.body.stretch) {
            res.json({ ref: 1000, msg: 'nilai base dan stretch tidak boleh sama', ok: false });
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
                  item.getStatuses()
                  .then((statusItem) => {
                    const filterStatus = statusItem.filter(each => each.period === req.body.period);
                    if (filterStatus.length < 1) {
                      res.json({ ref: 910, msg: `item ${item.name} berhasil diperbarui targetnya untuk bulan ${utility.processMonthName(updatedTarget.period)}.`, msg2: 'belum ada status dan performance pada item dengan period ini', updatedTarget, item, ok: true });
                    } else {
                      // ubah status sama performance di sini kalau base n stretch di update
                      item.getProgresses()
                      .then((progress) => {
                        item.getPerformances()
                        .then((performance) => {
                          item.getBobots()
                          .then((bobot) => {
                            item.getStatuses()
                            .then((status) => {
                              const statusFilter = status.filter(
                                each => each.period === req.body.period);
                              const filterProgress = progress.filter(
                            each => each.period === req.body.period);
                              const filterPerformance = performance.filter(
                            each => each.period === req.body.period);
                              const filterBobot = bobot.filter(
                                each => each.WorkerId === decoded.id);
                              const progressVal = Number.parseInt(filterProgress[0].value, 10);
                              const base = Number.parseInt(filteredTarget[0].base, 10);
                              const stretch = Number.parseInt(filteredTarget[0].stretch, 10);
                              const updatedStats = processStatsValue(progressVal, base, stretch);
                              const perfValue = (
                                filterBobot[0].value / 100) * (updatedStats.value / 100) * 100;
                              filterPerformance[0].update({
                                value: perfValue,
                              })
                              .then((performanceResult) => {
                                statusFilter[0].update({
                                  value: updatedStats.value,
                                  stats: updatedStats.stats,
                                })
                              .then((statusResult) => {
                                res.json({ ref: 1048, updatedTarget, statusResult, performanceResult, ok: true, msg: 'sukses memperbarui data' });
                              });
                              });
                            });
                          });
                        });
                      });
                    }
                  });
                  // res.json({ ref: 919, msg: 'berhasil update target', updatedTarget, ok: true });
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
              if (filteredTargets[0].base === null || filteredTargets[0].base === '0') {
                res.json({ ref: 1157, msg: `tidak bisa update progress. pastikan nilai base bulan ${utility.processMonthName(filteredProgress[0].period)} pada item ${item.name} diisi dulu`, ok: false });
              } else if (filteredTargets[0].stretch === null || filteredTargets[0].stretch === '0') {
                res.json({ ref: 1159, msg: `tidak bisa update progress. pastikan nilai stretch bulan ${utility.processMonthName(filteredProgress[0].period)} pada item ${item.name} diisi dulu`, ok: false });
              } else {
                filteredProgress[0].update({
                  value: req.body.value,
                })
                .then((progressResult) => {
                  // update status di sini
                  let result = null;
                  if (filteredTargets[0].base === null || filteredTargets[0].base === '0') {
                    res.json({ ref: 1168, msg: `tidak bisa update progress. pastikan nilai base bulan ${utility.processMonthName(filteredProgress[0].period)} pada item ${item.name} diisi dulu`, ok: false });
                  } else if (filteredTargets[0].stretch === null || filteredTargets[0].stretch === '0') {
                    res.json({ ref: 1170, msg: `tidak bisa update progress. pastikan nilai stretch bulan ${utility.processMonthName(filteredProgress[0].period)} pada item ${item.name} diisi dulu`, ok: false });
                  } else {
                    const progress = Number.parseInt(progressResult.value, 10);
                    const base = Number.parseInt(filteredTargets[0].base, 10);
                    const stretch = Number.parseInt(filteredTargets[0].stretch, 10);
                    result = processStatsValue(progress, base, stretch);
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
                            value: result.value,
                            stats: result.stats,
                          })
                          .then((statusResult) => {
                            models.StatusItem.create({
                              statusId: statusResult.id,
                              itemId: item.id,
                            })
                            .then((statusItemRef) => {
                              // kalau belum ada performance, bikin performance baru
                              if (perf.length < 1) {
                                const perfValue = (filteredBobots[0].value / 100) * (statusResult.value / 100) * 100;
                                models.Performance.create({
                                  period: req.body.period,
                                  value: perfValue,
                                })
                                .then((performanceResult) => {
                                  models.PerformanceItem.create({
                                    performanceId: performanceResult.id,
                                    itemId: item.id,
                                  });
                                  res.json({ ref: 1137, msg: 'berhasil meperbarui nilai progress', filteredProgress, progressResult, filteredTargets, statusItemRef, statusResult, performanceResult, ok: true });
                                });
                              } else {
                                const perfValue = (filteredBobots[0].value / 100) * (statusResult.value / 100) * 100;
                                models.Performance.create({
                                  period: req.body.period,
                                  value: perfValue,
                                })
                                .then((performanceResult) => {
                                  models.PerformanceItem.create({
                                    performanceId: performanceResult.id,
                                    itemId: item.id,
                                  });
                                  res.json({ ref: 1130, msg: 'berhasil memperbarui nilai progress', filteredProgress, progressResult, filteredTargets, statusItemRef, statusResult, performanceResult, ok: true });
                                });
                                // res.json({ ref: 1157, msg: 'update performance di sini', perf });
                              }
                            });
                          });
                        } else {
                          filteredStatuses[0].update({
                            value: result.value,
                            stats: result.stats,
                          })
                          .then((statusResult) => {
                            const perfValue =
                            (filteredBobots[0].value / 100) * (statusResult.value / 100) * 100;
                            const filter = perf.filter(each => each.period === req.body.period);
                            filter[0].update({
                              value: perfValue,
                            })
                            .then((performanceResult) => {
                              res.json({ filter, ref: 1146, msg: 'berhasil memperbarui nilai progress', filteredProgress, progressResult, filteredTargets, statusResult, performanceResult, ok: true });
                            });
                          });
                        }
                      });
                    });
                  });
                });
              }
            });
          }
        });
      } else {
        res.json({ msg: 'masukan dulu nilai progress', ok: false });
      }
    });
  }
};

methods.getItemWithTargets = (req, res, next) => {
  const itemId = req.params.itemId;
  if (!req.headers.token) {
    res.json({ msg: 'butuh jwt token untuk mengupdate nama unit', ok: false });
  } else {
    models.Item.findOne({
      where: {
        id: itemId,
      },
      include: [
        {
          model: models.Target,
        },
        {
          model: models.Progress,
        },
        {
          model: models.Status,
        },
        {
          model: models.Performance,
        },
      ],
      order: [
        [models.Target, 'period', 'ASC'],
        [models.Progress, 'period', 'ASC'],
        [models.Status, 'period', 'ASC'],
        [models.Performance, 'period', 'ASC'],
      ],
    })
    .then((itemWithTargets) => {
      res.json({ itemWithTargets });
    });
  }
};

methods.getItemsNameAndId = (req, res, next) => {
  if (!req.headers.token) {
    res.json({ msg: 'butuh jwt token untuk mengupdate nama unit', ok: false });
  } else {
    models.Item.findAll({
      attributes: [['name', 'text'], ['id', 'value']],
      order: [['name', 'ASC']],
    })
    .then((items) => {
      res.json({ ok: true, items });
    });
  }
};

methods.getItemDeviationInCertainPeriod = (req, res, next) => {
  const itemId = req.params.itemId;
  const period = req.params.period;
  if (!req.headers.token) {
    res.json({ msg: 'butuh jwt token untuk mendapatkan deviation item ini', ok: false });
  } else {
    models.Status.findOne({
      include: [{
        model: models.Item,
        where: {
          id: itemId },
      }],
      where: {
        period,
      },
    })
    .then((deviation) => {
      if (!deviation) {
        res.json({ ok: false, msg: `tidak ada deviation untuk item dengan id ${itemId} dan period ${period}` });
      }
      res.json({ ok: true, deviation });
    });
  }
};

module.exports = methods;
