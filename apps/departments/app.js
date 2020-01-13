const express = require('express')

const DepartmentController = require('./controller.js')
const auth = require('../../src/js/authentication.js')

const app = express()

app.set('views', __dirname + '/views')

app.use((req, res, next) => {
	req.controller = new DepartmentController()
	next()
})

app.get('/', auth.currentUserCan('departments_read'), function(req, res) {
	req.controller.getHome(req, res)
})

app.get('/create', auth.currentUserCan('departments_create'), function(req, res) {
	req.controller.getCreate(req, res)
})

app.post('/create', auth.currentUserCan('departments_create'), function(req, res) {
	req.controller.postCreate(req, res)
})

app.get('/:id/edit', auth.currentUserCan('departments_edit'), function(req, res) {
	req.controller.getEdit(req, res)
})

app.post('/:id/edit', auth.currentUserCan('departments_edit'), function(req, res) {
	req.controller.postEdit(req, res)
})

app.get('/:id/remove', auth.currentUserCan('departments_remove'), function(req, res) {
	req.controller.getRemove(req, res)
})

app.post('/:id/remove', auth.currentUserCan('departments_remove'), function(req, res) {
	req.controller.postRemove(req, res)
})

module.exports = config => app
