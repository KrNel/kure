import { createStore, applyMiddleware } from 'redux'
import thunk from 'redux-thunk'
import { createLogger } from 'redux-logger'
import reducer from './reducers'

/**
 *  Adding redux thunk middleware before creating the store.
 */
const middleware = [ thunk ];
if (process.env.NODE_ENV !== 'production') {
  middleware.push(createLogger());
}

/**
 *  Creating a redux store for the application.
 */
const store = createStore(
  reducer,
  applyMiddleware(...middleware)
)

export default store;
