import { Request, Response } from 'express'
import Job from '../models/Job'

const directionNames = [
  'Frontend',
  'Backend',
  'Fullstack',
  'QA и тестирование',
  'Data и аналитика',
  'Продакт-менеджмент',
] as const

type DirectionName = (typeof directionNames)[number]

const directionMatchers: Array<[DirectionName, RegExp]> = [
  ['Fullstack', /full[\s-]?stack|fullstack/i],
  ['Frontend', /front[\s-]?end|react|vue|angular|интерфейс|верстк/i],
  ['Backend', /back[\s-]?end|node|java|python|php|\.net|go|сервер/i],
  ['QA и тестирование', /qa|quality|тестир|автоматизац.*тест/i],
  ['Data и аналитика', /data|аналит|bi|machine learning|ml|данн/i],
  ['Продакт-менеджмент', /product|продакт|продукт|project manager|pm/i],
]

const getDirection = (position: string): DirectionName | null => {
  const match = directionMatchers.find(([, matcher]) => matcher.test(position))
  return match?.[0] ?? null
}

export const getMarketOverview = async (_req: Request, res: Response) => {
  const jobs = await Job.find({}, { position: 1, _id: 0 }).lean()
  const applicationsByDirection = new Map<DirectionName, number>()

  for (const direction of directionNames) {
    applicationsByDirection.set(direction, 0)
  }

  for (const job of jobs) {
    const direction = getDirection(job.position)

    if (direction) {
      applicationsByDirection.set(
        direction,
        (applicationsByDirection.get(direction) ?? 0) + 1,
      )
    }
  }

  return res.status(200).json({
    totalApplications: jobs.length,
    popularDirections: directionNames
      .map((name) => ({
        name,
        applications: applicationsByDirection.get(name) ?? 0,
      }))
      .sort((first, second) => second.applications - first.applications),
  })
}
