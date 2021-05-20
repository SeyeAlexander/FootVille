const catchAsync = require('../utils/catchAsync')
const APIFeatures = require('../utils/apiFeatures')
const AppError = require('../utils/appError')

exports.createDoc = Model => 
    catchAsync(async (req, res, next) => {
        const doc = await Model.create(req.body)

        res.status(201).json({
            status: 'success',
            data: { doc }
        })
        
    })

exports.getAllDocs = Model => 
    catchAsync(async (req, res) => {
        //for nested get routes
        let filter = {}
        if (req.params.tourId) filter = { tour: req.params.tourId }
        
        // get all query
        const features = new APIFeatures(Model.find(filter), req.query)
            .filter()
            .sort()
            .limitFields()
            .paginate()

        // await overall query
        // const doc = await features.query.explain()
        const doc = await features.query

        res.status(200).json({
            status: 'success',
            results: doc.length,
            data: { doc }
        })
    })

exports.getDoc = (Model, popOptions) =>
    catchAsync(async (req, res, next) => {
        let query = Model.findById(req.params.id)
        if (popOptions) query = query.populate(popOptions)
        const doc = await query

        if(!doc) return next(new AppError(`cannot find document with this id`, 404))

        res.status(200).json({
            status: 'success',
            data: { doc }
        })
    })

exports.updateDoc = Model => 
    catchAsync(async (req, res, next) => {
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


