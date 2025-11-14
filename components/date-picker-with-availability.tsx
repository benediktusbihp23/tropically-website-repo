"use client"

import { useState, useEffect } from "react"
import { Calendar } from "@/components/ui/calendar"
import { format, startOfMonth, endOfMonth, isAfter, isBefore, startOfDay } from "date-fns"

interface AvailabilityData {
  date: string
  minNights: number
  isBaseMinNights: boolean
  status: string
  cta: boolean
  ctd: boolean
}

interface DatePickerWithAvailabilityProps {
  selected: Date | undefined
  onSelect: (date: Date | undefined) => void
  disabled?: (date: Date) => boolean
  mode: "checkIn" | "checkOut"
  checkInDate?: Date
  listingId: string
}

export function DatePickerWithAvailability({
  selected,
  onSelect,
  disabled,
  mode,
  checkInDate,
  listingId,
}: DatePickerWithAvailabilityProps) {
  const [availability, setAvailability] = useState<Record<string, AvailabilityData>>({})
  const [loading, setLoading] = useState(false)
  const [currentMonth, setCurrentMonth] = useState(new Date())

  useEffect(() => {
    fetchAvailability(currentMonth)
  }, [currentMonth, listingId])

  const fetchAvailability = async (monthDate: Date) => {
    setLoading(true)
    try {
      const today = startOfDay(new Date())
      const monthStart = startOfMonth(monthDate)
      const monthEnd = endOfMonth(monthDate)

      const fromDate = isAfter(monthStart, today) ? monthStart : today
      const toDate = monthEnd

      const response = await fetch(
        `/api/listings/${listingId}/availability?from=${format(fromDate, "yyyy-MM-dd")}&to=${format(toDate, "yyyy-MM-dd")}`,
      )

      if (response.ok) {
        const data: AvailabilityData[] = await response.json()
        const availabilityMap: Record<string, AvailabilityData> = {}
        data.forEach((item) => {
          availabilityMap[item.date] = item
        })
        setAvailability(availabilityMap)
      }
    } catch (error) {
      console.error("Failed to fetch availability:", error)
    } finally {
      setLoading(false)
    }
  }

  const handleMonthChange = (month: Date) => {
    setCurrentMonth(month)
  }

  const isDateDisabled = (date: Date): boolean => {
    const today = startOfDay(new Date())

    if (isBefore(date, today)) {
      return true
    }

    if (mode === "checkOut" && checkInDate) {
      if (date <= checkInDate) {
        return true
      }
    }

    if (disabled && disabled(date)) {
      return true
    }

    return false
  }

  const modifiers = {
    available: (date: Date) => {
      const dateStr = format(date, "yyyy-MM-dd")
      const dayAvailability = availability[dateStr]
      return dayAvailability?.status === "available" && !isDateDisabled(date)
    },
    unavailable: (date: Date) => {
      const dateStr = format(date, "yyyy-MM-dd")
      const dayAvailability = availability[dateStr]
      return (dayAvailability && dayAvailability.status !== "available") || isDateDisabled(date)
    },
  }

  const modifiersClassNames = {
    available:
      "relative after:absolute after:bottom-1 after:left-1/2 after:-translate-x-1/2 after:w-1.5 after:h-1.5 after:bg-green-500 after:rounded-full",
    unavailable:
      "relative after:absolute after:bottom-1 after:left-1/2 after:-translate-x-1/2 after:w-1.5 after:h-1.5 after:bg-red-500 after:rounded-full",
  }

  return (
    <Calendar
      mode="single"
      selected={selected}
      onSelect={onSelect}
      disabled={isDateDisabled}
      onMonthChange={handleMonthChange}
      modifiers={modifiers}
      modifiersClassNames={modifiersClassNames}
      initialFocus
    />
  )
}
