import { apiFetchMemos, apiCreateMemo } from '../lib/memoSevices'

const initialState = {
    memos: [],
    create: {
        title: '',
        url: ''
    }
}

// ACTION-NAMES

const MEMOS_LOAD = 'MEMOS_LOAD'
const MEMO_ADD = 'MEMO_ADD'

const CURRENT_TITLE_UPDATE = 'CURRENT_TITLE_UPDATE'
const CURRENT_URL_UPDATE = 'CURRENT_URL_UPDATE'

const NOTE_ADD = 'NOTE_ADD'

// ACTIONS

const loadMemos = (memos) => (
    { type: MEMOS_LOAD, payload: memos }
)

const addMemo = (memo) => (
    { type: MEMO_ADD, payload: memo }
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

// ASYNC ACTIONS

export const fetchMemos = () => {
    return (dispatch) => {
        apiFetchMemos()
            .then(memos =>
                dispatch(loadMemos(memos))
            )
    }
}

export const createMemo = () => {
    return (dispatch, getState) => {
        const memo = getState().memo.create
        apiCreateMemo(memo)
            .then(res =>
                dispatch(addMemo(res))
            )
    }
}

// REDUCER

export default (state = initialState, action) => {

    switch (action.type) {

        case MEMOS_LOAD:
            return { ...state, memos: action.payload.reverse() }

        case MEMO_ADD:
            return {
                ...state,
                create: { title: '', url: '' },
                memos: [action.payload, ...state.memos]
            }

        case NOTE_ADD:
            return {
                ...state,
                memos: [
                    ...state.memos.map(memo => {
                        if (memo.id === action.payload.memoID) {
                            return {
                                ...memo,
                                notes: [

                                    ...memo.notes || [], {
                                        id: action.payload.newNoteID,
                                        desc: 'test'
                                    }
                                ]
                            };
                        } else {
                            return memo;
                        }
                    })
                ]
            }

        case CURRENT_TITLE_UPDATE:
            return { ...state, create: { ...state.create, title: action.payload } }

        case CURRENT_URL_UPDATE:
            return { ...state, create: { ...state.create, url: action.payload } }

        default:
            return state

    }

}
