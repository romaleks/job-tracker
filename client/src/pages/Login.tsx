import AuthFormField from '@/components/auth/AuthFormField'
import { Button } from '@/components/ui/button'
import {
  Card,
  CardAction,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'

import { FieldError, FieldGroup } from '@/components/ui/field'

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
  email: z
    .email('Please enter a valid email address.')
    .max(254, 'Email must be at most 254 characters.'),
  password: z.string().min(6, 'Password must be at least 6 characters.'),
})

function Login() {
  const dispatch = useAppDispatch()
  const [authError, setAuthError] = useState<string | null>(null)

  const navigate = useNavigate()

  const loginMutation = useMutation({
    mutationFn: authService.login,
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

      if (error.response?.status === 401) {
        setAuthError('Invalid email or password.')
        return
      }

      setAuthError(serverMessage || 'Unable to login. Please try again.')
    },
  })

  const form = useForm({
    defaultValues: {
      email: '',
      password: '',
    },
    validators: {
      onSubmit: formSchema,
    },
    onSubmit: async ({ value }) => {
      loginMutation.mutate(value)
    },
  })

  const handleLogin = (e: React.SyntheticEvent) => {
    e.preventDefault()
    setAuthError(null)
    form.handleSubmit()
  }

  return (
    <div className="w-screen h-screen flex justify-center items-center">
      <Card className="w-full max-w-sm">
        <CardHeader>
          <CardTitle>Login to your account</CardTitle>
          <CardDescription>
            Enter your email and password below to login to your account
          </CardDescription>
          <CardAction>
            <Link to={'/register'}>
              <Button variant="link">Sign Up</Button>
            </Link>
          </CardAction>
        </CardHeader>
        <CardContent>
          <form id="login-form" onSubmit={handleLogin}>
            <FieldGroup>
              {authError && <FieldError>{authError}</FieldError>}
              <form.Field
                name="email"
                children={(field) => {
                  const isInvalid =
                    field.state.meta.isTouched && !field.state.meta.isValid
                  return (
                    <AuthFormField
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
                    <AuthFormField
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
                      autoComplete="current-password"
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
            form="login-form"
            className="w-full"
            disabled={loginMutation.isPending}
          >
            Login
          </Button>
        </CardFooter>
      </Card>
    </div>
  )
}

export default Login
