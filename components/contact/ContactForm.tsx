'use client'

import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { Loader2, CheckCircle2 } from 'lucide-react'
import { contactSchema, type ContactFormValues } from '@/lib/contact-schema'
import { submitContactForm } from '@/actions/contact'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Label } from '@/components/ui/label'
import { Select } from '@/components/ui/select'
import { Button } from '@/components/ui/button'

type Status = 'idle' | 'loading' | 'success' | 'error'

export function ContactForm() {
  const [status, setStatus] = useState<Status>('idle')
  const [errorMessage, setErrorMessage] = useState('')
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<ContactFormValues>({ resolver: zodResolver(contactSchema) })

  const onSubmit = async (values: ContactFormValues) => {
    setStatus('loading')
    const result = await submitContactForm(values)
    if (result.success) {
      setStatus('success')
      reset()
    } else {
      setStatus('error')
      setErrorMessage(result.error)
    }
  }

  if (status === 'success') {
    return (
      <div className="flex flex-col items-center gap-3 rounded-2xl border border-border bg-card p-10 text-center">
        <CheckCircle2 className="h-8 w-8 text-accent" />
        <p className="text-foreground">
          Thanks — your project details were received. I&apos;ll get back to you soon.
        </p>
      </div>
    )
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-5" noValidate>
      <div className="grid gap-5 sm:grid-cols-2">
        <div>
          <Label htmlFor="name">Name</Label>
          <Input id="name" {...register('name')} />
          {errors.name && <p className="mt-1 text-xs text-destructive">{errors.name.message}</p>}
        </div>
        <div>
          <Label htmlFor="email">Email</Label>
          <Input id="email" type="email" {...register('email')} />
          {errors.email && <p className="mt-1 text-xs text-destructive">{errors.email.message}</p>}
        </div>
      </div>
      <div>
        <Label htmlFor="company">Company</Label>
        <Input id="company" {...register('company')} />
      </div>
      <div className="grid gap-5 sm:grid-cols-2">
        <div>
          <Label htmlFor="projectType">Project type</Label>
          <Select id="projectType" {...register('projectType')}>
            <option value="Website">Website</option>
            <option value="Web Application">Web Application</option>
            <option value="AI / Automation">AI / Automation</option>
            <option value="SaaS">SaaS</option>
            <option value="Other">Other</option>
          </Select>
        </div>
        <div>
          <Label htmlFor="budget">Budget</Label>
          <Select id="budget" {...register('budget')}>
            <option value="Under $2,000">Under $2,000</option>
            <option value="$2,000–$5,000">$2,000–$5,000</option>
            <option value="$5,000–$10,000">$5,000–$10,000</option>
            <option value="$10,000+">$10,000+</option>
            <option value="Not sure yet">Not sure yet</option>
          </Select>
        </div>
      </div>
      <div>
        <Label htmlFor="message">Message</Label>
        <Textarea id="message" rows={5} {...register('message')} />
        {errors.message && <p className="mt-1 text-xs text-destructive">{errors.message.message}</p>}
      </div>
      {status === 'error' && <p className="text-sm text-destructive">{errorMessage}</p>}
      <Button type="submit" size="lg" variant="primary" disabled={status === 'loading'}>
        {status === 'loading' ? (
          <span className="flex items-center gap-2">
            <Loader2 className="h-4 w-4 animate-spin" /> Sending
          </span>
        ) : (
          'Start a Conversation'
        )}
      </Button>
    </form>
  )
}
