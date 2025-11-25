import { z } from 'zod'

export const messageSchema = z.object({
  id: z.string(),
  text: z.string(),
  user_chat: z.string(),
  is_from_user: z.boolean(),
  created_at: z.string(),
})

export type Message = z.infer<typeof messageSchema>