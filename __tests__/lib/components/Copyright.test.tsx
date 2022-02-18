import { render, screen } from '@testing-library/react'
import { Copyright } from '@lib/components'

describe('Copyright', () => {
  it('displays the developer name', () => {
    render(<Copyright />)

    const name = screen.getByText(/marco antônio/i)

    expect(name).toBeInTheDocument()
  })

  it('displays the current year', () => {
    render(<Copyright />)

    const year = (new Date).getFullYear().toString()
    const matcher = new RegExp(year)

    const yearEl = screen.getByText(matcher)

    expect(yearEl).toBeInTheDocument()
  })
})