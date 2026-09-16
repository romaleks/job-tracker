import { expect, test } from '@playwright/test'

test.describe('Register Page', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/register')
  })

  test('успешная регистрация и редирект на главную страницу', async ({
    page,
  }) => {
    // Мокируем API-запрос регистрации
    await page.route('**/api/auth/register', async (route) => {
      await route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify({
          token: 'fake-jwt-token',
          user: { id: '1', username: 'john_doe', email: 'john@example.com' },
        }),
      })
    })

    // Заполнение полей формы
    await page.getByLabel('Username').fill('john_doe')
    await page.getByLabel('Email').fill('john@example.com')
    await page.getByLabel('Password').fill('password123')

    // Отправка формы
    await page.getByRole('button', { name: 'Sign up' }).click()

    // Проверяем редирект на главную страницу
    await expect(page).toHaveURL('/')
  })

  test('отображение ошибок валидации Zod при вводе некорректных данных', async ({
    page,
  }) => {
    // Вводим слишком короткий username, невалидный email и короткий password
    await page.getByLabel('Username').fill('usr')
    await page.getByLabel('Email').fill('invalid-email')
    await page.getByLabel('Password').fill('12345')

    await page.getByRole('button', { name: 'Sign up' }).click()

    // Проверяем появление сообщений об ошибках клиентской валидации
    await expect(
      page.getByText('Username must be at least 5 characters.'),
    ).toBeVisible()
    await expect(
      page.getByText('Please enter a valid email address.'),
    ).toBeVisible()
    await expect(
      page.getByText('Password must be at least 6 characters.'),
    ).toBeVisible()
  })

  test('отображение ошибки 409 Conflict (пользователь уже существует)', async ({
    page,
  }) => {
    const serverErrorMessage = 'Email or username already in use.'

    // Имитируем ответ сервера 409
    await page.route('**/api/auth/register', async (route) => {
      await route.fulfill({
        status: 409,
        contentType: 'application/json',
        body: JSON.stringify({ error: serverErrorMessage }),
      })
    })

    await page.getByLabel('Username').fill('existing_user')
    await page.getByLabel('Email').fill('existing@example.com')
    await page.getByLabel('Password').fill('password123')

    await page.getByRole('button', { name: 'Sign up' }).click()

    // Проверяем вывод специфичного сообщения об ошибке от сервера
    await expect(page.getByText(serverErrorMessage)).toBeVisible()
  })

  test('переход на страницу входа по клику на кнопку Login', async ({
    page,
  }) => {
    await page.getByRole('button', { name: 'Login' }).click()
    await expect(page).toHaveURL('/login')
  })
})
