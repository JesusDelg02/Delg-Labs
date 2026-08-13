import { z } from 'zod'

export const contactSchema = z.object({
  name: z.string().min(2, 'Enter your name'),
  email: z.string().email('Enter a valid email'),
  company: z.string().optional(),
  projectType: z.enum(['Website', 'Web Application', 'AI / Automation', 'SaaS', 'Other']),
  budget: z.enum([
    'Under $2,000',
    '$2,000–$5,000',
    '$5,000–$10,000',
    '$10,000+',
    'Not sure yet',
  ]),
  message: z.string().min(10, 'Tell me a bit more — at least 10 characters'),
  website: z.string().max(0).optional(),
})

export type ContactFormValues = z.infer<typeof contactSchema>
