import { cookieStorage, useTokenState } from "@/stores/tokenStore";
import { jwtDecode } from "jwt-decode";
import { authAPI } from "./api";

import { JwtPayload } from "jwt-decode";

export interface MyJwtPayload extends JwtPayload {
  username: string;
}

export async function decodeToRefresh(): Promise<string | null>{
    let refresh = cookieStorage.getItem('tokenRefresh')
    const data = jwtDecode(refresh as string)
    
    let now = Date.now() / 1000
    let acess
    if (data.exp as number < now) {
        acess = await authAPI.refresh(cookieStorage.getItem('tokenRefresh') as string)
    }
    return acess
}

export function getUsernameByToken(token: string){
    
    const data = jwtDecode<MyJwtPayload>(token as string)
    
    return data.username
}