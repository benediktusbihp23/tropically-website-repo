"use client"

import { Button } from "@/components/ui/button"
import { Minus, Plus } from 'lucide-react'

interface GuestSelectorProps {
  adults: number
  children: number
  infants: number
  pets: number
  onAdultsChange: (value: number) => void
  onChildrenChange: (value: number) => void
  onInfantsChange: (value: number) => void
  onPetsChange: (value: number) => void
  onClose: () => void
}

export function GuestSelector({
  adults,
  children,
  infants,
  pets,
  onAdultsChange,
  onChildrenChange,
  onInfantsChange,
  onPetsChange,
  onClose,
}: GuestSelectorProps) {
  return (
    <div className="p-6">
      <div className="space-y-6">
        {/* Adults */}
        <div className="flex items-center justify-between">
          <div>
            <p className="font-semibold">Adults</p>
            <p className="text-sm text-muted-foreground">Age 13+</p>
          </div>
          <div className="flex items-center gap-3">
            <Button
              variant="outline"
              size="icon"
              className="h-8 w-8 rounded-full bg-transparent"
              onClick={() => onAdultsChange(Math.max(1, adults - 1))}
              disabled={adults <= 1}
            >
              <Minus className="h-4 w-4" />
            </Button>
            <span className="w-8 text-center">{adults}</span>
            <Button
              variant="outline"
              size="icon"
              className="h-8 w-8 rounded-full bg-transparent"
              onClick={() => onAdultsChange(adults + 1)}
            >
              <Plus className="h-4 w-4" />
            </Button>
          </div>
        </div>

        {/* Children */}
        <div className="flex items-center justify-between">
          <div>
            <p className="font-semibold">Children</p>
            <p className="text-sm text-muted-foreground">Ages 2–12</p>
          </div>
          <div className="flex items-center gap-3">
            <Button
              variant="outline"
              size="icon"
              className="h-8 w-8 rounded-full bg-transparent"
              onClick={() => onChildrenChange(Math.max(0, children - 1))}
              disabled={children <= 0}
            >
              <Minus className="h-4 w-4" />
            </Button>
            <span className="w-8 text-center">{children}</span>
            <Button
              variant="outline"
              size="icon"
              className="h-8 w-8 rounded-full bg-transparent"
              onClick={() => onChildrenChange(children + 1)}
            >
              <Plus className="h-4 w-4" />
            </Button>
          </div>
        </div>

        {/* Infants */}
        <div className="flex items-center justify-between">
          <div>
            <p className="font-semibold">Infants</p>
            <p className="text-sm text-muted-foreground">Under 2</p>
          </div>
          <div className="flex items-center gap-3">
            <Button
              variant="outline"
              size="icon"
              className="h-8 w-8 rounded-full bg-transparent"
              onClick={() => onInfantsChange(Math.max(0, infants - 1))}
              disabled={infants <= 0}
            >
              <Minus className="h-4 w-4" />
            </Button>
            <span className="w-8 text-center">{infants}</span>
            <Button
              variant="outline"
              size="icon"
              className="h-8 w-8 rounded-full bg-transparent"
              onClick={() => onInfantsChange(infants + 1)}
            >
              <Plus className="h-4 w-4" />
            </Button>
          </div>
        </div>

        {/* Pets */}
        <div className="flex items-center justify-between pb-6 border-b border-gray-200 dark:border-gray-800">
          <div>
            <p className="font-semibold">Pets</p>
            <p className="text-sm text-muted-foreground">Service animals welcome</p>
          </div>
          <div className="flex items-center gap-3">
            <Button
              variant="outline"
              size="icon"
              className="h-8 w-8 rounded-full bg-transparent"
              onClick={() => onPetsChange(Math.max(0, pets - 1))}
              disabled={pets <= 0}
            >
              <Minus className="h-4 w-4" />
            </Button>
            <span className="w-8 text-center">{pets}</span>
            <Button
              variant="outline"
              size="icon"
              className="h-8 w-8 rounded-full bg-transparent"
              onClick={() => onPetsChange(pets + 1)}
            >
              <Plus className="h-4 w-4" />
            </Button>
          </div>
        </div>

        <Button onClick={onClose} className="w-full">
          Close
        </Button>
      </div>
    </div>
  )
}
