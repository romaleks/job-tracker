import { expect, test } from '@playwright/test'

test.describe('Login Page', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/login')
  })

  test('успешная авторизация и редирект на главную страницу', async ({
    page,
  }) => {
    // Перехватываем API-запрос авторизации
    await page.route('**/api/auth/login', async (route) => {
      await route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify({
          token: 'fake-jwt-token',
          user: { id: '1', email: 'user@example.com', name: 'Test User' },
        }),
      })
    })

    // Заполнение формы
    await page.getByLabel('Email').fill('user@example.com')
    await page.getByLabel('Password').fill('password123')

    // Отправка формы
    await page.getByRole('button', { name: 'Login' }).click()

    // Проверка редиректа на главную страницу
    await expect(page).toHaveURL('/')
  })

  test('отображение ошибки валидации при неверных данных на клиенте', async ({
    page,
  }) => {
    // Вводим некорректный email и короткий пароль
    await page.getByLabel('Email').fill('invalid-email')
    await page.getByLabel('Password').fill('123')

    await page.getByRole('button', { name: 'Login' }).click()

    // Проверяем появление текстовых ошибок Zod
    await expect(
      page.getByText('Please enter a valid email address.'),
    ).toBeVisible()
    await expect(
      page.getByText('Password must be at least 6 characters.'),
    ).toBeVisible()
  })

  test('отображение ошибки сервера при неверных учётных данных (401)', async ({
    page,
  }) => {
    // Имитируем ответ сервера 401 Unauthorized
    await page.route('**/api/auth/login', async (route) => {
      await route.fulfill({
        status: 401,
        contentType: 'application/json',
        body: JSON.stringify({ error: 'Invalid credentials' }),
      })
    })

    await page.getByLabel('Email').fill('wrong@example.com')
    await page.getByLabel('Password').fill('wrongpassword')
    await page.getByRole('button', { name: 'Login' }).click()

    // Проверяем отображение сообщения об ошибке из состояния authError
    await expect(page.getByText('Invalid email or password.')).toBeVisible()
  })

  test('переход на страницу регистрации по клику на Sign Up', async ({
    page,
  }) => {
    await page.getByRole('button', { name: 'Sign Up' }).click()
    await expect(page).toHaveURL('/register')
  })
})
