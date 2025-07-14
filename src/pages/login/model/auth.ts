import type { User } from "@/entities/user/type";

export const login = async (username: string, password: string) => {
    const response = await fetch("/api/login", {
        method: "POST",
        headers: {
            "Content-Type": "application/x-www-form-urlencoded",
        },
        body: new URLSearchParams({
            username,
            password,
        }),
        credentials: "include",
    });

    if (!response.ok) throw new Error("Ошибка авторизации");

    const data = await response.json();

    return data as User;
};