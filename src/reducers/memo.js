import {
    apiCreateMemo,
    apiDeleteMemo,
    apiFetchMemos,
    apiFetchCategories
} from '../lib/memoSevices'

const initialState = {
    memos: {},
    categories: {},
    categoryFilter: false,
    totalMemos: false,
    createMemo: { title: '', url: '', notes: {} },
    createNote: { memoID: false, noteID: false, desc: '' }
}

// ACTION-NAMES

const MEMOS_LOAD = 'MEMOS_LOAD'
const MEMO_ADD = 'MEMO_ADD'
const MEMO_REMOVE = 'MEMO_DELETE'
const MEMO_APPLYFILTER = 'MEMO_APPLYFILTER'

const CURRENT_TITLE_UPDATE = 'CURRENT_TITLE_UPDATE'
const CURRENT_URL_UPDATE = 'CURRENT_URL_UPDATE'

const CATEGORIES_LOAD = 'CATEGORIES_LOAD'

const NOTE_ADD = 'NOTE_ADD'

// ACTIONS

const loadMemos = (memos) => (
    { type: MEMOS_LOAD, payload: memos }
)

const addMemo = (memo) => (
    { type: MEMO_ADD, payload: memo }
)

const removeMemo = (id) => (
    { type: MEMO_REMOVE, payload: { id } }
)

export const applyFilter = (val) => (
    { type: MEMO_APPLYFILTER, payload: { val } }
)

export const addNote = (memoID, newNoteID) => (
    { type: NOTE_ADD, payload: { memoID, newNoteID } }
)

export const updateCurrentTitle = (val) => (
    { type: CURRENT_TITLE_UPDATE, payload: val }
)

export const updateCurrentUrl = (val) => (
    { type: CURRENT_URL_UPDATE, payload: val }
)

export const loadCategories = (categories) => (
    { type: CATEGORIES_LOAD, payload: { categories } }
)

// ASYNC ACTIONS

export const fetchMemos = () => {
    return (dispatch, getState) => {
        const categoryFilter = getState().memo.categoryFilter;
        apiFetchMemos(categoryFilter)
            .then(memos => {
                let memosForState = {}
                memos.forEach(memo => {
                    memosForState[memo.id] = memo
                })
                dispatch(loadMemos(memosForState))
            })
    }
}

export const createMemo = () => {
    return (dispatch, getState) => {
        const memo = getState().memo.createMemo;
        apiCreateMemo(memo)
            .then(res =>
                dispatch(addMemo(res))
            )
    }
}

export const deleteMemo = (id) => {
    return (dispatch) => {
        apiDeleteMemo(id)
            .then(
                dispatch(removeMemo(id))
            )
    }
}

export const fetchCategories = () => {
    return (dispatch) => {
        apiFetchCategories()
            .then(categories => {
                const categoriesForState = {};
                categories.forEach(c => categoriesForState[c.id] = c)

                dispatch(loadCategories(categoriesForState))
            })
    }
}
// REDUCER

export default (state = initialState, action) => {

    switch (action.type) {

        case MEMOS_LOAD:
            return { ...state, memos: action.payload }

        case MEMO_ADD:
            return {
                ...state,
                create: { title: '', url: '' },
                memos: {
                    ...state.memos,
                    [action.payload.id]: action.payload
                }
            }

        case MEMO_REMOVE:
            return {
                ...state,
                memos: {
                    ...Object.keys(state.memos).reduce((acc, i) => {
                        if (state.memos[i].id !== action.payload.id) {
                            acc[i] = state.memos[i]
                        }
                        return acc;
                    }, [])
                }
            }

        case MEMO_APPLYFILTER:
            return {
                ...state,
                categoryFilter: action.payload.val
            }

        case NOTE_ADD:
            return {
                ...state,
                memos: {
                    ...state.memos,
                    [action.payload.memoID]: {
                        ...state.memos[action.payload.memoID],
                        notes: {
                            ...state.memos[action.payload.memoID].notes,
                            [action.payload.newNoteID]: {
                                isNew: true
                            }
                        }
                    }
                },
                // createNote: {
                //     ...state.createNote,
                //     memoID: action.payload.memoID,
                //     noteID: action.payload.newNoteID
                // }
            }

        case CATEGORIES_LOAD:
            return {
                ...state,
                categories: action.payload.categories
            }

        case CURRENT_TITLE_UPDATE:
            return { ...state, createMemo: { ...state.createMemo, title: action.payload } }

        case CURRENT_URL_UPDATE:
            return { ...state, createMemo: { ...state.createMemo, url: action.payload } }

        default:
            return state

    }

}
