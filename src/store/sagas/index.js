import {logoutSaga,checkAuthTimeoutSaga, authUserSaga, authCheckStateSaga} from './auth';
import {initIngredientsSaga} from './burgerBuilder';
import {takeEvery,all,takeLatest} from 'redux-saga/effects';
import * as actionTypes from '../actions/actionTypes';
import { purchaseBurgerSaga, fetchBurgerSaga } from './order';


export function* watchAuth(){
    /*yield takeEvery(actionTypes.AUTH_CHECK_TIMEOUT,checkAuthTimeoutSaga)
    yield takeEvery(actionTypes.AUTH_INITIATE_LOGOUT,logoutSaga)
    yield takeEvery(actionTypes.AUTH_USER,authUserSaga)
    yield takeEvery(actionTypes.AUTH_CHECK_INITIAL_STATE,authCheckStateSaga)*/
    yield all([takeEvery(actionTypes.AUTH_CHECK_TIMEOUT,checkAuthTimeoutSaga),
        takeEvery(actionTypes.AUTH_INITIATE_LOGOUT,logoutSaga),
        takeEvery(actionTypes.AUTH_USER,authUserSaga),
        takeEvery(actionTypes.AUTH_CHECK_INITIAL_STATE,authCheckStateSaga)
    ])
}

export function* watchBurgerBuilder(){
    yield takeEvery(actionTypes.INIT_INGREDIENTS_CHECK,initIngredientsSaga)
    
}

export function* watchOrder(){
    yield takeLatest(actionTypes.PURCHASE_BURGER,purchaseBurgerSaga)/*only one of the saga is run*/
    yield takeEvery(actionTypes.FETCH_ORDERS,fetchBurgerSaga)
}