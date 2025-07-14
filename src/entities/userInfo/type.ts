import type { Post } from "../post/type"

export interface UserInfo {
    blogName: string
    fullName: string
    id: number
    post: Post[]
}