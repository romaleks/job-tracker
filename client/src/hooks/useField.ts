import { useState, type ChangeEvent, type HTMLInputTypeAttribute } from 'react'

const useField = (type: HTMLInputTypeAttribute) => {
  const [value, setValue] = useState('')

  const onChange = (event: ChangeEvent<HTMLInputElement>) => {
    setValue(event.target.value)
  }

  return {
    type,
    value,
    onChange,
  }
}

export default useField
