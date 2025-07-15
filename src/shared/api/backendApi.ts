import type { GetPostDto } from "@/entities/getpostdto/type";
import type { SaveCommentDto } from "@/entities/savecommentdto/type";
import type { SavePostDto } from "@/entities/savepostdto/type";
import type { UpdatePostDto } from "@/entities/updatepostdto/type";
import type { UserInfo } from "@/entities/userInfo/type";

export const findAll = async () => {  
    try {
        const response = await fetch("/backend/userInfo/findAll", {
            credentials: "include",
        });

        if (!response.ok) {
            throw new Error("Ошибка получения данных. Cтатус: " + response.status);
        }

        const data = await response.json();
        return data as UserInfo[];
    } catch (error) {
        throw error;
    }
};

export const addUserInfo = async (blogName: string, fullName: string) => {
    try {
        const response = await fetch("/backend/userInfo", {
            method: "POST",
            credentials: "include",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({ 
                blogName,
                fullName
            })       
        })

        if (!response.ok) throw new Error("Ошибка добавления данных. Cтатус: " + response.status);
        
        const data = await response.json();
        
        return data as UserInfo;
    } catch (error) {
        throw error;
    }
}

export const deleteUserInfo = async (id: number) => {
    try {
        const response = await fetch(`/backend/userInfo/${id}`, {
            method: "DELETE",
            credentials: "include",
        })

        if (!response.ok) throw new Error("Ошибка удаления данных. Cтатус: " + response.status);
    } catch (error) {
        throw error;
    }
}

export const addPost = async (spd: SavePostDto, userId: number) => {
    try {
        const response = await fetch(`/backend/post?userInfoId=${userId}`, {
            method: "POST",
            credentials: "include",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(spd)       
        })

        if (!response.ok) throw new Error("Ошибка добавления данных. Cтатус: " + response.status);
    } catch (error) {
        throw error;
    }
}

export const deletePost = async (id: number) => {
    try {
        const response = await fetch(`/backend/post/${id}`, {
            method: "DELETE",
            credentials: "include",
        })

        if (!response.ok) throw new Error("Ошибка удаления данных. Cтатус: " + response.status);
    } catch (error) {
        throw error;
    }
}

export const updatePost = async (upd: UpdatePostDto) => {
    try {
        const response = await fetch('/backend/post/', {
            method: "PUT",
            credentials: "include",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(upd)       
        })

        if (!response.ok) throw new Error("Ошибка обновления данных. Cтатус: " + response.status);
    } catch (error) {
        throw error;
    }
}

export const getPostInfo = async (id: number) => {
    try {
        const response = await fetch(`/backend/post/${id}`, {
            method: "GET",
            credentials: "include",
            headers: {
                "Content-Type": "application/json",
            }
        });

        if (!response.ok) {
            throw new Error("Ошибка получения данных. Cтатус: " + response.status);
        }

        const data = await response.json();
        return data as GetPostDto;
    } catch (error) {
        throw error;
    }
};

export const addCommment = async (scd: SaveCommentDto, postId: number) => {
    try {
        const response = await fetch(`/backend/comment?postId=${postId}`, {
            method: "POST",
            credentials: "include",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(scd)       
        })

        if (!response.ok) throw new Error("Ошибка добавления данных. Cтатус: " + response.status);
    } catch (error) {
        throw error;
    }
}

export const deleteComment = async (id: number) => {
    try {
        const response = await fetch(`/backend/comment/${id}`, {
            method: "DELETE",
            credentials: "include",
        })

        if (!response.ok) throw new Error("Ошибка удаления данных. Cтатус: " + response.status);
    } catch (error) {
        throw error;
    }
}