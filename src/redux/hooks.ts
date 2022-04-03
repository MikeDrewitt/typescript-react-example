import { useMemo } from 'react'
import { useDispatch, useSelector, TypedUseSelectorHook } from 'react-redux'
import { bindActionCreators, Dispatch } from 'redux'

import { RootState } from 'redux/reducers'
import { AppDispatch } from './store'
import { ActionTypes } from 'redux/actions'

type ActionFunction = (...args: any[]) => ActionTypes

export function useActions<T extends ActionFunction[]>(...actions: T): T {
  const dispatch = useDispatch()

  // @ts-expect-error
  return useMemo(() => actions.map((a) => bindActionCreators(a, dispatch)), [])
}

export function useActionless<T extends ActionTypes['type'][]>(...types: T) {
  type Actions = {
    [Index in keyof T]: Extract<ActionTypes, { type: T[Index] }>['payload'] extends never
      ? () => Dispatch<Extract<ActionTypes, { type: T[Index] }>>
      : (
          payload: Extract<ActionTypes, { type: T[Index] }>['payload'],
        ) => Dispatch<Extract<ActionTypes, { type: T[Index] }>>
  }

  const dispatch = useDispatch<AppDispatch>()

  // @ts-expect-error
  return useMemo(() => types.map((type) => (payload) => dispatch({ type, payload })), []) as Actions
}

export const useAppSelector: TypedUseSelectorHook<RootState> = useSelector
