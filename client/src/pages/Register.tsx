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
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { useAppDispatch } from '@/hooks/storeHooks'
import useField from '@/hooks/useField'
import { setCredentials } from '@/reducers/authReducer'
import authService from '@/services/authService'
import type { UserResponse } from '@/types/auth'
import { useMutation } from '@tanstack/react-query'
import { Link, useNavigate } from 'react-router-dom'

function Register() {
  const username = useField('username')
  const email = useField('email')
  const password = useField('password')

  const dispatch = useAppDispatch()

  const navigate = useNavigate()

  const registerMutation = useMutation({
    mutationFn: authService.register,
    onSuccess: (res: UserResponse) => {
      dispatch(
        setCredentials({
          token: res.token,
          user: res.user,
        }),
      )

      navigate('/')
    },
  })

  const handleRegister = (e: React.SyntheticEvent) => {
    e.preventDefault()
    registerMutation.mutate({
      username: username.value,
      email: email.value,
      password: password.value,
    })
  }

  return (
    <div className="w-screen h-screen flex justify-center items-center">
      <Card className="w-full max-w-sm">
        <CardHeader>
          <CardTitle>Create your account</CardTitle>
          <CardDescription>
            Enter your email below to create your account
          </CardDescription>
          <CardAction>
            <Link to={'/login'}>
              <Button variant="link">Login</Button>
            </Link>
          </CardAction>
        </CardHeader>
        <form onSubmit={handleRegister}>
          <CardContent className="mb-6">
            <div className="flex flex-col gap-6">
              <div className="grid gap-2">
                <Label htmlFor="username">Username</Label>
                <Input id="username" required {...username} />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  placeholder="m@example.com"
                  required
                  {...email}
                />
              </div>
              <div className="grid gap-2">
                <div className="flex items-center">
                  <Label htmlFor="password">Password</Label>
                </div>
                <Input id="password" required {...password} />
              </div>
            </div>
          </CardContent>
          <CardFooter>
            <Button type="submit" className="w-full">
              Sign up
            </Button>
          </CardFooter>
        </form>
      </Card>
    </div>
  )
}

export default Register
