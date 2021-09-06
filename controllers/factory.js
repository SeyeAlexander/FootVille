const catchAsync = require('../utils/catchAsync')
const APIFeatures = require('../utils/apiFeatures')
const AppError = require('../utils/appError')

exports.createDoc = Model => 
    catchAsync(async (req, res, next) => {
        if (req.file) req.body.photo = req.file.filename
        
        // if (req.file) console.log( req.file ) | was used to test for the best way to name the files

        const doc = await Model.create(req.body)

        res.status(201).json({
            status: 'success',
            data: { doc }
        })
        
    })

exports.getAllDocs = (Model, Page) => 
    catchAsync(async (req, res) => {
        const features = new APIFeatures(Model.find(), req.query)
            .filter()
            .sort()
            .limitFields()
            .paginate()

        // await overall query
        // use features.query.explain() to examine documents
        const docs = await features.query

        if (req.originalUrl.startsWith('/api')) {
            return res.status(200).json({
                status: 'success',
                results: docs.length,
                data: { docs }
            })
        }
        
        if (Page) {
            return res.status(200).render(Page, { docs, title: 'Kicks' })
        }
    })

exports.getDoc = (Model, Page, popOptions) =>
    catchAsync(async (req, res, next) => {
        if (req.originalUrl.startsWith('/api')) {
            let query = Model.findById(req.params.id)
            if (popOptions) query = query.populate(popOptions)
            const docc = await query

            if(!docc) return next(new AppError(`cannot find document with this id`, 404))

            return res.status(200).json({
                status: 'success',
                data: { docc }
            })
        }

        if (Page) {
            const doc = await Model.findOne({ slug: req.params.slug })

            if (!doc) return next(new AppError(`cannot get this Product right now, please check out others`, 404))

            res.status(200).render(Page, { 
                doc,
                title: `${doc.name}`
            })
        }
        
    })

exports.updateDoc = Model => 
    catchAsync(async (req, res, next) => {
        if (req.file) req.body.photo = req.file.filename

        const doc = await Model.findByIdAndUpdate(req.params.id, req.body, {
            new: true,
            runValidators: true
        }) 

        if(!doc) return next(new AppError(`cannot find document with this id`, 404))

        res.status(200).json({
            status: 'success',
            data: { doc }
        })
    })

exports.deleteDoc = Model =>  
    catchAsync(async (req, res, next) => {
        const doc = await Model.findByIdAndDelete(req.params.id)

        if(!doc) return next(new AppError(`cannot find document with this id`, 404))

        res.status(204).json({
            status: 'success',
            data: null
        })
    })


