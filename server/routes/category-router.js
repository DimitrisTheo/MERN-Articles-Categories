const express = require('express')
const router = express.Router()
const Category = require('../models/category')
const Joi = require('joi')

// get all categories
router.get('/', async (req, res) => {
    try {
        const categories = await Category.find()
        if (!categories.length) {
            return res.status(404).json({ error: 'No Categories exist yet!' })
        } 
        return res.json({ categories: categories })
    } catch (error) {
        return res.status(500).json({ error: error.message })
    }
})

// create a category
router.post('/', async (req, res) => {
    const { error } = validateCategory(req.body)
    if (error) {
        return res.status(400).json({ error: error.details[0].message})
    }

    const category = new Category({
        name: req.body.name
    })
    try {
        const newCategory  = await category.save()
        return res.status(201).json({ category: newCategory})
    } catch (error) {
        return res.status(500).json({ error: error.message })
    }
})

// delete a category
router.delete('/:param', async(req, res) => {
    // check if category exists either by id or name and return deleted object, otherwise return Not Found
    // check if param is an objectId
    if (new RegExp("^[0-9a-fA-F]{24}$").test(req.params.param)) {
        try {
            await Category.findByIdAndDelete(req.params.param, (err, category) => {
                // if not found
                if (category === null) return res.status(404).json({ error: 'Category Not Found' }) 
                // else
                return res.json({ category: category})
            })
        } catch (error) {
            return res.status(500).json({ error: error.message })
        }
    }
    else {
        // a name was given
        try {
            await Category.findOneAndDelete({ name: req.params.param }, (err, category) => {
                // if not found
                if (category === null) return res.status(404).json({ error: 'Category Not Found' })
                // else
                return res.json({ category: category})
            })
        } catch (error) {
            return res.status(500).json({ error: error.message })
        }
    }
})

function validateCategory(category) {
    const schema = Joi.object({
        name: Joi.string().required()
    })

    return schema.validate(category)
}

module.exports = router