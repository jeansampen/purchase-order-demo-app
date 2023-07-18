"use client"

import { useState } from "react"
import { zodResolver } from "@hookform/resolvers/zod"
import { format } from "date-fns"
import {
  AlertTriangle as AlertTriangleIcon,
  Calendar as CalendarIcon,
  X as XIcon,
} from "lucide-react"
import { useForm } from "react-hook-form"
import * as z from "zod"

import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Calendar } from "@/components/ui/calendar"
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"
import { useToast } from "@/components/ui/use-toast"

import { Skeleton } from "./ui/skeleton"

const MAX_FILE_SIZE = 500000
const ACCEPTED_FILE_TYPES = ["text/csv", "application/vnd.ms-excel"]

const formSchema = z.object({
  vendor: z.string().min(4, {
    message: "Vendor name must be at least 4 characters.",
  }),
  date: z
    .date({
      required_error: "Date is required.",
    })
    .min(new Date("1900-01-01"), {
      message: "Date must be after 1900-01-01.",
    }),
  csvFile: z.any().refine((files) => {
    return !!files
  }, "CSV File is required."),
})

export function PurchaseForm() {
  const [file, setFile] = useState<File | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<any>(null)

  const { toast } = useToast()

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      vendor: "",
      csvFile: "",
    },
  })

  async function onSubmit(values: z.infer<typeof formSchema>) {
    const formData = new FormData()
    formData.append("vendor", values.vendor)
    formData.append("date", values.date.toISOString())
    formData.append("csvFile", file as File)

    try {
      setIsLoading(true)
      setError(null)
      const response = await fetch("/api/submit", {
        method: "POST",
        body: formData,
      })

      const data = await response.json()

      if (data.error) {
        setError(data.error)
      } else {
        toast({
          title: "Your purchase has been submitted.",
          description: JSON.stringify(data.data),
        })
      }
    } catch (error: any) {
      setError("Something went wrong, please try again.")
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <Form {...form}>
      {error && (
        <div className="p-4 mb-4 text-white bg-red-500 rounded-md">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <div className="flex-shrink-0">
                <AlertTriangleIcon className="w-5 h-5" />
              </div>
              <div className="text-sm font-medium">{error}</div>
            </div>
            <div className="flex-shrink-0">
              <Button
                variant="ghost"
                onClick={() => setError(null)}
                className="text-white"
              >
                <XIcon className="w-5 h-5" />
              </Button>
            </div>
          </div>
        </div>
      )}
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
        <FormField
          control={form.control}
          name="vendor"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Vendor Name</FormLabel>
              <FormControl>
                <Input placeholder="John Doe" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="date"
          render={({ field }) => (
            <FormItem className="flex flex-col">
              <FormLabel>Date</FormLabel>
              <Popover>
                <PopoverTrigger asChild>
                  <FormControl>
                    <Button
                      variant={"outline"}
                      className={cn(
                        "w-[auto] pl-3 text-left font-normal",
                        !field.value && "text-muted-foreground"
                      )}
                    >
                      {field.value ? (
                        format(field.value, "PPP")
                      ) : (
                        <span>Pick a date</span>
                      )}
                      <CalendarIcon className="w-4 h-4 ml-auto opacity-50" />
                    </Button>
                  </FormControl>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0" align="start">
                  <Calendar
                    mode="single"
                    selected={field.value}
                    // @ts-ignore
                    onSelect={field.onChange}
                    disabled={(date) => date < new Date("1900-01-01")}
                    initialFocus
                  />
                </PopoverContent>
              </Popover>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="csvFile"
          render={({ field }) => (
            <FormItem>
              <FormLabel>CSV File</FormLabel>
              <FormControl>
                <Input
                  type="file"
                  {...field}
                  accept={ACCEPTED_FILE_TYPES.join(", ")}
                  onChange={(e) => {
                    // @ts-ignore
                    setFile(e.target?.files[0])
                    field.onChange(e)
                  }}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <div className="text-right">
          {!isLoading ? (
            <Button className="w-[64px] h-[35px]" type="submit" disabled={!form.formState.isValid}>
              Submit
            </Button>
          ) : (
            <Skeleton className="w-[64px] h-[35px] ml-auto" />
          )}
        </div>
      </form>
    </Form>
  )
}
