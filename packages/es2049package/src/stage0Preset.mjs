/*
© 2017-present Harald Rudell <harald.rudell@gmail.com> (http://www.haraldrudell.com)
This source code is licensed under the ISC-style license found in the LICENSE file in the root directory of this source tree.
*/
import functionBind from '@babel/plugin-proposal-function-bind'
import exportDefaultFrom from '@babel/plugin-proposal-export-default-from'
import logicalAssignmentOperators from '@babel/plugin-proposal-logical-assignment-operators'
import optionalChaining from '@babel/plugin-proposal-optional-chaining'
import pipelineOperator from '@babel/plugin-proposal-pipeline-operator'
import nullishCoalescingOperator from '@babel/plugin-proposal-nullish-coalescing-operator'
import doExpressions from '@babel/plugin-proposal-do-expressions'
import decorators from '@babel/plugin-proposal-decorators'
import functionSent from '@babel/plugin-proposal-function-sent'
import exportNamespaceFrom from '@babel/plugin-proposal-export-namespace-from'
import numericSeparator from '@babel/plugin-proposal-numeric-separator'
import throwExpressions from '@babel/plugin-proposal-throw-expressions'
import dynamicImport from '@babel/plugin-syntax-dynamic-import'
import importMeta from '@babel/plugin-syntax-import-meta'
import classProperties from '@babel/plugin-proposal-class-properties'
import jsonStrings from '@babel/plugin-proposal-json-strings'

export default {plugins: [
  // 181204 https://babeljs.io/docs/en/babel-preset-stage-0

  // stage 0
  functionBind,

  // Stage 1
  exportDefaultFrom,
  logicalAssignmentOperators,
  [optionalChaining, { loose: false }],
  [pipelineOperator, { proposal: 'minimal' }],
  [nullishCoalescingOperator, { loose: false }],
  doExpressions,

  // Stage 2
  [decorators, { legacy: true }],
  functionSent,
  exportNamespaceFrom,
  numericSeparator,
  throwExpressions,

  // Stage 3
  dynamicImport,
  importMeta,
  [classProperties, { loose: false }],
  jsonStrings,
]}
