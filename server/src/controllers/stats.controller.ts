import { Response } from 'express'
import Job from '../models/Job'
import { AuthRequest } from '../types/express'

export const getUserStats = async (req: AuthRequest, res: Response) => {
  const createdBy = req.user!._id

  const stats = await Job.aggregate([
    { $match: { createdBy } },
    {
      $group: {
        _id: '$status',
        count: { $sum: 1 },
      },
    },
  ])

  const defaultStats = {
    applied: 0,
    interview: 0,
    offer: 0,
    rejected: 0,
  }

  stats.forEach((item) => {
    defaultStats[item._id as keyof typeof defaultStats] = item.count
  })

  const monthly = await Job.aggregate([
    { $match: { createdBy } },
    {
      $group: {
        _id: {
          year: { $year: '$createdAt' },
          month: { $month: '$createdAt' },
        },
        count: { $sum: 1 },
      },
    },
    {
      $sort: {
        '_id.year': 1,
        '_id.month': 1,
      },
    },
  ])

  const monthlyStats = monthly.map((item) => ({
    date: `${item._id.month}/${item._id.year}`,
    count: item.count,
  }))

  res.json({
    stats: defaultStats,
    monthlyStats,
  })
}

export default { getUserStats }
