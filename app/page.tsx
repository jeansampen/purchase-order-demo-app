"use client";

import { Toaster } from "@/components/ui/toaster"
import { PurchaseForm } from "@/components/purchase-form"

function Page() {
  return (
    <>
      <div className="container grid items-center gap-6 pt-6 pb-8 md:py-10 md:px-56">
        <h1 className="mx-auto mb-4 font-mono text-3xl font-extrabold leading-tight md:text-4xl">
          Purchase Form
        </h1>
        <PurchaseForm />
      </div>
      <Toaster />
    </>
  )
}

export default Page

