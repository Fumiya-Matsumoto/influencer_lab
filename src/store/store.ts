import { InjectionKey } from "vue";
import { createStore, Store, useStore as baseUseStore } from "vuex";

import * as MutationTypes from "./mutationTypes";
import * as ActionTypes from "./actionTypes";


// storeの型定義
type Category = {
    id: string;
    name: string;
}

type Picture = {
    data: {
        height: number;
        width: number;
        is_silhouette: boolean;
        url: string;
    }
}

type FacebookUserInfo = {
    id: string;
    name: string;
    email: string;
    picture?: Picture;
}

type FacebookPage = {
    id: string;
    access_token: string;
    name: string;
    category: string;
    category_list: Category[];
    link: string;
    picture: Picture;
}

type State = {
    isLogin: boolean;
    rail: boolean;
    userId: string;
    facebookUserInfo: FacebookUserInfo;
    facebookPage: FacebookPage;
    facebookPages: FacebookPage[];
};


// storeをprovide/injectするためのキー
export const key: InjectionKey<Store<State>> = Symbol();


// store本体
export const store = createStore<State>({
    state: {
        isLogin: false,
        rail: true,
        userId: '',
        facebookUserInfo: {
            id: '',
            name: '',
            email: '',
        },
        facebookPage: {
            id: '',
            access_token: '',
            name: '',
            category: '',
            category_list: [],
            link: '',
            picture: {
                data: {
                    height: 0,
                    width: 0,
                    is_silhouette: false,
                    url: ''
                }
            }
        },
        facebookPages: [],
    },
    mutations: {
        [MutationTypes.AUTH] (state, userId: string) {
            state.isLogin = true;
            state.userId = userId;
        },
        [MutationTypes.RAIL] (state, rail: boolean) {
            state.rail = rail
        },
        [MutationTypes.FacebookPage] (state, facebookPage: FacebookPage) {
            state.facebookPage = facebookPage;
        },
        [MutationTypes.FacebookPages] (state, facebookPages: []) {
            state.facebookPages = facebookPages;
        },
        [MutationTypes.FacebookUserInfo] (state, facebookUserInfo: FacebookUserInfo) {
            state.facebookUserInfo = facebookUserInfo;
        }

    },
    actions: {
        [ActionTypes.FETCH]({ commit }, userId: string) {
            commit(MutationTypes.AUTH, userId);
        },
        [ActionTypes.RAIL]({ commit }, rail: boolean) {
            commit(MutationTypes.RAIL, rail);
        },
        [ActionTypes.FacebookPage] ({ commit }, facebookPage: FacebookPage) {
            commit(MutationTypes.FacebookPage, facebookPage);
        },
        [ActionTypes.FacebookPages] ({ commit }, facebookPages: []) {
            commit(MutationTypes.FacebookPages, facebookPages);
        },
        [ActionTypes.FacebookUserInfo] ({ commit }, facebookUserInfo: FacebookUserInfo) {
            commit(MutationTypes.FacebookUserInfo, facebookUserInfo);
        },
    },
    modules: {
    }
});


// useStoreを使う際にキーの指定を省略するためのラッパー関数
export const useStore = () => {
    return baseUseStore(key);
}


