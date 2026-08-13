'use server'

import { Resend } from 'resend'
import { contactSchema, type ContactFormValues } from '@/lib/contact-schema'

type ContactResult = { success: true } | { success: false; error: string }

export async function submitContactForm(values: ContactFormValues): Promise<ContactResult> {
  const parsed = contactSchema.safeParse(values)
  if (!parsed.success) {
    return { success: false, error: 'Please check the form and try again.' }
  }

  const apiKey = process.env.RESEND_API_KEY
  if (!apiKey) {
    console.error('submitContactForm: RESEND_API_KEY is not set')
    return { success: false, error: 'Something went wrong. Please try again later.' }
  }

  const { name, email, company, projectType, budget, message } = parsed.data

  try {
    const resend = new Resend(apiKey)
    const { error } = await resend.emails.send({
      from: 'Delg Labs <onboarding@resend.dev>',
      to: process.env.CONTACT_INBOX_EMAIL ?? 'hello@delglabs.com',
      replyTo: email,
      subject: `New project inquiry from ${name}`,
      text: [
        `Name: ${name}`,
        `Email: ${email}`,
        `Company: ${company || 'n/a'}`,
        `Project type: ${projectType}`,
        `Budget: ${budget}`,
        '',
        message,
      ].join('\n'),
    })
    if (error) {
      console.error('submitContactForm: Resend returned an error', error)
      return { success: false, error: 'Something went wrong. Please try again later.' }
    }
    return { success: true }
  } catch (err) {
    console.error('submitContactForm: Resend call failed', err)
    return { success: false, error: 'Something went wrong. Please try again later.' }
  }
}
