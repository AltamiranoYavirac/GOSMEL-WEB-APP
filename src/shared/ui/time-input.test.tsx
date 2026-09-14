import { useState } from "react"
import { render, screen, within } from "@testing-library/react"
import userEvent from "@testing-library/user-event"
import { describe, expect, it, vi } from "vitest"

import { TimeInput } from "./time-input"

function ControlledTimeInput({ onChange }: { onChange?: (value: string) => void }) {
  const [value, setValue] = useState("")
  return (
    <TimeInput
      aria-label="Hora"
      value={value}
      onChange={(next) => {
        setValue(next)
        onChange?.(next)
      }}
    />
  )
}

describe("TimeInput", () => {
  it("muestra el placeholder cuando no hay valor", () => {
    render(<TimeInput aria-label="Hora" />)

    expect(screen.getByRole("button", { name: "Hora" })).toHaveTextContent("--:-- --")
  })

  it("formatea el valor en 12 horas con periodo", () => {
    render(<TimeInput aria-label="Hora" value="15:30" />)

    expect(screen.getByRole("button", { name: "Hora" })).toHaveTextContent("03:30 p. m.")
  })

  it("emite el valor en formato 24 horas al elegir hora, minuto y periodo", async () => {
    const user = userEvent.setup()
    const onChange = vi.fn()
    render(<ControlledTimeInput onChange={onChange} />)

    await user.click(screen.getByRole("button", { name: "Hora" }))

    await user.click(within(screen.getByRole("listbox", { name: "Hora" })).getByRole("option", { name: "03" }))
    await user.click(within(screen.getByRole("listbox", { name: "Minutos" })).getByRole("option", { name: "45" }))
    await user.click(within(screen.getByRole("listbox", { name: "Periodo" })).getByRole("option", { name: "p. m." }))

    expect(onChange).toHaveBeenLastCalledWith("15:45")
    expect(screen.getByRole("button", { name: "Hora" })).toHaveTextContent("03:45 p. m.")
  })

  it("convierte la medianoche a 00 horas", async () => {
    const user = userEvent.setup()
    const onChange = vi.fn()
    render(<ControlledTimeInput onChange={onChange} />)

    await user.click(screen.getByRole("button", { name: "Hora" }))

    await user.click(within(screen.getByRole("listbox", { name: "Hora" })).getByRole("option", { name: "12" }))
    await user.click(within(screen.getByRole("listbox", { name: "Periodo" })).getByRole("option", { name: "a. m." }))

    expect(onChange).toHaveBeenLastCalledWith("00:00")
  })
})
