import { atom } from "recoil";

export const userInfoAtom = atom({
  key: "userInfo",
  default: {
    id: "kanagawa-2023"
  }
})