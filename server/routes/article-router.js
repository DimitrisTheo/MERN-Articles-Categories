const express = require('express')
const router = express.Router()
const Article = require('../models/article')
const Joi = require('joi')
Joi.objectId = require('joi-objectid')(Joi)
const mongoose = require('mongoose')

// get all articles
router.get('/', async (req, res) => {
    // check if parameters were given and make the respective query
    let condition, select = null

    // if filter is set
    if (req.query.filter != null && req.query.filter !== '') {
        condition = { category: req.query.filter }
        // console.log(condition)
    }

    // if content is not wanted
    if (req.query.content === null || req.query.content !== 'yes') {
        select = '-content -description'
    }

    try {
        const articles = await Article.find(condition,select).populate('category')
        // const articles = await Article.find()
        if (!articles.length) {
            return res.status(404).json({ error: 'No Articles found!' })
        } 
        return res.json({ articles: articles })
    } catch (error) {
        return res.status(500).json({ error: error.message })
    }
})

// get a specific article
router.get('/:param', async (req, res) => {
    // check if article exists either by id or name and return deleted object, otherwise return Not Found
    let condition, select = null;
    if (new RegExp("^[0-9a-fA-F]{24}$").test(req.params.param)) {
        // if param is an objectId
        condition = { _id: req.params.param }
    }
    else {
        // a name was given
        condition = { title: req.params.param }
    }

    // if content is not wanted
    if (req.query.content === null || req.query.content !== 'yes') {
        select = '-content -description'
    }

    try {
        const article = await Article.findOne(condition, select).populate('category')
        // if not found
        if (article === null) return res.status(404).json({ error: 'Article Not Found' })
        // else
        return res.json({ article: article})
    } catch (error) {
        return res.status(500).json({ error: error.message })
    }
})

// create an article
router.post('/', async (req, res) => {
    const { error } = validateArticle(req.body)
    if (error) {
        return res.status(400).json({ error: error.details[0].message})
    }

    const article = new Article({
        title: req.body.title,
        content: req.body.content,
        category: mongoose.Types.ObjectId(req.body.category),
        description: (req.body.description) || null,
    })
    try {
        const newArticle  = await article.save()
        return res.status(201).json({ article: newArticle})
    } catch (error) {
        return res.status(500).json({ error: error.message })
    }
})

// edit an article
router.post('/:id', async (req, res) => {
    try{
        const updatedArticle = await Article.findByIdAndUpdate(req.params.id, { content: req.body.content }, { new: true, useFindAndModify: false })
        return res.json({ article: updatedArticle })
    } catch (error) {
        return res.status(500).json({ error: error.message })
    }
})

// delete an article
router.delete('/:param', async(req, res) => {
    // check if article exists either by id or name and return deleted object, otherwise return Not Found
    let condition = null
    if (new RegExp("^[0-9a-fA-F]{24}$").test(req.params.param)) {
        // check if param is an objectId
        condition = { _id: req.params.param }
    }
    else {
        // a name was given
        condition = { title: req.params.param }
    }
    
    try {
        const article = await Article.findOneAndDelete(condition, { useFindAndModify: false })
        // if not found
        if (article === null) return res.status(404).json({ error: 'Article Not Found' })
        // else
        return res.json({ article: article})
    } catch (error) {
        return res.status(500).json({ error: error.message })
    }
})

function validateArticle(article) {
    const schema = Joi.object({
        title: Joi.string().required(),
        content: Joi.string().required(),
        category: Joi.objectId().required()
    })

    return schema.validate(article)
}

module.exports = router