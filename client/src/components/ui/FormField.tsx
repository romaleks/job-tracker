import { Field, FieldError, FieldLabel } from '@/components/ui/field'
import { Input } from '@/components/ui/input'

interface FormFieldProps {
  label: string
  name: string
  value: string
  isInvalid: boolean
  onBlur: () => void
  onChange: (value: string) => void
  errors?: Array<{ message?: string } | undefined>
  placeholder?: string
  type?: React.HTMLInputTypeAttribute
  autoComplete?: string
}

function FormField({
  label,
  name,
  value,
  isInvalid,
  onBlur,
  onChange,
  errors,
  placeholder,
  type = 'text',
  autoComplete = 'off',
}: FormFieldProps) {
  return (
    <Field data-invalid={isInvalid}>
      <FieldLabel htmlFor={name}>{label}</FieldLabel>
      <Input
        id={name}
        name={name}
        type={type}
        value={value}
        onBlur={() => onBlur()}
        onChange={(e) => onChange(e.target.value)}
        aria-invalid={isInvalid}
        placeholder={placeholder}
        autoComplete={autoComplete}
      />
      {isInvalid && <FieldError errors={errors} />}
    </Field>
  )
}

export default FormField
