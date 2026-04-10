import { Input } from '@/components/ui/shadcn/input'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/shadcn/select'
import { Status } from '@/types/job'

interface JobFilterProps {
  search: string
  status: Status | 'all'
  onSearchChange: (value: string) => void
  onStatusChange: (value: Status | 'all') => void
}

const JobFilter = ({
  search,
  status,
  onSearchChange,
  onStatusChange,
}: JobFilterProps) => {
  return (
    <div className="flex w-full flex-col gap-3 sm:flex-row sm:items-center">
      <Input
        value={search}
        onChange={(event) => onSearchChange(event.target.value)}
        placeholder="Search by position or company"
        className="w-full"
      />

      <Select
        value={status}
        onValueChange={(value) => onStatusChange(value as Status | 'all')}
      >
        <SelectTrigger className="w-full sm:w-44">
          <SelectValue placeholder="Status" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="all">All applications</SelectItem>
          <SelectItem value={Status.Applied}>Applied</SelectItem>
          <SelectItem value={Status.Interview}>Interview</SelectItem>
          <SelectItem value={Status.Offer}>Offer</SelectItem>
          <SelectItem value={Status.Rejected}>Rejected</SelectItem>
        </SelectContent>
      </Select>
    </div>
  )
}

export default JobFilter
