/*
© 2018-present Harald Rudell <harald.rudell@gmail.com> (http://www.haraldrudell.com)
All rights reserved.
*/
import presetEsNext from 'babel-preset-7-esnext'
import {createTransformer} from 'babel-jest'

export default createTransformer(presetEsNext())
