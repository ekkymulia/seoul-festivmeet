'use client'

import * as React from 'react'
import { Calendar as CalendarPrimitive } from 'react-day-picker'
import { cn } from '@/lib/utils'

export function Calendar({
  className,
  classNames,
  showOutsideDays = true,
  ...props
}: React.ComponentProps<typeof CalendarPrimitive>) {
  return (
    <CalendarPrimitive
      showOutsideDays={showOutsideDays}
      className={cn("rounded-md border", className)}
      classNames={{
        ...classNames,
        // 원하는 classNames 커스터마이징
      }}
      {...props}
    />
  )
}
