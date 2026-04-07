export enum Status {
  Applied = 'applied',
  Interview = 'interview',
  Offer = 'offer',
  Rejected = 'rejected',
}

export enum Type {
  Remote = 'remote',
  Onsite = 'onsite',
  Hybrid = 'hybrid',
}

export interface Job {
  id: string
  createdBy: string
  company: string
  position: string
  status: Status
  type: Type
  salary?: number
  link?: string
  createdAt: string
  updatedAt: string
}

export type JobInput = Omit<Job, 'id' | 'createdBy' | 'createdAt' | 'updatedAt'>
