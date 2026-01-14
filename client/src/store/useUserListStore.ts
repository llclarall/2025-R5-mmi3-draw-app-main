import { create } from 'zustand';

type User = {
  username: string;
  avatar: string;
}[];

type UserState = {
  userList: User;
};

type UserAction = {
  setUserList: (users: User) => void;
};

export const useUserListStore = create<UserState & UserAction>((set) => ({
  userList: [  ],
  setUserList: (userList) => set({ userList }),
}));
