import z from "zod";

export const authSchema = z.object({
    username: z.string(),
    password: z.string()
})

export const tokensSchema = z.object({
    refresh: z.string(),
    access: z.string()
})

export const tokenAccessSchema = z.object({
    tokenAccess: z.string()
})

export type Auth = z.infer<typeof authSchema>
export type Tokens = z.infer<typeof tokensSchema>
export type Acess = z.infer<typeof tokenAccessSchema>