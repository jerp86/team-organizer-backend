const express = require('express');
const router = express.Router();
const Yup = require('yup');
const mongoose = require('mongoose');
require('../models/Role');
const Role = mongoose.model('roles');

router.get('/all', (req, res) => {
  Role.find(/*{}, {
    _id: 0, name: 1, description: 1
  }*/).then(roles => {
    res.json(roles);
  }).catch(err => {
    res.send({ error: err });
  });
});

router.get('/:id', (req, res) => {
  Role.findById(req.params.id).then(role => {
    if (!role) {
      res.status(404).send({ error: `ID '${req.params.id}' not found` });
    }
    res.send(role);
  }).catch(err => {
    res.send({ error: `Aqui é o erro do findById: ${err}` });
  });
});

router.delete('/:id', (req, res) => {
  Role.findByIdAndDelete({ _id: req.params.id }).then(role => {
    res.send({ apagado: `Foi apagado a Role '${role.name}'` });
  }).catch(err => {
    res.send({ error: err });
  });
});

router.put('/:id', (req, res) => {
  Role.findByIdAndUpdate({ _id: req.params.id }).then(role => {
    if (req.body.name && role.name !== req.body.name) {
      Role.findOne({ name: req.body.name }).then(r => {
        console.log(r);
        if (r) {
          res.status(400).send({ name: 'There is already a Role with that name' });
        }
      }).catch(err => {
        res.send({ error: `Aqui é o erro do findOne: ${err}` });
      });
      role.name = req.body.name;
    }
    if (req.body.description) {
      role.description = req.body.description;
    }

    role.save().then(() => {
      res.send(role);
    }).catch(err => {
      res.send({ error: `Aqui é o erro do save: ${err}` });
    });

  }).catch(err => {
    if (!err) {
      res.status(404).send({ error: `ID '${req.params.id}' does not exists` });
    }
    res.send({ error: `Aqui é o erro do findById ${err}` });
  });
});

router.post('/', async (req, res) =>{
  if (!req.body.name) {
    return res.status(404).send({ name: 'Name was not passed' })
  }
  
  if (await Role.findOne({ name: req.body.name })) {
    return res.status(409).send({ error: 'Role already exists' });
  }

  const newRole = await Role.create({
    name: req.body.name,
    description: req.body.description,
  });
  
  if (!newRole) {
    return res.status(402).send('Deu problema no salvamento');
  }

  return res.send(newRole);
});

module.exports = router;
