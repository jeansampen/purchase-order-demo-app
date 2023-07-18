import fs from "fs"
import path from "path"
import { PrismaClient } from "@prisma/client"
import { parse } from "fast-csv"
import multer from "multer"
import { ZodTypeAny, z } from "zod"

export const notNumericString = (schema: ZodTypeAny) =>
  z.preprocess((a) => {
    if (typeof a === "string") {
      return isNaN(parseInt(a, 10)) ? a : undefined
    } else {
      return undefined
    }
  }, schema)
const filePath = "uploads/"
const prisma = new PrismaClient()
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    if( !fs.existsSync(filePath) ) {
      fs.mkdirSync(filePath, { recursive: true })
    }
    cb(null, filePath)
  },

  filename: (req, file, cb) => {
    cb(null, file.originalname)
  },
})

const upload = multer({ storage })

const csvSchema = z.object({
  "Model Number": notNumericString(z.string()),
  "Unit Price": z.number(),
  Quantity: z.number().int(),
})

const formSchema = z.object({
  vendor: z.string().min(4),
  date: z.string(),
})

export const config = {
  api: {
    bodyParser: false,
  },
}

export default function handle(req: any, res: any) {
  return new Promise<void>((resolve, reject) => {
    if (req.method !== "POST") {
      res.status(405).json({ error: "Method not allowed" })
      return resolve()
    }

    upload.single("csvFile")(req, res, async (err: any) => {
      if (err) {
        res.status(500).json({ error: err.message })
        return reject(err)
      }

      const { vendor, date } = req.body
      const file = req.file
      if (!vendor || !date || !file) {
        res.status(400).send({ error: "Vendor, date and file are required" })
        return resolve()
      }

      try {
        const formValues = formSchema.parse(req.body)

        let rows: any[] = []
        let errors: any[] = []
        await fs
          .createReadStream(req.file.path)
          .pipe(parse({ headers: true }))
          .on("error", (error: any) => {
            throw error
          })
          .on("data", (row: any) => {
            try {
              row["Unit Price"] = parseFloat(row["Unit Price"]) // convert to float
              row.Quantity = parseInt(row.Quantity, 10) // convert to int
              rows.push(csvSchema.parse(row))
            } catch (error: any) {
              errors.push(`Invalid csv file`)
            }
          })
          .on("end", async () => {
            if (errors.length > 0) {
              res.status(400).json({ error: errors[0] })
              return resolve()
            }
            try {
              const purchaseOrder = await prisma.purchaseOrder.create({
                data: {
                  vendor: formValues.vendor,
                  date: new Date(formValues.date),
                  csvFile: path.relative(process.cwd(), req.file.path), // stores relative path to file
                  items: {
                    create: rows.map((row) => ({
                      modelNumber: row["Model Number"],
                      unitPrice: row["Unit Price"],
                      quantity: row.Quantity,
                    })),
                  },
                },
                include: {
                  items: true,
                },
              })
              res.status(200).json({ status: "ok", data: purchaseOrder }) // Send a response here
              return resolve()
            } catch (error: any) {
              res.status(400).json({ status: "error", error: error.message })
              return resolve()
            }
          })
      } catch (error: any) {
        res.status(400).json({ status: "error", error: error.message })
        return resolve()
      } finally {
        ;async () => await prisma.$disconnect()
      }
    })
  })
}

