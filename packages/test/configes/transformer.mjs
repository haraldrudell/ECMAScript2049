/*
© 2018-present Harald Rudell <harald.rudell@gmail.com> (http://www.haraldrudell.com)
All rights reserved.
*/
import config from './babel.config'
import {createTransformer} from 'babel-jest'

export default createTransformer(config)
