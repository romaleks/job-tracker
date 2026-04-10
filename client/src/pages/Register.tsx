import FormField from '@/components/ui/FormField'
import { Button } from '@/components/ui/shadcn/button'
import {
  Card,
  CardAction,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/shadcn/card'
import { FieldError, FieldGroup } from '@/components/ui/shadcn/field'
import { useAppDispatch } from '@/hooks/storeHooks'
import { setCredentials } from '@/reducers/authReducer'
import authService from '@/services/authService'
import type { UserResponse } from '@/types/auth'
import { useForm } from '@tanstack/react-form'
import { useMutation } from '@tanstack/react-query'
import type { AxiosError } from 'axios'
import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import * as z from 'zod'

interface ApiErrorResponse {
  error?: string
}

const formSchema = z.object({
  username: z
    .string()
    .trim()
    .min(5, 'Username must be at least 5 characters.')
    .max(32, 'Username must be at most 32 characters.'),
  email: z
    .email('Please enter a valid email address.')
    .max(254, 'Email must be at most 254 characters.'),
  password: z.string().min(6, 'Password must be at least 6 characters.'),
})

function Register() {
  const dispatch = useAppDispatch()
  const [authError, setAuthError] = useState<string | null>(null)

  const navigate = useNavigate()

  const registerMutation = useMutation({
    mutationFn: authService.register,
    onMutate: () => {
      setAuthError(null)
    },
    onSuccess: (res: UserResponse) => {
      dispatch(
        setCredentials({
          token: res.token,
          user: res.user,
        }),
      )

      navigate('/')
    },
    onError: (error: AxiosError<ApiErrorResponse>) => {
      const serverMessage = error.response?.data?.error

      if (error.response?.status === 409) {
        setAuthError('This email is already in use.')
        return
      }

      setAuthError(serverMessage || 'Unable to register. Please try again.')
    },
  })

  const form = useForm({
    defaultValues: {
      username: '',
      email: '',
      password: '',
    },
    validators: {
      onSubmit: formSchema,
    },
    onSubmit: async ({ value }) => {
      registerMutation.mutate(value)
    },
  })

  const handleRegister = (e: React.SyntheticEvent) => {
    e.preventDefault()
    setAuthError(null)
    form.handleSubmit()
  }

  return (
    <div className="w-screen h-screen flex justify-center items-center">
      <Card className="w-full max-w-sm">
        <CardHeader>
          <CardTitle>Create your account</CardTitle>
          <CardDescription>
            Enter your information below to create your account
          </CardDescription>
          <CardAction>
            <Link to={'/login'}>
              <Button variant="link">Login</Button>
            </Link>
          </CardAction>
        </CardHeader>
        <CardContent>
          <form id="register-form" onSubmit={handleRegister}>
            <FieldGroup>
              {authError && <FieldError>{authError}</FieldError>}
              <form.Field
                name="username"
                children={(field) => {
                  const isInvalid =
                    field.state.meta.isTouched && !field.state.meta.isValid
                  return (
                    <FormField
                      label="Username"
                      name={field.name}
                      value={field.state.value}
                      onBlur={field.handleBlur}
                      onChange={(value) => {
                        if (authError) {
                          setAuthError(null)
                        }

                        field.handleChange(value)
                      }}
                      isInvalid={isInvalid}
                      errors={field.state.meta.errors}
                      autoComplete="username"
                    />
                  )
                }}
              />
              <form.Field
                name="email"
                children={(field) => {
                  const isInvalid =
                    field.state.meta.isTouched && !field.state.meta.isValid
                  return (
                    <FormField
                      label="Email"
                      name={field.name}
                      value={field.state.value}
                      onBlur={field.handleBlur}
                      onChange={(value) => {
                        if (authError) {
                          setAuthError(null)
                        }

                        field.handleChange(value)
                      }}
                      isInvalid={isInvalid}
                      errors={field.state.meta.errors}
                      placeholder="email@example.com"
                      autoComplete="email"
                    />
                  )
                }}
              />
              <form.Field
                name="password"
                children={(field) => {
                  const isInvalid =
                    field.state.meta.isTouched && !field.state.meta.isValid
                  return (
                    <FormField
                      label="Password"
                      name={field.name}
                      value={field.state.value}
                      onBlur={field.handleBlur}
                      onChange={(value) => {
                        if (authError) {
                          setAuthError(null)
                        }

                        field.handleChange(value)
                      }}
                      isInvalid={isInvalid}
                      errors={field.state.meta.errors}
                      type="password"
                      autoComplete="new-password"
                    />
                  )
                }}
              />
            </FieldGroup>
          </form>
        </CardContent>
        <CardFooter>
          <Button
            type="submit"
            form="register-form"
            className="w-full"
            disabled={registerMutation.isPending}
          >
            Sign up
          </Button>
        </CardFooter>
      </Card>
    </div>
  )
}

export default Register
