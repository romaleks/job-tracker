import { useIsMobile } from '@/hooks/use-mobile'
import { act, renderHook } from '@testing-library/react'
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'

describe('useIsMobile', () => {
  let changeListener: (() => void) | null = null

  // Вспомогательная функция для эмуляции window.matchMedia
  const mockMatchMedia = (matches: boolean) => {
    return vi.fn().mockImplementation((query: string) => ({
      matches,
      media: query,
      onchange: null,
      addListener: vi.fn(), // Для старых браузеров
      removeListener: vi.fn(), // Для старых браузеров
      addEventListener: vi.fn((event: string, handler: () => void) => {
        if (event === 'change') {
          changeListener = handler
        }
      }),
      removeEventListener: vi.fn((event: string, handler: () => void) => {
        if (event === 'change' && changeListener === handler) {
          changeListener = null
        }
      }),
      dispatchEvent: vi.fn(),
    }))
  }

  // Вспомогательная функция для изменения ширины экрана
  const setWindowWidth = (width: number) => {
    Object.defineProperty(window, 'innerWidth', {
      writable: true,
      configurable: true,
      value: width,
    })
  }

  beforeEach(() => {
    changeListener = null
  })

  afterEach(() => {
    vi.restoreAllMocks()
  })

  it('возвращает true, если ширина экрана меньше 870px', () => {
    setWindowWidth(500)
    window.matchMedia = mockMatchMedia(true)

    const { result } = renderHook(() => useIsMobile())

    expect(result.current).toBe(true)
  })

  it('возвращает false, если ширина экрана 870px или больше', () => {
    setWindowWidth(1024)
    window.matchMedia = mockMatchMedia(false)

    const { result } = renderHook(() => useIsMobile())

    expect(result.current).toBe(false)
  })

  it('обновляет значение при вызове события change у matchMedia', () => {
    // Начинаем с десктопного разрешения
    setWindowWidth(1024)
    window.matchMedia = mockMatchMedia(false)

    const { result } = renderHook(() => useIsMobile())
    expect(result.current).toBe(false)

    // Симулируем переход на мобильное разрешение
    act(() => {
      setWindowWidth(500)
      if (changeListener) {
        changeListener()
      }
    })

    expect(result.current).toBe(true)
  })

  it('корректно удаляет слушатель событий при размонтировании', () => {
    setWindowWidth(500)
    const matchMediaMock = mockMatchMedia(true)
    window.matchMedia = matchMediaMock

    const { unmount } = renderHook(() => useIsMobile())

    expect(changeListener).not.toBeNull()

    unmount()

    expect(changeListener).toBeNull()
  })
})
