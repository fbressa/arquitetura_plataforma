"use client"

import { useAppContext } from "@/app/context/AppContext"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Button } from "@/components/ui/button"
import { X, CheckCircle, AlertTriangle, Info, XCircle } from "lucide-react"
import { cn } from "@/lib/utils"
import { ClientOnly } from "./client-only"

export function NotificationSystem() {
  const { notifications, removeNotification } = useAppContext()

  return (
    <ClientOnly>
      {notifications.length > 0 && (
        <div className="fixed top-4 right-4 z-50 space-y-2 w-80">
          {notifications.map((notification) => {
            const Icon = {
              success: CheckCircle,
              error: XCircle,
              warning: AlertTriangle,
              info: Info,
            }[notification.type]

            return (
              <Alert
                key={notification.id}
                className={cn(
                  "border-l-4 shadow-lg",
                  {
                    "border-l-green-500 bg-green-50 dark:bg-green-950": notification.type === "success",
                    "border-l-red-500 bg-red-50 dark:bg-red-950": notification.type === "error",
                    "border-l-yellow-500 bg-yellow-50 dark:bg-yellow-950": notification.type === "warning",
                    "border-l-blue-500 bg-blue-50 dark:bg-blue-950": notification.type === "info",
                  }
                )}
              >
                <div className="flex items-start gap-2">
                  <Icon className={cn(
                    "h-4 w-4 mt-0.5",
                    {
                      "text-green-600": notification.type === "success",
                      "text-red-600": notification.type === "error", 
                      "text-yellow-600": notification.type === "warning",
                      "text-blue-600": notification.type === "info",
                    }
                  )} />
                  <AlertDescription className="flex-1">
                    {notification.message}
                  </AlertDescription>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-4 w-4 opacity-70 hover:opacity-100"
                    onClick={() => removeNotification(notification.id)}
                  >
                    <X className="h-3 w-3" />
                  </Button>
                </div>
              </Alert>
            )
          })}
        </div>
      )}
    </ClientOnly>
  )
}
