/*
© 2018-present Harald Rudell <harald.rudell@gmail.com> (http://www.haraldrudell.com)
All rights reserved.
*/
import env from '@babel/preset-env'
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

export default {
  presets: [[env, {targets: {node: '10.2.0'}}]],
  plugins: [ // @babel/stage-0 181212
    functionBind, // Stage 0
    exportDefaultFrom, // Stage 1
    logicalAssignmentOperators,
    [optionalChaining, { loose: false }],
    [pipelineOperator, { proposal: 'minimal' }],
    [nullishCoalescingOperator, { loose: false }],
    doExpressions,
    [decorators, { legacy: true }], // Stage 2
    functionSent,
    exportNamespaceFrom,
    numericSeparator,
    throwExpressions,
    dynamicImport, // Stage 3
    importMeta,
    [classProperties, { loose: false }],
    jsonStrings,
  ],
}
