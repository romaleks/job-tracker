import { Field, FieldError, FieldLabel } from '@/components/ui/shadcn/field'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/shadcn/select'

interface FormSelectOption {
  label: string
  value: string
  disabled?: boolean
}

interface FormSelectProps {
  label: string
  name: string
  value: string
  isInvalid: boolean
  onBlur: () => void
  onChange: (value: string) => void
  errors?: Array<{ message?: string } | undefined>
  placeholder?: string
  options: FormSelectOption[]
}

function FormSelect({
  label,
  name,
  value,
  isInvalid,
  onBlur,
  onChange,
  errors,
  placeholder = 'Select an option',
  options,
}: FormSelectProps) {
  return (
    <Field data-invalid={isInvalid}>
      <FieldLabel htmlFor={name}>{label}</FieldLabel>
      <Select value={value} onValueChange={onChange}>
        <SelectTrigger id={name} aria-invalid={isInvalid} onBlur={onBlur}>
          <SelectValue placeholder={placeholder} />
        </SelectTrigger>
        <SelectContent>
          {options.map((option) => (
            <SelectItem
              key={option.value}
              value={option.value}
              disabled={option.disabled}
            >
              {option.label}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
      {isInvalid && <FieldError errors={errors} />}
    </Field>
  )
}

export default FormSelect
