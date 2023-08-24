const Job = require('../models/Job')
const { StatusCodes } = require('http-status-codes')
const { BadRequestError, NotFoundError } = require('../errors')

const getAllJobs = async (req, res) => {
  const { userId } = req.user
  const jobs = await Job.find({ createdBy: userId }).sort('createdAt')

  res.status(StatusCodes.OK).json({ jobs, count: jobs.length })
}
const getJob = async (req, res) => {
  const {
    user: { userId },
    params: { id: jobId },
  } = req

  const job = await Job.findOne({ createdBy: userId, _id: jobId })

  if (!job) throw new NotFoundError(`No job with id ${jobId}`)
  res.status(StatusCodes.OK).json({ job })
}
const createJob = async (req, res) => {
  // ma dostęp do req.user.userId bo authentication middleware działa
  req.body.createdBy = req.user.userId
  const job = await Job.create(req.body)
  res.status(StatusCodes.CREATED).json({ job })
}

const updateJob = async (req, res) => {
  const {
    user: { userId },
    body: { company, position },
    params: { id: jobId },
  } = req

  if (company === '' || position === '') {
    throw new BadRequestError('Company and position fields cannot be empty')
  }

  const job = await Job.findOneAndUpdate(
    { _id: jobId, createdBy: userId },
    req.body,
    { new: true, runValidators: true }
  )

  res.status(StatusCodes.OK).json(job)
}

const deleteJob = async (req, res) => {
  const {
    user: { userId },
    params: { id: jobId },
  } = req

  const job = await Job.findOneAndRemove({
    _id: jobId,
    createdBy: userId,
  })

  if (!job) {
    throw new NotFoundError('No job with id ' + jobId)
  }

  res.status(StatusCodes.OK).send()
}

module.exports = { getAllJobs, getJob, createJob, updateJob, deleteJob }
