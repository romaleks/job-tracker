import { Button } from '@/components/ui/button'
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog'
import { FieldError, FieldGroup } from '@/components/ui/field'
import FormField from '@/components/ui/FormField'
import FormSelect from '@/components/ui/FormSelect'
import jobService from '@/services/jobService'
import { Status, Type, type Job, type JobInput } from '@/types/job'
import { useForm } from '@tanstack/react-form'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import type { AxiosError } from 'axios'
import { useMemo, useState, type PropsWithChildren } from 'react'
import * as z from 'zod'

interface ApiErrorResponse {
  error?: string
}

const formSchema = z.object({
  position: z.string().min(1, 'Position must be specified.'),
  company: z.string().min(1, 'Company must be specified.'),
  salary: z.string().refine((value) => {
    const parsed = Number(value)
    return value === '' || (Number.isFinite(parsed) && parsed > 0)
  }, 'Salary must be positive.'),
  status: z.enum(Status, 'Please select status.'),
  type: z.enum(Type, 'Please select type.'),
  link: z.url('Please enter a valid URL.').or(z.literal('')),
})

interface UpdateMutationProps {
  id: string
  updatedJob: JobInput
}

interface JobFormProps {
  action: 'add' | 'edit'
  job?: Job
}

export function JobForm({
  action,
  job,
  children,
}: PropsWithChildren<JobFormProps>) {
  const [error, setError] = useState<string | null>(null)
  const [open, setOpen] = useState(false)
  const formId = useMemo(
    () => `job-form-${action}-${job?.id ?? 'new'}`,
    [action, job?.id],
  )

  const queryClient = useQueryClient()

  const updateMutation = useMutation({
    mutationFn: ({ id, updatedJob }: UpdateMutationProps) =>
      jobService.update(id, updatedJob),
    onMutate: () => {
      setError(null)
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['jobs'] })
      setOpen(false)
    },
    onError: (error: AxiosError<ApiErrorResponse>) => {
      const serverMessage = error.response?.data?.error
      setError(
        serverMessage || 'Unable to edit job information. Please try again.',
      )
    },
  })

  const createMutation = useMutation({
    mutationFn: jobService.create,
    onMutate: () => {
      setError(null)
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['jobs'] })
      setOpen(false)
    },
    onError: (error: AxiosError<ApiErrorResponse>) => {
      const serverMessage = error.response?.data?.error
      setError(
        serverMessage || 'Unable to add job application. Please try again.',
      )
    },
  })

  const form = useForm({
    defaultValues: {
      position: job?.position ?? '',
      company: job?.company ?? '',
      salary: job?.salary?.toString() ?? '',
      status: action === 'edit' && job?.status ? job.status : '',
      type: action === 'edit' && job?.type ? job.type : '',
      link: job?.link ?? '',
    },
    validators: {
      onSubmit: formSchema,
    },
    onSubmit: async ({ value }) => {
      const jobInput: JobInput = {
        ...value,
        status: value.status as Status,
        type: value.type as Type,
        salary: Number(value.salary),
      }

      if (action === 'edit' && job) {
        return updateMutation.mutate({ id: job.id, updatedJob: jobInput })
      }

      return createMutation.mutate(jobInput)
    },
  })

  const handleSubmit = (e: React.SyntheticEvent) => {
    e.preventDefault()
    setError(null)
    form.handleSubmit()
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <form id={formId} onSubmit={handleSubmit}>
        <DialogTrigger asChild>{children}</DialogTrigger>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="text-lg">
              {action === 'add' ? 'Add' : 'Edit'} job information
            </DialogTitle>
            <DialogDescription>
              {action === 'add' ? 'Create' : 'Make changes to'} your application
              here. Click save when you&apos;re done.
            </DialogDescription>
          </DialogHeader>
          <FieldGroup>
            {error && <FieldError>{error}</FieldError>}
            <div className="flex gap-4">
              <form.Field
                name="position"
                children={(field) => {
                  const isInvalid =
                    field.state.meta.isTouched && !field.state.meta.isValid

                  return (
                    <FormField
                      label="Position"
                      name={field.name}
                      value={field.state.value}
                      onBlur={field.handleBlur}
                      onChange={field.handleChange}
                      isInvalid={isInvalid}
                      errors={field.state.meta.errors}
                      placeholder={job?.position}
                    />
                  )
                }}
              />
              <form.Field
                name="company"
                children={(field) => {
                  const isInvalid =
                    field.state.meta.isTouched && !field.state.meta.isValid

                  return (
                    <FormField
                      label="Company"
                      name={field.name}
                      value={field.state.value}
                      onBlur={field.handleBlur}
                      onChange={field.handleChange}
                      isInvalid={isInvalid}
                      errors={field.state.meta.errors}
                      placeholder={job?.company}
                    />
                  )
                }}
              />
            </div>
            <div className="grid grid-cols-[1fr_3fr] gap-4">
              <form.Field
                name="salary"
                children={(field) => {
                  const isInvalid =
                    field.state.meta.isTouched && !field.state.meta.isValid

                  return (
                    <FormField
                      type="number"
                      label="Salary"
                      name={field.name}
                      value={field.state.value}
                      onBlur={field.handleBlur}
                      onChange={field.handleChange}
                      isInvalid={isInvalid}
                      errors={field.state.meta.errors}
                      placeholder={job?.salary?.toString()}
                    />
                  )
                }}
              />
              <form.Field
                name="link"
                children={(field) => {
                  const isInvalid =
                    field.state.meta.isTouched && !field.state.meta.isValid

                  return (
                    <FormField
                      label="URL (optional)"
                      name={field.name}
                      value={field.state.value}
                      onBlur={field.handleBlur}
                      onChange={field.handleChange}
                      isInvalid={isInvalid}
                      errors={field.state.meta.errors}
                      placeholder="https://example.com/job-posting"
                      type="url"
                    />
                  )
                }}
              />
            </div>
            <div className="flex gap-4">
              <form.Field
                name="type"
                children={(field) => {
                  const isInvalid =
                    field.state.meta.isTouched && !field.state.meta.isValid

                  return (
                    <FormSelect
                      label="Type"
                      name={field.name}
                      value={field.state.value}
                      onBlur={field.handleBlur}
                      onChange={(value) => field.handleChange(value as Type)}
                      isInvalid={isInvalid}
                      errors={field.state.meta.errors}
                      placeholder="Select type"
                      options={[
                        { label: 'Remote', value: Type.Remote },
                        { label: 'Onsite', value: Type.Onsite },
                        { label: 'Hybrid', value: Type.Hybrid },
                      ]}
                    />
                  )
                }}
              />
              <form.Field
                name="status"
                children={(field) => {
                  const isInvalid =
                    field.state.meta.isTouched && !field.state.meta.isValid

                  return (
                    <FormSelect
                      label="Status"
                      name={field.name}
                      value={field.state.value}
                      onBlur={field.handleBlur}
                      onChange={(value) => field.handleChange(value as Status)}
                      isInvalid={isInvalid}
                      errors={field.state.meta.errors}
                      placeholder="Select status"
                      options={[
                        { label: 'Applied', value: Status.Applied },
                        { label: 'Interview', value: Status.Interview },
                        { label: 'Offer', value: Status.Offer },
                        { label: 'Rejected', value: Status.Rejected },
                      ]}
                    />
                  )
                }}
              />
            </div>
          </FieldGroup>
          <DialogFooter>
            <DialogClose asChild>
              <Button variant="outline">Cancel</Button>
            </DialogClose>
            <Button type="submit" form={formId}>
              {action === 'add' ? 'Create' : 'Save changes'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </form>
    </Dialog>
  )
}

export default JobForm
